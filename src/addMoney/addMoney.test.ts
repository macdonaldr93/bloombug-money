import isoCurrencies from '../iso-currencies.json';
import { CAD, USD } from '../currencies';
import Currency from '../currency';
import Money from '../money';
import addMoney from './addMoney';

describe('addMoney', () => {
  beforeAll(() => {
    Currency.load(isoCurrencies);
  });

  it('returns expected fractional', () => {
    const money = new Money(400, CAD);
    const other = new Money(400, CAD);

    expect(addMoney(money, other)).toEqualMoney(new Money(800, CAD));
  });

  it('throws when exchange rate is not found', () => {
    const money = new Money(400, CAD);
    const other = new Money(400, USD);

    expect(() => addMoney(money, other)).toThrow(
      "No conversion rate known for 'CAD' -> 'USD'"
    );
  });
});
