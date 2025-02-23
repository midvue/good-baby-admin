import axios from 'axios'
import { createWXAdapter } from '../adapter/taro'
import { defaultConfig } from './config'
import { handleInterceptor } from './interceptor'
import { parseRequest } from './request'
import type { HttpClient, HttpRequestConfig, HttpRequestConfigWrap } from '../types'

class Http {
  private static _instance: Http | null = null
  private _client: HttpClient | null = null
  defaultReqConfig: HttpRequestConfig

  constructor(reqConfig: HttpRequestConfig) {
    this.defaultReqConfig = reqConfig
    this.createHttp()
  }

  public static get instance(): Http {
    return Http._instance!
  }

  /** 初始化配置 */
  public static init(config?: HttpRequestConfigWrap) {
    if (!Http._instance) {
      const _config = Object.assign({}, defaultConfig, config)
      Http._instance = new Http(_config)
    }
    return Http._instance
  }

  public createHttp() {
    const _request = axios.create(defaultConfig)
    handleInterceptor(_request, this.defaultReqConfig)
    this._client = _request
  }

  /** 设置baseUrl */
  setBaseURL(baseURL: string) {
    this.defaultReqConfig.baseURL = baseURL
  }

  setAdapter(option: Record<string, any>) {
    //@ts-ignore
    const _wx = typeof wx === 'object' ? wx : ''
    if (_wx) {
      option.adapter = createWXAdapter
    }
  }

  public get client(): HttpClient {
    return this._client!
  }
  /** 通用请求 */
  request<T = any>(reqConfig: HttpRequestConfigWrap) {
    const config = Object.assign({}, this.defaultReqConfig, reqConfig)
    const option = parseRequest(config) as Record<string, any>
    this.setAdapter(option)
    option.baseURL = ''
    return this.client.request<any, T>(option)
  }

  /** get请求 */
  public static get<T = any>(reqConfig: HttpRequestConfigWrap) {
    return Http.init().request<T>({ method: 'get', ...reqConfig })
  }

  /** post请求 */
  public static post<T = any>(reqConfig: HttpRequestConfigWrap) {
    return Http.init().request<T>({ method: 'post', ...reqConfig })
  }

  /** put 请求 */
  public static put<T = any>(reqConfig: HttpRequestConfigWrap) {
    return Http.init().request<T>({ method: 'put', ...reqConfig })
  }

  /** delete 请求 */
  public static delete<T = any>(reqConfig: HttpRequestConfigWrap) {
    return Http.init().request<T>({ method: 'delete', ...reqConfig })
  }
}

export default Http
