import Currency from '../currency';
import parseMoney from './parseMoney';

describe('parseMoney', () => {
  it('returns money from string based on currency', () => {
    const money = parseMoney('1,004.99', 'USD');

    expect(money.fractional).toEqual(BigInt(100499));
    expect(money.currency).toEqual(new Currency('USD'));
  });

  it('returns money from number based on currency', () => {
    const money = parseMoney(4.99, 'USD');

    expect(money.fractional).toEqual(BigInt(499));
    expect(money.currency).toEqual(new Currency('USD'));
  });

  it('returns money in default currency', () => {
    const money = parseMoney('1,004.99');

    expect(money.fractional).toEqual(BigInt(100499));
    expect(money.currency).toEqual(new Currency('USD'));
  });
});
