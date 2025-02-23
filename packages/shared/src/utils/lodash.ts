import { isDef, isNullOrUnDef, isObject, isUnDef } from './is'

/**
 * 深拷贝
 * @param  obj  - 要深拷贝的值
 * @returns  深拷贝后的值
 * @example
 * ```ts
 * let result= deepClone({name:'a',person:{age:18,name:'b',hobbies:['sing','dance']}})
 * ```
 */
export function deepClone<T extends Record<string, any> | null | undefined>(obj: T): T {
  if (isUnDef(obj)) {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item)) as unknown as T
  }

  if (isObject(obj)) {
    const to = {} as Record<string, any>
    Object.keys(obj).forEach((key) => {
      to[key] = deepClone(obj[key])
    })

    return to as T
  }

  return obj
}

type OmitUndefined<T> = {
  [K in keyof T]: undefined extends T[K] ? never : T[K]
}

/**
 * 删除对象中的某些键值对
 * @param obj - 源对象
 * @param fields - 需要删除的字段数组
 * @param ignoreEmpty - 是否忽略 undefined | null
 * @returns 返回新的对象
 * @example
 * ```ts
 * const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
      c: '',
      d: undefined,
    }
    const cloneObj = omit(obj, ['a'])
 * ```
 */
export function omit<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  fields: K[] | string[],
  ignoreEmpty = true,
): Omit<T, K> {
  if (!obj) return {} as Omit<T, K>
  if (!ignoreEmpty) {
    return fields.reduce((result, key) => {
      const { [key]: _, ...rest } = result
      return rest as T
    }, obj)
  }

  const result = {} as OmitUndefined<T>
  for (const key in obj) {
    // @ts-ignore
    if (!fields.includes(key) && !isNullOrUnDef(obj[key])) {
      result[key] = obj[key]
    }
  }
  return result
}

export type Writeable<T> = { -readonly [P in keyof T]: T[P] }

/**
 * 从对象中取出指定的键值对
 * @param obj - 源对象
 * @param keys - 需要取出的键值对
 * @param ignoreEmpty - 是否忽略 undefined 
 * @returns 返回新的对象
 * @example
 * ```ts
 *    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    }
    const cloneObj = pick(obj, ['b'])
 * ``` 
 */
export function pick<T, U extends keyof T>(
  obj: T,
  keys: ReadonlyArray<U> | string[],
  ignoreUndefined = true,
) {
  if (!obj) return {} as Writeable<Pick<T, U>>
  return keys.reduce(
    (ret, key) => {
      const value = obj[key as U]
      if (!ignoreUndefined || isDef(value)) {
        ret[key as U] = value
      }
      return ret
    },
    {} as Writeable<Pick<T, U>>,
  )
}

/**
 * 从对象中取出指定的键值对,第二个参数predicate（断言函数)
 * @param obj - 源对象
 * @param predicate - 断言函数,判断为真值的属性会被返回
 * @returns 返回新的对象
 * @example
 * ```ts
 *    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
      c: '',
      d: undefined,
    }
    const cloneObj = pickBy(obj, (value) => !!value)
 * ``` 
 */
export function pickBy<T>(
  obj: T,
  predicate: (val: NonNullable<T>[keyof T], key: keyof T) => boolean,
) {
  if (!obj) return {} as Partial<T>
  const ret: Partial<T> = {}
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const typedKey = key as keyof T
      const value = obj[typedKey]
      if (predicate(value, typedKey)) {
        ret[typedKey] = value
      }
    }
  }
  return ret
}

type OmitBy<T, F> = { [K in keyof T as F extends T[K] ? never : K]: T[K] }

/**
 * 从对象中去除属性,通过第二个参数predicate（断言函数)
 * 与 {@link pickBy} 反向版
 * @param obj - 源对象
 * @param predicate - 断言函数,判断为真值的属性会被**去除**
 * @returns 返回新的对象
 * @example
 * ```ts
 * const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
      c: '',
      d: undefined,
    }
    const cloneObj = omitBy(obj, (value) => !value)
 * ```
 */
export function omitBy<T>(
  object: T,
  predicate: (value: T[keyof T], key: keyof T) => boolean,
): OmitBy<T, T[keyof T]> {
  const result = { ...object }
  for (const key in object) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      const typedKey = key as keyof T
      const value = object[typedKey]
      if (predicate(value, typedKey)) {
        delete result[key]
      }
    }
  }
  return result
}

/**
 * 防抖函数
 * @param fn - 需要防抖的函数
 * @param delay - 防抖的时间
 * @example
 * ```ts
 * let handleSearch =()=>{}
 * const debounceSearch = debounce(handleSearch)
 * ```
 */
export const debounce = (fn: Function, delay = 0) => {
  let timer: number

  return function (this: unknown, ...args: any[]) {
    if (timer) {
      window.clearTimeout(timer)
    }

    timer = window.setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}

/**
 * 节流函数
 * @param fn  - 需要节流的函数
 * @param limit - 节流的时间
 * @param exeLastFunc - 是否执行最后一次函数
 * @example
 * ```ts
 * let handleSearch =()=>{}
 * const throttleSearch = throttle(handleSearch)
 * ```
 */
export const throttle = <T extends (...args: any) => any>(
  fn: T,
  limit = 200,
  exeLastFunc = true,
) => {
  let timer: number
  let start = 0

  return function loop(this: unknown, ...args: Parameters<T>) {
    const now = Date.now()
    const duration = now - start
    if (duration >= limit) {
      fn.apply(this, args)
      // 更新最后执行时间
      start = now
    } else if (exeLastFunc) {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        fn.apply(this, args)
        start = Date.now()
      }, limit - duration)
    }
  }
}

let counter = 0
/**
 * 生成当前浏览器唯一id
 * (自增+页面渲染时间+ random随机数)
 * 对于一般的唯一ID 生成来说是足够的
 * @param length -随机数长度 默认16
 * @example
 * ```ts
 * let uid11 = uniqueId(11) //11位
 * let uid16 = uniqueId() //16位
 * let uid19 = uniqueId(19) //19 位
 * let uid32 = uniqueId(32)
 * ```
 * @returns 唯一id
 */
export function uniqueId(length: number = 16): string {
  const pNow = new Date().getTime().toString()
  const random = Math.random().toString().replace('.', '').slice(1, 10)
  const padLength = length - pNow.length - counter.toString().length - random.length
  const padding = '0'.repeat(padLength > 0 ? padLength : 0)
  const uniqueId = '' + `${counter}${pNow}${padding}${random}`.slice(0, length)
  counter++
  return uniqueId
}

/**
 * 将 Blob 对象转换为 base64 字符串
 * @param blob - Blob 对象
 * @param ignorePrefix - 是否忽略 dateUrl 前缀
 * @example
 * ```ts
 * let base64 = blobToBase64(blob)
 * let base64 = blobToBase64(blob,false)
 * ```
 */
export function blobToBase64(blob: Blob, ignorePrefix = true): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (ignorePrefix) {
          return resolve(reader.result && reader.result.split(',')[1])
        }
        resolve(reader.result)
      } else {
        reject(new Error('Failed to convert Blob to base64'))
      }
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

type DeepKeyOf<T> = T extends object
  ? {
      [K in keyof T]-?: K extends string ? K | `${K}.${DeepKeyOf<T[K]>}` : never
    }[keyof T]
  : never

type DeepValueOf<T, K extends string> = K extends `${infer P}.${infer Rest}`
  ? P extends keyof T
    ? DeepValueOf<T[P], Rest>
    : ''
  : K extends keyof T
    ? T[K]
    : ''

/**
 * 从对象中获取指定路径的值
 * @param object -对象
 * @param path  - 指定路径
 * @example
 * ```ts
 * const obj = {
 *   a: { b: { c: 3 } }
 * }
 * const value = get(obj, 'a.b.c')
 * ```
 */
export function get<T, K extends DeepKeyOf<T>>(obj: T, path: K) {
  const keys = (path as string).split('.')
  let result = obj

  keys.forEach((key) => {
    result = isObject(result) ? result[key] ?? '' : ''
  })
  return result as DeepValueOf<T, K>
}
