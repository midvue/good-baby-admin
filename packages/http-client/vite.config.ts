import { fileURLToPath } from 'node:url'
import path from 'path'
import { defineConfig, type ConfigEnv } from 'vite'
import dts from 'vite-plugin-dts'

export default ({ mode }: ConfigEnv) => {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)

  return defineConfig({
    mode,
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        '~/': `${path.resolve(__dirname, './src')}/`,
      },
    },
    plugins: [
      dts({
        outDir: 'dist',
        insertTypesEntry: true,
      }),
    ],
    build: {
      target: 'es2015',
      cssTarget: 'chrome63',
      outDir: 'dist',
      lib: {
        entry: path.resolve(__dirname, './src/index.ts'),
        name: 'map',
        fileName: (format) => `map.${format}.js`,
      },
      rollupOptions: {
        // // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue', 'vant'],
        output: {
          exports: 'named',
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  })
}
