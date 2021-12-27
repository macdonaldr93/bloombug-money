import { Big } from 'bigdecimal.js';
import Currency, { CurrencyCodeISO4217, ICurrency } from '../currency';
import Money from '../money';
import { IRateStore, RateMemoryStore, UnknownRateError } from '../rates';

export default class Exchange {
  store: IRateStore;

  constructor(store = new RateMemoryStore()) {
    this.store = store;
  }

  exchangeWith(
    money: Money,
    to: Currency | ICurrency | CurrencyCodeISO4217 | string
  ) {
    const toCurrency = Currency.wrap(to);

    if (money.currency.eq(toCurrency)) {
      return money;
    }

    const rate = this.getRate(money.currency, toCurrency);

    if (rate) {
      const fractional = this.calculateFractional(money, toCurrency);
      return new Money(this.exchange(fractional, rate), to);
    }

    throw new UnknownRateError(
      `No conversion rate known for '${money.currency.toString()}' -> '${toCurrency.toString()}'`
    );
  }

  exchange(fractional: bigint, rate: number) {
    return Big(fractional)
      .multiply(Big(rate))
      .toBigInt()
      .valueOf();
  }

  addRate(
    from: Currency | ICurrency | CurrencyCodeISO4217 | string,
    to: Currency | ICurrency | CurrencyCodeISO4217 | string,
    rate: number
  ) {
    return this.store.addRate(
      Currency.wrap(from).isoCode,
      Currency.wrap(to).isoCode,
      rate
    );
  }

  getRate(
    from: Currency | ICurrency | CurrencyCodeISO4217 | string,
    to: Currency | ICurrency | CurrencyCodeISO4217 | string
  ) {
    return this.store.getRate(
      Currency.wrap(from).isoCode,
      Currency.wrap(to).isoCode
    );
  }

  calculateFractional(money: Money, to: Currency) {
    return (
      BigInt(money.fractional) /
      (BigInt(money.currency.subunitToUnit) / BigInt(to.subunitToUnit))
    );
  }
}
