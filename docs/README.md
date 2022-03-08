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
const money = Money('1,000.00', { asAmount: true });

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

## React

React hooks and components are available using [@bloombug/react-money](https://github.com/macdonaldr93/bloombug-react-money).

### Installation

```shell
npm install @bloombug/react-money --save
```

```shell
yarn add @bloombug/react-money
```

### React Native

If you're using React Native, you'll need to polyfill `BigInt`.

```shell
npm install big-integer --save
```

```shell
yarn add big-integer
```

```js
// Somewhere at the top of your entry file. For example, ./App.tsx.
import BigInt from 'big-integer';

if (typeof global.BigInt === 'undefined') {
  global.BigInt = BigInt;
}
```

### Getting started

To start, you must wrap your app or part of your app in your `<MintProvider />`.

```jsx
import { Mint } from '@bloombug/money';
import currencies from '@bloombug/money/iso-currencies.json';
import { MintProvider } from '@bloombug/react-money';

const mint = new Mint({ currencies });

const App = () => {
  return (
    <MintProvider mint={mint}>
      <p>Inside this provider, you can use the hooks and components.</p>
      {/* The rest of your app */}
    </MintProvider>
  );
};
```

### Components

#### MoneyText

This provides a simple formatted text version of your money.

```jsx
import { MoneyText } from '@bloombug/react-money';

const Component = () => {
  return (
    <p>
      <MoneyText fractional={100} currency="USD" />
      <MoneyText
        fractional={100}
        currency="CAD"
        currencyDisplay="narrowSymbol"
        locale="en-CA"
      />
    </p>
  );
};
```

### Hooks

#### useMint()

This returns the mint from the provider's context.

```jsx
import { useMint } from '@bloombug/react-money';

const Component = () => {
  const { mint } = useMint();

  return <p>Component</p>;
};
```

#### useExchange()

This returns the exchange from the provider's context.

```jsx
import { useExchange } from '@bloombug/react-money';

const Component = () => {
  const { exchange } = useExchange();

  return <p>Component</p>;
};
```

#### useCurrency()

This returns the currency from the provider's mint.

```jsx
import { useCurrency } from '@bloombug/react-money';

const Component = () => {
  const { Currency } = useCurrency();

  return <p>{Currency('CAD').name}</p>;
};
```

#### useMoney()

This returns the money from the provider's mint.

```jsx
import { useMoney } from '@bloombug/react-money';

const Component = () => {
  const { Money, formatMoney } = useMoney();

  return (
    <div>
      <p>{Money(100).toLocaleString()}</p>
      <p>{formatMoney('en-US', 100, 'CAD')}</p>
    </div>
  );
};
```

## Testing

Custom matchers are available using [@bloombug/jest-money](https://github.com/macdonaldr93/bloombug-jest-money).

### Installation

```shell
npm install @bloombug/jest-money --save
```

```shell
yarn add @bloombug/jest-money
```

Import `@bloombug/jest-money` once (for instance in your [tests setup file](https://jestjs.io/docs/en/configuration.html#setupfilesafterenv-array)) and you're good to go:

```js
// In your own jest-setup.js (or any other name)
import '@bloombug/jest-money';

// In jest.config.js add (if you haven't already)
setupFilesAfterEnv: ['<rootDir>/jest-setup.js'];
```

### TypeScript

If you're using TypeScript, make sure your setup file is a .ts and not a .js to include the necessary types.

You will also need to include your setup file in your tsconfig.json if you haven't already:

```
// In tsconfig.json
"include": [
  ...
  "./jest-setup.ts"
],
```

### Custom matchers

#### toEqualCurrency

This allows you to check whether a currency is equal to another.

```js
expect(Currency(USD)).toEqualCurrency(Currency(USD));
expect(Currency(USD)).not.toEqualCurrency(Currency(CAD));
```

#### toEqualMoney

This allows you to check whether a money is equal to another.

```js
expect(Money(100, USD)).toEqualCurrency(Money(100, USD));
expect(Money(100, USD)).not.toEqualCurrency(Money(100, CAD));
```

## Examples

[View examples on GitHub](https://github.com/macdonaldr93/bloombug-money/tree/main/examples)

## Acknowledgements

**@bloombug/money** is inspired from ruby's [money gem](https://github.com/RubyMoney/money), [Dinero.js](https://github.com/dinerojs/dinero.js), and [bigdecimal.js](https://github.com/srknzl/bigdecimal.js).
