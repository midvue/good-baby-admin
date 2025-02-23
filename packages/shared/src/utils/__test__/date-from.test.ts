import { describe, expect, test } from 'vitest'
import { dateFromNow } from '../date'

describe('date.ts', () => {
  test('dateFromNow - param is 29 min', () => {
    const testDate1 = new Date(new Date().getTime() - 29 * 60 * 1000) // 29分钟前
    const _date = dateFromNow(testDate1)
    expect(_date).toEqual('29分钟前')
  })

  test('dateFromNow - param is today', () => {
    const testDate2 = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      9,
      23,
    ) // 今天 09:23
    const _date = dateFromNow(testDate2)
    expect(_date).toEqual('今天 09:23')
  })

  test('dateFromNow - param is past', () => {
    const testDate4 = new Date(2024, 4, 20)
    const _date = dateFromNow(testDate4)
    expect(_date).toEqual('2024/05/20')
  })

  test('dateFromNow - param is future', () => {
    const testDate4 = new Date(2024, 5, 20)
    const _date = dateFromNow(testDate4)
    expect(_date).toEqual('2024/06/20')
  })

  test('dateFromNow - param is 29 min and custom format', () => {
    const testDate1 = new Date(new Date().getTime() - 29 * 60 * 1000) // 29分钟前
    const _date = dateFromNow(testDate1, {
      minuteAgo: '${m} Minutes ago',
    })
    expect(_date).toEqual('29 Minutes ago')
  })

  test('dateFromNow - param is today and custom format', () => {
    const testDate2 = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      9,
      23,
    ) // 今天 09:23
    const _date = dateFromNow(testDate2, {
      today: '今日 ${HH:mm}',
    })
    expect(_date).toEqual('今日 09:23')
  })

  test('dateFromNow - param is past and custom format', () => {
    const testDate4 = new Date(2024, 4, 20)
    const _date = dateFromNow(testDate4, {
      other: '${YYYY-MM-DD}',
    })
    expect(_date).toEqual('2024-05-20')
  })
})
