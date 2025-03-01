import { EnumContentType, EnumMethod } from '../constants'
import { commonResponseErrorMsg } from './interceptor'
import type { HttpRequestConfig, HttpResponse } from '../types'

export const defaultInterceptors = () => {
  return {
    response: (res: HttpResponse) => {
      return new Promise((resolve, reject) => {
        const { showErrorMsg, ignoreToast } = res.config
        if (res.status === 200) {
          if (res.data.code === 0) {
            return resolve(res.data.data)
          }
          //code!==0
          //忽略错误,或者在忽略列表中,就不显示错误信息
          if (
            (Array.isArray(ignoreToast) && !ignoreToast.includes(res.data.code)) ||
            !ignoreToast
          ) {
            const msg = res.data.msg || res.message || '接口错误'
            showErrorMsg?.(msg)
          }
          return reject(res)
        }

        const errorTips = commonResponseErrorMsg(res)

        showErrorMsg?.(errorTips)
        return Promise.reject(res)
      })
    },
    rejectResponse: (res: any) => {
      const { showErrorMsg, ignoreToast } = res.config
      if ((Array.isArray(ignoreToast) && !ignoreToast.includes(res.data.code)) || !ignoreToast) {
        const msg = res.response?.data?.message || res.message || '接口错误'
        showErrorMsg?.(msg)
      }
      return Promise.reject(res.response)
    },
  }
}

/** 默认的配置 */
export const defaultConfig: HttpRequestConfig = {
  baseURL: '',
  headers: {
    method: EnumMethod.POST,
    'Content-Type': EnumContentType.JSON,
  },
  timeout: 10000,
  loading: false,
  method: 'POST',
  interceptors: defaultInterceptors(),
}
