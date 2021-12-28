import currencies from '../iso-currencies.json';
import { CAD, USD } from '../currencies';
import Money from '../money';
import addMoney from './addMoney';
import Mint from '../mint';

describe('addMoney', () => {
  const mint = new Mint({ currencies });

  it('returns expected fractional', () => {
    const money = new Money(mint, 400, CAD);
    const other = new Money(mint, 400, CAD);

    expect(addMoney(money, other)).toEqualMoney(new Money(mint, 800, CAD));
  });

  it('throws when exchange rate is not found', () => {
    const money = new Money(mint, 400, CAD);
    const other = new Money(mint, 400, USD);

    expect(() => addMoney(money, other)).toThrow(
      "No conversion rate known for 'CAD' -> 'USD'"
    );
  });
});
