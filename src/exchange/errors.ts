import { CurrencyCode } from '../currency';

export class UnknownRateError extends Error {
  constructor(from: CurrencyCode, to: CurrencyCode) {
    super(`No conversion rate known for '${from}' -> '${to}'`);
    this.name = 'UnknownRateError';
  }
}
