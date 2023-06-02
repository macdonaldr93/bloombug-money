import { Big } from 'bigdecimal.js';
import currencies from '../test/iso-currencies.json';
import { CAD, ISK, USD } from '../currencies';
import Currency from '../currency';
import Mint from '../mint';
import Money from './money';
import { Exchange } from '..';

describe('Money', () => {
  let mint: Mint;

  beforeAll(() => {
    mint = Mint.init({ currencies, defaultLocale: 'en-US' });
  });

  afterAll(() => {
    Mint.clear();
  });

  describe('#currency', () => {
    it('returns expected currency from string', () => {
      const money = new Money(400, CAD);

      expect(money.currency).toEqualCurrency(new Currency(CAD));
    });

    it('returns expected default currency', () => {
      const money = new Money(400);

      expect(money.currency).toEqualCurrency(new Currency(USD));
    });
  });

  describe('#fractional', () => {
    it('returns expected value', () => {
      const money = new Money(400, CAD);

      expect(money.fractional).toEqual(Big(400, undefined, mint.mathContext));
    });

    it('returns expected value from number', () => {
      const money = new Money(108741, CAD);

      expect(money.dollars).toEqual(1087.41);
    });

    it('returns expected value from string', () => {
      const money = new Money('400.00', CAD);

      expect(money.format()).toEqual('CA$400.00');
    });

    it('returns expected value from with string thousands', () => {
      const money = new Money('4000.19', CAD);

      expect(money.format()).toEqual('CA$4,000.19');
    });

    it('returns expected value from with string thousands and as amount', () => {
      const money = new Money('4,000.19', CAD);

      expect(money.format()).toEqual('CA$4,000.19');
    });

    it('throws when value is infinite', () => {
      const infinite = 4 / 0;

      expect(() => new Money(infinite, CAD, mint)).toThrowError(
        'fractional must be finite'
      );
    });

    it('#cents alias returns exepcted value', () => {
      const money = new Money(400, CAD);

      expect(money.cents).toEqual(400);
    });

    it('#cents alias returns exepcted value', () => {
      const money = new Money('1299.95', CAD);

      expect(money.multiply(0.03).cents).toEqual(3900);
    });
  });

  describe('#amount', () => {
    it('returns expected value', () => {
      const money = new Money(400, CAD);

      expect(money.amount).toEqual(4);
    });

    it('#dollars alias returns exepcted value', () => {
      const money = new Money(400, CAD);

      expect(money.dollars).toEqual(4);
    });
  });

  describe('add()', () => {
    it('returns expected fractional', () => {
      const money = new Money(400, CAD);
      const other = new Money(400, CAD);

      expect(money.add(other)).toEqualMoney(new Money(800, CAD, mint));
    });

    it('returns expected fractional for number', () => {
      const money = new Money(400, CAD);

      expect(money.add(400)).toEqualMoney(new Money(800, CAD, mint));
    });

    it('returns expected fractional with exchange', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = new Money(400, CAD, mint2);
      const other = new Money(400, USD, mint2);

      expect(money.add(other)).toEqualMoney(new Money(904, CAD, mint));
    });

    it('throws when exchange is not found', () => {
      const money = new Money(400, CAD);
      const other = new Money(400, USD);

      expect(() => money.add(other)).toThrow(
        'You must instantiate an exchange for currency exchange'
      );
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      const money = new Money(400, CAD, mint2);
      const other = new Money(400, USD, mint2);

      expect(() => money.add(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('subtract()', () => {
    it('returns expected fractional', () => {
      const money = new Money(400, CAD);
      const other = new Money(100, CAD);

      expect(money.subtract(other)).toEqualMoney(new Money(300, CAD, mint));
    });

    it('returns expected fractional for number', () => {
      const money = new Money(400, CAD);

      expect(money.subtract(100)).toEqualMoney(new Money(300, CAD, mint));
    });

    it('returns expected fractional with exchange', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = new Money(400, CAD, mint2);
      const other = new Money(100, USD, mint2);

      expect(money.subtract(other)).toEqualMoney(new Money(274, CAD, mint2));
    });

    it('throws when exchange is not found', () => {
      const money = new Money(400, CAD);
      const other = new Money(400, USD);

      expect(() => money.subtract(other)).toThrow(
        'You must instantiate an exchange for currency exchange'
      );
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      const money = new Money(400, CAD, mint2);
      const other = new Money(100, USD, mint2);

      expect(() => money.subtract(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('divide()', () => {
    it('returns expected fractional', () => {
      const money = new Money(400, CAD);
      const other = new Money(2, CAD);

      expect(money.divide(other)).toEqualMoney(new Money(200, CAD, mint));
    });

    it('returns expected fractional with rounding', () => {
      const money = new Money(234523, CAD);
      const other = new Money(21234, CAD);

      expect(money.divide(other)).toEqualMoney(new Money(11, CAD, mint));
    });

    it('returns expected fractional for number', () => {
      const money = new Money(400, CAD);

      expect(money.divide(2)).toEqualMoney(new Money(200, CAD, mint));
    });

    it('returns expected fractional for BigDecimal', () => {
      const money = new Money(400, CAD);

      expect(money.divide(Big(2))).toEqualMoney(new Money(200, CAD, mint));
    });

    it('returns expected fractional with exchange', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = new Money(400, CAD, mint2);
      const other = new Money(4, USD, mint2);

      expect(money.divide(other)).toEqualMoney(new Money(80, CAD, mint2));
    });

    it('throws when exchange is not found', () => {
      const money = new Money(400, CAD);
      const other = new Money(2, USD);

      expect(() => money.divide(other)).toThrow(
        'You must instantiate an exchange for currency exchange'
      );
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      const money = new Money(400, CAD, mint2);
      const other = new Money(2, USD, mint2);

      expect(() => money.divide(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('multiply()', () => {
    it('returns expected fractional', () => {
      const money = new Money(400, CAD);
      const other = new Money(2, CAD);

      expect(money.multiply(other)).toEqualMoney(new Money(800, CAD, mint));
    });

    it('returns expected fractional for number', () => {
      const money = new Money(400, CAD);

      expect(money.multiply(2)).toEqualMoney(new Money(800, CAD, mint));
    });

    it('returns expected fractional for BigDecimal', () => {
      const money = new Money(400, CAD);

      expect(money.multiply(Big(2))).toEqualMoney(new Money(800, CAD, mint));
    });

    it('returns expected fractional with exchange', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = new Money(400, CAD, mint2);
      const other = new Money(4, USD, mint2);

      expect(money.multiply(other)).toEqualMoney(new Money(2000, CAD, mint2));
    });

    it('throws when exchange is not found', () => {
      const money = new Money(400, CAD);
      const other = new Money(2, USD);

      expect(() => money.multiply(other)).toThrow(
        'You must instantiate an exchange for currency exchange'
      );
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies, exchange: new Exchange() });
      const money = new Money(400, CAD, mint2);
      const other = new Money(2, USD, mint2);

      expect(() => money.multiply(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('negate()', () => {
    it('returns positive amount as negative', () => {
      const money = new Money(400, CAD);

      expect(money.negate()).toEqualMoney(new Money(-400, CAD, mint));
    });

    it('returns negative amount as positive', () => {
      const money = new Money(-400, CAD);

      expect(money.negate()).toEqualMoney(new Money(400, CAD, mint));
    });
  });

  describe('formatter()', () => {
    it('returns formatter', () => {
      const money = new Money(400, CAD);
      const formatter = money.formatter('en-US');

      expect(formatter).toBeInstanceOf(Intl.NumberFormat);
    });

    it('returns formatter with default locale', () => {
      const mint = new Mint({ currencies, defaultLocale: 'fr-CA' });
      const money = new Money(400, CAD, mint);
      const formatter = money.formatter();

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          locale: 'fr-CA',
        })
      );
    });

    it('returns formatter with options', () => {
      const money = new Money(400, CAD);
      const formatter = money.formatter({ currencyDisplay: 'symbol' });

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          currencyDisplay: 'symbol',
        })
      );
    });

    it('returns formatter with locales and options', () => {
      const money = new Money(400, CAD);
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
      const money = new Money(411, CAD);
      const formattedMoney = money.format('en-US');

      expect(formattedMoney).toEqual('CA$4.11');
    });

    it('returns expected format with decimals', () => {
      const money = new Money(100000);

      expect(money.divide(23).format()).toEqual('$43.48');
    });

    it('returns formatter with default locale', () => {
      const mint = new Mint({ currencies, defaultLocale: 'fr-CA' });
      const money = new Money(400, CAD, mint);
      const formattedMoney = money.format();

      expect(formattedMoney).toEqual('4,00 $');
    });

    it('returns formatter with options', () => {
      const money = new Money(400, CAD);
      const formattedMoney = money.format({
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });

    it('returns formatter with locales and options', () => {
      const money = new Money(400, CAD);
      const formattedMoney = money.format('en-US', {
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });
  });

  describe('equals()', () => {
    it('returns true when money is same fractional and currency', () => {
      const money1 = new Money(400, CAD);
      const money2 = new Money(400, CAD);

      expect(money1.equals(money2)).toBeTruthy();
    });

    it('returns false when money is same fractional and different currency', () => {
      const money1 = new Money(400, CAD);
      const money2 = new Money(400, USD);

      expect(money1.equals(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and same currency', () => {
      const money1 = new Money(500, CAD);
      const money2 = new Money(400, CAD);

      expect(money1.equals(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and different currency', () => {
      const money1 = new Money(500, CAD);
      const money2 = new Money(400, USD);

      expect(money1.equals(money2)).toBeFalsy();
    });
  });

  describe('isZero()', () => {
    it('returns true when money is zero', () => {
      const money = new Money(0);

      expect(money.isZero()).toBeTruthy();
    });

    it('returns false when money is bigger than zero', () => {
      const money = new Money(5);

      expect(money.isZero()).toBeFalsy();
    });

    it('returns false when money is smaller than zero', () => {
      const money = new Money(-5);

      expect(money.isZero()).toBeFalsy();
    });
  });

  describe('gt()', () => {
    it('returns false when other money is same', () => {
      const money = new Money(0);
      const other = new Money(0);

      expect(money.gt(other)).toBeFalsy();
    });

    it('returns false when other money is bigger', () => {
      const money = new Money(0);
      const other = new Money(5);

      expect(money.gt(other)).toBeFalsy();
    });

    it('returns true when other money is smaller', () => {
      const money = new Money(5);
      const other = new Money(0);

      expect(money.gt(other)).toBeTruthy();
    });
  });

  describe('gte()', () => {
    it('returns true when other money is same', () => {
      const money = new Money(0);
      const other = new Money(0);

      expect(money.gte(other)).toBeTruthy();
    });

    it('returns false when other money is bigger', () => {
      const money = new Money(0);
      const other = new Money(5);

      expect(money.gte(other)).toBeFalsy();
    });

    it('returns true when other money is smaller', () => {
      const money = new Money(5);
      const other = new Money(0);

      expect(money.gte(other)).toBeTruthy();
    });
  });

  describe('lt()', () => {
    it('returns false when other money is same', () => {
      const money = new Money(0);
      const other = new Money(0);

      expect(money.lt(other)).toBeFalsy();
    });

    it('returns true when other money is bigger', () => {
      const money = new Money(0);
      const other = new Money(5);

      expect(money.lt(other)).toBeTruthy();
    });

    it('returns false when other money is smaller', () => {
      const money = new Money(5);
      const other = new Money(0);

      expect(money.lt(other)).toBeFalsy();
    });
  });

  describe('lte()', () => {
    it('returns true when other money is same', () => {
      const money = new Money(0);
      const other = new Money(0);

      expect(money.lte(other)).toBeTruthy();
    });

    it('returns true when other money is bigger', () => {
      const money = new Money(0);
      const other = new Money(5);

      expect(money.lte(other)).toBeTruthy();
    });

    it('returns false when other money is smaller', () => {
      const money = new Money(5);
      const other = new Money(0);

      expect(money.lte(other)).toBeFalsy();
    });
  });

  describe('compareTo()', () => {
    it('returns 0 when other money is same', () => {
      const money = new Money(0);
      const other = new Money(0);

      expect(money.compareTo(other)).toEqual(0);
    });

    it('returns 0 when other money is same for number', () => {
      const money = new Money(0);

      expect(money.compareTo(0)).toEqual(0);
    });

    it('returns -1 when other money is bigger', () => {
      const money = new Money(0);
      const other = new Money(5);

      expect(money.compareTo(other)).toEqual(-1);
    });

    it('returns -1 when other money is bigger for number', () => {
      const money = new Money(0);

      expect(money.compareTo(5)).toEqual(-1);
    });

    it('returns 1 when other money is smaller', () => {
      const money = new Money(5);
      const other = new Money(0);

      expect(money.compareTo(other)).toEqual(1);
    });

    it('returns 1 when other money is smaller for number', () => {
      const money = new Money(5);

      expect(money.compareTo(0)).toEqual(1);
    });
  });

  describe('toNumber()', () => {
    it('returns expected number', () => {
      const money = new Money(400, CAD);

      expect(money.toNumber()).toEqual(400);
    });
  });

  describe('toLocaleString()', () => {
    it('returns expected format', () => {
      const money = new Money(400, CAD);
      const formattedMoney = money.toLocaleString('en-US');

      expect(formattedMoney).toEqual('CA$4.00');
    });

    it('returns formatter with default locale', () => {
      const money = new Money(400, CAD);
      const formattedMoney = money.toLocaleString();

      expect(formattedMoney).toEqual('CA$4.00');
    });

    it('returns formatter with options', () => {
      const money = new Money(400, CAD);
      const formattedMoney = money.toLocaleString({
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });

    it('returns formatter with locales and options', () => {
      const money = new Money(400, CAD);
      const formattedMoney = money.toLocaleString('en-US', {
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });
  });

  describe('toString()', () => {
    it('returns expected value', () => {
      const money = new Money(400, USD);

      expect(money.toString()).toEqual('$4.00');
    });

    it('returns expected value with different default locale', () => {
      const mint2 = new Mint({ defaultLocale: 'en-CA' });
      const money = new Money(400, USD, mint2);

      expect(money.toString()).toEqual('US$4.00');
    });

    it('returns expected value without subunits', () => {
      const money = new Money(400, ISK);

      expect(money.toString()).toEqual('ISK 400');
    });
  });

  describe('toDecimal()', () => {
    it('returns expected value', () => {
      const money = new Money(400, USD);

      expect(money.toDecimal()).toEqual('4.00');
    });

    it('returns expected value with different default locale', () => {
      const mint2 = new Mint({ defaultLocale: 'en-CA' });
      const money = new Money(400, USD, mint2);

      expect(money.toDecimal()).toEqual('4.00');
    });

    it('returns expected value without subunits', () => {
      const money = new Money(400, ISK);

      expect(money.toDecimal()).toEqual('400');
    });
  });
});
