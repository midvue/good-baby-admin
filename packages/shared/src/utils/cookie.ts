import Cookies, { type CookieAttributes } from 'js-cookie'

/**
 * 设置cookie
 * @param name - cookie的key
 * @param value - cookie的内容
 * @param options - cookie的配置
 * @example
 * ```ts
 *  setCookie('name', 'value')
 *  setCookie('name', 'value', { expires: 30 })
 * ```
 */
export function setCookie(
  name: string,
  value: string,
  options: CookieAttributes = { expires: 30 },
) {
  Cookies.set(name, value, options)
}

/**
 * 获取指定name的cookie值
 * @param name - cookie的key
 * @example
 * ```ts
 *  getCookie('name')
 * ```
 */
export function getCookie(name: string) {
  return Cookies.get(name)
}

/**
 * 删除指定name的cookie
 * @param name - cookie的key
 * @example
 * ```ts
 *  removeCookie('name')
 * ```
 */
export function removeCookie(name: string) {
  Cookies.remove(name)
}
