import { CAD, USD } from '../currencies';
import { UnknownRateError } from './errors';

describe('UnknownRateError', () => {
  it('#message returns expected string', () => {
    const error = new UnknownRateError(USD, CAD);

    expect(error.message).toEqual(
      "No conversion rate known for 'USD' -> 'CAD'"
    );
  });

  it('#name returns expected string', () => {
    const error = new UnknownRateError(USD, CAD);

    expect(error.name).toEqual('UnknownRateError');
  });
});
