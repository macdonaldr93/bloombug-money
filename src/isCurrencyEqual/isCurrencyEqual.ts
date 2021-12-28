import Currency from '../currency';

export default function isCurrencyEqual(currency: Currency, other: Currency) {
  return currency.equals(other);
}
