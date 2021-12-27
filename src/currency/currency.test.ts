import Currency from './currency';
import { UnknownCurrencyError } from './errors';

describe('Currency', () => {
  describe('static', () => {
    describe('all()', () => {
      it('returns every currency by iso code', () => {
        const currencies = Currency.all();

        expect(currencies.length).toEqual(170);
      });
    });

    describe('find()', () => {
      it('returns currency by iso code', () => {
        const currency = Currency.find('CAD');

        expect(currency).toBeDefined();
        expect(currency?.isoCode).toEqual('CAD');
      });

      it('returns null when iso code is not found', () => {
        const currency = Currency.find('foo' as any);

        expect(currency).toBeNull();
      });
    });

    describe('register()', () => {
      it('returns a new custom currency', () => {
        const newCurrency = {
          priority: 100,
          isoCode: 'BTC',
          name: 'Bitcoin',
          symbol: '$',
          disambiguateSymbol: 'BTC$',
          alternateSymbols: ['BTC$'],
          subunit: 'satoshi',
          subunitToUnit: 100,
          symbolFirst: true,
          htmlEntity: '$',
          decimalMark: '.',
          thousandsSeparator: ',',
          smallestDenomination: 1,
        };

        const currency = Currency.register(newCurrency);

        expect(currency.priority).toEqual(100);
        expect(currency.isoCode).toEqual('BTC');
        expect(currency.name).toEqual('Bitcoin');
        expect(currency.symbol).toEqual('$');
        expect(currency.disambiguateSymbol).toEqual('BTC$');
        expect(currency.alternateSymbols).toEqual(['BTC$']);
        expect(currency.subunit).toEqual('satoshi');
        expect(currency.subunitToUnit).toEqual(100);
        expect(currency.symbolFirst).toEqual(true);
        expect(currency.htmlEntity).toEqual('$');
        expect(currency.decimalMark).toEqual('.');
        expect(currency.thousandsSeparator).toEqual(',');
        expect(currency.isoNumeric).toBeUndefined();
        expect(currency.smallestDenomination).toEqual(1);
      });
    });

    describe('unregister()', () => {
      it('returns true when currency existed', () => {
        const currency = new Currency('CAD');
        const unregistered = Currency.unregister(currency);

        expect(unregistered).toBeTruthy();

        Currency.reset();
      });

      it('returns false when currency did not exist', () => {
        const currency = new Currency('CAD');
        Currency.unregister(currency);
        const unregistered = Currency.unregister(currency);

        expect(unregistered).toBeFalsy();

        Currency.reset();
      });
    });

    describe('wrap()', () => {
      it('returns currency from currency', () => {
        const currency = Currency.wrap(new Currency('CAD'));

        expect(currency).toBeInstanceOf(Currency);
      });

      it('returns currency from string', () => {
        const currency = Currency.wrap('CAD');

        expect(currency).toBeInstanceOf(Currency);
      });

      it('returns currency from currency data', () => {
        const currency = Currency.wrap({ isoCode: 'CAD' } as any);

        expect(currency).toBeInstanceOf(Currency);
      });

      it('throws unknown currency error from undefined', () => {
        expect(() => Currency.wrap(undefined as any)).toThrow(
          new UnknownCurrencyError("Unknown currency 'undefined'")
        );
      });

      it('throws unknown currency error from null', () => {
        expect(() => Currency.wrap(null as any)).toThrow(
          new UnknownCurrencyError("Unknown currency 'null'")
        );
      });
    });
  });

  describe('constructor()', () => {
    it('initializes with properties', () => {
      const currency = new Currency('CAD');

      expect(currency.priority).toEqual(5);
      expect(currency.isoCode).toEqual('CAD');
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

    it('uppercases the iso code', () => {
      const currency = new Currency('cad' as any);
      expect(currency.isoCode).toEqual('CAD');
    });

    it('throws unknown currency error when iso code is not found', () => {
      expect(() => new Currency('foo' as any)).toThrow(
        new UnknownCurrencyError("Unknown currency 'FOO'")
      );
    });

    it('#separator returns decimal mark', () => {
      const currency = new Currency('CAD');

      expect(currency.separator).toEqual(currency.decimalMark);
    });

    it('#delimiter returns thousands separator', () => {
      const currency = new Currency('CAD');

      expect(currency.delimiter).toEqual(currency.thousandsSeparator);
    });

    it('#code returns iso code', () => {
      const currency = new Currency('CAD');

      expect(currency.code).toEqual(currency.isoCode);
    });
  });

  describe('eq()', () => {
    it('returns true when iso codes are the same', () => {
      const currency1 = new Currency('CAD');
      const currency2 = new Currency('CAD');

      expect(currency1.eq(currency2)).toBeTruthy();
    });

    it('returns false when iso codes are different', () => {
      const currency1 = new Currency('CAD');
      const currency2 = new Currency('USD');

      expect(currency1.eq(currency2)).toBeFalsy();
    });
  });

  describe('toString()', () => {
    it('returns iso code', () => {
      const currency = new Currency('CAD');

      expect(currency.toString()).toEqual('CAD');
    });
  });
});
