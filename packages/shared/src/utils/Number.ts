import Big from 'big.js'
import { isNullOrUnDef } from './is'
import type { RoundingMode } from 'big.js'

type BigSource = number | string | Big

/**
 * 返回一个实例化的Big对象
 * @param n  - 待处理的数字/字符串数字
 * @example
 * ```ts
 * const value = useNumber('1')
 * ```
 */
export function useNumber(n: BigSource): Big {
  return new Big(n)
}

/**
 * 4舍5入(精度兼容)
 * @param  dp - 保留位数
 * @param  rm - 0: 向下取整 1: 四舍五入 2: 向上取整
 * @example
 * ```ts
 * const value = round(5.23,1, 1)
 * ```
 */
export function round(m: BigSource, dp: number, rm: RoundingMode = 1) {
  return new Big(m).round(dp, rm).toNumber()
}

export interface FormatOptions {
  /**
   * 保留小数位数
   */
  precision?: number
  /**
   * 千位分隔符
   */
  thousandSeparator?: string

  /**
   * 分割的位数(3位代表千分位分割)
   */
  bit?: number
  /**
   *  0: 向下取整 1: 四舍五入, 2: roundHalfEven, 3: 向上取整
   */
  roundMode?: RoundingMode
}

/**
 * 格式化数字, 默认千位分隔符为","
 * @param thousandSeparator -分隔符
 * @param precision -保留小数位数
 * @param bit -分割的位数(3位代表千分位分割)
 * @param roundMode - 0: 向下取整 1: 四舍五入, 2: roundHalfEven, 3: 向上取整
 * @example
 * ```ts
 *  formatNumber(1000)  //输出 "1,000"
 *  formatNumber(1234567)  //输出 "1,234,567"
 *  formatNumber(1234.5678, { precision: 2, thousandSeparator: "-" }) // 输出: "1-234.5678"
 *  formatNumber(1234.5678, { precision: 2, thousandSeparator: "-" roundMode: 3 }) // 输出: "1-234.5678"
 * ```
 */
export function formatNumber(val: number | string, options: FormatOptions = {}): string {
  const { bit = 3, precision = 0, thousandSeparator = ',', roundMode = 1 } = options
  if (isNullOrUnDef(val)) return ''
  if (isNaN(+val)) return val + ''
  let value = useNumber(val).toFixed(precision, roundMode)
  const arr = value.split('.')
  value = arr[0]
  const reg = new RegExp(`(\\d)(?=(\\d{${bit}})+$)`, 'g')
  value = value.replace(reg, `$1${thousandSeparator}`)
  const decimal = arr.length > 1 ? `.${arr?.[1]}` : ''
  return value + decimal
}
