import { Big, BigDecimal } from 'bigdecimal.js';
import Currency, { CurrencyCode } from '../currency';
import Mint from '../mint';
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
    return this.fractional.divide(this.subunitToUnit).numberValue();
  }

  get cents() {
    return this.fractional.numberValue();
  }

  // Aliases
  get dollars() {
    return this.amount;
  }

  format(
    locales: string | string[] = this.mint.defaultLocale,
    options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> = {}
  ) {
    return this.formatter(locales, options).format(this.amount);
  }

  formatter(
    locales: string | string[] = this.mint.defaultLocale,
    options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> = {}
  ) {
    return createIntlNumberFormatter(locales, this.currency.isoCode, options);
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

  toNumber() {
    return this.fractional.numberValue();
  }

  toLocaleString(
    locales?: string | string[],
    options: Omit<Intl.NumberFormatOptions, 'style' | 'currency'> = {}
  ) {
    return this.format(locales, options);
  }

  toString() {
    return this.format(this.mint.defaultLocale);
  }
}
