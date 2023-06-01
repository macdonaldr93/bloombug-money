import currencies from '../test/iso-currencies.json';
import { CAD, USD } from '../currencies';
import Mint from '../mint';
import Money from '../money';
import Exchange from './exchange';
import { ExchangeMemoryStore } from '.';

describe('Exchange', () => {
  const mint = new Mint({ currencies });

  describe('useMint()', () => {
    it('sets expected mint', () => {
      const exchange = new Exchange();

      exchange.useMint(mint);

      expect(exchange.mint).toEqual(mint);
    });

    it('sets expected exchange for mint', () => {
      const exchange = new Exchange();

      exchange.useMint(mint);

      expect(mint.exchange).toEqual(exchange);
    });
  });

  describe('exchangeWith()', () => {
    it('returns expected money', () => {
      const exchange = new Exchange();

      exchange.useMint(mint);

      const money = exchange.exchangeWith(new Money(100, USD, mint), USD);

      expect(money).toEqualMoney(new Money(100, USD, mint));
    });

    it('returns expected money with exchange rate', () => {
      const exchange = new Exchange();

      exchange.useMint(mint);
      exchange.addRate(USD, CAD, 0.745);

      const money = exchange.exchangeWith(new Money(100, USD, mint), CAD);

      expect(money).toEqualMoney(new Money(74, CAD, mint));
    });

    it('throws if mint is undefined', () => {
      const exchange = new Exchange();

      expect(() =>
        exchange.exchangeWith(new Money(100, USD, mint), CAD)
      ).toThrow('You must initialize with a mint');
    });

    it('throws if rate is unknown', () => {
      const exchange = new Exchange();

      exchange.useMint(mint);

      expect(() =>
        exchange.exchangeWith(new Money(100, USD, mint), CAD)
      ).toThrow("No conversion rate known for 'USD' -> 'CAD'");
    });
  });

  describe('addRate()', () => {
    it('returns stores expected rate', () => {
      const cache = new ExchangeMemoryStore();
      const exchange = new Exchange(cache);

      exchange.useMint(mint);
      exchange.addRate(USD, CAD, 1.26);

      expect(cache.getRate(USD, CAD)).toEqual(1.26);
    });

    it('throws if mint is undefined', () => {
      const exchange = new Exchange();

      expect(() => exchange.addRate(USD, CAD, 1.26)).toThrow(
        'You must initialize with a mint'
      );
    });
  });

  describe('getRate()', () => {
    it('returns expected rate', () => {
      const exchange = new Exchange();

      exchange.useMint(mint);
      exchange.addRate(USD, CAD, 1.26);

      expect(exchange.getRate(USD, CAD)).toEqual(1.26);
    });

    it('throws if mint is undefined', () => {
      const exchange = new Exchange();

      expect(() => exchange.getRate(USD, CAD)).toThrow(
        'You must initialize with a mint'
      );
    });
  });
});
