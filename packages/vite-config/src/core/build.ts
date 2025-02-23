import process from 'node:process'
import { resolve } from 'path'
import type { BuildOptions } from 'vite'

export const useBuild = () => {
  const option: BuildOptions = {
    cssTarget: 'chrome61',
    chunkSizeWarningLimit: 2000,
    emptyOutDir: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(process.cwd(), 'index.html'),
      },
      output: {
        manualChunks: (filePath) => {
          if (
            filePath.includes('node_modules/@vue') ||
            filePath.includes('node_modules/vue-router') ||
            filePath.includes('node_modules/pinia')
          ) {
            // vue全家桶放到一个包
            return 'vue-family'
          }
          if (filePath.includes('node_modules/vant') || filePath.includes('node_modules/@vant')) {
            return 'vant'
          }
          if (
            filePath.includes('node_modules/element-plus') ||
            filePath.includes('node_modules/@element-plus')
          ) {
            return 'element-plus'
          }
          if (
            filePath.includes('node_modules/chart') ||
            filePath.includes('node_modules/vue-chartjs') ||
            filePath.includes('node_modules/echarts')
          ) {
            return 'chart-js'
          }
        },
      },
    },
  }

  return option
}
