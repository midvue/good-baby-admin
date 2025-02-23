import { isString } from './is'

export const MASK = 'Mask'
export const MASK_SEC = 'MaskSec'
export const VIRTUAL = 'Virtual'
/**
 * 字段是否是加密状态
 * @example
 * ```ts
 * if(isEncrypt({key:'测试',keyMask:'2222'},'key')){
 *  console.log('该字段是否是加密(敏感\监控\虚拟)')}
 * ```
 */
export function isEncrypt<T = Record<string, any>>(data = {} as T, fieldName: keyof T) {
  return (
    isMaskEncrypt(data, fieldName) ||
    isMaskSecEncrypt(data, fieldName) ||
    isVirtualEncrypt(data, fieldName)
  )
}

/**
 * 字段是否已解密状态
 * @example
 * ```ts
 * if(isDecrypt({key:'测试',keyMask:'2222'},'key')){
 *  console.log('该字段是否是解密(敏感\监控\虚拟)')}
 * ```
 */
export function isDecrypt<T = Record<string, any>>(data = {} as T, fieldName: keyof T) {
  return !isEncrypt(data, fieldName)
}

/**
 * 字段是否是监控
 * @example
 * ```ts
 * if(isMaskEncrypt({key:'测试',keyMask:'2222'},'key')){
 *  console.log('改字段是监控')}
 * ```
 */
export function isMaskEncrypt<T = Record<string, any>>(data = {} as T, fieldName: keyof T) {
  const key = ((fieldName as string) + MASK) as string
  return Object.prototype.hasOwnProperty.call(data, key) && !!data[key as keyof T]
}
/**
 * 字段是否是敏感
 * @example
 * ```ts
 * if(isMaskSecEncrypt({key:'测试',keyMaskSec:'2222'},'key')){
 *  console.log('改字段是敏感')}
 * ```
 */
export function isMaskSecEncrypt<T = Record<string, any>>(data = {} as T, fieldName: keyof T) {
  const key = ((fieldName as string) + MASK_SEC) as string
  return Object.prototype.hasOwnProperty.call(data, key) && !!data[key as keyof T]
}
/**
 * 字段是否是虚拟号
 * @example
 * ```ts
 * if(isVirtualEncrypt({key:'测试',keyVirtual:'2222'},'key')){
 *  console.log('改字段是虚拟号')}
 * ```
 */
export function isVirtualEncrypt<T = Record<string, any>>(data = {} as T, fieldName: keyof T) {
  const key = ((fieldName as string) + VIRTUAL) as string
  return Object.prototype.hasOwnProperty.call(data, key) && !!data[key as keyof T]
}

/**
 * 从source对象中获取字段集合fields参数及其对应的加密参数
 * @param  source - 获取原始字段和加密字段的数据来源
 * @param  fields - 需要获取加密参数的字段集合
 * @param ignoreEmpty -是否过滤掉空的值
 * @returns -带加密参数的对象
 */
export function pickEncrypt<T = Record<string, any>>(
  source = {} as T,
  fields: Array<keyof T> | keyof T,
  ignoreEmpty = false,
) {
  const params = isString(fields) ? [fields] : (fields as Array<keyof T>)
  const result = {} as T
  for (const key of params) {
    // 当设置了ignoreEmpty为true时，且字段为空，则不返回
    if (ignoreEmpty && !source[key]) {
      continue
    }
    result[key] = source[key]
    if (isMaskEncrypt(source, key)) {
      const mask = `${String(key)}${MASK}` as keyof T
      result[mask] = source[mask]
    }
    if (isMaskSecEncrypt(source, key)) {
      const maskSec = `${String(key)}${MASK_SEC}` as keyof T
      result[maskSec] = source[maskSec]
    }
    if (isVirtualEncrypt(source, key)) {
      const virtual = `${String(key)}${VIRTUAL}` as keyof T
      result[virtual] = source[virtual]
    }
  }
  return result
}
