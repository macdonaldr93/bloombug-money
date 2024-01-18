import { Big } from 'bigdecimal.js';
import { CAD, ISK, MRU, USD } from '../currencies';
import { Mint } from '../mint';

describe('Exchange', () => {
  const currencies = { CAD, USD };

  it('adds the rate as number', () => {
    const { exchange } = new Mint({ currencies });

    exchange.addRate(USD, CAD, 1.26);
    const rate = exchange.getRate(USD, CAD);

    expect(rate.toString()).toEqual('1.26');
  });

  it('adds the rate as string', () => {
    const { exchange } = new Mint({ currencies });

    exchange.addRate(USD, CAD, '1.26');
    const rate = exchange.getRate(USD, CAD);

    expect(rate.toString()).toEqual('1.26');
  });

  it('adds the rate as bigint', () => {
    const { exchange } = new Mint({ currencies });

    exchange.addRate(USD, CAD, BigInt(2));
    const rate = exchange.getRate(USD, CAD);

    expect(rate.toString()).toEqual('2');
  });

  it('adds the rate as BigDecimal', () => {
    const { exchange } = new Mint({ currencies });

    exchange.addRate(USD, CAD, Big(1.26));
    const rate = exchange.getRate(USD, CAD);

    expect(rate.toString()).toEqual('1.26');
  });

  describe('exchangeWith()', () => {
    it('returns expected money', () => {
      const { exchange, Money } = new Mint({
        currencies,
        defaultLocale: 'en-US',
      });
      const money = exchange.exchangeWith(Money(100, USD), USD);

      expect(money.toString()).toEqual('$1.00');
    });

    it('returns expected money with exchange rate', () => {
      const { exchange, Money } = new Mint({
        currencies,
        defaultLocale: 'en-US',
      });

      exchange.addRate(CAD, USD, 0.74);

      const money = exchange.exchangeWith(Money(3599, CAD), USD);

      expect(money.toString()).toEqual('$26.63');
    });

    it('returns expected money with different exponents', () => {
      const { exchange, Money } = new Mint({
        currencies,
        defaultLocale: 'en-US',
      });

      exchange.addRate(USD, ISK, 136.92);
      exchange.addRate(ISK, USD, 0.0073);

      const money = exchange.exchangeWith(Money(3599, ISK), USD);

      expect(money.toString()).toEqual('$26.27');
    });

    it('returns expected money with different base', () => {
      const { exchange, Money } = new Mint({
        currencies,
        defaultLocale: 'en-US',
      });

      exchange.addRate(USD, MRU, '39.5500');
      exchange.addRate(MRU, USD, '0.0253');

      const money = exchange.exchangeWith(Money(3599, MRU), USD);

      expect(money.toString()).toEqual('$9.11');
    });

    it('throws if rate is unknown', () => {
      const { exchange, Money } = new Mint({ currencies });

      expect(() => exchange.exchangeWith(Money(100, USD), CAD)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });
});
