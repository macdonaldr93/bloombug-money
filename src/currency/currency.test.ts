import currencies from '../iso-currencies.json';
import { CAD, USD } from '../currencies';
import Currency from './currency';
import { UnknownCurrencyError } from './errors';
import Mint from '../mint';

describe('Currency', () => {
  const mint = new Mint({ currencies });

  describe('constructor()', () => {
    it('initializes with currency data', () => {
      const currency = new Currency(mint, CAD);

      expect(currency.priority).toEqual(5);
      expect(currency.isoCode).toEqual(CAD);
      expect(currency.name).toEqual('Canadian Dollar');
      expect(currency.symbol).toEqual('$');
      expect(currency.disambiguateSymbol).toEqual('C$');
      expect(currency.alternateSymbols).toEqual(['C$', 'CAD$']);
      expect(currency.subunit).toEqual('Cent');
      expect(currency.subunitToUnit).toEqual(100);
      expect(currency.symbolFirst).toEqual(true);
      expect(currency.htmlEntity).toEqual('$');
      expect(currency.decimalMark).toEqual('.');
      expect(currency.thousandsSeparator).toEqual(',');
      expect(currency.isoNumeric).toEqual('124');
      expect(currency.smallestDenomination).toEqual(5);
    });

    it('throws unknown currency error when iso code is not found', () => {
      expect(() => new Currency(mint, 'foo' as any)).toThrow(
        new UnknownCurrencyError("Unknown currency 'foo'")
      );
    });

    it('throws when the currency store is empty', () => {
      const emptyMint = new Mint();

      expect(() => new Currency(emptyMint, CAD)).toThrowError();
    });

    it('#separator returns decimalMark mark', () => {
      const currency = new Currency(mint, CAD);

      expect(currency.separator).toEqual(currency.decimalMark);
    });

    it('#delimiter returns thousands separator', () => {
      const currency = new Currency(mint, CAD);

      expect(currency.delimiter).toEqual(currency.thousandsSeparator);
    });

    it('#code returns iso code', () => {
      const currency = new Currency(mint, CAD);

      expect(currency.code).toEqual(currency.isoCode);
    });
  });

  describe('equals()', () => {
    it('returns true when iso codes are the same', () => {
      const currency1 = new Currency(mint, CAD);
      const currency2 = new Currency(mint, CAD);

      expect(currency1.equals(currency2)).toBeTruthy();
    });

    it('returns false when iso codes are different', () => {
      const currency1 = new Currency(mint, CAD);
      const currency2 = new Currency(mint, USD);

      expect(currency1.equals(currency2)).toBeFalsy();
    });
  });

  describe('toLocaleString()', () => {
    it('returns name', () => {
      const currency = new Currency(mint, CAD);

      expect(currency.toLocaleString()).toEqual('Canadian Dollar');
    });
  });

  describe('toString()', () => {
    it('returns iso code', () => {
      const currency = new Currency(mint, CAD);

      expect(currency.toString()).toEqual(CAD);
    });
  });
});
