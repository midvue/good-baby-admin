import { statSync } from 'fs'
import fs from 'fs/promises'
import path, { dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function addSuffixJs() {
  try {
    const entryDir = path.resolve(__dirname, '../dist/esm')
    const paths = await fs.readdir(entryDir)
    const stack = paths.filter((path) => !path.endsWith('.d.ts'))
    while (stack.length) {
      const top = stack.pop()
      const pat = path.resolve(entryDir, top)
      const stat = await fs.stat(pat)
      if (stat.isDirectory()) {
        const temp = await fs.readdir(pat)
        if (temp) {
          for (const i of temp) {
            if (i.endsWith('.js')) {
              stack.push(path.join(top, i))
            }
          }
        }
      } else {
        let code = await fs.readFile(pat, { encoding: 'utf8' })
        const reg = /(export|import).* from '(\..*)'/g
        code = code.replace(reg, (s1, s2, s3) => {
          let fPath = path.join(pat, '../', s3 + '/index.js')
          try {
            //目录
            const _stat = statSync(fPath)
            if (_stat.isFile()) {
              return s1.replace(s3, `${s3}/index.js`)
            }
          } catch (error) {
            //文件
            fPath = path.join(pat, '../', s3 + '.js')
            const _dStat = statSync(fPath)
            if (_dStat.isFile()) {
              return s1.replace(s3, `${s3}.js`)
            }
          }
          return s1
        })
        await fs.writeFile(pat, code, { encoding: 'utf8' })
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const buildLib = async () => {
  // const esbuild = require('esbuild')
  // await esbuild.build({
  //   entryPoints: [resolve(entryDir, 'index.ts')],
  //   bundle: true,
  //   outfile: 'dist/bundle.js',
  //   platform: 'node',
  //   tsconfig: 'tsconfig.esm.json',
  // })

  await addSuffixJs()
}

buildLib()
