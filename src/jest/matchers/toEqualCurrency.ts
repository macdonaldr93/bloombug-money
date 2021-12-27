import Currency from '../../currency';

declare global {
  namespace jest {
    interface Matchers<R, T> {
      /**
       * Assert whether currency is equal to another or not.
       * @param {Currency} currency - Currency to compare to
       * @example
       * expect(new Currency('CAD')).toEqualCurrency(new Currency('CAD'))
       */
      toEqualCurrency(currency: Currency): R;
    }
  }
}

export default function toEqualCurrency(
  this: jest.MatcherUtils,
  received: Currency,
  expected: Currency
) {
  if (received.eq(expected)) {
    return {
      pass: true,
      message: () =>
        `Expected ${received.toString()} not to equal ${expected.toString()}`,
    };
  }

  return {
    pass: false,
    message: () =>
      `Expected ${received.toString()} to equal ${expected.toString()}`,
  };
}
