import { EnumContentType, EnumMethod } from '../constants'
import { commonResponseErrorMsg } from './interceptor'
import type { HttpRequestConfig, HttpResponse } from '../types'

export const defaultInterceptors = () => {
  return {
    response: (res: HttpResponse) => {
      const { showErrorMsg, ignoreToast } = res.config
      if (res.status === 200) {
        if (res.data.code === 0) {
          return Promise.resolve(res.data.data)
        } else {
          //忽略错误,或者在忽略列表中,就不显示错误信息
          if (
            (Array.isArray(ignoreToast) && !ignoreToast.includes(res.data.code)) ||
            !ignoreToast
          ) {
            // -1 没有msg,特殊处理
            const msg = res.data.msg || '接口错误'
            showErrorMsg?.(msg)
          }
          return Promise.reject(res)
        }
      }

      const errorTips = commonResponseErrorMsg(res)
      showErrorMsg?.(errorTips)
      return Promise.reject(res)
    },
  }
}

/** 默认的配置 */
export const defaultConfig: HttpRequestConfig = {
  baseURL: '',
  headers: {
    appkey: '',
    method: EnumMethod.POST,
    'Content-Type': EnumContentType.JSON,
  },
  timeout: 10000,
  loading: false,
  casToken: true,
  method: 'POST',
  interceptors: defaultInterceptors(),
}

export function getToken(): string | null {
  if (!window?.sessionStorage) return null
  return sessionStorage.getItem('ks_token')
}
