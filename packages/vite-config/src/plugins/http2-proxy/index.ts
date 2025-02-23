import proxy from 'http2-proxy'
import { createLogger, type Plugin, type ProxyOptions } from 'vite'

// export const https = {
//   key: fs.readFileSync(path.resolve(__dirname, './cert/local.key')),
//   cert: fs.readFileSync(path.resolve(__dirname, './cert/local.pem')),
//   maxSessionMemory: 1000, // 默认10M
//   peerMaxConcurrentStreams: 300, // 设置远程对等点的最大并发流数
// }

export const http2ProxyPlugin = (): Plugin => {
  let routes: Record<string, string | ProxyOptions>
  return {
    name: 'vite:http2-proxy-plugin',
    config: (config) => {
      const { server } = config
      routes = server?.proxy ?? {}
      if (server) {
        server.proxy = undefined
      }
      return config
    },
    configureServer: ({ config: { logger }, middlewares }) => {
      Object.entries(routes).forEach(([route, value]) => {
        if (!value) {
          createLogger().error("proxy don't have target api")
        }
        let url = value as string
        if (value instanceof Object && !Array.isArray(value)) {
          url = value.target as string
        }
        const { protocol, hostname, port } = new URL(url)
        const options = {
          protocol: protocol as 'http' | 'https',
          hostname,
          port: Number(port),
        }

        middlewares.use(route, (req, res) => {
          proxy.web(req, res, { ...options, path: req.originalUrl }, (err: Error) => {
            if (err) {
              logger.error(`[http2-proxy] Error when proxying request on '${req.originalUrl}'`, {
                timestamp: true,
                error: err,
              })
            }
          })
        })
      })
    },
  }
}
