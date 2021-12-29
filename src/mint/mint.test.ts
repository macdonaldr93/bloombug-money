import { CAD, USD } from '../currencies';
import { CurrencyCache } from '../currency';
import defaultCurrencies from '../default-currencies.json';
import Exchange from '../exchange';
import currencies from '../test/iso-currencies.json';
import Mint from './mint';

describe('Mint', () => {
  it('returns expected default currency', () => {
    const mint = new Mint({ defaultCurrency: CAD, currencies });

    expect(mint.defaultCurrency).toEqualCurrency(mint.Currency(CAD));
  });

  it('returns expected default currency for money', () => {
    const mint = new Mint({ defaultCurrency: CAD, currencies });
    const money = mint.Money();

    expect(money.currency).toEqualCurrency(mint.Currency(CAD));
  });

  it('returns expected currencies', () => {
    const mint = new Mint({ currencies });

    expect(mint.currencies).toEqual(currencies);
  });

  it('returns expected exchange', () => {
    const exchange = new Exchange();
    const mint = new Mint({ exchange });

    expect(mint.exchange).toEqual(exchange);
  });

  it('returns expected currency cache', () => {
    const currencyCache = new CurrencyCache();
    const mint = new Mint({ currencyCache });

    expect(mint.currencyCache).toEqual(currencyCache);
  });

  it('throws when default currency is not defined in currencies', () => {
    expect(() => new Mint({ defaultCurrency: CAD })).toThrow(
      "Unknown currency 'CAD'"
    );
  });

  describe('defaults', () => {
    it('returns expected default currency', () => {
      const mint = new Mint();

      expect(mint.defaultCurrency).toEqualCurrency(mint.Currency(USD));
    });

    it('returns expected default currencies', () => {
      const mint = new Mint();

      expect(mint.currencies).toEqual(defaultCurrencies);
    });
  });
});
