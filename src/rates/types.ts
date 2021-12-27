import { CurrencyCodeISO4217 } from '../currency';

export interface IRateStore {
  options: any;
  rates: { [key: string]: number };

  addRate(
    from: CurrencyCodeISO4217 | string,
    to: CurrencyCodeISO4217 | string,
    rate: number
  ): number;

  getRate(
    from: CurrencyCodeISO4217 | string,
    to: CurrencyCodeISO4217 | string
  ): number;

  eachRate(
    callback: (
      from: CurrencyCodeISO4217 | string,
      to: CurrencyCodeISO4217 | string,
      rate: number
    ) => any
  ): void;

  rateKeyFor(
    from: CurrencyCodeISO4217 | string,
    to: CurrencyCodeISO4217 | string
  ): string;
}
