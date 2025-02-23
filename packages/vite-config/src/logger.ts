import colors from 'picocolors'

const viteLog = {
  /**
   * 基本日志
   */
  info(...arg: any[]) {
    const [tag, ...rest] = arg || []
    console.log(colors.green('[vite-config]'), colors.blue(tag), ...rest)
  },

  /**
   * 成功日志
   */
  success(...arg: any[]) {
    const [tag, ...rest] = arg || []
    console.log(colors.green('[vite-config]'), colors.green(tag), ...rest)
  },

  /**
   * 警告日志
   */
  warn(...arg: any[]) {
    const [tag, ...rest] = arg || []
    console.log(colors.green('[vite-config]'), colors.yellow(tag), ...rest)
  },

  /**
   * 错误日志
   */
  error(...arg: any[]) {
    const [tag, ...rest] = arg || []
    console.log(colors.green('[vite-config]'), colors.yellow(tag), ...rest)
  },
}

export { viteLog }

export default viteLog
