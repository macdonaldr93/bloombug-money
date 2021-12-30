# @bloombug/money

The most comprehensive, yet simple and consistent library for manipulating JavaScript money and currency in a browser & Node.js.

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

## Docs

See [docs site](https://macdonaldr93.github.io/bloombug-money/#/) for more details, API, and other docs.

## Examples

[View examples](./examples)
