import { isEmptyObject } from '../utils'
import type { AxiosInstance } from 'axios'
import type { HttpInterceptor, HttpRequestConfig, MultiInterceptor } from '../types'

export function mergeInterceptor(httpInterceptor?: Partial<HttpInterceptor>) {
  const opt: MultiInterceptor = {
    request: [],
    response: [],
    rejectRequest: [],
    rejectResponse: [],
  }

  // 重试
  if (httpInterceptor && !isEmptyObject(httpInterceptor)) {
    for (const keyName in opt) {
      const optInterceptor = opt[keyName as keyof typeof opt]
      const interceptor = httpInterceptor[keyName as keyof typeof httpInterceptor] || []
      // @ts-ignore
      opt[keyName] = optInterceptor.concat(interceptor)
    }
  }

  const interceptorList = [
    ...opt.request.map((i) => {
      return {
        callback: i,
        type: 'request',
      }
    }),
    ...opt.response.map((i) => {
      return {
        callback: i,
        type: 'response',
      }
    }),
    ...opt.rejectRequest.map((i) => {
      return {
        callback: i,
        type: 'rejectRequest',
      }
    }),
    ...opt.rejectResponse.map((i) => {
      return {
        callback: i,
        type: 'rejectResponse',
      }
    }),
  ].filter(Boolean)
  return interceptorList
}

/**
 * 处理拦截器
 */
export function handleInterceptor(request: AxiosInstance, reqConfig: HttpRequestConfig) {
  // 拦截器配置
  const interceptorList = mergeInterceptor(reqConfig.interceptors)
  interceptorList.forEach((interceptor) => {
    const { type, callback } = interceptor
    type === 'request' && request.interceptors?.request?.use(callback as any)
    type === 'response' && request.interceptors?.response?.use(callback as any)
    type === 'rejectRequest' && request.interceptors?.request?.use(undefined, callback)
    type === 'rejectResponse' && request.interceptors?.response?.use(undefined, callback)
  })
}

const getErrorsTips = {
  'Network Error': '网络错误，请检查网络',
  'timeout of 20000ms exceeded': '请求超时，服务器未响应',
  'Request failed with status code 500': '请求服务器错误',
  'Internal Server Error': '请求服务器错误',
  'Request failed with status code 502': '请求服务器错误',
  api: '接口错误',
} as Record<string, string>

export function commonResponseErrorMsg(res: { message?: string; msg?: string; errMsg?: string }) {
  const msg = res.message || res.msg || res.errMsg || ''
  return getErrorsTips[msg] || msg || getErrorsTips.api
}
