import { CurrencyCode } from '../currency';

export interface IRate {
  from: CurrencyCode;
  to: CurrencyCode;
  rate: number;
}

export interface IExchangeStore<Options = any> {
  rates: { [key: string]: number };
  options: Options;

  addRates(rates: IRate[]): number[];
  addRate(from: CurrencyCode, to: CurrencyCode, rate: number): number;
  getRate(from: CurrencyCode, to: CurrencyCode): number;
  eachRate(
    callback: (from: CurrencyCode, to: CurrencyCode, rate: number) => any
  ): void;
}
