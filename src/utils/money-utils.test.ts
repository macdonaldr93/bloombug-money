import { CAD, USD } from '../currencies';
import { Mint } from '../mint';
import { isMoney } from './money-utils';

describe('utils/money-utils', () => {
  const currencies = { CAD, USD };
  const { Money } = new Mint({ currencies, defaultCurrency: USD });

  describe('isMoney()', () => {
    it('return true when object is money', () => {
      expect(isMoney(Money())).toBeTruthy();
    });

    it('return false when object is string', () => {
      expect(isMoney('foo')).toBeFalsy();
    });

    it('return false when object is number', () => {
      expect(isMoney(4500)).toBeFalsy();
    });

    it('return false when object is array', () => {
      expect(isMoney([])).toBeFalsy();
    });

    it('return false when object is object', () => {
      expect(isMoney({})).toBeFalsy();
    });

    it('return false when object is function', () => {
      expect(isMoney(() => {})).toBeFalsy();
    });

    it('return false when object is boolean', () => {
      expect(isMoney(true)).toBeFalsy();
    });
  });
});
