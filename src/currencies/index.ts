import * as currenciesHistorical from './historical';
import * as currenciesISO4217 from './iso-4217';
import * as currenciesNonStandard from './non-standard';

const currencies = {
  ...currenciesHistorical,
  ...currenciesISO4217,
  ...currenciesNonStandard,
};

export { currencies };

export * from './historical';
export * from './iso-4217';
export * from './non-standard';
