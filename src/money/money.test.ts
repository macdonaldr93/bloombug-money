import { CAD, EUR, GBP, ISK, USD } from '../currencies';
import { Mint } from '../mint';

describe('Money', () => {
  const currencies = { CAD, EUR, GBP, ISK, USD };
  const mint = new Mint({ currencies, defaultLocale: 'en-US' });
  const { Money } = mint;

  describe('#currency', () => {
    it('returns expected currency from string', () => {
      const money = Money(400, CAD);

      expect(money.currency).toStrictEqual(CAD);
    });

    it('returns expected default currency', () => {
      const money = Money(400);

      expect(money.currency).toStrictEqual(USD);
    });
  });

  describe('#fractional', () => {
    it('returns expected value', () => {
      const money = Money(400, CAD);

      expect(money.toJSON()).toStrictEqual({
        currency: 'CAD',
        fractional: 400,
      });
    });

    it('returns expected value from decimal', () => {
      const money = Money('400.000', CAD);

      expect(money.toJSON()).toStrictEqual({
        currency: 'CAD',
        fractional: 40000,
      });
    });
  });

  describe('add()', () => {
    it('adds money', () => {
      const money = Money(400, CAD);
      const other = Money(400, CAD);

      expect(money.add(other)).toEqualMoney(Money(800, CAD));
    });

    it('adds money from a different currency', () => {
      const mint2 = new Mint({ currencies });
      mint2.exchange.addRate(USD, CAD, 1.26);

      const money = mint2.Money(400, CAD);
      const other = mint2.Money(400, USD);

      money.add(other);

      expect(money).toEqualMoney(mint2.Money(904, CAD));
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies });
      const money = mint2.Money(400, CAD);
      const other = mint2.Money(400, USD);

      expect(() => money.add(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('subtract()', () => {
    it('subtracts money', () => {
      const money = Money(400, CAD);
      const other = Money(100, CAD);

      expect(money.subtract(other)).toEqualMoney(Money(300, CAD));
    });

    it('subtracts money from a different currency', () => {
      const mint2 = new Mint({ currencies });
      mint2.exchange.addRate(USD, CAD, 1.26);

      const money = mint2.Money(400, CAD);
      const other = mint2.Money(100, USD);

      expect(money.subtract(other)).toEqualMoney(mint2.Money(274, CAD));
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies });
      const money = mint2.Money(400, CAD);
      const other = mint2.Money(100, USD);

      expect(() => money.subtract(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('divide()', () => {
    it('divides two monies', () => {
      const money = Money(400, CAD);
      const other = Money(2, CAD);

      expect(money.divide(other)).toEqualMoney(Money(200, CAD));
    });

    it('divides two monies with rounding', () => {
      const money = Money(234523, CAD);
      const other = Money(21234, CAD);

      expect(money.divide(other)).toEqualMoney(Money(11, CAD));
    });

    it('divides by number', () => {
      const money = Money(400, CAD);

      expect(money.divide(2)).toEqualMoney(Money(200, CAD));
    });

    it('divides by money from a different currency', () => {
      const mint2 = new Mint({ currencies });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = mint2.Money(400, CAD);
      const other = mint2.Money(4, USD);

      expect(money.divide(other)).toEqualMoney(mint2.Money(79, CAD));
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies });
      const money = mint2.Money(400, CAD);
      const other = mint2.Money(2, USD);

      expect(() => money.divide(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('multiply()', () => {
    it('multiples money', () => {
      const money = Money(400, CAD);
      const other = Money(2, CAD);

      expect(money.multiply(other)).toEqualMoney(Money(800, CAD));
    });

    it('multiplies by a number', () => {
      const money = Money(400, CAD);

      expect(money.multiply(2)).toEqualMoney(Money(800, CAD));
    });

    it('multiples by money from a different currency', () => {
      const mint2 = new Mint({ currencies });
      mint2.exchange?.addRate(USD, CAD, 1.26);

      const money = mint2.Money(400, CAD);
      const other = mint2.Money(4, USD);

      expect(money.multiply(other)).toEqualMoney(mint2.Money(2016, CAD));
    });

    it('throws when exchange rate is not found', () => {
      const mint2 = new Mint({ currencies });
      const money = mint2.Money(400, CAD);
      const other = mint2.Money(2, USD);

      expect(() => money.multiply(other)).toThrow(
        "No conversion rate known for 'USD' -> 'CAD'"
      );
    });
  });

  describe('negate()', () => {
    it('returns positive amount as negative', () => {
      const money = Money(400, CAD);

      expect(money.negate()).toEqualMoney(Money(-400, CAD));
    });

    it('returns negative amount as positive', () => {
      const money = Money(-400, CAD);

      expect(money.negate()).toEqualMoney(Money(400, CAD));
    });
  });

  describe('formatter()', () => {
    it('returns formatter', () => {
      const money = Money(400, CAD);
      const formatter = money.formatter('en-US');

      expect(formatter).toBeInstanceOf(Intl.NumberFormat);
    });

    it('returns formatter with default locale', () => {
      const { Money } = new Mint({ currencies, defaultLocale: 'fr-CA' });
      const money = Money(400, CAD);
      const formatter = money.formatter();

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          locale: 'fr-CA',
        })
      );
    });

    it('returns formatter with options', () => {
      const money = Money(400, CAD);
      const formatter = money.formatter({ currencyDisplay: 'symbol' });

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          currencyDisplay: 'symbol',
        })
      );
    });

    it('returns formatter with locales and options', () => {
      const money = Money(400, CAD);
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
      const money = Money(411, CAD);
      const formattedMoney = money.format('en-US');

      expect(formattedMoney).toEqual('CA$4.11');
    });

    it('returns expected format with decimals', () => {
      const money = Money(100000);

      expect(money.divide(23).format()).toEqual('$43.48');
    });

    it('returns formatter with default locale', () => {
      const mint = new Mint({ currencies, defaultLocale: 'fr-CA' });
      const money = mint.Money(400, CAD);
      const formattedMoney = money.format();

      expect(formattedMoney).toEqual('4,00 $');
    });

    it('returns formatter with options', () => {
      const money = Money(400, CAD);
      const formattedMoney = money.format({
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });

    it('returns formatter with locales and options', () => {
      const money = Money(400, CAD);
      const formattedMoney = money.format('en-US', {
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });
  });

  describe('equals()', () => {
    it('returns true when money is same fractional and currency', () => {
      const money1 = Money(400, CAD);
      const money2 = Money(400, CAD);

      expect(money1.equals(money2)).toBeTruthy();
    });

    it('returns false when money is same fractional and different currency', () => {
      const money1 = Money(400, CAD);
      const money2 = Money(400, USD);

      expect(money1.equals(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and same currency', () => {
      const money1 = Money(500, CAD);
      const money2 = Money(400, CAD);

      expect(money1.equals(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and different currency', () => {
      const money1 = Money(500, CAD);
      const money2 = Money(400, USD);

      expect(money1.equals(money2)).toBeFalsy();
    });
  });

  describe('isZero()', () => {
    it('returns true when money is zero', () => {
      const money = Money(0);

      expect(money.isZero()).toBeTruthy();
    });

    it('returns false when money is bigger than zero', () => {
      const money = Money(5);

      expect(money.isZero()).toBeFalsy();
    });

    it('returns false when money is smaller than zero', () => {
      const money = Money(-5);

      expect(money.isZero()).toBeFalsy();
    });
  });

  describe('gt()', () => {
    it('returns false when other money is same', () => {
      const money = Money(0);
      const other = Money(0);

      expect(money.gt(other)).toBeFalsy();
    });

    it('returns false when other money is bigger', () => {
      const money = Money(0);
      const other = Money(5);

      expect(money.gt(other)).toBeFalsy();
    });

    it('returns true when other money is smaller', () => {
      const money = Money(5);
      const other = Money(0);

      expect(money.gt(other)).toBeTruthy();
    });
  });

  describe('gte()', () => {
    it('returns true when other money is same', () => {
      const money = Money(0);
      const other = Money(0);

      expect(money.gte(other)).toBeTruthy();
    });

    it('returns false when other money is bigger', () => {
      const money = Money(0);
      const other = Money(5);

      expect(money.gte(other)).toBeFalsy();
    });

    it('returns true when other money is smaller', () => {
      const money = Money(5);
      const other = Money(0);

      expect(money.gte(other)).toBeTruthy();
    });
  });

  describe('lt()', () => {
    it('returns false when other money is same', () => {
      const money = Money(0);
      const other = Money(0);

      expect(money.lt(other)).toBeFalsy();
    });

    it('returns true when other money is bigger', () => {
      const money = Money(0);
      const other = Money(5);

      expect(money.lt(other)).toBeTruthy();
    });

    it('returns false when other money is smaller', () => {
      const money = Money(5);
      const other = Money(0);

      expect(money.lt(other)).toBeFalsy();
    });
  });

  describe('lte()', () => {
    it('returns true when other money is same', () => {
      const money = Money(0);
      const other = Money(0);

      expect(money.lte(other)).toBeTruthy();
    });

    it('returns true when other money is bigger', () => {
      const money = Money(0);
      const other = Money(5);

      expect(money.lte(other)).toBeTruthy();
    });

    it('returns false when other money is smaller', () => {
      const money = Money(5);
      const other = Money(0);

      expect(money.lte(other)).toBeFalsy();
    });
  });

  describe('compareTo()', () => {
    it('returns 0 when other money is same', () => {
      const money = Money(0);
      const other = Money(0);

      expect(money.compareTo(other)).toEqual(0);
    });

    it('returns -1 when other money is bigger', () => {
      const money = Money(0);
      const other = Money(5);

      expect(money.compareTo(other)).toEqual(-1);
    });

    it('returns 1 when other money is smaller', () => {
      const money = Money(5);
      const other = Money(0);

      expect(money.compareTo(other)).toEqual(1);
    });
  });

  describe('toString()', () => {
    it('returns expected value', () => {
      const money = Money(400, USD);

      expect(money.toString()).toEqual('$4.00');
    });

    it('returns expected value with different default locale', () => {
      const mint2 = new Mint({ defaultLocale: 'en-CA' });
      const money = mint2.Money(400, USD);

      expect(money.toString()).toEqual('US$4.00');
    });

    it('returns expected value without subunits', () => {
      const money = Money(400, ISK);

      expect(money.toString()).toEqual('ISK 400');
    });
  });

  describe('toBigInt()', () => {
    it('returns expected bigint', () => {
      const money = Money(400, CAD);

      expect(money.toBigInt()).toEqual(BigInt(400));
    });
  });

  describe('toDecimal()', () => {
    it('returns expected value', () => {
      const money = Money('4.998', USD);

      expect(money.toDecimal()).toEqual('4.998');
    });

    it('returns expected value with different default locale', () => {
      const mint2 = new Mint({ defaultLocale: 'en-CA' });
      const money = mint2.Money(400, USD);

      expect(money.toDecimal()).toEqual('4');
    });

    it('returns expected value for ISK', () => {
      const money = Money(421, ISK);

      expect(money.toDecimal()).toEqual('421');
    });

    it('returns expected value for EUR', () => {
      const money = Money('400.10', EUR);

      expect(money.toDecimal()).toEqual('400.1');
    });

    it('returns expected value for GBP', () => {
      const money = Money(400, GBP);

      expect(money.toDecimal()).toEqual('4');
    });
  });

  describe('toFractional()', () => {
    it('returns expected fractional', () => {
      const money = Money(400, CAD);

      expect(money.toFractional()).toEqual(400);
    });
  });

  describe('toNumber()', () => {
    it('returns expected number', () => {
      const money = Money(432, CAD);

      expect(money.toNumber()).toEqual(4.32);
    });
  });

  describe('toJSON()', () => {
    it('returns expected JSON', () => {
      const money = Money(400, CAD);

      expect(money.toJSON()).toStrictEqual({
        fractional: 400,
        currency: 'CAD',
      });
    });
  });

  describe('toLocaleString()', () => {
    it('returns expected format', () => {
      const money = Money(400, CAD);
      const formattedMoney = money.toLocaleString('en-US');

      expect(formattedMoney).toEqual('CA$4.00');
    });

    it('returns formatter with default locale', () => {
      const money = Money(400, CAD);
      const formattedMoney = money.toLocaleString();

      expect(formattedMoney).toEqual('CA$4.00');
    });

    it('returns formatter with options', () => {
      const money = Money(400, CAD);
      const formattedMoney = money.toLocaleString({
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });

    it('returns formatter with locales and options', () => {
      const money = Money(400, CAD);
      const formattedMoney = money.toLocaleString('en-US', {
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });
  });
});
