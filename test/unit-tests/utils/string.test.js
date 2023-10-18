// test string utils
import assert from 'assert'

import BigNumber from 'decimal.js'
import math from '../../../src/defaultInstance.js'
import { endsWith, escape, format } from '../../../src/utils/string.js'

describe('string', function () {
  it('endsWith', function () {
    assert.strictEqual(endsWith('hello', 'hello'), true)
    assert.strictEqual(endsWith('hello', 'lo'), true)
    assert.strictEqual(endsWith('hello', ''), true)

    assert.strictEqual(endsWith('hello!', 'lo'), false)
    assert.strictEqual(endsWith('hello', 'LO'), false)
    assert.strictEqual(endsWith('hello', 'hellohello'), false)
  })

  it('should escape special HTML characters', function () {
    assert.strictEqual(escape('&<>"\''), '&amp;&lt;&gt;&quot;&#39;')
    assert.strictEqual(escape('<script src="script.js?version=1.0&type=js">'), '&lt;script src=&quot;script.js?version=1.0&amp;type=js&quot;&gt;')
  })

  describe('format', function () {
    it('should format null', function () {
      assert.strictEqual(format(null), 'null')
    })

    it('should format undefined', function () {
      assert.strictEqual(format(undefined), 'undefined')
    })

    it('should format a number', function () {
      assert.strictEqual(format(2.3), '2.3')
    })

    it('should format a bignumber', function () {
      const B = BigNumber.config({
        precision: 20
      })
      assert.strictEqual(format(new B(1).div(3)), '0.33333333333333333333')
    })

    it('should format a fraction without options', function () {
      assert.strictEqual(format(math.fraction(1, 3)), '1/3')
      assert.strictEqual(format(math.fraction(2, 6)), '1/3')
      assert.strictEqual(format(math.fraction(-0.125)), '-1/8')
    })

    it('should format a fraction with option fraction=\'ratio\'', function () {
      assert.strictEqual(format(math.fraction(1, 3), { fraction: 'ratio' }), '1/3')
      assert.strictEqual(format(math.fraction(2, 6), { fraction: 'ratio' }), '1/3')
    })

    it('should format a fraction with option fraction=\'decimal\'', function () {
      assert.strictEqual(format(math.fraction(1, 3), { fraction: 'decimal' }), '0.(3)')
      assert.strictEqual(format(math.fraction(2, 6), { fraction: 'decimal' }), '0.(3)')
    })

    it('should format a number with configuration', function () {
      assert.strictEqual(format(1.23456, 3), '1.23')
      assert.strictEqual(format(1.23456, { precision: 3 }), '1.23')
    })

    it('should format an array', function () {
      assert.strictEqual(format([1, 2, 3]), '[1, 2, 3]')
      assert.strictEqual(format([[1, 2], [3, 4]]), '[[1, 2], [3, 4]]')
    })

    it('should format a string', function () {
      assert.strictEqual(format('string'), '"string"')
    })

    it('should format a string with escape characters', function () {
      assert.strictEqual(format('with " double quote'), '"with \\" double quote"')
      assert.strictEqual(format('with \\ backslash'), '"with \\\\ backslash"')
      assert.strictEqual(format('with \b'), '"with \\b"')
      assert.strictEqual(format('with \f'), '"with \\f"')
      assert.strictEqual(format('with \n newline'), '"with \\n newline"')
      assert.strictEqual(format('with \r'), '"with \\r"')
      assert.strictEqual(format('with \t tab'), '"with \\t tab"')
    })

    it('should format an object', function () {
      const obj = {
        a: 1.1111,
        b: math.complex(2.2222, 3)
      }

      assert.strictEqual(format(obj), '{"a": 1.1111, "b": 2.2222 + 3i}')
      assert.strictEqual(format(obj, 3), '{"a": 1.11, "b": 2.22 + 3i}')
    })

    it('should format an object with escape characters', function () {
      assert.strictEqual(format({ 'with " double quote': 42 }), '{"with \\" double quote": 42}')
      assert.strictEqual(format({ 'with \\ backslash': 42 }), '{"with \\\\ backslash": 42}')
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

      assert.strictEqual(format(obj), 'obj')
      assert.strictEqual(format(obj, 4), 'obj 4')
      assert.strictEqual(format(obj, { precision: 4 }), 'obj {"precision":4}')
    })

    it('should format a function', function () {
      assert.strictEqual(format(function (a, b) { return a + b }), 'function')
      const f = function (a, b) { return a + b }
      f.syntax = 'f(x, y)'
      assert.strictEqual(format(f), 'f(x, y)')
    })

    it('should format unknown objects by converting them to string', function () {
      assert.strictEqual(format({}), '{}')
    })

    it('should format unknown primitives by converting them to string', function () {
      assert.strictEqual(format(true), 'true')
    })

    it('should limit the length of output with a truncate option', function () {
      const result = format('01234567890123456789', { truncate: 17 })
      assert.strictEqual(result.length, 17)
      assert.ok(endsWith(result, '...'))
    })
  })
})
