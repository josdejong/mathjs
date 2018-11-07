import assert from 'assert'
import { isBoolean, isNumber, isString } from '../../src/utils/is'

describe('is', function () {
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
})
