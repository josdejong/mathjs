// test boolean utils
const assert = require('assert')
const boolean = require('../../src/utils/boolean')

describe('boolean', function () {
  it('isBoolean', function () {
    assert.strictEqual(boolean.isBoolean(true), true)
    assert.strictEqual(boolean.isBoolean(false), true)
    assert.strictEqual(boolean.isBoolean(Boolean(false)), true)
    assert.strictEqual(boolean.isBoolean('hi'), false)
    assert.strictEqual(boolean.isBoolean(23), false)
    assert.strictEqual(boolean.isBoolean([]), false)
    assert.strictEqual(boolean.isBoolean({}), false)
    assert.strictEqual(boolean.isBoolean(new Date()), false)
  })
})
