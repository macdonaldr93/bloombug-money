import { UnknownCurrencyError } from './errors';

describe('UnknownCurrencyError', () => {
  it('#message returns expected string', () => {
    const error = new UnknownCurrencyError('CAD');

    expect(error.message).toEqual("Unknown currency 'CAD'");
  });

  it('#name returns expected string', () => {
    const error = new UnknownCurrencyError('CAD');

    expect(error.name).toEqual('UnknownCurrencyError');
  });
});
