import memoize from 'lodash.memoize';

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
    return new Intl.NumberFormat(locales, {
      ...options,
      style: 'currency',
      currency,
    });
  },
  keyResolver
);
