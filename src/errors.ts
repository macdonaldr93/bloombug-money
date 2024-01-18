import { Currency } from './currency';

export class MintMissingError extends Error {
  constructor() {
    super('You must provide a Mint context');
    this.name = 'ContextMissingError';
  }
}

export class ExchangeMissingError extends Error {
  constructor() {
    super('You must provide an exchange to convert currencies');
    this.name = 'ExchangeMissingError';
  }
}

export class UnknownCurrencyError extends Error {
  constructor(currency: Currency | string) {
    const isoCode = typeof currency === 'string' ? currency : currency.isoCode;

    super(`Unknown currency '${isoCode}'`);
    this.name = 'UnknownCurrencyError';
  }
}

export class UnknownRateError extends Error {
  constructor(from: string, to: string) {
    super(`No conversion rate known for '${from}' -> '${to}'`);
    this.name = 'UnknownRateError';
  }
}
