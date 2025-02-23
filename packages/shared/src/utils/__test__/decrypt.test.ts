import { describe, expect, test } from 'vitest'
import { isEncrypt, pickEncrypt } from '../decrypt'

describe('decrypt.ts', () => {
  test('isEncrypt - param is mask object,mask is string ', () => {
    const params = { name: '222', nameMask: '22' }
    const bool = isEncrypt(params, 'name')
    expect(bool).toEqual(true)
  })
  test('isEncrypt - param is mask object,mask is null', () => {
    const params = { name: '222', nameMask: '' }
    const bool = isEncrypt(params, 'name')
    expect(bool).toEqual(false)
  })

  test('isEncrypt - param is maskSec object,maskSec is string ', () => {
    const params = { name: '222', nameMaskSec: '22' }
    const bool = isEncrypt(params, 'name')
    expect(bool).toEqual(true)
  })
  test('isEncrypt - param is maskSec object,maskSec is null', () => {
    const params = { name: '222', nameMaskSec: '' }
    const bool = isEncrypt(params, 'name')
    expect(bool).toEqual(false)
  })

  test('isEncrypt - param is virtual object,virtual is string ', () => {
    const params = { name: '222', nameVirtual: '22' }
    const bool = isEncrypt(params, 'name')
    expect(bool).toEqual(true)
  })
  test('isEncrypt - param is virtual object,virtual is null', () => {
    const params = { name: '222', nameVirtual: '' }
    const bool = isEncrypt(params, 'name')
    expect(bool).toEqual(false)
  })

  test('pickEncrypt - param is  object, equal', () => {
    const params = { name: '222', nameVirtual: '222', age: '222' }
    const decryptData = pickEncrypt(params, ['name', 'age'])
    expect(decryptData).toEqual(params)
  })

  test('pickEncrypt - param is  object, not equal', () => {
    const params = { name: '222', nameVirtual: '222', age: '222' }
    const decryptData = pickEncrypt(params, ['name'])
    expect(decryptData).not.toEqual(params)
  })
})
