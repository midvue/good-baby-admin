//@ts-nocheck

import { log } from 'console'
import { loadEnv, type PluginOption } from 'vite'

export function envRuntimePlugin(): PluginOption {
  const virtualModuleId = 'virtual:env-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId
  const option = {}
  return {
    name: 'vite:env-runtime-plugin',
    enforce: 'pre',
    buildStart() {
      console.log('buildStart')
      const envDev = loadEnv('development', './env')
      const envProd = loadEnv('production', './env')

      option[envDev['VITE_LOCATION_HOST']] = envDev
      option[envProd['VITE_LOCATION_HOST']] = envProd
      log('envPlugin', option)
    },
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export default ${option}`
      }
    },
    transform(code, id, options) {
      if (id.includes('main.ts')) {
        console.log('transform', code, id, options)
        code += `window.importEnv = ${JSON.stringify(option)}`
        console.log(code)
      } else {
        code = code.replace(/import\.meta\.env\.(\w+)/g, ($1, $2, $3) => {
          console.log($1, $2, $3)
          return `window.importEnv[window.location.host][${$2}]`
        })
        if (id.includes('home/index.vue')) {
          console.log(id, code)
        }
      }
      return code
    },
  }
}

export type { PluginOption }
