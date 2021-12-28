import { CAD, USD } from '../currencies';
import isoCurrencies from '../iso-currencies.json';
import Exchange from '../exchange';
import Mint from './mint';

describe('Mint', () => {
  describe('#defaultCurrency', () => {
    it('returns USD as default currency', () => {
      const { Money } = Mint();

      expect(Money(400).currency.isoCode).toEqual(USD);
    });

    it('returns default currency', () => {
      const { Money } = Mint({
        defaultCurrency: CAD,
        currencies: isoCurrencies,
      });

      expect(Money(400).currency.isoCode).toEqual(CAD);
    });
  });

  describe('#currencies', () => {
    it('returns default currency', () => {
      const { currencies } = Mint({
        defaultCurrency: CAD,
        currencies: isoCurrencies,
      });

      expect(currencies).toEqual(isoCurrencies);
    });
  });

  describe('#exchange', () => {
    it('returns expected exchange', () => {
      const exchange = new Exchange();
      const { Money } = Mint({
        defaultCurrency: CAD,
        currencies: isoCurrencies,
        exchange,
      });

      expect(Money(400).exchange).toEqual(exchange);
    });
  });
});
