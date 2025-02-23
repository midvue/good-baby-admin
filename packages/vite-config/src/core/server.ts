import process from 'node:process'
import type { ProxyOptions, ServerOptions } from 'vite'

export const useDevServer = (env: Record<string, string>) => {
  const isProd = process.env.NODE_ENV === 'production'
  if (isProd) return undefined
  const option: ServerOptions = {
    host: '0.0.0.0',
    port: env.VITE_PORT ? Number(env.VITE_PORT) : 3000,
    proxy: {} as Record<string, string | ProxyOptions>,
  }

  const proxyConf = env.VITE_PROXY ? JSON.parse(env.VITE_PROXY as string) : {}

  Object.keys(proxyConf).forEach((key) => {
    const reg = new RegExp('^\\' + key)
    const proxy = {
      target: proxyConf[key].target,
      changeOrigin: true,
      ws: true,
      rewrite: (path: string) => {
        const _path = path.replace(reg, proxyConf[key].rewrite)
        return _path
      },
    } as ProxyOptions

    if (option && option.proxy) {
      option.proxy[key] = proxy
    }
  })

  return option
}
