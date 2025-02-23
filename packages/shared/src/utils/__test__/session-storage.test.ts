import { describe, expect, test } from 'vitest'
import { getSession, setSession } from '../storage'

describe('session.ts', () => {
  test('session - param is boolean', () => {
    const isTest = true
    const key = 'session-boolean-key'
    setSession(key, isTest)
    const value = getSession(key)
    expect(isTest).toEqual(value)
    expect(typeof value).toEqual('boolean')
  })

  test('session - param is string', () => {
    const isTest = '123456'
    const key = 'session-string-key'
    setSession(key, isTest)
    const value = getSession(key)
    expect(isTest).toEqual(value)
    expect(typeof value).toEqual('string')
  })

  test('session - param is number', () => {
    const isTest = 0
    const key = 'session-number-key'
    setSession(key, isTest)
    const value = getSession(key)
    expect(isTest).toEqual(value)
    expect(typeof value).toEqual('number')
  })

  test('session - param is plain object', () => {
    const isTest = {
      name: 'test',
      age: 11,
    }
    const key = 'session-plain-key'
    setSession(key, isTest)
    const value = getSession(key)
    expect(isTest).toEqual(value)
    expect(isTest).not.toBe(value)
    expect(typeof value).toEqual('object')
  })
})
