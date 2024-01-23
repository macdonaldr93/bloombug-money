import { Big, BigDecimal } from 'bigdecimal.js';
import { Currency } from '../currency';
import { ExchangeMissingError } from '../errors';
import { Mint } from '../mint';
import { Amount, CurrencyFormatOptions } from '../types';
import { createIntlNumberFormatter, isLocales } from '../utils/intl-utils';

export interface MoneyOptions {}

export class Money {
  static readonly ZERO = Big(0);

  fractional: BigDecimal;
  readonly currency: Currency;

  private readonly mint: Mint;

  constructor(
    fractional: Amount = Money.ZERO,
    currency: Currency,
    mint: Mint,
    _options: MoneyOptions = {}
  ) {
    this.mint = mint;
    this.currency = currency;

    // When fractional is a string with a period, we treat as decimal
    // 100.0 = $100.00 = ¢10000
    if (typeof fractional === 'string' && fractional.includes('.')) {
      const factor = this.currency.base ** this.currency.exponent;
      this.fractional = Big(
        fractional,
        undefined,
        this.mint.mathContext
      ).multiply(factor);
    } else {
      this.fractional = Big(fractional, undefined, this.mint.mathContext);
    }
  }

  equals(other: Money): boolean {
    return (
      this.fractional.compareTo(other.fractional) === 0 &&
      this.currency.isoCode === other.currency.isoCode
    );
  }

  isZero(): boolean {
    return this.fractional.compareTo(Money.ZERO) === 0;
  }

  gt(other: Money): boolean {
    return this.compareTo(other) === 1;
  }

  gte(other: Money): boolean {
    const comparison = this.compareTo(other);
    return comparison === 1 || comparison === 0;
  }

  lt(other: Money): boolean {
    return this.compareTo(other) === -1;
  }

  lte(other: Money): boolean {
    const comparison = this.compareTo(other);
    return comparison === -1 || comparison === 0;
  }

  compareTo(other: Money): number {
    if (this.currency.isoCode === other.currency.isoCode) {
      return this.fractional.compareTo(other.fractional);
    }

    if (!this.mint.exchange) {
      throw new ExchangeMissingError();
    }

    return this.fractional.compareTo(
      this.mint.exchange.convert(other, this.currency).fractional
    );
  }

  add(value: Money): Money {
    if (!(value instanceof Money)) {
      value = this.mint.Money(value, this.currency);
    }

    if (this.currency.isoCode === value.currency.isoCode) {
      this.fractional = this.fractional.add(value.fractional);
    } else {
      if (!this.mint.exchange) {
        throw new Error(
          'You must instantiate an exchange for currency exchange'
        );
      }

      this.add(this.mint.exchange.convert(value, this.currency));
    }

    return this;
  }

  subtract(value: Money): Money {
    if (!(value instanceof Money)) {
      value = this.mint.Money(value, this.currency);
    }

    if (this.currency.isoCode === value.currency.isoCode) {
      this.fractional = this.fractional.subtract(value.fractional);
    } else {
      if (!this.mint.exchange) {
        throw new Error(
          'You must instantiate an exchange for currency exchange'
        );
      }

      this.subtract(this.mint.exchange.convert(value, this.currency));
    }

    return this;
  }

  divide(value: Amount | Money): Money {
    if (!(value instanceof Money)) {
      value = this.mint.Money(value, this.currency);
    }

    if (this.currency.isoCode === value.currency.isoCode) {
      this.fractional = this.fractional.divide(
        value.fractional,
        undefined,
        this.mint.defaultRoundingMode
      );
    } else {
      if (!this.mint.exchange) {
        throw new Error(
          'You must instantiate an exchange for currency exchange'
        );
      }

      this.divide(this.mint.exchange.convert(value, this.currency));
    }

    return this;
  }

  multiply(value: Amount | Money): Money {
    if (!(value instanceof Money)) {
      value = this.mint.Money(value, this.currency);
    }

    if (this.currency.isoCode === value.currency.isoCode) {
      this.fractional = this.fractional.multiply(value.fractional);
    } else {
      if (!this.mint.exchange) {
        throw new ExchangeMissingError();
      }

      this.multiply(this.mint.exchange.convert(value, this.currency));
    }

    return this;
  }

  negate() {
    return this.mint.Money(this.fractional.negate(), this.currency);
  }

  clone() {
    return new Money(this.fractional, this.currency, this.mint);
  }

  formatter(locales: string | string[]): Intl.NumberFormat;
  formatter(options?: CurrencyFormatOptions): Intl.NumberFormat;
  formatter(
    locales: string | string[],
    options?: CurrencyFormatOptions
  ): Intl.NumberFormat;
  formatter(
    localesOrOptions?: string | string[] | CurrencyFormatOptions,
    options?: CurrencyFormatOptions
  ) {
    if (
      typeof localesOrOptions === 'undefined' &&
      typeof options === 'undefined'
    ) {
      return createIntlNumberFormatter(
        this.mint.defaultLocale,
        this.currency.isoCode
      );
    }

    if (isLocales(localesOrOptions)) {
      return createIntlNumberFormatter(
        localesOrOptions,
        this.currency.isoCode,
        options
      );
    }

    return createIntlNumberFormatter(
      this.mint.defaultLocale,
      this.currency.isoCode,
      localesOrOptions
    );
  }

  format(locales: string | string[]): string;
  format(options?: CurrencyFormatOptions): string;
  format(locales: string | string[], options?: CurrencyFormatOptions): string;
  format(
    localesOrOptions?: string | string[] | CurrencyFormatOptions,
    options?: CurrencyFormatOptions
  ) {
    const value = this.toNumber();

    if (
      typeof localesOrOptions === 'undefined' &&
      typeof options === 'undefined'
    ) {
      return this.formatter().format(value);
    }

    if (isLocales(localesOrOptions)) {
      return this.formatter(localesOrOptions, options).format(value);
    }

    return this.formatter(localesOrOptions).format(value);
  }

  toLocaleString(locales: string | string[]): string;
  toLocaleString(options?: CurrencyFormatOptions): string;
  toLocaleString(
    locales: string | string[],
    options?: CurrencyFormatOptions
  ): string;
  toLocaleString(
    localesOrOptions?: string | string[] | CurrencyFormatOptions,
    options?: CurrencyFormatOptions
  ) {
    if (
      typeof localesOrOptions === 'undefined' &&
      typeof options === 'undefined'
    ) {
      return this.format();
    }

    if (isLocales(localesOrOptions)) {
      return this.format(localesOrOptions, options);
    }

    return this.format(localesOrOptions);
  }

  toString() {
    return this.format(this.mint.defaultLocale);
  }

  toBigInt(): BigInt {
    return this.fractional.toBigInt();
  }

  toFractional(): number {
    return this.fractional.numberValue();
  }

  toDecimal(): string {
    const factor = this.currency.base ** this.currency.exponent;
    const float = this.fractional
      .divide(factor)
      .round(this.mint.mathContext)
      .numberValue();
    const decimal = Number.isInteger(float) ? float + '.0' : float.toString();

    return decimal;
  }

  toNumber(): number {
    const factor = this.currency.base ** this.currency.exponent;

    return this.fractional
      .divide(factor)
      .round(this.mint.mathContext)
      .numberValue();
  }

  toJSON() {
    return {
      fractional: this.toFractional(),
      currency: this.currency.isoCode,
    };
  }
}
