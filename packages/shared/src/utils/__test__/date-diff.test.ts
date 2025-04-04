import { describe, expect, test } from 'vitest'
import { dateDiffFormat } from '../date'

describe('date.ts', () => {
  test('dateDiffFormat - YY年MM个月DD天', () => {
    const start = '2024-12-18'
    const _date = dateDiffFormat(start, 1743762046095)
    expect(_date).toEqual('0年3个月17天')
  })

  test('dateFormat - param is Date', () => {
    const start = '2024-12-18'
    const _date = dateDiffFormat(start, 1743762046095, 'MM个月DD天')

    expect(_date).toEqual('3个月17天')
  })

  test('dateFormat - param is Date', () => {
    const start = '2023-12-18'
    const _date = dateDiffFormat(start, '2026-12-18', 'MM个月DD天')
    expect(_date).toEqual('36个月0天')
  })
})
