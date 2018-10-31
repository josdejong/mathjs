import { isBoolean, isString } from '../../src/utils/is'

import assert from 'assert';

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
})
