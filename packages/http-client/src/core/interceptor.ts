import { isEmptyObject } from '../utils'
import type { AxiosInstance } from 'axios'
import type { HttpInterceptor, HttpRequestConfig, HttpResponse, MultiInterceptor } from '../types'

export function mergeInterceptor(httpInterceptor?: Partial<HttpInterceptor>) {
  const opt: MultiInterceptor = {
    request: [],
    response: [],
    rejectRequest: [],
    rejectResponse: []
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
        type: 'request'
      }
    }),
    ...opt.response.map((i) => {
      return {
        callback: i,
        type: 'response'
      }
    }),
    ...opt.rejectRequest.map((i) => {
      return {
        callback: i,
        type: 'rejectRequest'
      }
    }),
    ...opt.rejectResponse.map((i) => {
      return {
        callback: i,
        type: 'rejectResponse'
      }
    })
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

export function commonResponseErrorMsg(res: HttpResponse) {
  const msg = res.data?.message || res.msg
  let errorMsg = ''
  switch (res.status) {
    case 401:
      errorMsg = '401:' + msg
      break
    case 403:
      errorMsg = msg
      break
    case 404:
      errorMsg = '404: ' + msg
      break
    case 422:
      errorMsg = '请求参数错误' + msg
      break
    case 426:
      errorMsg = '426: ' + msg
      break
    case 428:
      errorMsg = '428: ' + msg
      break
    case 500: {
      errorMsg = '服务器错误: ' + msg
      break
    }
    default:
      errorMsg = '未知的情况'
      break
  }
  return errorMsg
}
