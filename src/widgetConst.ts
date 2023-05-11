export const ENV_IS_CLIENT = typeof window !== 'undefined';

// Current env?
export const ENV =
  process &&
  process.env &&
  (process.env.NEXT_PUBLIC_NODE_ENV || process.env.NEXT_PUBLIC_VERCEL_ENV);
export const ENV_IS_DEV = ENV !== 'production' || true;
export const LFAI_HOST = ENV_IS_CLIENT
  ? window.origin
  : ENV_IS_DEV
  ? 'http://localhost:3002'
  : 'https://www.leftfieldai.com';
