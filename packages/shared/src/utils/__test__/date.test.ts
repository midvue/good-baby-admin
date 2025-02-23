import { describe, expect, test } from 'vitest'
import { dateFormat, minute } from '../date'

describe('date.ts', () => {
  test('dateFormat - param is Date', () => {
    const dateStr = new Date(2024, 2, 1)
    const date = '2024-03-01 00:00:00'
    const _date = dateFormat(dateStr)
    expect(_date).toEqual(date)
  })

  test('dateFormat - param is string ISO 8601', () => {
    const dateStr = '2024-03-01T16:00:00.000Z'
    const date = '2024-03-02 00:00:00'
    const _date = dateFormat(dateStr)
    expect(_date).toEqual(date)
  })

  test('dateFormat - param is string timestamp', () => {
    const dateStr = '1709286300000'
    const date = '2024-03-01 17:45:00'
    const _date = dateFormat(dateStr)
    expect(_date).toEqual(date)
  })

  test('dateFormat - param is number timestamp', () => {
    const dateNum = 1709286300000
    const date = '2024-03-01 17:45:00'
    const _date = dateFormat(dateNum)
    expect(_date).toEqual(date)
  })

  test('minute - param is null ', () => {
    const dateStr = ''
    const date = null
    const _date = minute(date)
    expect(_date).toEqual(dateStr)
  })

  test('minute - param is empty string ', () => {
    const dateStr = ''
    const date = ''
    const _date = minute(date)
    expect(_date).toEqual(dateStr)
  })

  test('minute - param is string ISO 8601', () => {
    const dateStr = '2024-03-01T16:00:00.000Z'
    const date = '2024-03-02 00:00'
    const _date = minute(dateStr)
    expect(_date).toEqual(date)
  })

  test('minute - param is string timestamp', () => {
    const dateStr = '1709286300000'
    const date = '2024-03-01 17:45'
    const _date = minute(dateStr)
    expect(_date).toEqual(date)
  })

  test('minute - param is number timestamp', () => {
    const dateNum = 1709286300000
    const date = '2024-03-01 17:45'
    const _date = minute(dateNum)
    expect(_date).toEqual(date)
  })
})
