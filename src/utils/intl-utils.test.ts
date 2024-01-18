import { createIntlNumberFormatter } from './intl-utils';

describe('utils/intl-utils', () => {
  describe('createIntlNumberFormatter()', () => {
    it('return a new formatter', () => {
      const formatter = createIntlNumberFormatter('en-US', 'USD');

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          currency: 'USD',
          locale: 'en-US',
          style: 'currency',
        })
      );
    });

    it('return a new formatter with options', () => {
      const formatter = createIntlNumberFormatter('en-US', 'USD', {
        currencyDisplay: 'narrowSymbol',
      });

      expect(formatter.resolvedOptions()).toEqual(
        expect.objectContaining({
          currency: 'USD',
          locale: 'en-US',
          style: 'currency',
          currencyDisplay: 'narrowSymbol',
        })
      );
    });

    it('caches formatter', () => {
      const formatter1 = createIntlNumberFormatter('en-US', 'USD');
      const formatter2 = createIntlNumberFormatter('en-US', 'USD');

      expect(formatter1).toEqual(formatter2);
    });
  });
});
