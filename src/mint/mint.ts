import { MathContext, RoundingMode } from 'bigdecimal.js';
import { USD } from '../currencies';
import { Currency } from '../currency';
import { UnknownCurrencyError } from '../errors';
import { Exchange, ExchangeStore } from '../exchange';
import { Money, MoneyOptions } from '../money';
import { Amount } from '../types';

const defaultCurrencies = {
  USD,
};

export interface MintConfig {
  currencies?: Record<string, Currency>;
  defaultCurrency?: Currency;
  defaultLocale?: string;
  defaultPrecision?: number;
  defaultRoundingMode?: RoundingMode;
  exchange?: { store: ExchangeStore };
}

export class Mint {
  readonly currencies: Record<string, Currency>;
  readonly defaultCurrency: Currency;
  readonly defaultLocale: string;
  readonly defaultPrecision: number;
  readonly defaultRoundingMode: RoundingMode;
  readonly mathContext: MathContext;
  exchange: Exchange;

  constructor({
    currencies = defaultCurrencies,
    defaultCurrency = USD,
    defaultLocale = 'en-US',
    defaultPrecision = 16,
    defaultRoundingMode = RoundingMode.HALF_UP,
    exchange,
  }: MintConfig = {}) {
    if (!(defaultCurrency.isoCode in currencies)) {
      throw new UnknownCurrencyError(defaultCurrency);
    }

    this.currencies = currencies;
    this.defaultLocale = defaultLocale;
    this.defaultCurrency = defaultCurrency;
    this.defaultPrecision = defaultPrecision;
    this.defaultRoundingMode = defaultRoundingMode;
    this.mathContext = new MathContext(
      this.defaultPrecision,
      this.defaultRoundingMode
    );

    this.Money = this.Money.bind(this);
    this.toCurrency = this.toCurrency.bind(this);
    this.exchange = new Exchange(exchange?.store, this);
  }

  Money(
    amount?: Amount,
    currency?: Currency | string | null,
    options: Omit<MoneyOptions, 'mint'> = {}
  ) {
    let resolvedCurrency = this.defaultCurrency;

    if (typeof currency === 'string') {
      resolvedCurrency = this.toCurrency(currency);
    } else if (currency) {
      resolvedCurrency = currency;
    }

    return new Money(amount, resolvedCurrency, this, options);
  }

  toCurrency(code: string): Currency {
    const currency = this.currencies[code];

    if (!currency) {
      throw new UnknownCurrencyError(code);
    }

    return currency;
  }
}
