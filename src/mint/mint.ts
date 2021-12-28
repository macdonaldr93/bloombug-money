import { Big, BigDecimal } from 'bigdecimal.js';

import { CurrencyCodeISO4217, ICurrency } from '../currency';
import { USD } from '../currencies';
import Exchange from '../exchange';

interface IMoney {
  currency: ICurrency;
  fractional: BigDecimal;
  exchange?: Exchange;
  add(other: IMoney): void;
  sub(other: IMoney): void;
}

interface MintOptions<Currencies> {
  defaultCurrency?: CurrencyCodeISO4217 | string;
  currencies?: Currencies;
  exchange?: Exchange;
}

const defaultCurrencies: Record<string, ICurrency> = {
  USD: {
    priority: 1,
    isoCode: USD,
    name: 'United States Dollar',
    symbol: '$',
    disambiguateSymbol: 'US$',
    alternateSymbols: ['US$'],
    subunit: 'Cent',
    subunitToUnit: 100,
    symbolFirst: true,
    htmlEntity: '$',
    decimalMark: '.',
    thousandsSeparator: ',',
    isoNumeric: '840',
    smallestDenomination: 1,
  },
};

export default function Mint<Currencies extends Record<string, ICurrency>>(
  options: MintOptions<Currencies> = {}
) {
  const {
    defaultCurrency = USD,
    currencies = defaultCurrencies,
    exchange,
  } = options;

  function Currency(isoCode: CurrencyCodeISO4217 | string) {
    const resolvedCurrency = currencies[isoCode];

    return {
      priority: resolvedCurrency.priority,
      isoCode: resolvedCurrency.isoCode,
      name: resolvedCurrency.name,
      symbol: resolvedCurrency.symbol,
      disambiguateSymbol: resolvedCurrency.disambiguateSymbol,
      alternateSymbols: resolvedCurrency.alternateSymbols,
      subunit: resolvedCurrency.subunit,
      subunitToUnit: resolvedCurrency.subunitToUnit,
      symbolFirst: resolvedCurrency.symbolFirst,
      format: resolvedCurrency.format,
      htmlEntity: resolvedCurrency.htmlEntity,
      decimalMark: resolvedCurrency.decimalMark,
      thousandsSeparator: resolvedCurrency.thousandsSeparator,
      isoNumeric: resolvedCurrency.isoNumeric,
      smallestDenomination: resolvedCurrency.smallestDenomination,
    };
  }

  function Money(
    fractional: number,
    currency?: CurrencyCodeISO4217 | string
  ): IMoney {
    const resolvedCurrency = Currency(currency || defaultCurrency);
    const resolvedfractional = Big(fractional);

    const add = (other: IMoney) => {
      resolvedfractional.add(other.fractional);
    };

    const sub = (other: IMoney) => {
      resolvedfractional.subtract(other.fractional);
    };

    return {
      currency: resolvedCurrency,
      exchange,
      fractional: resolvedfractional,
      add,
      sub,
    };
  }

  return { currencies, Currency, Money };
}
