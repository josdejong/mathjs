import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { isBigInt, isBoolean, isNumber, isObject, isString } from '../../../src/utils/is.js'

const { bignumber, complex, fraction, matrix, parse } = math

describe('is', function () {
  it('isObject', function () {
    assert.strictEqual(isObject({}), true)
    assert.strictEqual(isObject(matrix()), false)
    assert.strictEqual(isObject([]), false)
    assert.strictEqual(isObject(fraction(1, 2)), false)
    assert.strictEqual(isObject(bignumber(2)), false)
    assert.strictEqual(isObject(complex(2, 3)), false)
    assert.strictEqual(isObject(parse('2')), false)
    assert.strictEqual(isObject(/test/), false)
    assert.strictEqual(isObject(function () {}), false)
    assert.strictEqual(isObject(2), false)
    assert.strictEqual(isObject(null), false)
    assert.strictEqual(isObject(undefined), false)
    assert.strictEqual(isObject(), false)
  })

  it('isBoolean', function () {
    assert.strictEqual(isBoolean(true), true)
    assert.strictEqual(isBoolean(false), true)
    assert.strictEqual(isBoolean(Boolean(false)), true)
    assert.strictEqual(isBoolean('hi'), false)
    assert.strictEqual(isBoolean(23), false)
    assert.strictEqual(isBoolean([]), false)
    assert.strictEqual(isBoolean({}), false)
    assert.strictEqual(isBoolean(new Date()), false)
  })

  it('isString', function () {
    assert.strictEqual(isString('hi'), true)
    assert.strictEqual(isString(String('hi')), true)

    assert.strictEqual(isString(23), false)
    assert.strictEqual(isString(true), false)
    assert.strictEqual(isString(new Date()), false)
  })

  it('isNumber', function () {
    assert.strictEqual(isNumber(1), true)
    assert.strictEqual(isNumber(2e+3), true)
    assert.strictEqual(isNumber(Number(2.3)), true)
    assert.strictEqual(isNumber(NaN), true)
    assert.strictEqual(isNumber(-23), true)
    assert.strictEqual(isNumber(parseFloat('123')), true)

    assert.strictEqual(isNumber('23'), false)
    assert.strictEqual(isNumber('str'), false)
    assert.strictEqual(isNumber(new Date()), false)
    assert.strictEqual(isNumber({}), false)
    assert.strictEqual(isNumber([]), false)
    assert.strictEqual(isNumber(/regexp/), false)
    assert.strictEqual(isNumber(true), false)
    assert.strictEqual(isNumber(false), false)
    assert.strictEqual(isNumber(null), false)
    assert.strictEqual(isNumber(undefined), false)
    assert.strictEqual(isNumber(), false)
  })

  it('isBigInt', function () {
    assert.strictEqual(isBigInt(2n), true)
    assert.strictEqual(isBigInt(BigInt(2)), true)
    assert.strictEqual(isBigInt(2), false)
    assert.strictEqual(isBigInt(), false)
    assert.strictEqual(isBigInt(null), false)
  })
})
