import process from 'node:process'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import legacy from '@vitejs/plugin-legacy'
import { visualizer } from 'rollup-plugin-visualizer'
import viteCompression from 'vite-plugin-compression'
import viteLog from '../logger'
import type { Plugin, PluginOption } from 'vite'

export const usePlugins = (env: Record<string, string>): PluginOption[] => {
  const isProd = process.env.NODE_ENV === 'production'
  const plugins = [
    vue(),
    vueJsx(),
    legacy({
      targets: ['defaults', 'not IE 11', 'Chrome 63', 'iOS >= 12', 'android >= 6'],
      polyfills: [
        'es.symbol',
        'es.array.flat',
        'web.dom-collections.for-each',
        'es.promise.finally',
        'es.string.replace-all',
      ],
      modernPolyfills: [
        'es.promise.finally',
        'es.global-this',
        'es.string.match-all',
        'es.string.replace-all',
      ],
    }),
  ]

  //包分析的时候，才使用这个包
  if (env.VITE_PLUGIN_ANALYZER === 'true') {
    viteLog.warn('打包分析', '-已开启')
    plugins.push(
      visualizer({
        emitFile: false,
        filename: 'stats.html', //分析图生成的文件名
        open: true, //如果存在本地服务端口，将在打包后自动展示
      }) as Plugin,
    )
  }

  if (isProd && Boolean(env.VITE_PLUGIN_COMPRESSION === 'true')) {
    viteLog.warn('代码压缩', '-已开启')
    // compression 压缩
    plugins.push(
      viteCompression({
        threshold: 1024,
      }),
    )
  }
  return plugins
}
