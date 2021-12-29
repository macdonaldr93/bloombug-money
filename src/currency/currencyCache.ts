import Currency, { CurrencyCode } from '../currency';

export default class CurrencyCache {
  store: Map<CurrencyCode, Currency>;

  constructor() {
    this.store = new Map();
  }

  codes(): IterableIterator<CurrencyCode> {
    return this.store.keys();
  }

  currencies(): IterableIterator<Currency> {
    return this.store.values();
  }

  forEach(
    callbackfn: (
      currency: Currency,
      code: CurrencyCode,
      map: Map<CurrencyCode, Currency>
    ) => void
  ) {
    return this.store.forEach(callbackfn);
  }

  has(code: CurrencyCode) {
    return this.store.has(code);
  }

  get(code: CurrencyCode) {
    return this.store.get(code);
  }

  set(currency: Currency) {
    return this.store.set(currency.code, currency);
  }

  delete(code: CurrencyCode) {
    return this.store.delete(code);
  }

  clear() {
    return this.store.clear();
  }

  size() {
    return this.store.size;
  }
}
