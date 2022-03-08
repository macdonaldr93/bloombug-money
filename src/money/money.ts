import { Big, BigDecimal } from 'bigdecimal.js';
import Currency, { CurrencyCode } from '../currency';
import Mint from '../mint';
import { CurrencyFormatOptions, FractionalInputType } from '../types';
import isMoney from '../utilities/isMoney';
import { createIntlNumberFormatter } from '../utilities/formatter';
import { isValueFinite } from '../utilities/number';

interface MoneyOptions {
  asAmount?: boolean;
}

export default class Money {
  static readonly ZERO = Big(0);

  readonly currency: Currency;
  readonly mint: Mint;
  readonly fractional: BigDecimal;
  private cachedSubunitToUnit: BigDecimal;

  constructor(
    mint: Mint,
    fractional: FractionalInputType = Money.ZERO,
    currencyOrOptions?: CurrencyCode | null | MoneyOptions,
    options: MoneyOptions = {}
  ) {
    this.mint = mint;
    this.currency =
      typeof currencyOrOptions === 'string'
        ? this.mint.Currency(currencyOrOptions)
        : this.mint.defaultCurrency;

    let resolvedFractional = fractional;

    if (typeof fractional === 'string') {
      if (options.asAmount) {
        resolvedFractional = Big(
          fractional.replace(this.currency.thousandsSeparator, ''),
          undefined,
          this.mint.mathContext
        ).multiply(this.subunitToUnit, this.mint.mathContext);
      } else {
        resolvedFractional = Big(fractional, undefined, this.mint.mathContext);
      }
    }

    if (!isValueFinite(Number(resolvedFractional))) {
      throw RangeError('fractional must be finite');
    }

    this.fractional = Big(resolvedFractional, undefined, this.mint.mathContext);
  }

  get subunitToUnit() {
    if (!this.cachedSubunitToUnit) {
      this.cachedSubunitToUnit = Big(
        this.currency.subunitToUnit,
        undefined,
        this.mint.mathContext
      );
    }

    return this.cachedSubunitToUnit;
  }

  get amount() {
    return (
      this.fractional.round(this.mint.mathContext).numberValue() /
      this.subunitToUnit.round(this.mint.mathContext).numberValue()
    );
  }

  get cents() {
    return this.fractional.numberValue();
  }

  // Aliases
  get dollars() {
    return this.amount;
  }

  equals(other: Money) {
    return (
      this.fractional.equals(other.fractional) &&
      this.currency.equals(other.currency)
    );
  }

  isZero() {
    return this.fractional.compareTo(Money.ZERO) === 0;
  }

  gt(other: Money | FractionalInputType) {
    return this.compareTo(other) === 1;
  }

  gte(other: Money | FractionalInputType) {
    const comparison = this.compareTo(other);
    return comparison === 1 || comparison === 0;
  }

  lt(other: Money | FractionalInputType) {
    return this.compareTo(other) === -1;
  }

  lte(other: Money | FractionalInputType) {
    const comparison = this.compareTo(other);
    return comparison === -1 || comparison === 0;
  }

  compareTo(other: Money | FractionalInputType) {
    if (!isMoney(other)) {
      other = this.mint.Money(other, this.currency.isoCode);
    }

    if (this.currency.equals(other.currency)) {
      return this.fractional.compareTo(other.fractional);
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    return this.fractional.compareTo(
      this.mint.exchange.exchangeWith(other, this.currency.isoCode).fractional
    );
  }

  add(money: Money | FractionalInputType): Money {
    if (!isMoney(money)) {
      money = this.mint.Money(money, this.currency.isoCode);
    }

    if (this.currency.equals(money.currency)) {
      return this.mint.Money(
        this.fractional.add(money.fractional),
        this.currency.isoCode
      );
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    return this.add(
      this.mint.exchange.exchangeWith(money, this.currency.isoCode)
    );
  }

  subtract(money: Money | FractionalInputType): Money {
    if (!isMoney(money)) {
      money = this.mint.Money(money, this.currency.isoCode);
    }

    if (this.currency.equals(money.currency)) {
      return this.mint.Money(
        this.fractional.subtract(money.fractional),
        this.currency.isoCode
      );
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    return this.subtract(
      this.mint.exchange.exchangeWith(money, this.currency.isoCode)
    );
  }

  divide(money: Money | FractionalInputType): Money {
    if (!isMoney(money)) {
      return this.mint.Money(
        this.fractional.divide(
          Big(money, undefined, this.mint.mathContext),
          undefined,
          this.mint.defaultRoundingMode
        ),
        this.currency.isoCode
      );
    }

    if (this.currency.equals(money.currency)) {
      return this.mint.Money(
        this.fractional.divide(
          money.fractional,
          undefined,
          this.mint.defaultRoundingMode
        ),
        this.currency.isoCode
      );
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    return this.divide(
      this.mint.exchange.exchangeWith(money, this.currency.isoCode)
    );
  }

  multiply(money: Money | FractionalInputType): Money {
    if (!isMoney(money)) {
      return this.mint.Money(
        this.fractional.multiply(Big(money, undefined, this.mint.mathContext)),
        this.currency.isoCode
      );
    }

    if (this.currency.equals(money.currency)) {
      return this.mint.Money(
        this.fractional.multiply(money.fractional),
        this.currency.isoCode
      );
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    return this.multiply(
      this.mint.exchange.exchangeWith(money, this.currency.isoCode)
    );
  }

  negate() {
    return this.mint.Money(this.fractional.negate(), this.currency.isoCode);
  }

  clone() {
    return new Money(this.mint, this.cents, this.currency.isoCode);
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
    if (
      typeof localesOrOptions === 'undefined' &&
      typeof options === 'undefined'
    ) {
      return this.formatter().format(this.amount);
    }

    if (isLocales(localesOrOptions)) {
      return this.formatter(localesOrOptions, options).format(this.amount);
    }

    return this.formatter(localesOrOptions).format(this.amount);
  }

  toNumber() {
    return this.fractional.numberValue();
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
}

function isLocales(
  locales: string | string[] | undefined | CurrencyFormatOptions
): locales is string | string[] {
  return typeof locales === 'string' || Array.isArray(locales);
}
