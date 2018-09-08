// test parser

const assert = require('assert')
const approx = require('../../tools/approx')
const math = require('../../src/main')
const Parser = math.expression.Parser

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

  it('should throw an error when using deprecated function parse', function () {
    const parser = new Parser()

    assert.throws(function () { parser.parse('2 + 3') }, /is deprecated/)
  })

  it('should throw an error when using deprecated function compile', function () {
    const parser = new Parser()

    assert.throws(function () { parser.compile('2 + 3') }, /is deprecated/)
  })

  it('should evaluate an expression', function () {
    const parser = new Parser()

    const result = parser.eval('2 + 3')
    assert.strictEqual(result, 5)
  })

  it('should get variables from the parsers namespace ', function () {
    const parser = new Parser()

    parser.eval('a = 3')
    parser.eval('b = a + 2')
    assert.strictEqual(parser.eval('a'), 3)
    assert.strictEqual(parser.eval('b'), 5)
    assert.strictEqual(parser.get('a'), 3)
    assert.strictEqual(parser.get('b'), 5)
  })

  it('should get all variables from the parsers namespace ', function () {
    const parser = new Parser()

    parser.eval('a = 3')
    parser.eval('b = a + 2')
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
    assert.strictEqual(parser.eval('a'), 3)
    assert.strictEqual(parser.eval('a + 2'), 5)

    // adjust variable
    assert.strictEqual(parser.eval('a = a + 2'), 5)
    assert.strictEqual(parser.eval('a'), 5)
    assert.strictEqual(parser.get('a'), 5)

    assert.strictEqual(parser.set('a', parser.get('a') - 4), 1)
    assert.strictEqual(parser.eval('a'), 1)
  })

  it('should remove a variable from the parsers namespace ', function () {
    const parser = new Parser()

    assert.strictEqual(parser.set('qq', 3), 3)
    assert.strictEqual(parser.eval('qq'), 3)
    assert.strictEqual(parser.get('qq'), 3)

    parser.remove('qq')
    assert.strictEqual(parser.get('qq'), undefined)
    assert.throws(function () { parser.eval('qq') })

    assert.strictEqual(parser.eval('ww = 5'), 5)
    assert.strictEqual(parser.get('ww'), 5)
    parser.remove('ww')
    assert.strictEqual(parser.get('ww'), undefined)
    assert.throws(function () { parser.eval('ww') })
  })

  it('should clear the parsers namespace ', function () {
    const parser = new Parser()

    assert.strictEqual(parser.eval('xx = yy = zz = 5'), 5)

    assert.strictEqual(parser.set('pi', 'oops'), 'oops')

    assert.strictEqual(parser.get('xx'), 5)
    assert.strictEqual(parser.get('yy'), 5)
    assert.strictEqual(parser.get('zz'), 5)
    assert.strictEqual(parser.get('pi'), 'oops')

    assert.strictEqual(parser.eval('xx'), 5)
    assert.strictEqual(parser.eval('yy'), 5)
    assert.strictEqual(parser.eval('zz'), 5)
    assert.strictEqual(parser.eval('pi'), 'oops')

    parser.clear()

    assert.strictEqual(parser.get('xx'), undefined)
    assert.strictEqual(parser.get('yy'), undefined)
    assert.strictEqual(parser.get('zz'), undefined)
    approx.equal(parser.get('pi'), undefined)

    assert.throws(function () { parser.eval('xx') })
    assert.throws(function () { parser.eval('yy') })
    assert.throws(function () { parser.eval('zz') })
    assert.strictEqual(parser.eval('pi'), Math.PI)
  })

  describe('security', function () {
    it('should throw an error when accessing inherited properties', function () {
      try {
        const parser = new Parser()

        Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native

        parser.clear()

        assert.throws(function () { parser.get('foo') }, /No access/)
      } finally {
        delete Object.prototype.foo
      }
    })

    it('should throw an error when assigning an inherited property', function () {
      try {
        const parser = new Parser()
        assert.throws(function () { parser.set('toString', null) }, /No access/)
      } finally {
        delete Object.prototype.foo
      }
    })
  })

  it('should throw an exception when creating a parser without new', function () {
    assert.throws(function () { Parser() }, /Constructor must be called with the new operator/)
  })
})
