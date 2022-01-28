export type CurrencyFormatOptions = Omit<
  Intl.NumberFormatOptions,
  'style' | 'currency'
>;
