export class UnknownRateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'UnknownRateError';
  }
}
