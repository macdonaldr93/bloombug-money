import { UnknownRateError } from '../errors';
import { ExchangeStore } from './exchangeStore';
import { Rate } from './rate';

export class InMemoryExchangeStore implements ExchangeStore {
  private static INDEX_KEY_SEPARATOR = '_TO_';

  rates: { [key: string]: string };

  constructor(rates?: Rate[]) {
    this.rates = {};

    if (rates && rates.length > 0) {
      this.addRates(rates);
    }
  }

  async refreshRates(): Promise<void> {
    throw new Error('Rates are manually added using addRate() or addRates()');
  }

  addRates(rates: Rate[]) {
    return rates.map(({ from, to, rate }) => this.addRate(from, to, rate));
  }

  addRate(from: string, to: string, rate: string) {
    this.rates[this.rateKeyFor(from, to)] = rate;

    return rate;
  }

  getRate(from: string, to: string) {
    const rate = this.rates[this.rateKeyFor(from, to)];

    if (!rate) {
      throw new UnknownRateError(from, to);
    }

    return rate;
  }

  private rateKeyFor(from: string, to: string) {
    return [from.toUpperCase(), to.toUpperCase()].join(
      InMemoryExchangeStore.INDEX_KEY_SEPARATOR
    );
  }
}
