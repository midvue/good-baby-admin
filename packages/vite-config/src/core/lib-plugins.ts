import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dts from 'vite-plugin-dts'
import { type PluginOption } from 'vite'
/** 库模式 */
export const useLibPlugins = (): PluginOption[] => {
  const plugins = [
    vue(),
    vueJsx(),
    dts({
      exclude: ['node_modules', 'src/**/__test__', 'src/**/__tests__'],
      outDir: 'dist',
      insertTypesEntry: true,
    }),
  ]

  return plugins
}
