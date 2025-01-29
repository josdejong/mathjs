// test parser

import assert from 'assert'

import { approxEqual } from '../../../tools/approx.js'
import math from '../../../src/defaultInstance.js'
const Parser = math.Parser

describe('parser', function () {
  it('should create a parser', function () {
    const parser = new Parser()
    assert.ok(parser instanceof Parser)
  })

  it('should have a property isParser', function () {
    const a = new Parser()
    assert.strictEqual(a.isParser, true)
  })

  it('should have a property type', function () {
    const a = new Parser()
    assert.strictEqual(a.type, 'Parser')
  })

  it('should evaluate an expression', function () {
    const parser = new Parser()

    const result = parser.evaluate('2 + 3')
    assert.strictEqual(result, 5)
  })

  it('should evaluate a list with expressions', function () {
    const parser = new Parser()

    const result = parser.evaluate(['a = 2', 'a + 3'])
    assert.deepStrictEqual(result, [2, 5])
  })

  it('should get variables from the parsers namespace ', function () {
    const parser = new Parser()

    parser.evaluate('a = 3')
    parser.evaluate('b = a + 2')
    assert.strictEqual(parser.evaluate('a'), 3)
    assert.strictEqual(parser.evaluate('b'), 5)
    assert.strictEqual(parser.get('a'), 3)
    assert.strictEqual(parser.get('b'), 5)
  })

  it('should get all variables from the parsers namespace ', function () {
    const parser = new Parser()

    parser.evaluate('a = 3')
    parser.evaluate('b = a + 2')
    assert.deepStrictEqual(parser.getAll(), { a: 3, b: 5 })

    parser.remove('a')
    assert.deepStrictEqual(parser.getAll(), { b: 5 })
  })

  it('should return undefined when getting a non existing variable', function () {
    const parser = new Parser()

    assert.strictEqual(parser.get('non_existing_variable'), undefined)
  })

  it('should set variables in the parsers namespace ', function () {
    const parser = new Parser()

    assert.strictEqual(parser.set('a', 3), 3)
    assert.strictEqual(parser.evaluate('a'), 3)
    assert.strictEqual(parser.evaluate('a + 2'), 5)

    // adjust variable
    assert.strictEqual(parser.evaluate('a = a + 2'), 5)
    assert.strictEqual(parser.evaluate('a'), 5)
    assert.strictEqual(parser.get('a'), 5)

    assert.strictEqual(parser.set('a', parser.get('a') - 4), 1)
    assert.strictEqual(parser.evaluate('a'), 1)
  })

  it('should remove a variable from the parsers namespace ', function () {
    const parser = new Parser()

    assert.strictEqual(parser.set('qq', 3), 3)
    assert.strictEqual(parser.evaluate('qq'), 3)
    assert.strictEqual(parser.get('qq'), 3)

    parser.remove('qq')
    assert.strictEqual(parser.get('qq'), undefined)
    assert.throws(function () { parser.evaluate('qq') })

    assert.strictEqual(parser.evaluate('ww = 5'), 5)
    assert.strictEqual(parser.get('ww'), 5)
    parser.remove('ww')
    assert.strictEqual(parser.get('ww'), undefined)
    assert.throws(function () { parser.evaluate('ww') })
  })

  it('should clear the parsers namespace ', function () {
    const parser = new Parser()

    assert.strictEqual(parser.evaluate('xx = yy = zz = 5'), 5)

    assert.strictEqual(parser.set('pi', 'oops'), 'oops')

    assert.strictEqual(parser.get('xx'), 5)
    assert.strictEqual(parser.get('yy'), 5)
    assert.strictEqual(parser.get('zz'), 5)
    assert.strictEqual(parser.get('pi'), 'oops')

    assert.strictEqual(parser.evaluate('xx'), 5)
    assert.strictEqual(parser.evaluate('yy'), 5)
    assert.strictEqual(parser.evaluate('zz'), 5)
    assert.strictEqual(parser.evaluate('pi'), 'oops')

    parser.clear()

    assert.strictEqual(parser.get('xx'), undefined)
    assert.strictEqual(parser.get('yy'), undefined)
    assert.strictEqual(parser.get('zz'), undefined)
    approxEqual(parser.get('pi'), undefined)

    assert.throws(function () { parser.evaluate('xx') })
    assert.throws(function () { parser.evaluate('yy') })
    assert.throws(function () { parser.evaluate('zz') })
    assert.strictEqual(parser.evaluate('pi'), Math.PI)
  })

  it('should validate variable names', function () {
    const parser = new Parser()

    // Valid variable names
    assert.strictEqual(parser.set('validVar', 42), 42)
    assert.strictEqual(parser.evaluate('validVar'), 42)
    assert.strictEqual(parser.set('_underscoreVar', 10), 10)
    assert.strictEqual(parser.evaluate('_underscoreVar'), 10)
    assert.strictEqual(parser.set('var123', 100), 100)
    assert.strictEqual(parser.evaluate('var123'), 100)

    // Invalid variable names
    assert.throws(() => parser.set('123var', 5), /Invalid variable name/)
    assert.throws(() => parser.set('var-with-hyphen', 5), /Invalid variable name/)
    assert.throws(() => parser.set('var with space', 5), /Invalid variable name/)
    assert.throws(() => parser.set('@specialChar', 5), /Invalid variable name/)
  })

  describe('security', function () {
    it('should return undefined when accessing what appears to be inherited properties', function () {
      try {
        const parser = new Parser()

        Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native

        parser.clear()
        assert.strictEqual(parser.get('foo'), undefined)
        // No longer uses a Object scope, so this now works!
        // assert.throws(function () { parser.get('foo') }, /No access/)
      } finally {
        delete Object.prototype.foo
      }
    })

    it('should throw an error when assigning an inherited property', function () {
      try {
        const parser = new Parser()
        // We can safely set within the parser
        assert.strictEqual(parser.set('toString', null), null)
        // But getting it out via getAll() will throw.
        assert.throws(function () { parser.getAll() }, /No access/)
      } finally {
        delete Object.prototype.foo
      }
    })
  })

  it('should throw an exception when creating a parser without new', function () {
    assert.throws(function () { Parser() }, /Constructor must be called with the new operator/)
  })
})
