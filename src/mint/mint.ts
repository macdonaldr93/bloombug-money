import { MathContext, RoundingMode } from 'bigdecimal.js';

import defaultCurrencies from '../default-currencies.json';
import Currency, {
  CurrencyCache,
  CurrencyCode,
  ICurrency,
  UnknownCurrencyError,
} from '../currency';
import { USD } from '../currencies';
import Exchange from '../exchange';
import Money from '../money';
import { FractionalInputType } from '../types';

export interface MintConstructor {
  currencies?: Record<CurrencyCode | string, ICurrency>;
  currencyCache?: CurrencyCache;
  defaultCurrency?: CurrencyCode | string;
  defaultLocale?: string;
  defaultPrecision?: number;
  defaultRoundingMode?: RoundingMode;
  exchange?: Exchange;
}

export default class Mint {
  static defaultInstance?: Mint;

  static setDefault(mint: Mint) {
    Mint.defaultInstance = mint;
  }

  static resetDefault() {
    Mint.defaultInstance = undefined;
  }

  readonly currencies: Record<CurrencyCode | string, ICurrency>;
  readonly currencyCache: CurrencyCache;
  readonly defaultCurrency: Currency;
  readonly defaultLocale: string;
  readonly defaultPrecision: number;
  readonly defaultRoundingMode: RoundingMode;
  readonly mathContext: MathContext;
  exchange?: Exchange;

  constructor({
    currencies = defaultCurrencies,
    currencyCache = new CurrencyCache(),
    defaultCurrency = USD,
    defaultLocale = 'en-US',
    defaultPrecision = 16,
    defaultRoundingMode = RoundingMode.HALF_UP,
    exchange,
  }: MintConstructor = {}) {
    if (!currencies[defaultCurrency]) {
      throw new UnknownCurrencyError(defaultCurrency);
    }

    this.currencies = currencies;
    this.currencyCache = currencyCache;
    this.defaultLocale = defaultLocale;
    this.defaultCurrency = new Currency(defaultCurrency, this);
    this.defaultPrecision = defaultPrecision;
    this.defaultRoundingMode = defaultRoundingMode;
    this.mathContext = new MathContext(
      this.defaultPrecision,
      this.defaultRoundingMode
    );

    this.useExchange = this.useExchange.bind(this);
    this.Currency = this.Currency.bind(this);
    this.Money = this.Money.bind(this);

    if (exchange) {
      this.useExchange(exchange);
    }
  }

  useExchange(exchange: Exchange) {
    this.exchange = exchange;
    exchange.mint = this;

    return exchange;
  }

  Currency(isoCode: CurrencyCode) {
    return new Currency(isoCode, this);
  }

  Money(fractional?: FractionalInputType, currency?: CurrencyCode | null) {
    return new Money(fractional, currency, this);
  }
}
