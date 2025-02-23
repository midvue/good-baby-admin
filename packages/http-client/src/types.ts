import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import type { EnumContentType, EnumMethod } from './constants'

export type MethodValueType = (typeof EnumMethod)[keyof typeof EnumMethod] | string

export interface HttpRequestConfig<T = any> extends AxiosRequestConfig<T> {
  /**
   * token，可以是个函数
   */
  token?: string | (() => string)

  /** userId ,可以是函数 */
  userId?: string | (() => string)

  // 是否开启loading
  loading?: boolean
  /**
   * loading配置
   */
  loadingOption?: {
    show: () => void
    hide: () => void
  }

  /**
   * 是否忽略错误提示
   */
  ignoreToast?: boolean | Array<number | string>

  /**
   * 错误提示
   * @param msg - 后台返回错误信息
   */
  showErrorMsg?: (msg: string) => void
  casToken?: boolean
  headers: {
    method: MethodValueType
    'Content-Type': EnumContentType
    'content-type'?: EnumContentType
    'X-menu-id'?: string
    'x-from'?: number | string
    'X-associated-system-code'?: string
    [key: string]: string | number | undefined
  }
  interceptors?: Partial<HttpInterceptor>
}

export type HttpRequestConfigWrap<T = any> = Omit<HttpRequestConfig<T>, 'headers'> & {
  headers?: Partial<HttpRequestConfig['headers']>
}

export interface HttpResponse<T = any> {
  data: T
  code: number
  msg: string
  success: boolean
  headers: HttpRequestConfig['headers']
  config: HttpRequestConfigWrap<T>
  [key: string]: any
}

export interface HttpClient extends AxiosInstance {
  create?: (config: HttpRequestConfig) => any
  get: (url: string, params: any) => Promise<any>
  post: (url: string, params: any) => Promise<any>
}

export type HttpInterceptorRequest = (value: AxiosRequestConfig) => Record<string, any>
export type HttpInterceptorResponse = (value: HttpResponse) => Promise<any> | HttpResponse
export type HttpInterceptorReject = (error: any) => any

export interface HttpInterceptor {
  request: HttpInterceptorRequest | Array<HttpInterceptorRequest>
  response: HttpInterceptorResponse | Array<HttpInterceptorResponse>
  rejectRequest: HttpInterceptorReject | Array<HttpInterceptorReject>
  rejectResponse: HttpInterceptorReject | Array<HttpInterceptorReject>
}

export interface MultiInterceptor {
  request: Array<HttpInterceptorRequest>
  rejectRequest: Array<HttpInterceptorReject>
  rejectResponse: Array<HttpInterceptorReject>
  response: Array<HttpInterceptorResponse>
}
