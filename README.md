# ts-money

**ts-money** provides the most comprehensive, yet simple and consistent toolset for manipulating JavaScript money and currency in a browser & Node.js.

## Getting started

```js
import { parseMoney } from 'ts-money';

const money = parseMoney('1,000.24', 'USD');
//=> Money {fractional: 100024, currency: 'USD'}

money.format('en-US');
//=> $4.00
```

## Classes

### Money

```js
import { Money } from 'ts-money';

const money = new Money(100, 'USD');
//=> Money {fractional: 100, currency: 'USD'}

money.add(new Money(100, 'USD'));
//=> Money {fractional: 200, currency: 'USD'}

money.sub(new Money(100, 'USD'));
//=> Money {fractional: 100, currency: 'USD'}

money.toString();
//=> $1.00

const moneyCad = new Money(10000, 'CAD');
//=> Money {fractional: 10000, currency: 'CAD'}

moneyCad.format('fr-FR', { currencyDisplay: 'narrowSymbol' });
//=> 100,00 $

money.isEqual(moneyCad);
//=> false

money.isEqual(new Money(100, 'USD'));
//=> true
```

### Currency

```js
import { Currency } from 'ts-money';

const currency = new Currency('USD');
//=> 'USD'
```

## Why another money library?

**ts-money** makes money and currency feel like primitive types. As developers, we use money and currency all the time and yet they are poorly supported types and have difficult interfaces to work with. Money types range from integers to floats to strings without any standardization. **ts-money** makes it easy to operate on these values and exchange between currencies.
