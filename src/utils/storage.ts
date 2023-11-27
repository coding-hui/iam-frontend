import Cookies from 'js-cookie';
import { TOKEN_KEY } from '@/enums/cacheEnum';

/**
 * window.localStorage 浏览器永久缓存
 * @method set 设置永久缓存
 * @method get 获取永久缓存
 * @method remove 移除永久缓存
 * @method clear 移除全部永久缓存
 */
export const Local = {
  setKey(key: string) {
    // @ts-ignore
    return `${__NEXT_NAME__}:${key}`;
  },
  // 设置永久缓存
  set<T>(key: string, val: T) {
    window.localStorage.setItem(Local.setKey(key), JSON.stringify(val));
  },
  // 获取永久缓存
  get(key: string) {
    let json = <string>window.localStorage.getItem(Local.setKey(key));
    return JSON.parse(json);
  },
  // 移除永久缓存
  remove(key: string) {
    window.localStorage.removeItem(Local.setKey(key));
  },
  // 移除全部永久缓存
  clear() {
    window.localStorage.clear();
  },
};

/**
 * window.sessionStorage 浏览器临时缓存
 * @method set 设置临时缓存
 * @method get 获取临时缓存
 * @method remove 移除临时缓存
 * @method clear 移除全部临时缓存
 */
export const Session = {
  // 设置临时缓存
  set(key: string, val: any) {
    window.sessionStorage.setItem(key, JSON.stringify(val));
  },
  // 获取临时缓存
  get(key: string) {
    if (key === TOKEN_KEY) return Cookies.get(key);
    let json = <string>window.sessionStorage.getItem(key);
    return JSON.parse(json);
  },
  // 移除临时缓存
  remove(key: string) {
    if (key === TOKEN_KEY) return Cookies.remove(key);
    window.sessionStorage.removeItem(key);
  },
  // 移除全部临时缓存
  clear() {
    Cookies.remove(TOKEN_KEY);
    window.sessionStorage.clear();
  },
  // 获取当前存储的 access_token
  getToken() {
    return this.get(TOKEN_KEY);
  },
};
