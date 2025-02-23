import { type ConfigEnv, defineConfig } from 'vite'
import { viteLibConfig } from '@mid-vue/vite-config'

export default ({ mode }: ConfigEnv) => {
  const config = viteLibConfig({
    mode,
    build: {
      lib: {
        entry: './src/index.ts',
        name: 'shared',
        fileName: (format) => `shared.${format}.js`,
      },
    },
  })
  return defineConfig(config)
}
