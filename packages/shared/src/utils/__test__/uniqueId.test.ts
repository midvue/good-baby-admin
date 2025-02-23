import { describe, expect, test } from 'vitest'
import { uniqueId } from '../lodash'

describe('lodash.ts', () => {
  test('uniqueId 11 length', () => {
    const length = 11
    const _uid = uniqueId(length)
    const _uid1 = uniqueId(length)
    expect(_uid.length).toEqual(length)
    expect(_uid1.length).toEqual(length)
    expect(_uid).not.toEqual(_uid1)
  })

  test('uniqueId 16 length', () => {
    const length = 16
    const _uid = uniqueId(length)
    const _uid1 = uniqueId(length)
    expect(_uid.length).toEqual(length)
    expect(_uid1.length).toEqual(length)
    expect(_uid).not.toEqual(_uid1)
  })

  test('uniqueId 19 length', () => {
    const length = 19
    const _uid = uniqueId(length)
    const _uid1 = uniqueId(length)
    expect(_uid.length).toEqual(length)
    expect(_uid1.length).toEqual(length)
    expect(_uid).not.toEqual(_uid1)
  })

  test('uniqueId 32 length', () => {
    const length = 32
    const _uid = uniqueId(length)
    const _uid1 = uniqueId(length)
    expect(_uid.length).toEqual(length)
    expect(_uid1.length).toEqual(length)
    expect(_uid).not.toEqual(_uid1)
  })
})
