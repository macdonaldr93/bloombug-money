import Currency from '../currency';
import Money from './money';

describe('Money', () => {
  describe('#currency', () => {
    it('returns expected currency from string', () => {
      const money = new Money(400, 'CAD');

      expect(money.currency).toEqual(new Currency('CAD'));
    });

    it('returns expected currency from currency', () => {
      const money = new Money(400, new Currency('CAD'));

      expect(money.currency).toEqual(new Currency('CAD'));
    });

    it('returns expected currency from currency data', () => {
      const money = new Money(400, { isoCode: 'CAD' } as any);

      expect(money.currency).toEqual(new Currency('CAD'));
    });

    it('returns expected default currency', () => {
      const money = new Money(400);

      expect(money.currency).toEqual(new Currency('USD'));
    });
  });

  describe('#fractional', () => {
    it('returns expected value', () => {
      const money = new Money(400, 'CAD');

      expect(money.fractional).toEqual(BigInt(400));
    });

    it('throws when value is infinite', () => {
      const infinite = 4 / 0;
      expect(() => new Money(infinite, 'CAD')).toThrowError(
        'fractional must be finite'
      );
    });

    it('#cents alias returns exepcted value', () => {
      const money = new Money(400, 'CAD');

      expect(money.cents).toEqual(BigInt(400));
    });
  });

  describe('#amount', () => {
    it('returns expected value', () => {
      const money = new Money(400, 'CAD');

      expect(money.amount).toEqual(BigInt(4));
    });

    it('#dollars alias returns exepcted value', () => {
      const money = new Money(400, 'CAD');

      expect(money.dollars).toEqual(BigInt(4));
    });
  });

  describe('add()', () => {
    it('returns expected fractional', () => {
      const money = new Money(400, 'CAD');
      const other = new Money(400, 'CAD');

      money.add(other);

      expect(money.eq(new Money(800, 'CAD'))).toBeTruthy();
    });

    it('throws when exchange rate is not found', () => {
      const money = new Money(400, 'CAD');
      const other = new Money(400, 'USD');

      expect(() => money.add(other)).toThrow(
        "No conversion rate known for 'CAD' -> 'USD'"
      );
    });
  });

  describe('sub()', () => {
    it('returns expected fractional', () => {
      const money = new Money(400, 'CAD');
      const other = new Money(100, 'CAD');

      money.sub(other);

      expect(money.eq(new Money(300, 'CAD'))).toBeTruthy();
    });

    it('throws when exchange rate is not found', () => {
      const money = new Money(400, 'CAD');
      const other = new Money(100, 'USD');

      expect(() => money.sub(other)).toThrow(
        "No conversion rate known for 'CAD' -> 'USD'"
      );
    });
  });

  describe('formatter()', () => {
    it('returns formatter', () => {
      const money = new Money(400, 'CAD');
      const formatter = money.formatter('en-US');

      expect(formatter).toBeInstanceOf(Intl.NumberFormat);
    });

    it('returns formatter with options', () => {
      const money = new Money(400, 'CAD');
      const formatter = money.formatter('en-US', { currencyDisplay: 'symbol' });

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          currencyDisplay: 'symbol',
        })
      );
    });
  });

  describe('format()', () => {
    it('returns expected format', () => {
      const money = new Money(400, 'CAD');
      const formattedMoney = money.format('en-US');

      expect(formattedMoney).toEqual('CA$4.00');
    });

    it('returns formatter with options', () => {
      const money = new Money(400, 'CAD');
      const formattedMoney = money.format('en-US', {
        currencyDisplay: 'narrowSymbol',
      });

      expect(formattedMoney).toEqual('$4.00');
    });
  });

  describe('eq()', () => {
    it('returns true when money is same fractional and currency', () => {
      const money1 = new Money(400, 'CAD');
      const money2 = new Money(400, 'CAD');

      expect(money1.eq(money2)).toBeTruthy();
    });

    it('returns false when money is same fractional and different currency', () => {
      const money1 = new Money(400, 'CAD');
      const money2 = new Money(400, 'USD');

      expect(money1.eq(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and same currency', () => {
      const money1 = new Money(500, 'CAD');
      const money2 = new Money(400, 'CAD');

      expect(money1.eq(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and different currency', () => {
      const money1 = new Money(500, 'CAD');
      const money2 = new Money(400, 'USD');

      expect(money1.eq(money2)).toBeFalsy();
    });
  });

  describe('toString()', () => {
    it('returns expected value', () => {
      const money = new Money(400, 'CAD');

      expect(money.toString()).toEqual('$4.00');
    });
  });
});
