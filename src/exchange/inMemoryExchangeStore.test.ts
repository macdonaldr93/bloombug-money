import { InMemoryExchangeStore } from './inMemoryExchangeStore';

describe('InMemoryExchangeStore', () => {
  it('initializes with rates', () => {
    const store = new InMemoryExchangeStore([
      { from: 'USD', to: 'CAD', rate: '1.26' },
    ]);

    expect(store.rates).toEqual({
      USD_TO_CAD: '1.26',
    });
  });

  it('addRates() returns expected rates', () => {
    const store = new InMemoryExchangeStore();

    store.addRates([{ from: 'USD', to: 'CAD', rate: '1.26' }]);

    expect(store.rates).toEqual({
      USD_TO_CAD: '1.26',
    });
  });

  it('addRate() returns expected rate', () => {
    const store = new InMemoryExchangeStore();

    store.addRate('USD', 'CAD', '1.26');

    expect(store.rates).toEqual({
      USD_TO_CAD: '1.26',
    });
  });

  it('getRate() returns expected rate', () => {
    const store = new InMemoryExchangeStore();

    store.addRate('USD', 'CAD', '1.26');

    expect(store.getRate('USD', 'CAD')).toEqual('1.26');
  });

  it('getRate() throws unknown rate error', () => {
    const store = new InMemoryExchangeStore();

    expect(() => store.getRate('USD', 'CAD')).toThrow(
      "No conversion rate known for 'USD' -> 'CAD'"
    );
  });
});
