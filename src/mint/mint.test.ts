import { CAD, USD } from '../currencies';
import { InMemoryExchangeStore } from '../exchange';
import { Mint } from './mint';

describe('Mint', () => {
  const currencies = { CAD, USD };

  it('returns expected default currency', () => {
    const mint = new Mint({
      defaultCurrency: CAD,
      currencies,
    });

    expect(mint.defaultCurrency).toStrictEqual(CAD);
  });

  it('returns expected default currency for money', () => {
    const { Money } = new Mint({
      defaultCurrency: CAD,
      currencies,
    });
    const money = Money();

    expect(money.currency).toStrictEqual(CAD);
  });

  it('returns expected default locale', () => {
    const mint = new Mint({ defaultLocale: 'fr-FR' });

    expect(mint.defaultLocale).toEqual('fr-FR');
  });

  it('returns expected currencies', () => {
    const mint = new Mint({ currencies });

    expect(mint.currencies).toStrictEqual(currencies);
  });

  it('returns expected exchange store', () => {
    const store = new InMemoryExchangeStore();
    const mint = new Mint({ exchange: { store } });

    expect(mint.exchange.store).toEqual(store);
  });

  it('throws when default currency is not defined in currencies', () => {
    expect(() => new Mint({ defaultCurrency: CAD })).toThrow(
      "Unknown currency 'CAD'"
    );
  });
});
