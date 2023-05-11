import { lfaiCreatePopup } from '../src/index';

describe('lfaiCreatePopup()', () => {
  describe('validation', () => {
    it('requires an elementId to function', async () => {
      expect(() => {
        // @ts-ignore
        lfaiCreatePopup();
      }).toThrow();
    });
  });
});
