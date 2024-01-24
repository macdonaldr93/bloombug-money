import { Big, BigDecimal } from 'bigdecimal.js';
import { Currency } from '../currency';
import { ExchangeMissingError } from '../errors';
import { Mint } from '../mint';
import { Amount, CurrencyFormatOptions } from '../types';
import { createIntlNumberFormatter, isLocales } from '../utils/intl-utils';

export interface MoneyOptions {}

export class Money {
  static readonly ZERO = Big(0);

  amount: BigDecimal;
  readonly currency: Currency;

  private readonly currencyFactor: number;
  private readonly mint: Mint;

  constructor(
    amount: Amount = Money.ZERO,
    currency: Currency,
    mint: Mint,
    _options: MoneyOptions = {}
  ) {
    this.mint = mint;
    this.currency = currency;
    this.currencyFactor = this.currency.base ** this.currency.exponent;

    // When amount is a string with a period, we treat as decimal
    // 100.0 = $100.00 = ¢10000
    if (typeof amount === 'string' && amount.includes('.')) {
      this.amount = Big(amount, undefined, this.mint.mathContext).multiply(
        this.currencyFactor
      );
    } else {
      this.amount = Big(amount, undefined, this.mint.mathContext);
    }
  }

  isZero(): boolean {
    return this.amount.compareTo(Money.ZERO) === 0;
  }

  equals(other: Money): boolean {
    return (
      this.amount.compareTo(other.amount) === 0 &&
      this.currency.isoCode === other.currency.isoCode
    );
  }

  gt(other: Money): boolean {
    return (
      this.compareTo(other) === 1 &&
      this.currency.isoCode === other.currency.isoCode
    );
  }

  gte(other: Money): boolean {
    const comparison = this.compareTo(other);
    return (
      (comparison === 1 || comparison === 0) &&
      this.currency.isoCode === other.currency.isoCode
    );
  }

  lt(other: Money): boolean {
    return (
      this.compareTo(other) === -1 &&
      this.currency.isoCode === other.currency.isoCode
    );
  }

  lte(other: Money): boolean {
    const comparison = this.compareTo(other);
    return (
      (comparison === -1 || comparison === 0) &&
      this.currency.isoCode === other.currency.isoCode
    );
  }

  compareTo(other: Money): number {
    if (this.currency.isoCode === other.currency.isoCode) {
      return this.amount.compareTo(other.amount);
    }

    if (!this.mint.exchange) {
      throw new ExchangeMissingError();
    }

    return this.amount.compareTo(
      this.mint.exchange.convert(other, this.currency).amount
    );
  }

  add(value: Money): Money {
    if (!(value instanceof Money)) {
      value = this.mint.Money(value, this.currency);
    }

    if (this.currency.isoCode === value.currency.isoCode) {
      this.amount = this.amount.add(value.amount);
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
      this.amount = this.amount.subtract(value.amount);
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
      this.amount = this.amount.divideWithMathContext(
        value.amount,
        this.mint.mathContext
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
      this.amount = this.amount.multiply(value.amount);
    } else {
      if (!this.mint.exchange) {
        throw new ExchangeMissingError();
      }

      this.multiply(this.mint.exchange.convert(value, this.currency));
    }

    return this;
  }

  negate() {
    this.amount = this.amount.negate();

    return this;
  }

  clone() {
    return new Money(this.amount, this.currency, this.mint);
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
    return this.amount.toBigInt();
  }

  /**
   * Returns the amount with full precision. It's possible to have
   * fractions of the minor units.
   *
   * For USD, the fractional amount can return 1000.12 cents.
   */
  toFractional(): number {
    return this.amount.numberValue();
  }

  /**
   * Returns the amount rounded to the minor unit of the currency.
   *
   * For USD, cents is returned which is 1/100 of their dollar.
   * For JPY, yen is returned which is the smallest unit.
   */
  toMinorUnit(): number {
    return this.amount
      .setScale(0, this.mint.mathContext.roundingMode)
      .numberValue();
  }

  /**
   * Returns the amount as a decimal string. It's possible to have
   * fractions of the minor units.
   *
   * For USD, the decimal amount can return 100.121 dollars.
   */
  toDecimal(): string {
    const factor = this.currency.base ** this.currency.exponent;
    const float = this.amount
      .divideWithMathContext(factor, this.mint.mathContext)
      .numberValue();
    const decimal = Number.isInteger(float) ? float + '.0' : float.toString();

    return decimal;
  }

  /**
   * Returns the amount as a number. It's possible to have
   * fractions of the minor units.
   *
   * For USD, the decimal amount can return 100.121 dollars.
   */
  toNumber(): number {
    const factor = this.currency.base ** this.currency.exponent;

    return this.amount
      .divideWithMathContext(factor, this.mint.mathContext)
      .numberValue();
  }

  toJSON() {
    return {
      amount: this.toFractional(),
      currency: this.currency.isoCode,
    };
  }
}
