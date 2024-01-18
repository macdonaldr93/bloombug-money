# @bloombug/money

![NPM](https://img.shields.io/npm/l/@bloombug/money)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@bloombug/money)

A simple and consistent library for dealing with JavaScript money and currency in a browser & Node.js.

```js
import { Mint, USD } from '@bloombug/money';

const { Money } = new Mint();

const wallet = Money();
//=> Money { fractional: 0, currency: 'USD' }

const payment = Money(100, USD);
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

## Docs

See [docs site](https://macdonaldr93.github.io/bloombug-money/#/) for more details, API, and other docs.

## Examples

[View examples](./examples)
