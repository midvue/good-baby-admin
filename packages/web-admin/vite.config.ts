import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import ElementPlus from 'unplugin-element-plus/vite'
import AutoImport from 'unplugin-auto-import/vite'
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

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')]
      }),
      ElementPlus({
        useSource: true
      }),
      AutoImport({
        include: [/\.vue$/, /\.[tj]sx$/, /\.[tj]s$/],
        imports: [
          {
            '@/lib/msgBox': [['EmMessageBox', '$EmMsgBox']],
            'element-plus': [['ElMessage', '$EmMsg']]
          }
        ],
        dts: 'types/auto-import.d.ts',
        eslintrc: {
          enabled: true
        }
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
