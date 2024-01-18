import { Rate } from './rate';

export interface ExchangeStore {
  rates: { [key: string]: string };
  addRates(rates: Rate[]): string[];
  addRate(from: string, to: string, rate: string): string;
  getRate(from: string, to: string): string;
}
