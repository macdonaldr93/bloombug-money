import { Money } from '../money';

export function isMoney(object: any): object is Money {
  return object.hasOwnProperty('amount') && object.hasOwnProperty('currency');
}
