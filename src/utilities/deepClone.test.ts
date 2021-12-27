import deepClone from './deepClone';

describe('utilities', () => {
  describe('deepClone()', () => {
    it('return a new object', () => {
      const value = { foo: 'bar' };

      expect(deepClone(value) === value).toBeFalsy();
    });
  });
});
