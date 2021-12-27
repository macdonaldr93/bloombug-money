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

  isEqual(other: Money) {
    return (
      this.fractional === other.fractional &&
      this.currency.isEqual(other.currency)
    );
  }
}
