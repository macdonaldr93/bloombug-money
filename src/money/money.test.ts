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

  describe('isEqual()', () => {
    it('returns true when money is same fractional and currency', () => {
      const money1 = new Money(400, 'CAD');
      const money2 = new Money(400, 'CAD');

      expect(money1.isEqual(money2)).toBeTruthy();
    });

    it('returns false when money is same fractional and different currency', () => {
      const money1 = new Money(400, 'CAD');
      const money2 = new Money(400, 'USD');

      expect(money1.isEqual(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and same currency', () => {
      const money1 = new Money(500, 'CAD');
      const money2 = new Money(400, 'CAD');

      expect(money1.isEqual(money2)).toBeFalsy();
    });

    it('returns false when money is different fractional and different currency', () => {
      const money1 = new Money(500, 'CAD');
      const money2 = new Money(400, 'USD');

      expect(money1.isEqual(money2)).toBeFalsy();
    });
  });
});
