import { USD } from '../currencies';
import Currency, {
  CurrencyCodeISO4217,
  ICurrency,
  UnknownCurrencyError,
} from '../currency';
import Exchange from '../exchange';
import { UnknownRateError } from '../rates';
import { isValueFinite } from '../utilities/number';

export interface MoneyOptions {
  defaultCurrency: CurrencyCodeISO4217 | string;
}

export default class Money {
  static defaultCurrency: Currency;
  static exchange?: Exchange;

  static configure(options: Partial<MoneyOptions> = {}) {
    const resolvedOptions = {
      defaultCurrency: USD,
      ...options,
    };

    const currency = Currency.find(resolvedOptions.defaultCurrency);

    if (!currency) {
      throw new UnknownCurrencyError(
        `You must register '${resolvedOptions.defaultCurrency}' currency.
Currency.register({
  ${resolvedOptions.defaultCurrency}: {
    isoCode: '${resolvedOptions.defaultCurrency}',
    // the rest of your currency
  },
})`
      );
    }

    Money.defaultCurrency = new Currency(resolvedOptions.defaultCurrency);
  }

  static reset() {
    Money.defaultCurrency = new Currency(USD);
  }

  currency: Currency;
  fractional: bigint;

  constructor(
    fractional: bigint | number,
    currency?: Currency | ICurrency | CurrencyCodeISO4217 | string | null
  ) {
    if (!isValueFinite(Number(fractional))) {
      throw RangeError('fractional must be finite');
    }

    this.fractional = BigInt(fractional);
    this.currency = Currency.wrap(currency || Money.defaultCurrency.isoCode);
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
    if (this.currency.eq(money.currency)) {
      this.fractional += money.fractional;

      return this;
    }

    if (!Money.exchange) {
      throw new Error(
        `You must initialize an exchange to support multi-currency arithmetic.

Money.exchange = new Exchange();`
      );
    }

    this.add(Money.exchange.exchangeWith(money, this.currency));

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

Money.configure();
