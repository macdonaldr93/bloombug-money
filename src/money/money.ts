import { UnknownRateError } from '../bank';
import Currency, { CurrencyCodeISO4217, ICurrency } from '../currency';
import { isValueFinite } from '../utilities/number';

export interface MoneyOptions {}

export default class Money {
  static defaultCurrency: Currency = new Currency('USD');

  currency: Currency;
  fractional: bigint;

  constructor(
    fractional: number,
    currency?: Currency | ICurrency | CurrencyCodeISO4217 | string | null,
    _: MoneyOptions = {}
  ) {
    if (!isValueFinite(fractional)) {
      throw RangeError('fractional must be finite');
    }

    this.fractional = BigInt(fractional);
    this.currency = currency ? Currency.wrap(currency) : Money.defaultCurrency;
  }

  get cents() {
    return this.fractional;
  }

  get dollars() {
    return this.amount;
  }

  get amount() {
    return this.fractional / BigInt(this.currency.subunitToUnit);
  }

  add(money: Money) {
    if (!this.currency.isEqual(money.currency)) {
      throw new UnknownRateError(
        `No conversion rate known for '${this.currency.toString()}' -> '${money.currency.toString()}'`
      );
    }

    this.fractional += money.fractional;
  }

  sub(money: Money) {
    if (!this.currency.isEqual(money.currency)) {
      throw new UnknownRateError(
        `No conversion rate known for '${this.currency.toString()}' -> '${money.currency.toString()}'`
      );
    }

    this.fractional -= money.fractional;
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

  isEqual(other: Money) {
    return (
      this.fractional === other.fractional &&
      this.currency.isEqual(other.currency)
    );
  }

  toString() {
    return this.formatter().format(this.amount);
  }
}
