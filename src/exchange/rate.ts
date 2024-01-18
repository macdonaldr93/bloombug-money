export interface Rate {
  /** A three-letter currency code */
  from: string;
  /** A three-letter currency code */
  to: string;
  /** A signed decimal number, which supports arbitrary precision and is serialized as a string. */
  rate: string;
}
