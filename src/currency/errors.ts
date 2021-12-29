export class UnknownCurrencyError extends Error {
  constructor(code: string) {
    super(`Unknown currency '${code}'`);
    this.name = 'UnknownCurrencyError';
  }
}
