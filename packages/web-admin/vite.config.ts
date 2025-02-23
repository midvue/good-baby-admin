import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { viteConfig, envRuntimePlugin } from '@mid-vue/vite-config'
import type { ConfigEnv } from 'vite'

export default ({ mode }: ConfigEnv) => {
  const env = loadEnv(mode, './env')
  console.log(env.VITE_BASE_API)
  const config = viteConfig({
    mode,
    envDir: './env',
    plugins: [
      envRuntimePlugin(),
      createStyleImportPlugin({
        libs: [
          // {
          //   libraryName: 'vant',
          //   esModule: true,
          //   resolveStyle: (name) => {
          //     console.log(name)
          //     const whites = [
          //       'show-success-toast',
          //       'show-loading-toast',
          //       'show-fail-toast',
          //       'show-toast',
          //       'show-confirm-dialog',
          //       'close-toast',
          //       'show-dialog',
          //       'show-notify',
          //       'show-image-preview',
          //       'toast',
          //       'dialog',
          //       'notify',
          //       'image-preview'
          //     ]
          //     if (whites.includes(name)) return ''
          //     const style = path.resolve(
          //       process.cwd(),
          //       'node_modules/',
          //       `vant/es/${name}/style/index.mjs`
          //     )
          //     return style
          //   }
          // }
        ]
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')]
      })
    ],
    server: {
      port: +env.VITE_PORT,
      proxy: {
        '/api': {
          target: env.VITE_BASE_API,
          changeOrigin: true,
          ws: true
        }
      }
    }
  })
  return defineConfig(config)
}
