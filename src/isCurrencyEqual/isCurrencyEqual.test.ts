import currencies from '../iso-currencies.json';
import { CAD, USD } from '../currencies';
import Currency from '../currency';
import isCurrencyEqual from './isCurrencyEqual';
import Mint from '../mint';

describe('isCurrencyEqual', () => {
  const mint = new Mint({ currencies });

  it('returns true when iso codes are the same', () => {
    const currency1 = new Currency(mint, CAD);
    const currency2 = new Currency(mint, CAD);

    expect(isCurrencyEqual(currency1, currency2)).toBeTruthy();
  });

  it('returns false when iso codes are different', () => {
    const currency1 = new Currency(mint, CAD);
    const currency2 = new Currency(mint, USD);

    expect(isCurrencyEqual(currency1, currency2)).toBeFalsy();
  });
});
