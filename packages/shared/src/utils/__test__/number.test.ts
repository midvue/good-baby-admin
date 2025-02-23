import { describe, expect, test } from 'vitest'
import { formatNumber } from '../number'

describe('number.ts', () => {
  test('formatNumber - param is null', () => {
    const num = null
    const expected = ''
    //@ts-ignore
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is NaN', () => {
    const num = '***'
    const expected = '***'
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is number', () => {
    const num = 1000
    const expected = '1,000'
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is number', () => {
    const num = 1234567
    const expected = '1,234,567'
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is string', () => {
    const num = '1000'
    const expected = '1,000'
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is string', () => {
    const num = 1234567
    const expected = '1,234,567'
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is 0', () => {
    const num = 0
    const expected = '0'
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is decimal', () => {
    const num = 1234.5678
    const expected = '1,235'
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })
  test('formatNumber - param is negative', () => {
    const num = -1234.5678
    const expected = '-1,235'
    const formatNum = formatNumber(num)
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is precision eq 2', () => {
    const num = 1234.5678
    const expected = '1,234.57'
    const formatNum = formatNumber(num, { precision: 2 })
    expect(expected).toEqual(formatNum)
  })

  test('formatNumber - param is precision eq 2', () => {
    const num = 1234
    const expected = '1,234.00'
    const formatNum = formatNumber(num, { precision: 2 })
    expect(expected).toEqual(formatNum)
  })
})
