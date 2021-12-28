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
  defaultCurrency?: CurrencyCode | string;
  currencies?: Record<CurrencyCode | string, ICurrency>;
  currencyCache?: CurrencyCache;
  exchange?: Exchange;
}

export default class Mint {
  readonly currencies: Record<CurrencyCode | string, ICurrency>;
  readonly currencyCache: CurrencyCache;
  readonly defaultCurrency: Currency;
  exchange?: Exchange;

  constructor({
    currencies = defaultCurrencies,
    currencyCache = new CurrencyCache(),
    defaultCurrency = USD,
    exchange,
  }: MintConstructor = {}) {
    if (!currencies[defaultCurrency]) {
      throw new UnknownCurrencyError(
        `Default currency '${defaultCurrency}' must be defined in currencies`
      );
    }

    this.currencies = currencies;
    this.currencyCache = currencyCache;

    this.defaultCurrency = new Currency(this, defaultCurrency);

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

  Money(fractional?: bigint | number, currency?: CurrencyCode | null) {
    return new Money(this, fractional, currency);
  }
}
