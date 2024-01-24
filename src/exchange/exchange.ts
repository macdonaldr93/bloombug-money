import { Big, BigDecimal } from 'bigdecimal.js';
import { Currency } from '../currency';
import { Mint } from '../mint';
import { Money } from '../money';
import { Amount } from '../types';
import { InMemoryExchangeStore } from './inMemoryExchangeStore';
import { ExchangeStore } from './exchangeStore';
import { Rate } from './rate';

export interface ExchangeOptions {}

export class Exchange {
  mint: Mint;
  store: ExchangeStore;

  constructor(
    store: ExchangeStore = new InMemoryExchangeStore(),
    mint: Mint,
    _options: ExchangeOptions = {}
  ) {
    this.mint = mint;
    this.store = store;
  }

  convert(money: Money, to: string | Currency): Money {
    to = typeof to === 'string' ? this.mint.toCurrency(to) : to;

    if (money.currency.isoCode === to.isoCode) {
      return money;
    }

    const rate = this.getRate(money.currency, to);
    const exponent = to.exponent - money.currency.exponent;
    const factor = to.base ** exponent;
    const amount = money.amount.multiply(rate).multiply(factor);

    return this.mint.Money(amount, to);
  }

  refreshRates() {
    return this.store.refreshRates();
  }

  addRates(rates: Rate[]) {
    return this.store
      .addRates(rates)
      .map(r => Big(r, undefined, this.mint.mathContext));
  }

  addRate(
    from: string | Currency,
    to: string | Currency,
    rate: Amount
  ): BigDecimal {
    from = typeof from === 'string' ? from : from.isoCode;
    to = typeof to === 'string' ? to : to.isoCode;

    return Big(
      this.store.addRate(from, to, rate.toString()),
      undefined,
      this.mint.mathContext
    );
  }

  getRate(from: string | Currency, to: string | Currency): BigDecimal {
    from = typeof from === 'string' ? from : from.isoCode;
    to = typeof to === 'string' ? to : to.isoCode;

    return Big(this.store.getRate(from, to), undefined, this.mint.mathContext);
  }
}
