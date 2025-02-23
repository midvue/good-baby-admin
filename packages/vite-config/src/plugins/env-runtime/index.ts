import { loadEnv, type ConfigEnv, type PluginOption } from 'vite'

import type { ViteEnvRuntimeOptions } from './types'

const defaultEnvList = [
  'import.meta.env.MODE',
  'import.meta.env.BASE_URL',
  'import.meta.env.PROD',
  'import.meta.env.DEV',
  'import.meta.env.SSR',
]

/**
 * 默认vite的环境规则解析
 */
export const viteRuleResolve = () => {
  if (['feiyanyun.com'].includes(window.location.host)) {
    return 'production'
  }

  return 'development'
}

/**
 * env生成环境运行时
 * @param options - 配置
 */
export function envRuntimePlugin(options?: ViteEnvRuntimeOptions): PluginOption {
  const virtualModuleId = '\0virtual:env-runtime-plugin'

  let { excludes = [], ruleResolve = viteRuleResolve } = options || {}
  excludes = [...defaultEnvList, ...excludes]

  const envMap = {} as Record<string, Record<string, string>>
  let configEnv = {} as ConfigEnv
  return {
    name: 'vite:env-runtime-plugin',
    enforce: 'pre',
    config(config, ConfigEnv) {
      configEnv = ConfigEnv
      return config
    },
    buildStart() {
      const envDev = loadEnv('development', './env')
      const envProd = loadEnv('production', './env')

      envMap['development'] = envDev
      envMap['production'] = envProd
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return id
      }
    },
    load(id) {
      if (id === virtualModuleId) {
        return `
        let resolveRule = ${ruleResolve}\nlet runtimeMap = ${JSON.stringify(envMap)};\n
        let mode = ${configEnv.command === 'serve' ? JSON.stringify(configEnv.mode) : 'resolveRule()'}
        export default runtimeMap[mode]`
      }
    },
    transform(code) {
      let isMatch = false
      code = code.replace(/import\.meta\.env\.(\w+)/g, (_, $2) => {
        if (excludes.includes(`import.meta.env.${$2}`)) {
          return `import.meta.env.${$2}`
        }
        isMatch = true
        return `viteImportEnvMap['${$2}']`
      })
      if (isMatch) {
        const newImport = `import viteImportEnvMap from "${virtualModuleId}";`
        // 检查是否已有该import
        if (code.includes(newImport)) {
          return code
        }
        // 正则表达式匹配所有import语句
        const lastImportRegex = /^import\s.+from\s['"].*['"];?$/m
        const matches = code.match(lastImportRegex)
        // 替换或追加新的import语句
        if (matches && matches.length > 0) {
          const lastImport = matches[matches.length - 1]
          code = code.replace(lastImport, `${lastImport}\n${newImport}`)
        }
        // 如果文件末尾没有其他import语句，则追加到文件顶部
        if (!code.includes(newImport)) {
          code = `${newImport}\n` + code
        }
      }
      return code
    },
  }
}

export type { PluginOption }
