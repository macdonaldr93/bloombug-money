import memoize from 'lodash.memoize';
import { CurrencyFormatOptions } from '../types';

export function isLocales(
  locales: string | string[] | undefined | CurrencyFormatOptions
): locales is string | string[] {
  return typeof locales === 'string' || Array.isArray(locales);
}

const keyResolver = (
  locales: string | string[],
  currency: string,
  options: Intl.NumberFormatOptions = {}
) =>
  `${
    typeof locales === 'string' ? locales : locales.join('-')
  }-${currency}-${JSON.stringify(options)}`;

export const createIntlNumberFormatter = memoize(
  (
    locales: string | string[],
    currency: string,
    options: Intl.NumberFormatOptions = {}
  ) => {
    const mergedOptions = { style: 'currency', ...options, currency };

    if (options.currencyDisplay === 'narrowSymbol') {
      try {
        return new Intl.NumberFormat(locales, mergedOptions);
      } catch (err) {
        if (err instanceof RangeError) {
          return new Intl.NumberFormat(locales, {
            ...mergedOptions,
            currencyDisplay: 'symbol',
          });
        }

        throw err;
      }
    }

    return new Intl.NumberFormat(locales, mergedOptions);
  },
  keyResolver
);
