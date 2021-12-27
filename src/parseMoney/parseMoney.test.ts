import { USD } from '../currencies';
import Money from '../money';
import parseMoney from './parseMoney';

describe('parseMoney', () => {
  it('returns money from string based on currency', () => {
    const money = parseMoney('1,004.99', USD);

    expect(money).toEqualMoney(new Money(100499, USD));
  });

  it('returns money from number based on currency', () => {
    const money = parseMoney(4.99, USD);

    expect(money).toEqualMoney(new Money(499, USD));
  });

  it('returns money in default currency', () => {
    const money = parseMoney('1,004.99');

    expect(money).toEqualMoney(new Money(100499, USD));
  });
});
