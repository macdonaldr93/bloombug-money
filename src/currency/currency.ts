import DefaultISOCurrencies from '../config/currency_iso.json';
import { UnknownCurrencyError } from './errors';
import { CurrencyCodeISO4217, ICurrency } from './types';

export default class Currency implements ICurrency {
  static store: Record<string, ICurrency> = Currency.loadDefaultCurrencies();
  private static instances = new Map<CurrencyCodeISO4217 | string, Currency>();

  static all(): Currency[] {
    return Object.keys(Currency.store).map(
      (isoCode: any) => new Currency(isoCode)
    );
  }

  static find(isoCode: CurrencyCodeISO4217) {
    let currency = null;

    try {
      currency = new Currency(isoCode);
    } catch (err) {
      currency = null;
    }

    return currency;
  }

  static register(data: ICurrency): Currency {
    const isoCode = data.isoCode;

    Currency.store[isoCode] = data;

    const currency = new Currency(isoCode);

    Currency.instances.delete(isoCode);
    Currency.instances.set(isoCode, currency);

    return Currency.instances.get(isoCode)!;
  }

  static unregister(currency: Currency): boolean {
    const isoCode = currency.isoCode;
    const hadCurrency = Currency.instances.has(isoCode);

    delete Currency.store[isoCode];
    Currency.instances.delete(isoCode);

    return hadCurrency;
  }

  static reset(): boolean {
    Currency.instances = new Map();
    Currency.store = this.loadDefaultCurrencies();

    return true;
  }

  static wrap(object: Currency | ICurrency | string): Currency {
    if (object instanceof Currency) {
      return object;
    } else if (object && typeof object === 'string') {
      return new Currency(object);
    } else if (object && typeof object === 'object') {
      return new Currency(object.isoCode);
    } else {
      throw new UnknownCurrencyError(`Unknown currency '${object}'`);
    }
  }

  private static loadDefaultCurrencies() {
    return JSON.parse(JSON.stringify(DefaultISOCurrencies));
  }

  alternateSymbols?: string[] | null;
  decimalMark: string;
  disambiguateSymbol?: string | null;
  format?: string;
  htmlEntity: string;
  isoCode: CurrencyCodeISO4217 | string;
  isoNumeric?: string | null;
  name: string;
  priority: number;
  smallestDenomination?: number | null;
  subunit: string | null;
  subunitToUnit: number;
  symbol: string;
  symbolFirst: boolean;
  thousandsSeparator: string;

  constructor(isoCode: CurrencyCodeISO4217 | string) {
    if (Currency.instances.has(isoCode)) {
      return Currency.instances.get(isoCode)!;
    }

    this.isoCode = isoCode.toUpperCase();

    if (!Object.keys(Currency.store).includes(this.isoCode)) {
      throw new UnknownCurrencyError(`Unknown currency '${this.isoCode}'`);
    }

    const data = Currency.store[this.isoCode];

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

    Currency.instances.set(this.isoCode, this);
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

  isEqual(other: Currency) {
    return this.isoCode === other.isoCode;
  }

  toString() {
    return this.isoCode;
  }
}