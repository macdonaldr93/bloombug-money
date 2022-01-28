import { Big } from 'bigdecimal.js';
import currencies from '../test/iso-currencies.json';
import { CAD, USD } from '../currencies';
import Currency from '../currency';
import Mint from '../mint';
import Money from './money';
import { Exchange } from '..';

describe('Money', () => {
  const mint = new Mint({ currencies, defaultLocale: 'en-US' });

  describe('#currency', () => {
    it('returns expected currency from string', () => {
      const money = new Money(mint, 400, CAD);

      expect(money.currency).toEqualCurrency(new Currency(mint, CAD));
    });

    it('returns expected default currency', () => {
      const money = new Money(mint, 400);

      expect(money.currency).toEqualCurrency(new Currency(mint, USD));
    });
  });

  describe('#fractional', () => {
    it('returns expected value', () => {
      const money = new Money(mint, 400, CAD);

      expect(money.fractional).toEqual(Big(400));
    });

    it('returns expected value from string', () => {
      const money = new Money(mint, '400', CAD);

      expect(money.fractional).toEqual(Big(40000));
    });

    it('returns expected value from with string thousands', () => {
      const money = new Money(mint, '4,000.19', CAD);

      expect(money.fractional).toEqual(Big(400019));
    });

    it('throws when value is infinite', () => {
      const infinite = 4 / 0;

      expect(() => new Money(mint, infinite, CAD)).toThrowError(
        'fractional must be finite'
      );
    });

    it('#cents alias returns exepcted value', () => {
      const money = new Money(mint, 400, CAD);

      expect(money.cents).toEqual(400);
    });
  });

  describe('#amount', () => {
    it('returns expected value', () => {
      const money = new Money(mint, 400, CAD);

      expect(money.amount).toEqual(4);
    });

    it('#dollars alias returns exepcted value', () => {
      const money = new Money(mint, 400, CAD);

      expect(money.dollars).toEqual(4);
    });
  });

  describe('add()', () => {
    it('returns expected fractional', () => {
      const money = new Money(mint, 400, CAD);
      const other = new Money(mint, 400, CAD);

      money.add(other);

      expect(money).toEqualMoney(new Money(mint, 800, CAD));
    });

    it('returns expected fractional with exchange', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = new Money(mint2, 400, CAD);
      const other = new Money(mint2, 400, USD);

      money.add(other);

      expect(money).toEqualMoney(new Money(mint, 904, CAD));
    });

    it('throws when exchange is not found', () => {
      const money = new Money(mint, 400, CAD);
      const other = new Money(mint, 400, USD);

      expect(() => money.add(other)).toThrow(
        'You must instantiate an exchange for currency exchange'
      );
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      const money = new Money(mint2, 400, CAD);
      const other = new Money(mint2, 400, USD);

      expect(() => money.add(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('subtract()', () => {
    it('returns expected fractional', () => {
      const money = new Money(mint, 400, CAD);
      const other = new Money(mint, 100, CAD);

      money.subtract(other);

      expect(money).toEqualMoney(new Money(mint, 300, CAD));
    });

    it('returns expected fractional with exchange', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = new Money(mint2, 400, CAD);
      const other = new Money(mint2, 100, USD);

      money.subtract(other);

      expect(money).toEqualMoney(new Money(mint2, 274, CAD));
    });

    it('throws when exchange is not found', () => {
      const money = new Money(mint, 400, CAD);
      const other = new Money(mint, 400, USD);

      expect(() => money.subtract(other)).toThrow(
        'You must instantiate an exchange for currency exchange'
      );
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      const money = new Money(mint2, 400, CAD);
      const other = new Money(mint2, 100, USD);

      expect(() => money.subtract(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('divide()', () => {
    it('returns expected fractional', () => {
      const money = new Money(mint, 400, CAD);
      const other = new Money(mint, 2, CAD);

      money.divide(other);

      expect(money).toEqualMoney(new Money(mint, 200, CAD));
    });

    it('returns expected fractional for number', () => {
      const money = new Money(mint, 400, CAD);

      money.divide(2);

      expect(money).toEqualMoney(new Money(mint, 200, CAD));
    });

    it('returns expected fractional for BigDecimal', () => {
      const money = new Money(mint, 400, CAD);

      money.divide(Big(2));

      expect(money).toEqualMoney(new Money(mint, 200, CAD));
    });

    it('returns expected fractional with exchange', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = new Money(mint2, 400, CAD);
      const other = new Money(mint2, 4, USD);

      money.divide(other);

      expect(money).toEqualMoney(new Money(mint2, 80, CAD));
    });

    it('throws when exchange is not found', () => {
      const money = new Money(mint, 400, CAD);
      const other = new Money(mint, 2, USD);

      expect(() => money.divide(other)).toThrow(
        'You must instantiate an exchange for currency exchange'
      );
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      const money = new Money(mint2, 400, CAD);
      const other = new Money(mint2, 2, USD);

      expect(() => money.divide(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('multiply()', () => {
    it('returns expected fractional', () => {
      const money = new Money(mint, 400, CAD);
      const other = new Money(mint, 2, CAD);

      money.multiply(other);

      expect(money).toEqualMoney(new Money(mint, 800, CAD));
    });

    it('returns expected fractional for number', () => {
      const money = new Money(mint, 400, CAD);

      money.multiply(2);

      expect(money).toEqualMoney(new Money(mint, 800, CAD));
    });

    it('returns expected fractional for BigDecimal', () => {
      const money = new Money(mint, 400, CAD);

      money.multiply(Big(2));

      expect(money).toEqualMoney(new Money(mint, 800, CAD));
    });

    it('returns expected fractional with exchange', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = new Money(mint2, 400, CAD);
      const other = new Money(mint2, 4, USD);

      money.multiply(other);

      expect(money).toEqualMoney(new Money(mint2, 2000, CAD));
    });

    it('throws when exchange is not found', () => {
      const money = new Money(mint, 400, CAD);
      const other = new Money(mint, 2, USD);

      expect(() => money.multiply(other)).toThrow(
        'You must instantiate an exchange for currency exchange'
      );
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      const money = new Money(mint2, 400, CAD);
      const other = new Money(mint2, 2, USD);

      expect(() => money.multiply(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('negate()', () => {
    it('returns positive amount as negative', () => {
      const money = new Money(mint, 400, CAD);

      money.negate();

      expect(money).toEqualMoney(new Money(mint, -400, CAD));
    });

    it('returns negative amount as positive', () => {
      const money = new Money(mint, -400, CAD);

      money.negate();

      expect(money).toEqualMoney(new Money(mint, 400, CAD));
    });
  });

  describe('formatter()', () => {
    it('returns formatter', () => {
      const money = new Money(mint, 400, CAD);
      const formatter = money.formatter('en-US');

      expect(formatter).toBeInstanceOf(Intl.NumberFormat);
    });

    it('returns formatter with default locale', () => {
      const mint = new Mint({ currencies, defaultLocale: 'fr-CA' });
      const money = new Money(mint, 400, CAD);
      const formatter = money.formatter();

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          locale: 'fr-CA',
        })
      );
    });

    it('returns formatter with options', () => {
      const money = new Money(mint, 400, CAD);
      const formatter = money.formatter({ currencyDisplay: 'symbol' });

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          currencyDisplay: 'symbol',
        })
      );
    });

    it('returns formatter with locales and options', () => {
      const money = new Money(mint, 400, CAD);
      const formatter = money.formatter('en-US', { currencyDisplay: 'symbol' });

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          locale: 'en-US',
          currencyDisplay: 'symbol',
        })
      );
    });
  });

  describe('format()', () => {
    it('returns expected format', () => {
      const money = new Money(mint, 400, CAD);
      const formattedMoney = money.format('en-US');

      expect(formattedMoney).toEqual('CA$4.00');
    });

    it('returns formatter with default locale', () => {
      const mint = new Mint({ currencies, defaultLocale: 'fr-CA' });
      const money = new Money(mint, 400, CAD);
      const formattedMoney = money.format();

      expect(formattedMoney).toEqual('4,00 $ CA');
    });

    it('returns formatter with options', () => {
      const money = new Money(mint, 400, CAD);
      const formattedMoney = money.format({
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });

    it('returns formatter with locales and options', () => {
      const money = new Money(mint, 400, CAD);
      const formattedMoney = money.format('en-US', {
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });
  });

  describe('equals()', () => {
    it('returns true when money is same fractional and currency', () => {
      const money1 = new Money(mint, 400, CAD);
      const money2 = new Money(mint, 400, CAD);

      expect(money1.equals(money2)).toBeTruthy();
    });

    it('returns false when money is same fractional and different currency', () => {
      const money1 = new Money(mint, 400, CAD);
      const money2 = new Money(mint, 400, USD);

      expect(money1.equals(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and same currency', () => {
      const money1 = new Money(mint, 500, CAD);
      const money2 = new Money(mint, 400, CAD);

      expect(money1.equals(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and different currency', () => {
      const money1 = new Money(mint, 500, CAD);
      const money2 = new Money(mint, 400, USD);

      expect(money1.equals(money2)).toBeFalsy();
    });
  });

  describe('toNumber()', () => {
    it('returns expected number', () => {
      const money = new Money(mint, 400, CAD);

      expect(money.toNumber()).toEqual(400);
    });
  });

  describe('toLocaleString()', () => {
    it('returns expected format', () => {
      const money = new Money(mint, 400, CAD);
      const formattedMoney = money.toLocaleString('en-US');

      expect(formattedMoney).toEqual('CA$4.00');
    });

    it('returns formatter with default locale', () => {
      const money = new Money(mint, 400, CAD);
      const formattedMoney = money.toLocaleString();

      expect(formattedMoney).toEqual('CA$4.00');
    });

    it('returns formatter with options', () => {
      const money = new Money(mint, 400, CAD);
      const formattedMoney = money.toLocaleString({
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });

    it('returns formatter with locales and options', () => {
      const money = new Money(mint, 400, CAD);
      const formattedMoney = money.toLocaleString('en-US', {
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });
  });

  describe('toString()', () => {
    it('returns expected value', () => {
      const money = new Money(mint, 400, USD);

      expect(money.toString()).toEqual('$4.00');
    });

    it('returns expected value with different default locale', () => {
      const mint2 = new Mint({ defaultLocale: 'en-CA' });
      const money = new Money(mint2, 400, USD);

      expect(money.toString()).toEqual('US$4.00');
    });
  });
});
