import { isValueFinite } from './number';

describe('utilities', () => {
  describe('number', () => {
    describe('isValueFinite()', () => {
      it('return true when value is number', () => {
        expect(isValueFinite(400)).toBeTruthy();
      });

      it('return true when value is string', () => {
        expect(isValueFinite('400')).toBeTruthy();
      });

      it('return true when value is empty string', () => {
        expect(isValueFinite('')).toBeTruthy();
      });

      it('return false when value is infinite number', () => {
        expect(isValueFinite(4 / 0)).toBeFalsy();
      });
    });
  });
});
