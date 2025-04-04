import { createReadStream, createWriteStream } from 'fs'
import { createRequire } from 'module'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import fse from 'fs-extra'
// 引入 vite 的 build 方法，进行编译构建
import { build } from 'vite'
import { viteLibConfig } from '@mid-vue/vite-config'

const { outputFile } = fse

const require = createRequire(import.meta.url)

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 输出目录
const outputDir = resolve(__dirname, '../dist')

const {
  version,
  peerDependencies,
  name,
  description,
  publishConfig,
  dependencies,
  type,
} = require('../package.json')
// 生成 package.json
const createPackageJson = () => {
  const pkgName = name
  const pkgUMD = './shared.umd.js'
  const pkgESM = './shared.es.js'

  const fileStr = `{
    "name": "${pkgName}",
    "version": "${version}",
    "description": "${description}",
    "main": "${pkgUMD}",
    "module":"${pkgESM}",
    "types": "index.d.ts",
    "exports": {
      ".": {
        "import": "${pkgESM}",
        "require": "${pkgUMD}"
      }
    },
    "keywords": ["lodash", "dayjs", "big.js","${name || ''}"],
    "license": "MIT",
    "author": "Spig",
    "publishConfig":${JSON.stringify(publishConfig)},
    "dependencies":${JSON.stringify(dependencies)},
    "peerDependencies":  ${peerDependencies ? JSON.stringify(peerDependencies) : '{}'}
  }
  `
  // 单个组件 or 全量
  const filePath = resolve(outputDir, 'package.json')
  outputFile(filePath, fileStr, 'utf-8')
}

/** 全量构建 */
const buildAll = async () => {
  const config = viteLibConfig({
    mode: 'production',
    build: {
      target: 'es2015',
      lib: {
        entry: './src/index.ts',
        name: 'shared',
        fileName: (format) => `shared.${format}.js`,
      },
    },
  })
  await build(config)

  createPackageJson()
}

// copy文件
// README.md
// 样式 index.css
const copyFiles = () => {
  const markdown = createReadStream(resolve(__dirname, '../README.md'))
  markdown.pipe(createWriteStream(resolve(__dirname, '../dist/README.md')))
}

const buildLib = async () => {
  await buildAll()
  copyFiles()
}

buildLib()
