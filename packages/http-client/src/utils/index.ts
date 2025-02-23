const toString = Object.prototype.toString

export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`
}

export function isObject(val: any): val is Record<any, any> {
  return val !== null && is(val, 'Object')
}

export function isFunction(val: unknown): val is Function {
  return typeof val === 'function'
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
 * 随机数
 * @param count  - 位数
 */
export const random = (count: number) => {
  const num = Date.now() + Math.floor(1000 * Math.random() + 1000)
  if (count) {
    return num.toString().substr(-count)
  }
  return num.toString()
}

export const isKuaShengClient = navigator.userAgent.toLowerCase().indexOf('kuasheng-2.0') >= 0
