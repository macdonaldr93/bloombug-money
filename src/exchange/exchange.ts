import { Big, BigDecimal } from 'bigdecimal.js';
import { Currency } from '../currency';
import { Mint } from '../mint';
import { Money } from '../money';
import { Amount } from '../types';
import { InMemoryExchangeStore } from './inMemoryExchangeStore';
import { ExchangeStore } from './exchangeStore';

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

  exchangeWith(money: Money, toCurrency: Currency): Money {
    if (money.currency.isoCode === toCurrency.isoCode) {
      return money;
    }

    const rate = this.getRate(money.currency, toCurrency);
    const exponent = toCurrency.exponent - money.currency.exponent;
    const factor = toCurrency.base ** exponent;
    const fractional = money.fractional.multiply(rate).multiply(factor);

    return this.mint.Money(fractional, toCurrency);
  }

  addRate(from: Currency, to: Currency, rate: Amount): BigDecimal {
    return Big(
      this.store.addRate(from.isoCode, to.isoCode, rate.toString()),
      undefined,
      this.mint.mathContext
    );
  }

  getRate(from: Currency, to: Currency): BigDecimal {
    return Big(
      this.store.getRate(from.isoCode, to.isoCode),
      undefined,
      this.mint.mathContext
    );
  }
}
