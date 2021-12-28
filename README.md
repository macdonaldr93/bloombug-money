# @bloombug/money

The most comprehensive, yet simple and consistent toolset for manipulating JavaScript money and currency in a browser & Node.js.

## Getting started

```js
import { Mint } from '@bloombug/money';

const { Money } = new Mint();
const money = Money();
//=> Money {fractional: 0, currency: 'USD'}
```

## Classes

### Currency

```js
import { Mint } from '@bloombug/money';

const { Currency } = new Mint();
const currency = Currency('USD');
//=> 'USD'
```

### Money

```js
import { Mint } from '@bloombug/money';

const { Money } = new Mint();
const money = Money(100, 'USD');
//=> Money {fractional: 100, currency: 'USD'}

money.add(Money(100, 'USD'));
//=> Money {fractional: 200, currency: 'USD'}

money.subtract(Money(100, 'USD'));
//=> Money {fractional: 100, currency: 'USD'}

money.toString();
//=> $1.00

money.format('fr-FR', { currencyDisplay: 'narrowSymbol' });
//=> 100,00 $

money.equals(Money(400, 'USD'));
//=> false

money.equals(Money(100, 'USD'));
//=> true
```

### Exchange

```js
import { Mint, Exchange } from '@bloombug/money';
import { CAD, USD } from '@bloombug/money/currencies';
import currencies from '@bloombug/money/iso-currencies.json';

const { Currency, Money, exchange } = new Mint({
  currencies,
  exchange: new Exchange(),
});

exchange.addRate(USD, CAD, 0.745);

const money = new Money(100, USD);
//=> Money {fractional: 100, currency: USD}

exchange.exchangeWith(money, CAD);
//=> Money {fractional: 74, currency: CAD}
```

## Why another money library?

**@bloombug/money** makes money and currency feel like primitive types. As developers, we use money and currency all the time and yet they are poorly supported types and have difficult interfaces to work with. Money types range from integers to floats to strings without any standardization. **@bloombug/money** makes it easy to operate on these values and exchange between currencies.
