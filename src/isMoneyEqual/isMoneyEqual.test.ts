import Money from '../money';
import isMoneyEqual from './isMoneyEqual';

describe('isMoneyEqual', () => {
  it('returns true when money is same fractional and currency', () => {
    const money1 = new Money(400, 'CAD');
    const money2 = new Money(400, 'CAD');

    expect(isMoneyEqual(money1, money2)).toBeTruthy();
  });

  it('returns false when money is same fractional and different currency', () => {
    const money1 = new Money(400, 'CAD');
    const money2 = new Money(400, 'USD');

    expect(isMoneyEqual(money1, money2)).toBeFalsy();
  });

  it('returns false when money is different fractional and same currency', () => {
    const money1 = new Money(500, 'CAD');
    const money2 = new Money(400, 'CAD');

    expect(isMoneyEqual(money1, money2)).toBeFalsy();
  });

  it('returns false when money is different fractional and different currency', () => {
    const money1 = new Money(500, 'CAD');
    const money2 = new Money(400, 'USD');

    expect(isMoneyEqual(money1, money2)).toBeFalsy();
  });
});
