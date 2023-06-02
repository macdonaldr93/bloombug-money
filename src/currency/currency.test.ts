import currencies from '../test/iso-currencies.json';
import { CAD, USD } from '../currencies';
import { Currency } from '..';
import { UnknownCurrencyError } from './errors';
import Mint from '../mint';

describe('Currency', () => {
  beforeAll(() => {
    Mint.init({ currencies });
  });

  afterAll(() => {
    Mint.clear();
  });

  it('initializes with currency data', () => {
    const currency = new Currency(CAD);

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
    expect(() => new Currency('foo' as any)).toThrow(
      new UnknownCurrencyError('foo')
    );
  });

  it('throws when the currency store is empty', () => {
    const emptyMint = new Mint();

    expect(() => new Currency(CAD, emptyMint)).toThrowError();
  });

  it('#separator returns decimalMark mark', () => {
    const currency = new Currency(CAD);

    expect(currency.separator).toEqual(currency.decimalMark);
  });

  it('#delimiter returns thousands separator', () => {
    const currency = new Currency(CAD);

    expect(currency.delimiter).toEqual(currency.thousandsSeparator);
  });

  it('#code returns iso code', () => {
    const currency = new Currency(CAD);

    expect(currency.code).toEqual(currency.isoCode);
  });

  describe('equals()', () => {
    it('returns true when iso codes are the same', () => {
      const currency1 = new Currency(CAD);
      const currency2 = new Currency(CAD);

      expect(currency1.equals(currency2)).toBeTruthy();
    });

    it('returns false when iso codes are different', () => {
      const currency1 = new Currency(CAD);
      const currency2 = new Currency(USD);

      expect(currency1.equals(currency2)).toBeFalsy();
    });
  });

  describe('toLocaleString()', () => {
    it('returns name', () => {
      const currency = new Currency(CAD);

      expect(currency.toLocaleString()).toEqual('Canadian Dollar');
    });

    it('returns iso code when name is undefined', () => {
      const mint = new Mint({
        currencies: {
          USD: {
            priority: 1,
            isoCode: 'USD',
            symbol: '$',
            disambiguateSymbol: 'US$',
            alternateSymbols: ['US$'],
            subunit: 'Cent',
            subunitToUnit: 100,
            symbolFirst: true,
            htmlEntity: '$',
            decimalMark: '.',
            thousandsSeparator: ',',
            isoNumeric: '840',
            smallestDenomination: 1,
          },
        },
      });
      const currency = new Currency(USD, mint);

      expect(currency.toLocaleString()).toEqual('USD');
    });
  });

  describe('toString()', () => {
    it('returns iso code', () => {
      const currency = new Currency(CAD);

      expect(currency.toString()).toEqual(CAD);
    });
  });
});
