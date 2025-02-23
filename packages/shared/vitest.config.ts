import { cpus } from 'os'
import { defineConfig, mergeConfig, type UserConfig } from 'vitest/config'
import { viteConfig } from '@mid-vue/vite-config'

const cpuNum = Math.max(cpus().length - 1, 1)

export default mergeConfig(
  viteConfig() as UserConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      coverage: {
        provider: 'istanbul',
        include: ['src/**/*.[jt]s?(x)'],
        exclude: [
          '**/example/**',
          '**/__tests__/**',
          'docs/**',
          'coverage/**',
          'types/**',
          'shims/**',
        ],
      },
      poolOptions: {
        vmThreads: {
          memoryLimit: Math.min(1 / (cpuNum * 2), 0.1),
        },
      },
      restoreMocks: true,
    },
  })
)
