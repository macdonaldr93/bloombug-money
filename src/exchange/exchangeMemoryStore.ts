import { CurrencyCodeISO4217 } from '../currency';
import { IExchangeStore, IRate } from './types';

export default class ExchangeMemoryStore implements IExchangeStore {
  private static INDEX_KEY_SEPARATOR = '_TO_';

  rates: { [key: string]: number };
  options: any;

  constructor(rates = {}, options = {}) {
    this.rates = rates;
    this.options = options;
  }

  addRates(rates: IRate[]) {
    return rates.map(({ from, to, rate }) => this.addRate(from, to, rate));
  }

  addRate(
    from: CurrencyCodeISO4217 | string,
    to: CurrencyCodeISO4217 | string,
    rate: number
  ) {
    this.rates[this.rateKeyFor(from, to)] = rate;

    return rate;
  }

  getRate(
    from: CurrencyCodeISO4217 | string,
    to: CurrencyCodeISO4217 | string
  ) {
    return this.rates[this.rateKeyFor(from, to)];
  }

  eachRate(
    callback: (
      from: CurrencyCodeISO4217 | string,
      to: CurrencyCodeISO4217 | string,
      rate: number
    ) => any
  ) {
    Object.entries(this.rates).forEach(([key, rate]) => {
      const [from, to] = key.split(ExchangeMemoryStore.INDEX_KEY_SEPARATOR);

      callback(from, to, rate);
    });
  }

  rateKeyFor(
    from: CurrencyCodeISO4217 | string,
    to: CurrencyCodeISO4217 | string
  ) {
    return [from.toUpperCase(), to.toUpperCase()].join(
      ExchangeMemoryStore.INDEX_KEY_SEPARATOR
    );
  }
}
