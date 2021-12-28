import currencies from '../iso-currencies.json';
import { CAD, USD } from '../currencies';
import Mint from '../mint';
import Money from '../money';
import subtractMoney from './subtractMoney';

describe('subtractMoney', () => {
  const mint = new Mint({ currencies });

  it('returns expected fractional', () => {
    const money = new Money(mint, 400, CAD);
    const other = new Money(mint, 100, CAD);

    expect(subtractMoney(money, other)).toEqualMoney(new Money(mint, 300, CAD));
  });

  it('throws when exchange rate is not found', () => {
    const money = new Money(mint, 400, CAD);
    const other = new Money(mint, 100, USD);

    expect(() => subtractMoney(money, other)).toThrow(
      "No conversion rate known for 'CAD' -> 'USD'"
    );
  });
});
