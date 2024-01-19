import { CAD, USD, Mint, currencies, ISK } from '.';

describe('@bloombug/money', () => {
  it('handles example use case', () => {
    const { Money, exchange } = new Mint({
      currencies,
      defaultCurrency: USD,
      defaultLocale: 'en-US',
    });

    exchange.addRate(USD, CAD, 1.3475);
    exchange.addRate(CAD, USD, 0.7421);
    exchange.addRate(USD, ISK, 136.92);
    exchange.addRate(ISK, USD, 0.0073);

    const wallet = Money();
    expect(wallet.toString()).toEqual('$0.00');

    const payment1 = Money(1000);
    expect(payment1.toString()).toEqual('$10.00');

    wallet.add(payment1);
    expect(wallet.toString()).toEqual('$10.00');

    const payment2 = Money(2000, CAD);
    expect(payment2.toString()).toEqual('CA$20.00');
    expect(exchange.exchangeWith(payment2, USD).toString()).toEqual('$14.84');

    wallet.add(payment2);
    expect(wallet.toString()).toEqual('$24.84');

    const spending = Money(1000, ISK);
    expect(spending.toString()).toEqual('ISK 1,000');
    expect(exchange.exchangeWith(spending, USD).toString()).toEqual('$7.30');

    wallet.subtract(spending);
    expect(wallet.toString()).toEqual('$17.54');
  });
});
