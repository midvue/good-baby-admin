import { describe, expect, test } from 'vitest'
import { durationFormat, durationFormatNoZero } from '../date'

describe('date.ts', () => {
  test('durationFormat - param is string', () => {
    const dateNum = '61'
    const _date = durationFormat(dateNum, {
      unit: 'm',
    })
    expect(_date).toEqual('01小时01分钟')
  })

  test('durationFormat - param is 1111161 s', () => {
    const dateNum = 1111161
    const _date = durationFormat(dateNum, {
      unit: 's',
      format: 'mm分钟ss秒',
    })
    expect(_date).toEqual('18519分钟21秒')
  })

  test('durationFormat - param set min to 61 and format to HH:mm', () => {
    const dateNum = 61
    const _date = durationFormat(dateNum, {
      unit: 'm',
      format: 'HH:mm',
    })
    expect(_date).toEqual('01:01')
  })

  test('durationFormat - param set min to 61 and format to Array', () => {
    const dateNum = 61
    const _dates = durationFormat(dateNum, {
      unit: 'm',
      format: ['HH', 'mm'],
    })
    expect(_dates).toEqual(['01', '01'])
  })

  test('durationFormat - param is 5126', () => {
    const dateNum = 5126758806
    const _date = durationFormat(dateNum, {
      unit: 'ms',
      format: 'DD天HH小时mm分钟ss秒',
    })
    expect(_date).toEqual('59天08小时05分钟58秒')
  })

  test('durationFormat - param is 5126', () => {
    const dateNum = 5126758806
    const _date = durationFormat(dateNum, {
      unit: 'ms',
      format: 'HH小时mm分钟ss秒',
    })
    expect(_date).toEqual('1424小时05分钟58秒')
  })

  test('durationFormatNoZero - param is 61m', () => {
    const dateNum = '61'
    const _date = durationFormatNoZero(dateNum, {
      unit: 'm',
    })
    expect(_date).toEqual('1小时1分钟')
  })

  test('durationFormatNoZero - param is 60m', () => {
    const dateNum = '60'
    const _date = durationFormatNoZero(dateNum, {
      unit: 'm',
    })
    expect(_date).toEqual('1小时')
  })

  test('durationFormatNoZero - param is 600m', () => {
    const dateNum = '600'
    const _date = durationFormatNoZero(dateNum, {
      unit: 'm',
    })
    expect(_date).toEqual('10小时')
  })
  test('durationFormatNoZero - param is 0.5h', () => {
    const dateNum = '0.5'
    const _date = durationFormatNoZero(dateNum, {
      unit: 'h',
    })
    expect(_date).toEqual('30分钟')
  })
  test('durationFormatNoZero - param is 24.03h', () => {
    const dateNum = '24.03'
    const _date = durationFormatNoZero(dateNum, {
      unit: 'h',
    })
    expect(_date).toEqual('1天1分钟')
  })
  test('durationFormatNoZero - format is HH小时mm分钟ss秒', () => {
    const dateNum = '24.5'
    const _date = durationFormatNoZero(dateNum, {
      unit: 'h',
      format: 'HH小时mm分钟ss秒',
    })
    expect(_date).toEqual('24小时30分钟')
  })

  test('durationFormatNoZero - param is 100.5h', () => {
    const dateNum = '100.5'
    const _date = durationFormatNoZero(dateNum, {
      unit: 'h',
      format: 'HH小时mm分钟ss秒',
    })
    expect(_date).toEqual('100小时30分钟')
  })

  test('durationFormatNoZero - param is 1.05h', () => {
    const dateNum = '1.05'
    const _date = durationFormatNoZero(dateNum, {
      unit: 'h',
      format: 'HH小时mm分钟',
    })
    expect(_date).toEqual('01小时03分钟')
  })

  test('durationFormatNoZero - param is 0', () => {
    const dateNum = 0
    const _date = durationFormatNoZero(dateNum, {
      unit: 'h',
      format: 'HH小时mm分钟',
    })
    expect(_date).toEqual('')
  })

  test('durationFormatNoZero - param is null', () => {
    const dateNum = null
    //@ts-ignore
    const _date = durationFormatNoZero(dateNum, {
      unit: 'h',
      format: 'HH小时mm分钟',
    })
    expect(_date).toEqual('')
  })
})
