/**
 * 睡眠函数
 * @param timer - 睡眠时间(ms)
 * @example
 * ```ts
 * await sleep(100)
 * ```
 */
export function sleep(timer: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, timer)
  })
}
