import { BigDecimal } from 'bigdecimal.js';

export type Amount = BigDecimal | bigint | number | string;

export type CurrencyFormatOptions = Omit<Intl.NumberFormatOptions, 'currency'>;
