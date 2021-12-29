import { CAD, USD } from '../currencies';
import ExchangeMemoryStore from './exchangeMemoryStore';

describe('ExchangeMemoryStore', () => {
  it('initializes with rates', () => {
    const store = new ExchangeMemoryStore([{ from: USD, to: CAD, rate: 1.26 }]);

    expect(store.rates).toEqual({
      USD_TO_CAD: 1.26,
    });
  });

  it('addRates() returns expected rates', () => {
    const store = new ExchangeMemoryStore();

    store.addRates([{ from: USD, to: CAD, rate: 1.26 }]);

    expect(store.rates).toEqual({
      USD_TO_CAD: 1.26,
    });
  });

  it('addRate() returns expected rate', () => {
    const store = new ExchangeMemoryStore();

    store.addRate(USD, CAD, 1.26);

    expect(store.rates).toEqual({
      USD_TO_CAD: 1.26,
    });
  });

  it('getRate() returns expected rate', () => {
    const store = new ExchangeMemoryStore();

    store.addRate(USD, CAD, 1.26);

    expect(store.getRate(USD, CAD)).toEqual(1.26);
  });

  it('getRate() throws unknown rate error', () => {
    const store = new ExchangeMemoryStore();

    expect(() => store.getRate(USD, CAD)).toThrow(
      "No conversion rate known for 'USD' -> 'CAD'"
    );
  });

  it('eachRate() iterates over rates', () => {
    const stub = jest.fn();
    const store = new ExchangeMemoryStore();

    store.addRate(USD, CAD, 1.26);
    store.addRate(CAD, USD, 0.74);
    store.eachRate(stub);

    expect(stub).toHaveBeenCalledTimes(2);
  });
});
