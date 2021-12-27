import Money from '../money';

export default function addMoney(money: Money, other: Money) {
  return money.add(other);
}
