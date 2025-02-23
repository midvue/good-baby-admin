/**
 * 中划线转小驼峰
 * @param str - 字符串
 * @returns 驼峰字符串
 * @example
 * ```ts
 * let result=camelize('user-info')
 * ```
 */
export const camelize = (str: string): string => str.replace(/-(\w)/g, (_, c) => c.toUpperCase())

/**
 * 驼峰转中划线
 * @param str - 字符串
 * @returns 中划线字符串
 * @example
 * ```ts
 * let result=kebabCase('userInfo')
 * ```
 */
export const kebabCase = (str: string) =>
  str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')

/**
 * 驼峰转下划线
 * @param str - 字符串
 * @returns 下划线字符串
 * @example
 * ```ts
 * let result=snakeCase('userInfo')
 * ```
 */
export const snakeCase = (str: string) => str.replace(/([A-Z])/g, '_$1').toLowerCase()
