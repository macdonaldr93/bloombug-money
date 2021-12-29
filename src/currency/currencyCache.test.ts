import currencies from '../test/iso-currencies.json';
import { CAD, USD } from '../currencies';
import Currency from './currency';
import Mint from '../mint';
import { CurrencyCache } from '.';

describe('CurrencyCache', () => {
  it('codes() returns currency iso codes', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const currency = new Currency(mint, CAD);

    currencyCache.set(currency);

    for (const code of currencyCache.codes()) {
      expect(code).toEqual(CAD);
    }
  });

  it('currencies() returns currencies', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const cad = new Currency(mint, CAD);

    currencyCache.set(cad);

    for (const currency of currencyCache.currencies()) {
      expect(currency).toEqual(cad);
    }
  });

  it('forEach() iterates over empty cache', () => {
    const stub = jest.fn();
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const cad = new Currency(mint, CAD);
    const usd = new Currency(mint, USD);

    currencyCache.set(cad);
    currencyCache.set(usd);
    currencyCache.forEach(stub);

    expect(stub).toBeCalledTimes(2);
  });

  it('forEach() iterates over cache', () => {
    const stub = jest.fn();
    const currencyCache = new CurrencyCache();

    currencyCache.forEach(stub);

    expect(stub).toBeCalledTimes(0);
  });

  it('has() returns true if currency is cached', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const currency = new Currency(mint, CAD);

    currencyCache.set(currency);

    expect(currencyCache.has(currency.isoCode)).toBeTruthy();
  });

  it('has() returns false if currency is not cached', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const currency = new Currency(mint, CAD);

    expect(currencyCache.has(currency.isoCode)).toBeFalsy();
  });

  it('get() returns currency', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const cad = new Currency(mint, CAD);

    currencyCache.set(cad);

    expect(currencyCache.get(cad.isoCode)).toEqual(cad);
  });

  it('get() returns undefined', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const cad = new Currency(mint, CAD);

    expect(currencyCache.get(cad.isoCode)).toBeUndefined();
  });

  it('set() stores currency', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const currency = new Currency(mint, CAD);

    currencyCache.set(currency);

    expect(currencyCache.has(currency.isoCode)).toBeTruthy();
  });

  it('delete() removes currency', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const currency = new Currency(mint, CAD);

    currencyCache.set(currency);

    expect(currencyCache.has(currency.isoCode)).toBeTruthy();

    currencyCache.delete(currency.isoCode);

    expect(currencyCache.has(currency.isoCode)).toBeFalsy();
  });

  it('clear() removes all currency', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const currency = new Currency(mint, CAD);

    currencyCache.set(currency);
    currencyCache.clear();

    expect(currencyCache.size()).toEqual(0);
  });

  it('size() returns number of currencies', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencies });
    const currency = new Currency(mint, CAD);

    currencyCache.set(currency);

    expect(currencyCache.size()).toEqual(1);
  });
});
