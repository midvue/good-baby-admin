import { EnumMethod } from './constants'
import Http from './core'
import type { HttpRequestConfigWrap } from './types'

export * from './core'
export * from './types'

/**
 * 发送请求
 * 默认post
 */
export const useHttp = <T = any>(config: HttpRequestConfigWrap) => {
  config.method = config.method || EnumMethod.POST
  return Http.init().request<T>(config)
}

export { Http }
export default Http
