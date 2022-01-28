import { Big, BigDecimal } from 'bigdecimal.js';
import Currency, { CurrencyCode } from '../currency';
import Mint from '../mint';
import { CurrencyFormatOptions } from '../types';
import isMoney from '../utilities/isMoney';
import { createIntlNumberFormatter } from '../utilities/formatter';
import { isValueFinite } from '../utilities/number';

export default class Money {
  readonly currency: Currency;
  readonly mint: Mint;
  fractional: BigDecimal;
  private cachedSubunitToUnit: BigDecimal;

  constructor(
    mint: Mint,
    fractional: bigint | number | string = 0,
    currency?: CurrencyCode | null
  ) {
    this.mint = mint;
    this.currency = currency
      ? this.mint.Currency(currency)
      : this.mint.defaultCurrency;

    let resolvedFractional = fractional;

    if (typeof fractional === 'string') {
      resolvedFractional =
        parseFloat(fractional.replace(this.currency.thousandsSeparator, '')) *
        this.currency.subunitToUnit;
    }

    if (!isValueFinite(Number(resolvedFractional))) {
      throw RangeError('fractional must be finite');
    }

    this.fractional = Big(resolvedFractional);
  }

  get subunitToUnit() {
    if (!this.cachedSubunitToUnit) {
      this.cachedSubunitToUnit = Big(this.currency.subunitToUnit);
    }

    return this.cachedSubunitToUnit;
  }

  get amount() {
    return this.fractional
      .divide(this.subunitToUnit, undefined, this.mint.defaultRoundingMode)
      .numberValue();
  }

  get cents() {
    return this.fractional.numberValue();
  }

  // Aliases
  get dollars() {
    return this.amount;
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

  equals(other: Money) {
    return (
      this.fractional.equals(other.fractional) &&
      this.currency.equals(other.currency)
    );
  }

  add(money: Money) {
    if (this.currency.equals(money.currency)) {
      this.fractional = this.fractional.add(money.fractional);

      return this;
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    this.add(this.mint.exchange.exchangeWith(money, this.currency.isoCode));

    return this;
  }

  subtract(money: Money) {
    if (this.currency.equals(money.currency)) {
      this.fractional = this.fractional.subtract(money.fractional);

      return this;
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    this.subtract(
      this.mint.exchange.exchangeWith(money, this.currency.isoCode)
    );

    return this;
  }

  divide(money: Money | number | BigDecimal) {
    if (!isMoney(money)) {
      this.fractional = this.fractional.divide(
        Big(money),
        undefined,
        this.mint.defaultRoundingMode
      );

      return this;
    }

    if (this.currency.equals(money.currency)) {
      this.fractional = this.fractional.divide(
        money.fractional,
        undefined,
        this.mint.defaultRoundingMode
      );

      return this;
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    this.divide(this.mint.exchange.exchangeWith(money, this.currency.isoCode));

    return this;
  }

  multiply(money: Money | number | BigDecimal) {
    if (!isMoney(money)) {
      this.fractional = this.fractional.multiply(Big(money));

      return this;
    }

    if (this.currency.equals(money.currency)) {
      this.fractional = this.fractional.multiply(money.fractional);

      return this;
    }

    if (!this.mint.exchange) {
      throw new Error('You must instantiate an exchange for currency exchange');
    }

    this.multiply(
      this.mint.exchange.exchangeWith(money, this.currency.isoCode)
    );

    return this;
  }

  negate() {
    this.fractional = this.fractional.negate();

    return this;
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
