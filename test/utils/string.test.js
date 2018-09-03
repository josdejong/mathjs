// test string utils
const assert = require('assert')
const BigNumber = require('decimal.js')
const math = require('../../src/main')
const string = require('../../src/utils/string')

describe('string', function () {
  it('isString', function () {
    assert.strictEqual(string.isString('hi'), true)
    assert.strictEqual(string.isString(String('hi')), true)

    assert.strictEqual(string.isString(23), false)
    assert.strictEqual(string.isString(true), false)
    assert.strictEqual(string.isString(new Date()), false)
  })

  it('endsWith', function () {
    assert.strictEqual(string.endsWith('hello', 'hello'), true)
    assert.strictEqual(string.endsWith('hello', 'lo'), true)
    assert.strictEqual(string.endsWith('hello', ''), true)

    assert.strictEqual(string.endsWith('hello!', 'lo'), false)
    assert.strictEqual(string.endsWith('hello', 'LO'), false)
    assert.strictEqual(string.endsWith('hello', 'hellohello'), false)
  })

  it('should escape special HTML characters', function () {
    assert.strictEqual(string.escape('&<>"\''), '&amp;&lt;&gt;&quot;&#39;')
    assert.strictEqual(string.escape('<script src="script.js?version=1.0&type=js">'), '&lt;script src=&quot;script.js?version=1.0&amp;type=js&quot;&gt;')
  })

  describe('format', function () {
    it('should format null', function () {
      assert.strictEqual(string.format(null), 'null')
    })

    it('should format undefined', function () {
      assert.strictEqual(string.format(undefined), 'undefined')
    })

    it('should format a number', function () {
      assert.strictEqual(string.format(2.3), '2.3')
    })

    it('should format a bignumber', function () {
      const B = BigNumber.config({
        precision: 20
      })
      assert.strictEqual(string.format(new B(1).div(3)), '0.33333333333333333333')
    })

    it('should format a fraction without options', function () {
      assert.strictEqual(string.format(math.fraction(1, 3)), '1/3')
      assert.strictEqual(string.format(math.fraction(2, 6)), '1/3')
      assert.strictEqual(string.format(math.fraction(-0.125)), '-1/8')
    })

    it('should format a fraction with option fraction=\'ratio\'', function () {
      assert.strictEqual(string.format(math.fraction(1, 3), { fraction: 'ratio' }), '1/3')
      assert.strictEqual(string.format(math.fraction(2, 6), { fraction: 'ratio' }), '1/3')
    })

    it('should format a fraction with option fraction=\'decimal\'', function () {
      assert.strictEqual(string.format(math.fraction(1, 3), { fraction: 'decimal' }), '0.(3)')
      assert.strictEqual(string.format(math.fraction(2, 6), { fraction: 'decimal' }), '0.(3)')
    })

    it('should format a number with configuration', function () {
      assert.strictEqual(string.format(1.23456, 3), '1.23')
      assert.strictEqual(string.format(1.23456, { precision: 3 }), '1.23')
    })

    it('should format an array', function () {
      assert.strictEqual(string.format([1, 2, 3]), '[1, 2, 3]')
      assert.strictEqual(string.format([[1, 2], [3, 4]]), '[[1, 2], [3, 4]]')
    })

    it('should format a string', function () {
      assert.strictEqual(string.format('string'), '"string"')
    })

    it('should format an object', function () {
      const obj = {
        a: 1.1111,
        b: math.complex(2.2222, 3)
      }

      assert.strictEqual(string.format(obj), '{"a": 1.1111, "b": 2.2222 + 3i}')
      assert.strictEqual(string.format(obj, 3), '{"a": 1.11, "b": 2.22 + 3i}')
    })

    it('should format an object with its own format function', function () {
      const obj = {
        format: function (options) {
          let str = 'obj'
          if (options !== undefined) {
            str += ' ' + JSON.stringify(options)
          }
          return str
        }
      }

      assert.strictEqual(string.format(obj), 'obj')
      assert.strictEqual(string.format(obj, 4), 'obj 4')
      assert.strictEqual(string.format(obj, { precision: 4 }), 'obj {"precision":4}')
    })

    it('should format a function', function () {
      assert.strictEqual(string.format(function (a, b) { return a + b }), 'function')
      const f = function (a, b) { return a + b }
      f.syntax = 'f(x, y)'
      assert.strictEqual(string.format(f), 'f(x, y)')
    })

    it('should format unknown objects by converting them to string', function () {
      assert.strictEqual(string.format({}), '{}')
    })

    it('should format unknown primitives by converting them to string', function () {
      assert.strictEqual(string.format(true), 'true')
    })
  })
})
