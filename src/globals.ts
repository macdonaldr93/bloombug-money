import { Mint, MintConfig } from './mint';

export interface GlobalMintOptions {
  /**
   * If you're intentionally overriding globals, you can set this to
   * true to supress console warnings.
   */
  suppressOverrideWarnings?: boolean;
}

/**
 * Initialized a mint bound to the global context.
 * You can access the mint using globalThis, window, or self.
 *
 * For TypeScript, add the following to your global type declaration:
 *
 * @example
 *
 * import {currencies, initGlobalMint, Mint} from '@bloombug/money';
 *
 * declare global {
 *   var Mint: Mint;
 *   var Money: Mint['Money'];
 * }
 *
 * initGlobalMint({currencies});
 */
export function initGlobalMint(config: MintConfig, options: GlobalMintOptions) {
  const mint = new Mint(config);

  if (typeof globalThis === 'undefined') {
    throw new Error(
      "globalThis isn't available in this environment." +
        '\n' +
        "You'll need to initialize the mint and bind it globally yourself."
    );
  }

  if (
    !options.suppressOverrideWarnings &&
    ('Mint' in globalThis || 'Money' in globalThis)
  ) {
    if ('Mint' in globalThis) {
      console.warn(
        "Mint is already defined in globalThis. You're overriding the previous value."
      );
    }

    if ('Money' in globalThis) {
      console.warn(
        "Money is already defined in globalThis. You're overriding the previous value."
      );
    }
  }

  (globalThis as any).Mint = mint;
  (globalThis as any).Money = mint.Money;
}
