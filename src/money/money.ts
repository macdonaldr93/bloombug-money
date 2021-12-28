import { Big, BigDecimal } from 'bigdecimal.js';
import Currency, { CurrencyCode } from '../currency';
import { UnknownRateError } from '../exchange';
import Mint from '../mint';
import { isValueFinite } from '../utilities/number';

export interface MoneyOptions {}

export default class Money {
  readonly currency: Currency;
  readonly mint: Mint;
  fractional: BigDecimal;

  constructor(
    mint: Mint,
    fractional: bigint | number = 0,
    currency?: CurrencyCode | null
  ) {
    if (!isValueFinite(Number(fractional))) {
      throw RangeError('fractional must be finite');
    }

    this.mint = mint;
    this.fractional = Big(fractional);
    this.currency = currency
      ? this.mint.Currency(currency)
      : this.mint.defaultCurrency;
  }

  get amount() {
    return this.fractional
      .divide(Big(this.currency.subunitToUnit))
      .numberValue();
  }

  // Aliases
  get cents() {
    return this.fractional;
  }

  get dollars() {
    return this.amount;
  }

  format(
    locales?: string | string[],
    options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> = {}
  ) {
    return this.formatter(locales, options).format(this.amount);
  }

  formatter(
    locales?: string | string[],
    options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> = {}
  ) {
    return new Intl.NumberFormat(locales, {
      ...options,
      style: 'currency',
      currency: this.currency.isoCode,
    });
  }

  equals(other: Money) {
    return (
      this.fractional.equals(other.fractional) &&
      this.currency.equals(other.currency)
    );
  }

  add(money: Money) {
    if (!this.currency.equals(money.currency)) {
      throw new UnknownRateError(
        `No conversion rate known for '${this.currency.toString()}' -> '${money.currency.toString()}'`
      );
    }

    this.fractional = this.fractional.add(money.fractional);

    return this;
  }

  subtract(money: Money) {
    if (!this.currency.equals(money.currency)) {
      throw new UnknownRateError(
        `No conversion rate known for '${this.currency.toString()}' -> '${money.currency.toString()}'`
      );
    }

    this.fractional = this.fractional.subtract(money.fractional);

    return this;
  }

  toLocaleString(
    locales?: string | string[],
    options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> = {}
  ) {
    return this.format(locales, options);
  }

  toString() {
    return this.format();
  }
}
