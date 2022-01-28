import Money from '../money';

export default function isMoney(object: any): object is Money {
  return (
    object.hasOwnProperty('fractional') && object.hasOwnProperty('currency')
  );
}
