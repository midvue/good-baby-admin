const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}
/**
 * 判断不是undefined
 * @param val  -内容
 * @example
 * ```ts
 * let result= isDef('test')
 * ```
 */
export function isDef<T = unknown>(val?: T): val is T {
  return typeof val !== 'undefined'
}
/**
 * 判断是undefined
 * @param val  -内容
 * @example
 * ```ts
 * let result= isUnDef('test')
 * ```
 */
export function isUnDef<T = unknown>(val?: T): val is T {
  return !isDef(val)
}

/**
 * 判断是Object,包含数组
 * @param val  -内容
 * @example
 * ```ts
 * let result= isObject({name:1})
 * ```
 */
export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

/**
 * 判断是原始Object,不包含数组
 * @param val  -内容
 * @example
 * ```ts
 * let result= isPlainObject({name:1})
 * ```
 */
export function isPlainObject(val: unknown): val is Record<string, unknown> {
  return isObject(val) && !isArray(val)
}

/**
 * 检测当前类型是否是空对象
 * @param obj - 检测当前类型
 * @returns 如果为空的对象则返回true、否则返回false
 */
export const isEmptyObject = (obj: any): boolean => {
  return isObject(obj) && Object.keys(obj as Object).length === 0
}

/**
 * 检测当前类型是否空(空string|undefined|null)
 * @param val - 检测当前类型
 * @returns 如果为空的对象则返回true、否则返回false
 */
export const isEmptyValue = (val: string | number | null | undefined): boolean => {
  if (isNullOrUnDef(val)) return true
  if (val === '') return true
  return false
}

/**
 * 判断是空,包括空数组,空对象,空Map
 * @param val  -内容
 * @example
 * ```ts
 * let result= isEmpty({name:1})
 * ```
 */
export function isEmpty<T = unknown>(val: T): val is T {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

/**
 * 判断是日期对象
 * @param val  -内容
 * @example
 * ```ts
 * let result= isDate(new Date())
 * ```
 */
export function isDate(val: unknown): val is Date {
  return is(val, 'Date')
}

/**
 * 判断是否为null
 * @param val - 任意值
 * @returns  boolean
 */
export function isNull(val: unknown): val is null {
  return val === null
}

/**
 * 判断是null和undefined
 * @param val  -内容
 * @example
 * ```ts
 * let result= isNullAndUnDef('')
 * ```
 */
export function isNullAndUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) && isNull(val)
}

/**
 * 判断是null或undefined
 * @param val  -内容
 * @example
 * ```ts
 * let result= isNullOrUnDef('')
 * ```
 */
export function isNullOrUnDef(val: unknown): val is null | undefined {
  return isUnDef(val) || isNull(val)
}

/**
 * 是否是number
 * @param val  -内容
 * @example
 * ```ts
 * let result= isNumber('test')
 * ```
 */
export function isNumber(val: unknown): val is number {
  return is(val, 'Number')
}

/**
 * 是否是Promise
 * @param val  -内容
 * @example
 * ```ts
 * let result= isPromise('test')
 * ```
 */
export function isPromise<T = any>(val: any): val is Promise<T> {
  return is(val, 'Promise') && isFunction(val.then) && isFunction(val.catch)
}

export function isString(val: unknown): val is string {
  return is(val, 'String')
}

/**
 * 是否是函数
 * @param val  -内容
 * @example
 * ```ts
 * let result= isFunction('test')
 * ```
 */

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
}

export function isBoolean(val: unknown): val is boolean {
  return is(val, 'Boolean')
}

/**
 * 是否是正则
 * @param val  -内容
 * @example
 * ```ts
 * let result= isRegExp(window)
 * ```
 */
export function isRegExp(val: unknown): val is RegExp {
  return is(val, 'RegExp')
}
/**
 * 是否是数组
 * @param val  -内容
 * @example
 * ```ts
 * let result= isArray(window)
 * ```
 */
export function isArray(val: any): val is Array<any> {
  return val && Array.isArray(val)
}

/**
 * 是否是Window
 * @param val  -内容
 * @example
 * ```ts
 * let result= isWindow(window)
 * ```
 */
export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export function isElement(val: unknown): val is Element {
  return isObject(val) && !!val.tagName
}

/**
 * 是否是Map
 * @param val  -内容
 * @example
 * ```ts
 * let result= isMap(window)
 * ```
 */
export function isMap(val: unknown): val is Map<any, any> {
  return is(val, 'Map')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

/**
 * 是否是isUrl
 * @param val  -内容
 * @example
 * ```ts
 * let result= isUrl('http://www.baidu.com')
 * ```
 */
export function isUrl(path: string): boolean {
  const reg =
    // eslint-disable-next-line no-useless-escape
    /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}

/**
 * 是否是Android客户端
 * @example
 * ```ts
 * let result= isAndroid()
 * ```
 */

export function isAndroid() {
  return navigator.userAgent.indexOf('Android') > -1
}
/**
 * 是否是ios客户端
 * @example
 * ```ts
 * let result= isIos()
 * ```
 */
export function isIos() {
  return /(iPhone|iPad|iPod)/i.test(navigator.userAgent)
}

/**
 * 是否是微信客户端
 * @example
 * ```ts
 * let result= isWeChat()
 * ```
 */
export function isWeChat() {
  return navigator.userAgent.toLowerCase().indexOf('micromessenger') !== -1
}
