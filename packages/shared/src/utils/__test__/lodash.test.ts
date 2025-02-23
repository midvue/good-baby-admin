import { describe, expect, test } from 'vitest'
import { deepClone, omit, omitBy, pick, pickBy } from '../lodash'

describe('lodash.ts', () => {
  test('deepClone - param is a plain object', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    }
    const cloneObj = deepClone(obj)
    expect(cloneObj).toEqual(obj)
    expect(cloneObj).not.toBe(obj)
  })

  test('deepClone - param is an array', () => {
    const arr = [
      1,
      {
        a: 1,
      },
      3,
      4,
      { b: 2 },
    ]
    const cloneObj = deepClone(arr)
    expect(cloneObj).toEqual(arr)
    expect(cloneObj).not.toBe(arr)
  })

  test('pick - param set to default', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    }
    const cloneObj = pick(obj, ['b'])
    expect(cloneObj).toEqual({ b: { c: 2, d: { e: 3 } } })
    expect(cloneObj).not.toBe(obj)
  })

  test('pickBy - param set to true', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
      c: '',
      d: undefined,
    }
    const cloneObj = pickBy(obj, (value) => !!value)
    const result = pick(obj, ['a', 'b'])
    expect(cloneObj).toEqual(result)
    expect(cloneObj).not.toBe(result)
  })

  test('omit - param is  default', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
      c: '',
      d: undefined,
    }
    const cloneObj = omit(obj, ['a'])
    const result = {
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
      c: '',
    }
    expect(cloneObj).toEqual(result)
    expect(cloneObj).not.toBe(result)
  })

  test('omitBy - param set to false', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
      c: '',
      d: undefined,
    }
    const cloneObj = omitBy(obj, (value) => !value)
    const result = omit(obj, ['c'])
    expect(cloneObj).toEqual(result)
    expect(cloneObj).not.toBe(result)
  })
})
