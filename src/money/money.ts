import Currency, { CurrencyCodeISO4217, ICurrency } from '../currency';
import { UnknownRateError } from '../rates';
import { isValueFinite } from '../utilities/number';

export interface MoneyOptions {}

export default class Money {
  static defaultCurrency: Currency;

  currency: Currency;
  fractional: bigint;

  constructor(
    fractional: bigint | number,
    currency?: Currency | ICurrency | CurrencyCodeISO4217 | string | null,
    _: MoneyOptions = {}
  ) {
    if (!isValueFinite(Number(fractional))) {
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

  format(
    locales?: string | string[],
    options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> = {}
  ) {
    return this.formatter(locales, options).format(Number(this.amount));
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

  eq(other: Money) {
    return (
      this.fractional === other.fractional && this.currency.eq(other.currency)
    );
  }

  add(money: Money) {
    if (!this.currency.eq(money.currency)) {
      throw new UnknownRateError(
        `No conversion rate known for '${this.currency.toString()}' -> '${money.currency.toString()}'`
      );
    }

    this.fractional += money.fractional;

    return this;
  }

  sub(money: Money) {
    if (!this.currency.eq(money.currency)) {
      throw new UnknownRateError(
        `No conversion rate known for '${this.currency.toString()}' -> '${money.currency.toString()}'`
      );
    }

    this.fractional -= money.fractional;

    return this;
  }

  toLocaleString(
    locales?: string | string[],
    options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> = {}
  ) {
    return this.format(locales, options);
  }

  toString() {
    return this.formatter().format(Number(this.amount));
  }
}

Money.defaultCurrency = new Currency('USD');
