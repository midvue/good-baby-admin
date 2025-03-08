import md5 from 'js-md5'
import { EnumContentType } from '../constants'
import { isFunction } from '../utils'
import type { HttpRequestConfig } from '../types'

/**
 * 创建请求头
 */
export function parseHeaders(config: HttpRequestConfig) {
  const { url, data } = config

  const token = isFunction(config.token) ? config.token() || '' : config.token || ''

  const _getSign = () => {
    return md5(md5(token).toUpperCase() + JSON.stringify(data || {})).toUpperCase()
  }
  const _headers = {
    ...config.headers,
    method: url,
    sign: _getSign()
  } as Record<string, any>
  if (token) {
    _headers.Authorization = 'Bearer ' + token
  }
  return _headers
}

/**
 * 创建请求体
 */
export function parseBody(config: HttpRequestConfig) {
  const { data = {} } = config
  const contentType = config.headers?.['Content-Type'] || config.headers?.['content-type']
  const option = { data: {} }
  switch (contentType) {
    case EnumContentType.URL_ENCODED: {
      const params = new window.URLSearchParams()
      for (const [key, val] of Object.entries(data)) {
        params.append(key, val as string)
      }
      option['data'] = params
      //data = qs.stringify(param, { arrayFormat: 'brackets' })
      break
    }
    case EnumContentType.FORM: {
      const formData = new FormData()
      for (const [key, val] of Object.entries(data)) {
        formData.append(key, val as string)
      }
      option['data'] = formData
      break
    }
    default:
      option['data'] = data
      break
  }
  return option
}

/**
 * 处理转换请求
 */
export function parseRequest(config: HttpRequestConfig) {
  //处理请求体
  const body = parseBody(config)
  //处理请求头
  const headers = parseHeaders(config)
  //处理请求行
  //const url = parseUrl(config.url!)
  return {
    ...config,
    headers,
    ...body
  }
}
