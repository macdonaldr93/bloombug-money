# mint-fns

**mint-fns** provides the most comprehensive, yet simple and consistent toolset for manipulating JavaScript money and currency in a browser & Node.js.

## Getting started

```js
import { parseMoney } from 'mint-fns';

const money = parseMoney('1,000.24', 'USD');
//=> Money {fractional: 100024, currency: 'USD'}

money.format('en-US');
//=> $4.00
```

## Classes

### Currency

```js
import { Currency } from 'mint-fns';

const currency = new Currency('USD');
//=> 'USD'
```

### Money

```js
import { Money } from 'mint-fns';

const money = new Money(100, 'USD');
//=> Money {fractional: 100, currency: 'USD'}

money.add(new Money(100, 'USD'));
//=> Money {fractional: 200, currency: 'USD'}

money.sub(new Money(100, 'USD'));
//=> Money {fractional: 100, currency: 'USD'}

money.toString();
//=> $1.00

money.format('fr-FR', { currencyDisplay: 'narrowSymbol' });
//=> 100,00 $

money.eq(new Money(400, 'USD'));
//=> false

money.eq(new Money(100, 'USD'));
//=> true
```

### Exchange

```js
import { Currency, Exchange } from 'mint-fns';
import isoCurrencies from 'mint-fns/iso-currencies.json';

Currency.load(isoCurrencies);

const exchange = new Exchange();

exchange.addRate('USD', 'CAD', 0.745);

const money = new Money(100, 'USD');
//=> Money {fractional: 100, currency: 'USD'}

exchange.exchangeWith(money, 'CAD');
//=> Money {fractional: 74, currency: 'CAD'}
```

## Why another money library?

**mint-fns** makes money and currency feel like primitive types. As developers, we use money and currency all the time and yet they are poorly supported types and have difficult interfaces to work with. Money types range from integers to floats to strings without any standardization. **mint-fns** makes it easy to operate on these values and exchange between currencies.
