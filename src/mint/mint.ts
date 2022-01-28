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

export interface MintConstructor {
  currencies?: Record<CurrencyCode | string, ICurrency>;
  currencyCache?: CurrencyCache;
  defaultCurrency?: CurrencyCode | string;
  defaultLocale?: string;
  defaultRoundingMode?: RoundingMode;
  exchange?: Exchange;
}

export default class Mint {
  readonly currencies: Record<CurrencyCode | string, ICurrency>;
  readonly currencyCache: CurrencyCache;
  readonly defaultCurrency: Currency;
  readonly defaultLocale: string;
  readonly defaultRoundingMode: RoundingMode;
  readonly mathContext: MathContext;
  exchange?: Exchange;

  constructor({
    currencies = defaultCurrencies,
    currencyCache = new CurrencyCache(),
    defaultCurrency = USD,
    defaultLocale = 'en-US',
    defaultRoundingMode = RoundingMode.HALF_UP,
    exchange,
  }: MintConstructor = {}) {
    if (!currencies[defaultCurrency]) {
      throw new UnknownCurrencyError(defaultCurrency);
    }

    this.currencies = currencies;
    this.currencyCache = currencyCache;
    this.defaultLocale = defaultLocale;
    this.defaultCurrency = new Currency(this, defaultCurrency);
    this.defaultRoundingMode = defaultRoundingMode;

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
    return new Currency(this, isoCode);
  }

  Money(fractional?: bigint | number | string, currency?: CurrencyCode | null) {
    return new Money(this, fractional, currency);
  }
}
