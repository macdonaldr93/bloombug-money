import isoCurrencies from '../iso-currencies.json';
import { CAD, USD } from '../currencies';
import Currency from '../currency';
import Money from '../money';
import subMoney from './subMoney';

describe('subMoney', () => {
  beforeAll(() => {
    Currency.load(isoCurrencies);
  });

  it('returns expected fractional', () => {
    const money = new Money(400, CAD);
    const other = new Money(100, CAD);

    expect(subMoney(money, other)).toEqualMoney(new Money(300, CAD));
  });

  it('throws when exchange rate is not found', () => {
    const money = new Money(400, CAD);
    const other = new Money(100, USD);

    expect(() => subMoney(money, other)).toThrow(
      "No conversion rate known for 'CAD' -> 'USD'"
    );
  });
});
