import { isUnDef } from './is'

interface Store {
  [key: string]: any
}

/**
 * 存储类型
 */
type StoreType = Store | string | number | boolean

export const EnumStoreType = {
  /**
   * localStorage
   */
  LOCAl: 'localStorage',
  /**
   * sessionStorage
   */
  SESSION: 'sessionStorage',
} as const

export type EnumStoreType = (typeof EnumStoreType)[keyof typeof EnumStoreType]

/* ****************************** 包装方法 ******************************* */

/**
 * 设置本地存储, 默认`type` 为`localStorage`
 * @param key - 字符串唯一key
 * @param value - 需要存储的内容
 * @param type - 存储类型 {@link EnumStoreType}
 * @example
 * ```ts
 *  let value = { name: '张三', age: 18 }
 *  // localStorage
 *  setStore('userInfo', value)
 *  // sessionStorage
 *  setStore('userInfo', value, EnumStoreType.SESSION)
 * ```
 */
export function setStore(key: string, value: StoreType, type: EnumStoreType = EnumStoreType.LOCAl) {
  if (isUnDef(value)) return
  const content = JSON.stringify({ _value_: value })
  window[type].setItem(key, content)
}

/**
 * 获取本地存储, 默认`type` 为`localStorage`
 * @param key - 字符串key
 * @param type - 存储类型 {@link EnumStoreType}
 * @returns  获取到的内容
 *
 * @example
 * ```ts
 * // localStorage
 * const value = getStore('token')
 * // sessionStorage
 * const value = getStore('token', EnumStoreType.SESSION)
 * ```
 */
export function getStore<T = any>(
  key: string,
  type: EnumStoreType = EnumStoreType.LOCAl,
): T | null {
  const info = window[type].getItem(key)
  if (!info) return null
  try {
    const content = JSON.parse(info)
    if (Object.hasOwnProperty.call(content, '_value_')) {
      return content._value_ as T
    }
    return content as T
  } catch (error) {
    return info as string as T
  }
}

/**
 * 删除指定key的Local
 * @param key - 字符串key
 *
 * @example
 * ```ts
 * // localStorage
 * const value = removeStore('token')
 * // sessionStorage
 * const value = removeStore('token', EnumStoreType.SESSION)
 * ```
 */
export function removeStore(key: string, type: EnumStoreType = EnumStoreType.LOCAl) {
  window[type].removeItem(key)
}

/**
 * 清空所有Local
 */
export function clearStore(type: EnumStoreType = EnumStoreType.LOCAl) {
  window[type].clear()
}

/**
 * 设置LocalStorage
 * @param key - 字符串唯一key
 * @param content - 需要存储的内容
 * @returns void
 * @example
 * ```ts
 * // localStorage
 * setLocal('token','123')
 * ```
 */
export const setLocal = (key: string, content: StoreType) => setStore(key, content)
/**
 * 获取LocalStorage
 * @param key - 字符串key
 * @returns 获取到的内容
 * @example
 * ```ts
 * const value = getLocal('token')
 * ```
 */
export const getLocal = <T = any>(key: string) => getStore<T>(key)

/**
 * 删除指定key的LocalStorage
 * @param key - 字符串key
 * @returns void
 * @example
 * ```ts
 * removeLocal('token')
 * ```
 */
export const removeLocal = (key: string) => removeStore(key)

/**
 * 清除所有LocalStorage
 * @example
 * ```ts
 * clearLocal()
 * ```
 */
export const clearLocal = () => clearStore()

/**
 * 设置sessionStorage
 * @param key - 字符串唯一key
 * @param content - 需要存储的内容
 * @returns void
 * @example
 * ```ts
 * setSession('token','123')
 * ```
 */
export const setSession = (key: string, content: StoreType) =>
  setStore(key, content, EnumStoreType.SESSION)

/**
 * 获取sessionStorage
 * @param key - 字符串key
 * @returns - 获取到的内容
 * @example
 * ```ts
 * const value = getSession('token')
 * ```
 */
export const getSession = <T = any>(key: string) => getStore<T>(key, EnumStoreType.SESSION)

/**
 * 删除指定key的sessionStorage
 * @param key - 字符串key
 * @example
 * ```ts
 * const value = removeSession('token')
 * ```
 */
export const removeSession = (key: string) => removeStore(key, EnumStoreType.SESSION)

/**
 * 清除所有sessionStorage
 * @example
 * ```ts
 * const value = clearSession()
 * ```
 */
export const clearSession = () => clearStore(EnumStoreType.SESSION)
