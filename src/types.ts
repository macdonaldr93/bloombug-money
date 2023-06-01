import { BigDecimal } from 'bigdecimal.js';

export type CurrencyFormatOptions = Omit<Intl.NumberFormatOptions, 'currency'>;

export type FractionalInputType = BigDecimal | bigint | number | string;
