import { commonResponseErrorMsg } from '../core/interceptor'
import type { HttpRequestConfig } from '../types'

export function createWXAdapter(config: HttpRequestConfig): any {
  return new Promise(function (resolve, reject) {
    config.headers['appkey'] = String(config.headers.appkey || '')
    const header = { ...config.headers }
    // @ts-ignore
    ;(wx as Wx).request({
      method: config.method,
      url: config.url!,
      data: config.data,
      header,
      enableHttp2: true,
      success(res: Record<string, any>) {
        const responseData = res.data
        const response = {
          data: responseData,
          status: res.statusCode,
          statusText: 'OK',
          headers: header,
          config: config,
          request: config,
        }
        resolve(response)
      },
      fail(error: any) {
        const msg = commonResponseErrorMsg(error)
        !config.ignoreToast && config.showErrorMsg?.(msg)
        error._config = config

        reject(error)
      },
    })
  })
}
