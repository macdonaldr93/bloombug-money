import { UnknownCurrencyError } from './errors';
import { CurrencyCode } from './types';
import Mint from '../mint';

export default class Currency {
  readonly alternateSymbols?: string[] | null;
  readonly decimalMark: string;
  readonly disambiguateSymbol?: string | null;
  readonly format?: string;
  readonly htmlEntity: string;
  readonly isoCode: CurrencyCode;
  readonly isoNumeric?: string | null;
  readonly name: string;
  readonly priority: number;
  readonly smallestDenomination?: number | null;
  readonly subunit: string | null;
  readonly subunitToUnit: number;
  readonly symbol: string;
  readonly symbolFirst: boolean;
  readonly thousandsSeparator: string;
  private readonly mint: Mint;

  constructor(mint: Mint, isoCode: CurrencyCode) {
    this.isoCode = isoCode;
    this.mint = mint;

    if (this.mint.currencyCache.has(this.isoCode)) {
      return this.mint.currencyCache.get(this.isoCode)!;
    }

    const data = this.mint.currencies[this.isoCode];

    if (!data) {
      throw new UnknownCurrencyError(`Unknown currency '${this.isoCode}'`);
    }

    this.alternateSymbols = data.alternateSymbols;
    this.decimalMark = data.decimalMark;
    this.disambiguateSymbol = data.disambiguateSymbol;
    this.format = data.format;
    this.htmlEntity = data.htmlEntity;
    this.isoNumeric = data.isoNumeric;
    this.name = data.name;
    this.priority = data.priority;
    this.smallestDenomination = data.smallestDenomination;
    this.subunit = data.subunit;
    this.subunitToUnit = data.subunitToUnit;
    this.symbol = data.symbol;
    this.symbolFirst = data.symbolFirst;
    this.thousandsSeparator = data.thousandsSeparator;

    this.mint.currencyCache.set(this);
  }

  get separator() {
    return this.decimalMark;
  }

  get delimiter() {
    return this.thousandsSeparator;
  }

  get code() {
    return this.isoCode;
  }

  equals(other: Currency) {
    return this.isoCode === other.isoCode;
  }

  toLocaleString() {
    return this.name || this.isoCode;
  }

  toString() {
    return this.isoCode;
  }
}
