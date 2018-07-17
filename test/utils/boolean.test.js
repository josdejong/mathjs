// test boolean utils
const assert = require('assert')
const boolean = require('../../src/utils/boolean')

describe('boolean', function () {
  it('isBoolean', function () {
    assert.equal(boolean.isBoolean(true), true)
    assert.equal(boolean.isBoolean(false), true)
    assert.equal(boolean.isBoolean(Boolean(false)), true)
    assert.equal(boolean.isBoolean('hi'), false)
    assert.equal(boolean.isBoolean(23), false)
    assert.equal(boolean.isBoolean([]), false)
    assert.equal(boolean.isBoolean({}), false)
    assert.equal(boolean.isBoolean(new Date()), false)
  })
})
