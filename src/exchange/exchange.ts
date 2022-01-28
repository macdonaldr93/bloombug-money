import { Big, BigDecimal } from 'bigdecimal.js';
import Currency, { CurrencyCode } from '../currency';
import Mint from '../mint';
import Money from '../money';
import ExchangeMemoryStore from './exchangeMemoryStore';
import { IExchangeStore } from './types';

export default class Exchange {
  mint?: Mint;
  store: IExchangeStore;

  constructor(store = new ExchangeMemoryStore()) {
    this.store = store;
  }

  useMint(mint: Mint) {
    this.mint = mint;
    mint.exchange = this;

    return mint;
  }

  exchangeWith(money: Money, to: CurrencyCode) {
    if (!this.mint) {
      throw new Error('You must initialize with a mint');
    }

    const toCurrency = this.mint.Currency(to);

    if (money.currency.equals(toCurrency)) {
      return money;
    }

    const rate = this.getRate(money.currency.isoCode, toCurrency.isoCode);
    const fractional = this.calculateFractional(money, toCurrency);

    return this.mint.Money(this.exchange(fractional, rate), to);
  }

  exchange(fractional: BigDecimal, rate: number) {
    return Big(fractional, undefined, this.mint?.mathContext)
      .multiply(Big(rate, undefined, this.mint?.mathContext))
      .toBigInt()
      .valueOf();
  }

  addRate(from: CurrencyCode, to: CurrencyCode, rate: number) {
    if (!this.mint) {
      throw new Error('You must initialize with a mint');
    }

    return this.store.addRate(
      this.mint.Currency(from).isoCode,
      this.mint.Currency(to).isoCode,
      rate
    );
  }

  getRate(from: CurrencyCode, to: CurrencyCode) {
    if (!this.mint) {
      throw new Error('You must initialize with a mint');
    }

    return this.store.getRate(
      this.mint.Currency(from).isoCode,
      this.mint.Currency(to).isoCode
    );
  }

  private calculateFractional(money: Money, to: Currency) {
    return money.fractional.divide(
      Big(
        money.currency.subunitToUnit,
        undefined,
        this.mint?.mathContext
      ).divide(
        Big(to.subunitToUnit, undefined, this.mint?.mathContext),
        undefined,
        this.mint?.defaultRoundingMode
      ),
      undefined,
      this.mint?.defaultRoundingMode
    );
  }
}
