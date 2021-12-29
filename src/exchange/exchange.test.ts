import currencies from '../test/iso-currencies.json';
import { CAD, USD } from '../currencies';
import Mint from '../mint';
import Money from '../money';
import Exchange from './exchange';

describe('Exchange', () => {
  const mint = new Mint({ currencies });

  describe('exchangeWith()', () => {
    it('returns expected money', () => {
      const exchange = new Exchange();

      exchange.useMint(mint);
      exchange.addRate(USD, CAD, 0.745);

      const money = exchange.exchangeWith(new Money(mint, 100, USD), CAD);

      expect(money).toEqualMoney(new Money(mint, 74, CAD));
    });
  });
});
