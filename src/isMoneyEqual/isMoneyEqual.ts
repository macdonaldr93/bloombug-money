import Money from '../money';

export default function isMoneyEqual(money: Money, other: Money) {
  return money.isEqual(other);
}
