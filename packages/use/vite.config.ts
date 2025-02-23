import { type ConfigEnv, defineConfig } from 'vite'
import { viteLibConfig } from '@mid-vue/vite-config'

export default ({ mode }: ConfigEnv) => {
  const config = viteLibConfig({
    mode,
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'use',
        fileName: (format) => `use.${format}.js`,
      },
    },
  })
  return defineConfig(config)
}
