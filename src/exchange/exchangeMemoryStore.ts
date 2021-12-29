import { CurrencyCodeISO4217 } from '../currency';
import { UnknownRateError } from './errors';
import { IExchangeStore, IRate } from './types';

export default class ExchangeMemoryStore implements IExchangeStore {
  private static INDEX_KEY_SEPARATOR = '_TO_';

  rates: { [key: string]: number };
  options: any;

  constructor(rates?: IRate[], options = {}) {
    this.rates = {};
    this.options = options;

    if (rates && rates.length > 0) {
      this.addRates(rates);
    }
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
    const rate = this.rates[this.rateKeyFor(from, to)];

    if (!rate) {
      throw new UnknownRateError(from, to);
    }

    return rate;
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

  private rateKeyFor(
    from: CurrencyCodeISO4217 | string,
    to: CurrencyCodeISO4217 | string
  ) {
    return [from.toUpperCase(), to.toUpperCase()].join(
      ExchangeMemoryStore.INDEX_KEY_SEPARATOR
    );
  }
}
