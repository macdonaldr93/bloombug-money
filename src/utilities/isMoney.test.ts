import currencies from '../test/iso-currencies.json';
import Mint from '../mint';
import Money from '../money';
import isMoney from './isMoney';

describe('utilities', () => {
  const mint = new Mint({ currencies });

  beforeAll(() => {
    Mint.setDefault(mint);
  });

  afterAll(() => {
    Mint.resetDefault();
  });

  describe('isMoney()', () => {
    it('return true when object is money', () => {
      expect(isMoney(new Money(0))).toBeTruthy();
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
