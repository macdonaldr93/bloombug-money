import { CurrencyCode } from '../currency';

export interface IRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
}

export interface IExchangeStore {
  options: any;
  rates: { [key: string]: number };

  addRates(rates: IRate[]): number[];
  addRate(from: CurrencyCode, to: CurrencyCode, rate: number): number;
  getRate(from: CurrencyCode, to: CurrencyCode): number;
  eachRate(
    callback: (from: CurrencyCode, to: CurrencyCode, rate: number) => any
  ): void;
  rateKeyFor(from: CurrencyCode, to: CurrencyCode): string;
}
