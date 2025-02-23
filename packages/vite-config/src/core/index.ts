import path from 'path'
import process from 'process'
import { loadEnv, mergeConfig, type UserConfig, type UserConfigExport } from 'vite'
import { viteLog } from '../logger'
import { useBuild } from './build'
import { useLibPlugins } from './lib-plugins'
import { usePlugins } from './plugins'
import { useDevServer } from './server'

export const viteConfig = (config: UserConfig = {}): UserConfigExport => {
  const mode = config.mode || process.env.NODE_ENV
  const env = loadEnv(mode || '', config.envDir || './')

  viteLog.success('**************************************')
  viteLog.info('--mode =', mode)
  viteLog.info('--envDir =', config.envDir)
  viteLog.success('**************************************')

  const _commonConfig = {
    base: config.base,
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        '@': path.resolve(process.cwd(), './src'),
        '~/': `${path.resolve(process.cwd(), './src')}/`,
      },
    },
    optimizeDeps: {
      include: ['vue', 'vue-router'],
    },
    build: useBuild(),
    plugins: usePlugins(env),
    server: useDevServer(env),
  } as UserConfig
  const _config = mergeConfig(_commonConfig, config)
  return _config as UserConfig
}

/**
 * 库模式
 */
export const viteLibConfig = (config: UserConfig = {}): UserConfigExport => {
  const mode = config.mode || process.env.NODE_ENV

  viteLog.success('**************************************')
  viteLog.info('--mode =', mode)
  viteLog.info('--envDir =', config.envDir)

  viteLog.success('**************************************')

  const _commonConfig = {
    base: config.base,
    resolve: {
      extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
      alias: {
        '@': path.resolve(process.cwd(), './src'),
        '~/': `${path.resolve(process.cwd(), './src')}/`,
      },
    },
    optimizeDeps: {
      include: ['pinia', 'vue', 'vue-router'],
    },
    plugins: useLibPlugins(),
    build: {
      target: 'es2015',
      cssTarget: 'chrome61',
      outDir: 'dist',
      rollupOptions: {
        // // 确保外部化处理那些你不想打包进库的依赖
        external: ['vue', 'vue-router'],
        output: {
          exports: 'named',
          // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  } as UserConfig
  const _config = mergeConfig(_commonConfig, config)
  return _config as UserConfig
}
