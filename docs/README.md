# @bloombug/money

![NPM](https://img.shields.io/npm/l/@bloombug/money)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@bloombug/money)

A simple and consistent library for dealing with JavaScript money and currency in a browser & Node.js.

```js
import { Mint } from '@bloombug/money';

const { Currency, Money } = new Mint();

const wallet = Money();
//=> Money { fractional: 0, currency: 'USD' }

const payment = Money(100);
//=> Money { fractional: 100, currency: 'USD' }

wallet.add(payment);
//=> Money { fractional: 100, currency: 'USD' }
```

## Installation

```shell
npm install @bloombug/money --save
```

```shell
yarn add @bloombug/money
```

## Introduction

**@bloombug/money** has 3 core concepts:

- `Mint` holds the context in which your money and currencies are created and operated.
- `Money` provides a consistent and reliable type to work with money and arithmetic.
- `Currency` understands the details of working with and expression money in a specific way.

### Why another money library?

**@bloombug/money** makes money and currency feel like primitive types. As developers, we use money and currency all the time and yet they are poorly supported types and have difficult interfaces to work with. Money types range from integers to floats to strings without any standardization or normalization. Other libraries avoid providing standardized definitions of ISO currencies and exchange rates. **@bloombug/money** is a complete solution for working with money in your application.

## Getting started

```js
import { Mint } from '@bloombug/money';

const { Money } = new Mint();
const money = Money(100, 'USD');
//=> Money { fractional: 100, currency: 'USD' }

money.add(Money(100, 'USD'));
//=> Money { fractional: 200, currency: 'USD' }

money.subtract(Money(100, 'USD'));
//=> Money { fractional: 100, currency: 'USD' }

money.toString();
//=> $1.00

money.format('fr-FR', { currencyDisplay: 'narrowSymbol' });
//=> 100,00 $

money.equals(Money(400, 'USD'));
//=> false

money.equals(Money(100, 'USD'));
//=> true
```

### Multi-currency and exchange rates

**@bloombug/money** exports a list a ISO currencies and an exchange to handle rates.

```js
import { Mint, CAD, USD } from '@bloombug/money';
import currencies from '@bloombug/money/iso-currencies.json';

const { exchange, Money } = new Mint({ currencies, exchange: new Exchange() });

exchange.addRate(CAD, USD, 0.76);

const usd = Money(100);
const cad = Money(100, CAD);

usd.add(cad);
//=> Money { fractional: 176, currency: 'USD' }
```

### i18n and formatting

**@bloombug/money** uses native formatters to handle different languages and locales.

```js
import { Mint, CAD } from '@bloombug/money';
import currencies from '@bloombug/money/iso-currencies.json';

const { Money } = new Mint({ currencies, defaultCurrency: CAD });
const money = Money('1,000.00');

money.format('en-US');
//=> CA$1,000.00

money.format('en-US', {
  currencyDisplay: 'narrowSymbol',
});
//=> $1,000.00

money.format('fr-FR');
//=> 1 000,00 $CA
```

### Constants

**@bloombug/money** provides some useful constants.

##### `currencies`

Exports all ISO currency ISO codes.

```js
import { Mint, CAD, EUR, USD } from '@bloombug/money';
import currencies from '@bloombug/money/iso-currencies.json';

const { Currency } = new Mint({ currencies });
const cad = Currency(CAD);
const eur = Currency(EUR);
const usd = Currency(USD);
```

##### `iso-currencies.json`

A list of all [ISO currencies](https://en.wikipedia.org/wiki/ISO_4217#Active_codes) and their metadata. This module is exported separated to reduce the bundle size for application with only one or a subset of currencies.

```js
import { Mint } from '@bloombug/money';
import currencies from '@bloombug/money/iso-currencies.json';

const { Currency } = new Mint({ currencies });
```

## Examples

[View examples on GitHub](https://github.com/macdonaldr93/bloombug-money/tree/main/examples)

## Acknowledgements

**@bloombug/money** is inspired from ruby's [money gem](https://github.com/RubyMoney/money), [Dinero.js](https://github.com/dinerojs/dinero.js), and [bigdecimal.js](https://github.com/srknzl/bigdecimal.js).
