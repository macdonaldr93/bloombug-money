export function isValueFinite(number: string | number): boolean {
  if (typeof number === 'string') {
    return isFinite(number ? parseInt(number, 10) : 0);
  }

  return isFinite(number);
}
