import isoCurrencies from '../iso-currencies.json';
import { CAD, USD } from '../currencies';
import Currency from '../currency';
import isCurrencyEqual from './isCurrencyEqual';

describe('isCurrencyEqual', () => {
  beforeAll(() => {
    Currency.load(isoCurrencies);
  });

  it('returns true when iso codes are the same', () => {
    const currency1 = new Currency(CAD);
    const currency2 = new Currency(CAD);

    expect(isCurrencyEqual(currency1, currency2)).toBeTruthy();
  });

  it('returns false when iso codes are different', () => {
    const currency1 = new Currency(CAD);
    const currency2 = new Currency(USD);

    expect(isCurrencyEqual(currency1, currency2)).toBeFalsy();
  });
});
