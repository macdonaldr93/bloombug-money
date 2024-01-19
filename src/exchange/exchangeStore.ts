import { Rate } from './rate';

export interface ExchangeStore {
  refreshRates(): Promise<void>;
  addRates(rates: Rate[]): string[];
  addRate(from: string, to: string, rate: string): string;
  getRate(from: string, to: string): string;
}
