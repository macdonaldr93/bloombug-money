import currencies from '../iso-currencies.json';
import { CAD, USD } from '../currencies';
import Money from '../money';
import isMoneyEqual from './isMoneyEqual';
import Mint from '../mint';

describe('isMoneyEqual', () => {
  const mint = new Mint({ currencies });

  it('returns true when money is same fractional and currency', () => {
    const money1 = new Money(mint, 400, CAD);
    const money2 = new Money(mint, 400, CAD);

    expect(isMoneyEqual(money1, money2)).toBeTruthy();
  });

  it('returns false when money is same fractional and different currency', () => {
    const money1 = new Money(mint, 400, CAD);
    const money2 = new Money(mint, 400, USD);

    expect(isMoneyEqual(money1, money2)).toBeFalsy();
  });

  it('returns false when money is different fractional and same currency', () => {
    const money1 = new Money(mint, 500, CAD);
    const money2 = new Money(mint, 400, CAD);

    expect(isMoneyEqual(money1, money2)).toBeFalsy();
  });

  it('returns false when money is different fractional and different currency', () => {
    const money1 = new Money(mint, 500, CAD);
    const money2 = new Money(mint, 400, USD);

    expect(isMoneyEqual(money1, money2)).toBeFalsy();
  });
});
