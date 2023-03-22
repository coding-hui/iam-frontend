import pkg from '../../package.json';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  // @ts-ignore
  return process.env.MODE_ENV;
}

export function getCommonStoragePrefix() {
  return `WECODING__${getEnv()}`.toUpperCase();
}

// Generate cache key according to version
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return process.env.NODE_ENV === 'development';
}
