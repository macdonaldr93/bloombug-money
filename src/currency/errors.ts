export class UnknownCurrencyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownCurrencyError';
  }
}
