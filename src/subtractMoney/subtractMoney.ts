import Money from '../money';

export default function subtractMoney(money: Money, other: Money) {
  return money.subtract(other);
}
