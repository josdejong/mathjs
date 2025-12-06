// test parse
import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import { isMap, isObjectWrappingMap, isPartitionedMap } from '../../../src/utils/is.js'
import { PartitionedMap } from '../../../src/utils/map.js'

import { approxDeepEqual, approxEqual } from '../../../tools/approx.js'

const parse = math.parse
const ConditionalNode = math.ConditionalNode
const ConstantNode = math.ConstantNode
const OperatorNode = math.OperatorNode
const RangeNode = math.RangeNode
const Complex = math.Complex
const Matrix = math.Matrix
const Range = math.Range
const Unit = math.Unit
const ResultSet = math.ResultSet

/**
 * Helper function to parse an expression and immediately evaluate its results
 * @param {String} expr
 * @param {Object} [scope]
 * @return {*} result
 */
function parseAndEval (expr, scope) {
  return parse(expr).evaluate(scope)
}

function parseAndStringifyWithParens (expr) {
  return parse(expr).toString({ parenthesis: 'all' })
}

describe('parse', function () {
  it('should parse a single expression', function () {
    approxEqual(parse('2 + 6 / 3').compile().evaluate(), 4)
  })

  it('should parse an empty expression', function () {
    assert.strictEqual(parse('').compile().evaluate(), undefined)
    assert.strictEqual(parse('\n').compile().evaluate(), undefined)
    assert.strictEqual(parse('\n\n').compile().evaluate(), undefined)
    assert.strictEqual(parse('\n  \n').compile().evaluate(), undefined)
    assert.strictEqual(parse('#foo\n').compile().evaluate(), undefined)
    assert.strictEqual(parse('#foo\n#bar\n').compile().evaluate(), undefined)
  })

  it('should parse an array with expressions', function () {
    const scope = {}
    assert.deepStrictEqual(parse(['a=3', 'b=4', 'a*b']).map(function (node) {
      return node.compile().evaluate(scope)
    }), [3, 4, 12])
  })

  it('should parse a matrix with expressions', function () {
    const scope = {}
    assert.deepStrictEqual(parse(math.matrix(['a=3', 'b=4', 'a*b'])).map(function (node) {
      return node.compile().evaluate(scope)
    }), math.matrix([3, 4, 12]))
  })

  it('should parse an array with an empty expression', function () {
    assert.deepStrictEqual(parse(['']).map(function (node) {
      return node.compile().evaluate()
    }), [undefined])
  })

  it('should parse an array with an empty expression', function () {
    assert.deepStrictEqual(parse(math.matrix([''])).map(function (node) {
      return node.compile().evaluate()
    }), math.matrix([undefined]))
  })

  it('should parse unicode and other special characters', function () {
    // https://unicode-table.com/en
    const scope = {}

    math.evaluate('$ab$c = 2', scope) // dollar sign
    assert.strictEqual(scope.$ab$c, 2)

    math.evaluate('\u00E9 = 2', scope) // Latin Small Letter E with Acute
    assert.strictEqual(scope['\u00E9'], 2)

    math.evaluate('\u03A6 = 3', scope) // Greek Capital Letter Phi
    assert.strictEqual(scope['\u03A6'], 3)

    math.evaluate('\u03A9 = 4', scope) // Greek Capital Letter Omega
    assert.strictEqual(scope['\u03A9'], 4)

    math.evaluate('\u2126 = 4', scope) // Letter-like character Ohm
    assert.strictEqual(scope['\u2126'], 4)

    math.evaluate('k\u00F6ln = 5', scope) // Combination of latin and unicode
    assert.strictEqual(scope['k\u00F6ln'], 5)

    // test unicode characters in the astral plane (surrogate pairs
    math.evaluate('\uD835\uDD38 = 1', scope) // double struck capital A
    assert.strictEqual(scope['\uD835\uDD38'], 1)

    math.evaluate('x\t=\u00A02 +\u00A04', scope) // Non-breaking space (&nbsp;)
    assert.strictEqual(scope.x, 6)

    // should not allow the "holes"
    assert.throws(function () {
      math.evaluate('\uD835\uDCA3 = 1', scope)
    })
  })

  describe('multiline', function () {
    it('should parse multiline expressions', function () {
      assert.deepStrictEqual(parse('a=3\nb=4\na*b').compile().evaluate(), new ResultSet([3, 4, 12]))
      assert.deepStrictEqual(parse('b = 43; b * 4').compile().evaluate(), new ResultSet([172]))
    })

    it('should skip empty lines in multiline expressions', function () {
      assert.deepStrictEqual(parse('\n;\n2 * 4\n').compile().evaluate(), new ResultSet([8]))
    })

    it('should spread operators over multiple lines', function () {
      assert.deepStrictEqual(parse('2+\n3').compile().evaluate(), 5)
      assert.deepStrictEqual(parse('2+\n\n3').compile().evaluate(), 5)
      assert.deepStrictEqual(parse('2*\n3').compile().evaluate(), 6)
      assert.deepStrictEqual(parse('2^\n3').compile().evaluate(), 8)
      assert.deepStrictEqual(parse('2==\n3').compile().evaluate(), false)
      assert.deepStrictEqual(parse('2*-\n3').compile().evaluate(), -6)
    })

    it('should parse multiple function assignments', function () {
      const scope = {}
      parse('f(x)=x*2;g(x)=x*3').compile().evaluate(scope)
      assert.strictEqual(scope.f(2), 4)
      assert.strictEqual(scope.g(2), 6)

      const scope2 = {}
      parse('a=2;f(x)=x^a;').compile().evaluate(scope2)
      assert.strictEqual(scope2.a, 2)
      assert.strictEqual(scope2.f(3), 9)
    })

    it('should correctly scope a function variable if also used outside the function', function () {
      const scope = {}
      const res = parse('x=2;f(x)=x^2;x').compile().evaluate(scope) // x should be x=2, not x of the function

      assert.deepStrictEqual(res.entries, [2])
      assert.strictEqual(scope.x, 2)
      assert.strictEqual(scope.f(3), 9)
    })

    it('should support variable assignment inside a function definition', function () {
      const scope = {}
      parse('f(x)=(y=x)*2').compile().evaluate(scope)
      assert.strictEqual(scope.f(2), 4)
      assert.strictEqual(scope.y, 2)
    })

    it('should spread a function over multiple lines', function () {
      assert.deepStrictEqual(parse('add(\n4\n,\n2\n)').compile().evaluate(), 6)
    })

    it('should spread contents of parameters over multiple lines', function () {
      assert.deepStrictEqual(parse('(\n4\n+\n2\n)').compile().evaluate(), 6)
    })

    it('should spread a function assignment over multiple lines', function () {
      assert.deepStrictEqual(typeof parse('f(\nx\n,\ny\n)=\nx+\ny').compile().evaluate(), 'function')
    })

    it('should spread a variable assignment over multiple lines', function () {
      assert.deepStrictEqual(parse('x=\n2').compile().evaluate(), 2)
    })

    it('should spread a matrix over multiple lines', function () {
      assert.deepStrictEqual(parse('[\n1\n,\n2\n]').compile().evaluate(), math.matrix([1, 2]))
    })

    it('should spread a range over multiple lines', function () {
      assert.deepStrictEqual(parse('2:\n4').compile().evaluate(), math.matrix([2, 3, 4]))
      assert.deepStrictEqual(parse('2:\n2:\n6').compile().evaluate(), math.matrix([2, 4, 6]))
    })

    it('should spread an index over multiple lines', function () {
      assert.deepStrictEqual(parse('a[\n1\n,\n1\n]').compile().evaluate({ a: [[1, 2], [3, 4]] }), 1)

      const scope = { a: [[1, 2], [3, 4]] }
      assert.deepStrictEqual(parse('a[\n1\n,\n1\n]=\n100').compile().evaluate(scope), 100)
      assert.deepStrictEqual(scope, { a: [[100, 2], [3, 4]] })
    })
  })

  it('should throw an error when scope contains a reserved keyword', function () {
    const scope = {
      end: 2
    }
    assert.throws(function () {
      parse('2+3').compile().evaluate(scope)
    }, /Scope contains an illegal symbol/)
  })

  it('should give informative syntax errors', function () {
    assert.throws(function () { parse('2 +') }, /Unexpected end of expression \(char 4\)/)
    assert.throws(function () { parse('2 + 3 + *') }, /Value expected \(char 9\)/)
  })

  it('should throw an error if called with wrong number of arguments', function () {
    assert.throws(function () { parse() }, /Too few arguments/)
    assert.throws(function () { parse('2 + 3', {}, 3) }, /Too many arguments/)
  })

  it('should throw an error if called with a wrong type of argument', function () {
    assert.throws(function () { parse(math.unit('5cm')) }, TypeError)
    assert.throws(function () { parse(new Complex(2, 3)) }, TypeError)
    assert.throws(function () { parse(new Date()) }, TypeError)
  })

  it('should throw an error in case of unsupported characters', function () {
    assert.throws(function () { parse('2\u00A1') }, /Syntax error in part "\u00A1"/)
  })

  describe('comments', function () {
    it('should skip comments', function () {
      assert.strictEqual(parseAndEval('2 + 3 # - 4'), 5)
    })

    it('should skip comments in a ResultSet', function () {
      assert.deepStrictEqual(parseAndEval('2 + 3 # - 4\n6-2'), new ResultSet([5, 4]))
    })

    it('should fill in the property comment of a Node', function () {
      assert.strictEqual(parse('2 + 3').comment, undefined)

      assert.strictEqual(parse('2 + 3 # hello').comment, '# hello')
      assert.strictEqual(parse('   # hi').comment, '# hi')

      const blockNode = parse('2 # foo\n3   # bar')
      assert.strictEqual(blockNode.blocks.length, 2)
      assert.strictEqual(blockNode.blocks[0].node.comment, '# foo')
      assert.strictEqual(blockNode.blocks[1].node.comment, '# bar')
    })
  })

  describe('number', function () {
    it('should parse valid numbers', function () {
      assert.strictEqual(parseAndEval('0'), 0)
      assert.strictEqual(parseAndEval('3'), 3)
      assert.strictEqual(parseAndEval('3.2'), 3.2)
      assert.strictEqual(parseAndEval('3.'), 3)
      assert.strictEqual(parseAndEval('3. '), 3)
      assert.strictEqual(parseAndEval('3.\t'), 3)
      assert.strictEqual(parseAndEval('003.2'), 3.2)
      assert.strictEqual(parseAndEval('003.200'), 3.2)
      assert.strictEqual(parseAndEval('.2'), 0.2)
      assert.strictEqual(parseAndEval('3e2'), 300)
      assert.strictEqual(parseAndEval('300e2'), 30000)
      assert.strictEqual(parseAndEval('300e+2'), 30000)
      assert.strictEqual(parseAndEval('300e-2'), 3)
      assert.strictEqual(parseAndEval('300E-2'), 3)
      assert.strictEqual(parseAndEval('3.2e2'), 320)

      assert.strictEqual(parseAndEval('0b0'), 0)
      assert.strictEqual(parseAndEval('0o0'), 0)
      assert.strictEqual(parseAndEval('0x0'), 0)
      assert.strictEqual(parseAndEval('0b01'), 0b1)
      assert.strictEqual(parseAndEval('0o01234567'), 0o01234567)
      assert.strictEqual(parseAndEval('0xabcdef'), 0xabcdef)
      assert.strictEqual(parseAndEval('0x3456789'), 0x3456789)
      assert.strictEqual(parseAndEval('0xABCDEF'), 0xabcdef)
      assert.strictEqual(parseAndEval('0x80i8'), -128)
      assert.strictEqual(parseAndEval('0x80'), 128)
      assert.strictEqual(parseAndEval('0x80000000i32'), -2147483648)
      assert.strictEqual(parseAndEval('0xffffffffi32'), -1)
      assert.strictEqual(parseAndEval('0xfffffffei32'), -2)
      assert.strictEqual(parseAndEval('0o37777777777i32'), -1)
      assert.strictEqual(parseAndEval('0b11111111111111111111111111111111i32'), -1)
      assert.strictEqual(parseAndEval('0b11111111111111111111111111111110i32'), -2)
      assert.strictEqual(parseAndEval('0b11111111111111111111111111111110'), 4294967294)
      assert.strictEqual(parseAndEval('0x7fffffff'), 2 ** 31 - 1)
      assert.strictEqual(parseAndEval('0x7fffffffi32'), 2 ** 31 - 1)
      assert.strictEqual(parseAndEval('0x1fffffffffffff'), 2 ** 53 - 1)
      assert.strictEqual(parseAndEval('0x1fffffffffffffi53'), -1)
      assert.strictEqual(parseAndEval('0b1.1'), 1.5)
      assert.strictEqual(parseAndEval('0o1.4'), 1.5)
      assert.strictEqual(parseAndEval('0x1.8'), 1.5)
      assert.strictEqual(parseAndEval('0x1.f'), 1.9375)
      assert.strictEqual(parseAndEval('0b100.001'), 4.125)
      assert.strictEqual(parseAndEval('0o100.001'), 64.001953125)
      assert.strictEqual(parseAndEval('0x100.001'), 256.000244140625)
      assert.strictEqual(parseAndEval('0b1.'), 1)
      assert.strictEqual(parseAndEval('0o1.'), 1)
      assert.strictEqual(parseAndEval('0x1.'), 1)
    })

    it('should require hex, bin, oct values to be followed by whitespace or a delimiter', function () {
      assert.throws(() => parseAndEval('0b0a'), /SyntaxError: String "0b0a" is not a valid number/)
      assert.throws(() => parseAndEval('0x1k'), /SyntaxError: String "0x1k" is not a valid number/)
      assert.throws(() => parseAndEval('0o1k'), /SyntaxError: String "0o1k" is not a valid number/)
      assert.throws(() => parseAndEval('0b1k'), /SyntaxError: String "0b1k" is not a valid number/)

      assert.strictEqual(parseAndEval('0x1 k', { k: 2 }), 2)
      assert.strictEqual(parseAndEval('0o1 k', { k: 2 }), 2)
      assert.strictEqual(parseAndEval('0b1 k', { k: 2 }), 2)

      assert.strictEqual(parseAndEval('0x1*k', { k: 2 }), 2)
      assert.strictEqual(parseAndEval('0o1*k', { k: 2 }), 2)
      assert.strictEqual(parseAndEval('0b1*k', { k: 2 }), 2)
    })

    it('should parse a number followed by e', function () {
      approxEqual(parseAndEval('2e'), 2 * Math.E)
    })

    it('should parse dot operators after a value', function () {
      approxEqual(parseAndEval('2.*3'), 6)
      approxEqual(parseAndEval('2./3'), 2 / 3)
      approxEqual(parseAndEval('2.^3'), 2 ** 3)
    })

    it('should parse dot operators after an implicit multiplication with symbol E', function () {
      approxEqual(parseAndEval('2E.*3'), 2 * Math.E * 3)
      approxEqual(parseAndEval('2E./3'), 2 * Math.E / 3)
      approxEqual(parseAndEval('2E.^3'), 2 * Math.E ** 3)
      approxEqual(parseAndEval('2e.*3'), 2 * Math.E * 3)
      approxEqual(parseAndEval('2e./3'), 2 * Math.E / 3)
      approxEqual(parseAndEval('2e.^3'), 2 * Math.E ** 3)
    })

    it('should throw an error with invalid numbers', function () {
      assert.throws(function () { parseAndEval('.') }, /Value expected/)
      assert.throws(function () { parseAndEval('3.2.2') }, SyntaxError)
      assert.throws(function () { parseAndEval('3.2e2.2') }, SyntaxError)

      assert.throws(function () { parseAndEval('3e0.5') }, /Digit expected, got "."/)
      assert.throws(function () { parseAndEval('3e.5') }, /Digit expected, got "."/)
      assert.throws(function () { parseAndEval('-3e0.5') }, /Digit expected, got "."/)
      assert.throws(function () { parseAndEval('-3e.5') }, /Digit expected, got "."/)
      assert.throws(function () { parseAndEval('3e-0.5') }, /Digit expected, got "."/)
      assert.throws(function () { parseAndEval('3e-.5') }, /Digit expected, got "."/)
      assert.throws(function () { parseAndEval('-3e-0.5') }, /Digit expected, got "."/)
      assert.throws(function () { parseAndEval('-3e-.5') }, /Digit expected, got "."/)

      assert.throws(function () { parseAndEval('2e+a') }, /Digit expected, got "a"/)

      assert.throws(function () { parseAndEval('0b') }, SyntaxError)
      assert.throws(function () { parseAndEval('0o') }, SyntaxError)
      assert.throws(function () { parseAndEval('0x') }, SyntaxError)
      assert.throws(function () { parseAndEval('0b2') }, SyntaxError)
      assert.throws(function () { parseAndEval('0o8') }, SyntaxError)
      assert.throws(function () { parseAndEval('0xg') }, SyntaxError)

      assert.throws(function () { parseAndEval('0x12ii') })
      assert.throws(function () { parseAndEval('0x12u') })
      assert.throws(function () { parseAndEval('0x12i-8') })

      assert.throws(function () { parseAndEval('0b123.45') }, /SyntaxError: String "0b123\.45" is not a valid number/)
      assert.throws(function () { parseAndEval('0o89.89') }, /SyntaxError: String "0o89\.89" is not a valid number/)
      assert.throws(function () { parseAndEval('0xghji.xyz') }, /SyntaxError: String "0xghji.xyz" is not a valid number/)
    })
  })

  describe('bignumber', function () {
    it('should parse bignumbers', function () {
      assert.deepStrictEqual(parseAndEval('bignumber(0.1)'), math.bignumber(0.1))
      assert.deepStrictEqual(parseAndEval('bignumber("1.2e500")'), math.bignumber('1.2e500'))
    })

    it('should output bignumbers if default number type is bignumber', function () {
      const bigmath = math.create({
        number: 'BigNumber'
      })

      assert.deepStrictEqual(bigmath.parse('0.1').compile().evaluate(), bigmath.bignumber(0.1))
      assert.deepStrictEqual(bigmath.parse('1.2e5000').compile().evaluate(), bigmath.bignumber('1.2e5000'))

      assert.deepStrictEqual(bigmath.parse('0xffffffff').compile().evaluate(), bigmath.bignumber(0xffffffff))
      assert.deepStrictEqual(bigmath.parse('0x80000000i32').compile().evaluate(), bigmath.bignumber(-2147483648))
      assert.deepStrictEqual(bigmath.parse('0xffffffffi32').compile().evaluate(), bigmath.bignumber(-1))
      assert.deepStrictEqual(bigmath.parse('0xffffffffffffffffffffffffffffffffi128').compile().evaluate(), bigmath.bignumber(-1))
      assert.deepStrictEqual(bigmath.parse('0xffffffffffffffffffffffffffffffff').compile().evaluate(), bigmath.bignumber('0xffffffffffffffffffffffffffffffff'))
      assert.deepStrictEqual(bigmath.parse('0b1.1').compile().evaluate(), bigmath.bignumber(1.5))
      assert.deepStrictEqual(bigmath.parse('0o1.4').compile().evaluate(), bigmath.bignumber(1.5))
      assert.deepStrictEqual(bigmath.parse('0x1.8').compile().evaluate(), bigmath.bignumber(1.5))
      assert.deepStrictEqual(bigmath.parse('0x1.f').compile().evaluate(), bigmath.bignumber(1.9375))
      assert.deepStrictEqual(bigmath.parse('0b100.001').compile().evaluate(), bigmath.bignumber(4.125))
      assert.deepStrictEqual(bigmath.parse('0o100.001').compile().evaluate(), bigmath.bignumber(64.001953125))
      assert.deepStrictEqual(bigmath.parse('0x100.001').compile().evaluate(), bigmath.bignumber(256.000244140625))
      assert.deepStrictEqual(bigmath.parse('0b1.').compile().evaluate(), bigmath.bignumber(1))
      assert.deepStrictEqual(bigmath.parse('0o1.').compile().evaluate(), bigmath.bignumber(1))
      assert.deepStrictEqual(bigmath.parse('0x1.').compile().evaluate(), bigmath.bignumber(1))
    })
  })

  describe('fraction', function () {
    it('should output fractions if default number type is fraction', function () {
      const fmath = math.create({
        number: 'Fraction'
      })

      assert(fmath.parse('0.1').compile().evaluate() instanceof math.Fraction)
      assert.strictEqual(fmath.parse('1/3').compile().evaluate().toString(), '0.(3)')
      assert.strictEqual(fmath.parse('0.1+0.2').compile().evaluate().toString(), '0.3')
    })
  })

  describe('string (double quotes)', function () {
    it('should parse a string', function () {
      assert.deepStrictEqual(parseAndEval('"hello"'), 'hello')
      assert.deepStrictEqual(parseAndEval('   "hi" '), 'hi')
    })

    it('should parse a string containing escape characters', function () {
      // quote
      assert.deepStrictEqual(parseAndEval('"with\'quote"'), "with'quote")

      // escaped quote -> remove escape character
      assert.deepStrictEqual(parseAndEval('"with\\"quote"'), 'with"quote')
      assert.deepStrictEqual(parseAndEval('"with\\\'quote"'), "with'quote")

      // escaped escape character -> remove two escape characters
      assert.deepStrictEqual(parseAndEval('"with\\\\\\"quote"'), 'with\\"quote')
      assert.deepStrictEqual(parseAndEval('"with\\\\\'quote"'), "with\\'quote")
    })

    it('should parse a with escaped characters', function () {
      assert.deepStrictEqual(parseAndEval('"line end\\nnext"'), 'line end\nnext')
      assert.deepStrictEqual(parseAndEval('"line end\\n"'), 'line end\n')
      assert.deepStrictEqual(parseAndEval('"tab\\tnext"'), 'tab\tnext')
      assert.deepStrictEqual(parseAndEval('"tab\\t"'), 'tab\t')
      assert.deepStrictEqual(parseAndEval('"escaped backslash\\\\next"'), 'escaped backslash\\next')
      assert.deepStrictEqual(parseAndEval('"escaped backslash\\\\"'), 'escaped backslash\\')
    })

    it('should parse unicode characters', function () {
      assert.deepStrictEqual(parseAndEval('"★"'), '★')
      assert.deepStrictEqual(parseAndEval('"😀"'), '😀')
      assert.deepStrictEqual(parseAndEval('"\ud83d\ude00"'), '\ud83d\ude00')

      assert.deepStrictEqual(parseAndEval('"\\ud83d\\ude00"'), '😀')
      assert.deepStrictEqual(parseAndEval('"\\u2140"'), '⅀')
      assert.deepStrictEqual(parseAndEval('"\\u221B"'), '∛')
    })

    it('should throw an error on an invalid unicode character', function () {
      assert.throws(() => parseAndEval('"\\ud8'), /Invalid unicode character \\ud8/)
      assert.throws(() => parseAndEval('"\\ud8TT'), /Invalid unicode character \\ud8TT/)
    })

    it('should throw an error on an invalid escape character', function () {
      assert.throws(() => parseAndEval('"\\y'), /Bad escape character \\y/)
      assert.throws(() => parseAndEval('"\\v'), /Bad escape character \\v/)
    })

    it('should throw an error with invalid strings', function () {
      assert.throws(function () { parseAndEval('"hi') }, SyntaxError)
      assert.throws(function () { parseAndEval(' hi" ') }, Error)
    })

    it('should get a string subset', function () {
      const scope = {}
      assert.deepStrictEqual(parseAndEval('c="hello"', scope), 'hello')
      assert.deepStrictEqual(parseAndEval('c[2:4]', scope), 'ell')
      assert.deepStrictEqual(parseAndEval('c[5:-1:1]', scope), 'olleh')
      assert.deepStrictEqual(parseAndEval('c[end-2:-1:1]', scope), 'leh')
      assert.deepStrictEqual(parseAndEval('"hello"[2:4]', scope), 'ell')
    })

    it('should set a string subset', function () {
      const scope = {}
      assert.deepStrictEqual(parseAndEval('c="hello"', scope), 'hello')
      assert.deepStrictEqual(parseAndEval('c[1] = "H"', scope), 'H')
      assert.deepStrictEqual(scope.c, 'Hello')
      assert.deepStrictEqual(parseAndEval('c', scope), 'Hello')
      assert.deepStrictEqual(parseAndEval('c[6:11] = " world"', scope), ' world')
      assert.deepStrictEqual(scope.c, 'Hello world')
      assert.deepStrictEqual(parseAndEval('c[end] = "D"', scope), 'D')
      assert.deepStrictEqual(scope.c, 'Hello worlD')
    })

    it('should set a string subset on an object', function () {
      const scope = { a: {} }
      assert.deepStrictEqual(parseAndEval('a.c="hello"', scope), 'hello')
      assert.deepStrictEqual(parseAndEval('a.c[1] = "H"', scope), 'H')
      assert.deepStrictEqual(scope.a, { c: 'Hello' })
      assert.deepStrictEqual(parseAndEval('a.c', scope), 'Hello')
      assert.deepStrictEqual(parseAndEval('a.c[6:11] = " world"', scope), ' world')
      assert.deepStrictEqual(scope.a, { c: 'Hello world' })
      assert.deepStrictEqual(parseAndEval('a.c', scope), 'Hello world')
      assert.deepStrictEqual(scope.a, { c: 'Hello world' })
      assert.deepStrictEqual(parseAndEval('a.c[end] = "D"', scope), 'D')
      assert.deepStrictEqual(scope.a, { c: 'Hello worlD' })
    })
  })

  describe('string (single quotes)', function () {
    it('should parse a string', function () {
      assert.deepStrictEqual(parseAndEval('\'hello\''), 'hello')
      assert.deepStrictEqual(parseAndEval('   \'hi\' '), 'hi')
    })

    it('should parse a string containing escape characters', function () {
      // quote
      assert.deepStrictEqual(parseAndEval("'with\"quote'"), 'with"quote')

      // escaped quote -> remove escape character
      assert.deepStrictEqual(parseAndEval("'with\\'quote'"), "with'quote")
      assert.deepStrictEqual(parseAndEval("'with\\\"quote'"), 'with"quote')

      // escaped escape character -> remove two escape characters
      assert.deepStrictEqual(parseAndEval("'with\\\\\\'quote'"), "with\\'quote")
      assert.deepStrictEqual(parseAndEval("'with\\\\\"quote'"), 'with\\"quote')
    })

    it('should parse a string with escaped characters', function () {
      assert.deepStrictEqual(parseAndEval('\'line end\\nnext\''), 'line end\nnext')
      assert.deepStrictEqual(parseAndEval('\'line end\\n\''), 'line end\n')
      assert.deepStrictEqual(parseAndEval('\'tab\\tnext\''), 'tab\tnext')
      assert.deepStrictEqual(parseAndEval('\'tab\\t\''), 'tab\t')
      assert.deepStrictEqual(parseAndEval('\'escaped backslash\\\\next\''), 'escaped backslash\\next')
      assert.deepStrictEqual(parseAndEval('\'escaped backslash\\\\\''), 'escaped backslash\\')
    })

    it('should throw an error with invalid strings', function () {
      assert.throws(function () { parseAndEval('\'hi') }, SyntaxError)
      assert.throws(function () { parseAndEval(' hi\' ') }, Error)
    })

    it('should get a string subset', function () {
      const scope = {}
      assert.deepStrictEqual(parseAndEval('c=\'hello\'', scope), 'hello')
      assert.deepStrictEqual(parseAndEval('c[2:4]', scope), 'ell')
      assert.deepStrictEqual(parseAndEval('c[5:-1:1]', scope), 'olleh')
      assert.deepStrictEqual(parseAndEval('c[end-2:-1:1]', scope), 'leh')
      assert.deepStrictEqual(parseAndEval('\'hello\'[2:4]', scope), 'ell')
    })

    it('should set a string subset', function () {
      const scope = {}
      assert.deepStrictEqual(parseAndEval('c=\'hello\'', scope), 'hello')
      assert.deepStrictEqual(parseAndEval('c[1] = \'H\'', scope), 'H')
      assert.deepStrictEqual(scope.c, 'Hello')
      assert.deepStrictEqual(parseAndEval('c', scope), 'Hello')
      assert.deepStrictEqual(parseAndEval('c[6:11] = \' world\'', scope), ' world')
      assert.deepStrictEqual(scope.c, 'Hello world')
      assert.deepStrictEqual(parseAndEval('c[end] = \'D\'', scope), 'D')
      assert.deepStrictEqual(scope.c, 'Hello worlD')
    })

    it('should set a string subset on an object', function () {
      const scope = { a: {} }
      assert.deepStrictEqual(parseAndEval('a.c=\'hello\'', scope), 'hello')
      assert.deepStrictEqual(parseAndEval('a.c[1] = \'H\'', scope), 'H')
      assert.deepStrictEqual(scope.a, { c: 'Hello' })
      assert.deepStrictEqual(parseAndEval('a.c', scope), 'Hello')
      assert.deepStrictEqual(parseAndEval('a.c[6:11] = \' world\'', scope), ' world')
      assert.deepStrictEqual(scope.a, { c: 'Hello world' })
      assert.deepStrictEqual(parseAndEval('a.c', scope), 'Hello world')
      assert.deepStrictEqual(scope.a, { c: 'Hello world' })
      assert.deepStrictEqual(parseAndEval('a.c[end] = \'D\'', scope), 'D')
      assert.deepStrictEqual(scope.a, { c: 'Hello worlD' })
    })
  })

  describe('unit', function () {
    it('should parse units', function () {
      assert.deepStrictEqual(parseAndEval('5cm'), new Unit(5, 'cm'))
      assert.ok(parseAndEval('5cm') instanceof Unit)
    })

    it('should parse physical constants', function () {
      const expected = new Unit(299792458, 'm/s')
      expected.fixPrefix = true
      assert.deepStrictEqual(parseAndEval('speedOfLight'), expected)
    })

    it('should correctly parse negative temperatures', function () {
      approxDeepEqual(parseAndEval('-6 celsius'), new Unit(-6, 'celsius'))
      approxDeepEqual(parseAndEval('--6 celsius'), new Unit(6, 'celsius'))
      approxDeepEqual(parseAndEval('-6 celsius to fahrenheit'),
        new Unit(21.2, 'fahrenheit').to('fahrenheit'))
    })

    it('should convert units', function () {
      const scope = {}
      approxDeepEqual(parseAndEval('(5.08 cm * 1000) to inch', scope),
        math.unit(2000, 'inch').to('inch'))
      approxDeepEqual(parseAndEval('a = (5.08 cm * 1000) to mm', scope),
        math.unit(50800, 'mm').to('mm'))
      approxDeepEqual(parseAndEval('a to inch', scope),
        math.unit(2000, 'inch').to('inch'))

      approxDeepEqual(parseAndEval('10 celsius to fahrenheit'),
        math.unit(50, 'fahrenheit').to('fahrenheit'))
      approxDeepEqual(parseAndEval('20 celsius to fahrenheit'),
        math.unit(68, 'fahrenheit').to('fahrenheit'))
      approxDeepEqual(parseAndEval('50 fahrenheit to celsius'),
        math.unit(10, 'celsius').to('celsius'))
      approxDeepEqual(parseAndEval('degC to degF'),
        math.unit(1.8, 'degF').to('degF'))
    })

    it('should create units and aliases', function () {
      const myMath = math.create()
      myMath.evaluate('createUnit("knot", {definition: "0.514444444 m/s", aliases: ["knots", "kt", "kts"]})')
      assert.strictEqual(myMath.evaluate('5 knot').toString(), '5 knot')
      assert.strictEqual(myMath.evaluate('5 knots').toString(), '5 knots')
      assert.strictEqual(myMath.evaluate('5 kt').toString(), '5 kt')
    })

    it('should evaluate operator "to" with correct precedence ', function () {
      approxDeepEqual(parseAndEval('5.08 cm * 1000 to inch'),
        new Unit(2000, 'inch').to('inch'))
    })

    it('should evaluate operator "in" (alias of "to") ', function () {
      approxDeepEqual(parseAndEval('5.08 cm in inch'),
        new Unit(2, 'inch').to('inch'))
    })

    it('should evaluate unit "in" (should not conflict with operator "in")', function () {
      approxDeepEqual(parseAndEval('2 in'), new Unit(2, 'in'))
      approxEqual(parseAndEval('(2 lbf in).toNumeric("lbf in")'), 2)
      approxEqual(parseAndEval('[2 lbf in][1].toNumeric("lbf in")'), 2)
      approxEqual(parseAndEval('[2 lbf in, 5][1].toNumeric("lbf in")'), 2)
      approxEqual(parseAndEval('[2 lbf in; 5][1,1].toNumeric("lbf in")'), 2)
      approxEqual(parseAndEval('{foo:2 lbf in}["foo"].toNumeric("lbf in")'), 2)
      approxDeepEqual(parseAndEval('5.08 cm in in'), new Unit(2, 'in').to('in'))
      approxDeepEqual(parseAndEval('5 in in in'), new Unit(5, 'in').to('in'))
      approxDeepEqual(parseAndEval('2 in to meter'), new Unit(2, 'inch').to('meter'))
      approxDeepEqual(parseAndEval('2 in in meter'), new Unit(2, 'inch').to('meter'))
      approxDeepEqual(parseAndEval('a in inch', { a: new Unit(5.08, 'cm') }), new Unit(2, 'inch').to('inch'))
      approxDeepEqual(parseAndEval('(2+3) in'), new Unit(5, 'in'))
      approxDeepEqual(parseAndEval('a in', { a: 5 }), new Unit(5, 'in'))
      approxDeepEqual(parseAndEval('0.5in + 1.5in to cm'), new Unit(5.08, 'cm').to('cm'))

      assert(parseAndEval('2 meter^2').toString(), '2 meter^2')
      assert(parseAndEval('-2 meter^2').toString(), '-2 meter^2')
      assert(parseAndEval('2 in^2').toString(), '2 in^2')
      assert(parseAndEval('-2 in^2').toString(), '-2 in^2')
    })
  })

  describe('complex', function () {
    it('should parse complex values', function () {
      assert.deepStrictEqual(parseAndEval('i'), new Complex(0, 1))
      assert.deepStrictEqual(parseAndEval('2+3i'), new Complex(2, 3))
      assert.deepStrictEqual(parseAndEval('2+3*i'), new Complex(2, 3))
      assert.deepStrictEqual(parseAndEval('1/2i'), new Complex(0, 0.5))
    })
  })

  describe('matrix', function () {
    it('should parse a matrix', function () {
      assert.ok(parseAndEval('[1,2;3,4]') instanceof Matrix)

      const m = parseAndEval('[1,2,3;4,5,6]')
      assert.deepStrictEqual(m.size(), [2, 3])
      assert.deepStrictEqual(m, math.matrix([[1, 2, 3], [4, 5, 6]]))

      const b = parseAndEval('[5, 6; 1, 1]')
      assert.deepStrictEqual(b.size(), [2, 2])
      assert.deepStrictEqual(b, math.matrix([[5, 6], [1, 1]]))

      // from 1 to n dimensions
      assert.deepStrictEqual(parseAndEval('[ ]'), math.matrix([]))
      assert.deepStrictEqual(parseAndEval('[1,2,3]'), math.matrix([1, 2, 3]))
      assert.deepStrictEqual(parseAndEval('[1;2;3]'), math.matrix([[1], [2], [3]]))
      assert.deepStrictEqual(parseAndEval('[[1,2],[3,4]]'), math.matrix([[1, 2], [3, 4]]))
      assert.deepStrictEqual(parseAndEval('[[[1],[2]],[[3],[4]]]'), math.matrix([[[1], [2]], [[3], [4]]]))
    })

    it('should parse a matrix with trailing commas', function () {
      assert.ok(parseAndEval('[1,2;3,4;]') instanceof Matrix)

      const m = parseAndEval('[1,2,3;4,5,6;]')
      assert.deepStrictEqual(m.size(), [2, 3])
      assert.deepStrictEqual(m, math.matrix([[1, 2, 3], [4, 5, 6]]))

      const b = parseAndEval('[5, 6; 1, 1;]')
      assert.deepStrictEqual(b.size(), [2, 2])
      assert.deepStrictEqual(b, math.matrix([[5, 6], [1, 1]]))

      // from 1 to n dimensions
      assert.deepStrictEqual(parseAndEval('[ ]'), math.matrix([]))
      assert.deepStrictEqual(parseAndEval('[1,2,3,]'), math.matrix([1, 2, 3]))
      assert.deepStrictEqual(parseAndEval('[1;2;3;]'), math.matrix([[1], [2], [3]]))
      assert.deepStrictEqual(parseAndEval('[[1,2],[3,4],]'), math.matrix([[1, 2], [3, 4]]))
      assert.deepStrictEqual(parseAndEval('[[[1],[2]],[[3],[4]],]'), math.matrix([[[1], [2]], [[3], [4]]]))
    })

    it('should throw an error when multiple trailing commas/semicolons are in a matrix', function () {
      assert.throws(function () {
        parseAndEval('[1,2,3,,] ')
      }, /SyntaxError: Value expected/)

      assert.throws(function () {
        parseAndEval('[1,2;3,4;,] ')
      }, /SyntaxError: Value expected/)

      assert.throws(function () {
        parseAndEval('[1;2;3;;]')
      }, /SyntaxError: Value expected/)

      assert.throws(function () {
        parseAndEval('[[[1],[2]],[[3],[4]],,]')
      }, /SyntaxError: Value expected/)
    })

    it('should parse an empty matrix', function () {
      assert.deepStrictEqual(parseAndEval('[]'), math.matrix([]))
    })

    it('should get a matrix subset', function () {
      const scope = {
        a: math.matrix([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ])
      }
      assert.deepStrictEqual(parseAndEval('a[2, :]', scope), math.matrix([4, 5, 6]))
      assert.deepStrictEqual(parseAndEval('a[2, :2]', scope), math.matrix([4, 5]))
      assert.deepStrictEqual(parseAndEval('a[2, :end-1]', scope), math.matrix([4, 5]))
      assert.deepStrictEqual(parseAndEval('a[2, 2:]', scope), math.matrix([5, 6]))
      assert.deepStrictEqual(parseAndEval('a[2, 2:3]', scope), math.matrix([5, 6]))
      assert.deepStrictEqual(parseAndEval('a[2, 1:2:3]', scope), math.matrix([4, 6]))
      assert.deepStrictEqual(parseAndEval('a[:, 2]', scope), math.matrix([2, 5, 8]))
      assert.deepStrictEqual(parseAndEval('a[:2, [2]]', scope), math.matrix([[2], [5]]))
      assert.deepStrictEqual(parseAndEval('a[:end-1, [2]]', scope), math.matrix([[2], [5]]))
      assert.deepStrictEqual(parseAndEval('a[2:, [2]]', scope), math.matrix([[5], [8]]))
      assert.deepStrictEqual(parseAndEval('a[2:3, [2]]', scope), math.matrix([[5], [8]]))
      assert.deepStrictEqual(parseAndEval('a[1:2:3, [2]]', scope), math.matrix([[2], [8]]))
    })

    it('should get a matrix subset of a matrix subset', function () {
      const scope = {
        a: math.matrix([
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9]
        ])
      }
      assert.deepStrictEqual(parseAndEval('a[[2], :][1,1]', scope), 4)
    })

    it('should get BigNumber value from an array', function () {
      const res = parseAndEval('arr[1]', { arr: [math.bignumber(2)] })
      assert.deepStrictEqual(res, math.bignumber(2))
    })

    it('should parse matrix resizings', function () {
      const scope = {}
      assert.deepStrictEqual(parseAndEval('a = []', scope), math.matrix([]))
      assert.deepStrictEqual(parseAndEval('a[1:3,1] = [1;2;3]', scope), math.matrix([[1], [2], [3]]))
      assert.deepStrictEqual(parseAndEval('a[:,2] = [4;5;6]', scope), math.matrix([[4], [5], [6]]))
      assert.deepStrictEqual(scope.a, math.matrix([[1, 4], [2, 5], [3, 6]]))

      assert.deepStrictEqual(parseAndEval('a = []', scope), math.matrix([]))
      assert.strictEqual(parseAndEval('a[1,3] = 3', scope), 3)
      assert.deepStrictEqual(scope.a, math.matrix([[0, 0, 3]]))
      assert.deepStrictEqual(parseAndEval('a[2,:] = [[4,5,6]]', scope), math.matrix([[4, 5, 6]]))
      assert.deepStrictEqual(scope.a, math.matrix([[0, 0, 3], [4, 5, 6]]))

      assert.deepStrictEqual(parseAndEval('a = []', scope), math.matrix([]))
      assert.strictEqual(parseAndEval('a[3,1] = 3', scope), 3)
      assert.deepStrictEqual(scope.a, math.matrix([[0], [0], [3]]))
      assert.deepStrictEqual(parseAndEval('a[:,2] = [4;5;6]', scope), math.matrix([[4], [5], [6]]))
      assert.deepStrictEqual(scope.a, math.matrix([[0, 4], [0, 5], [3, 6]]))

      assert.deepStrictEqual(parseAndEval('a = []', scope), math.matrix([]))
      assert.deepStrictEqual(parseAndEval('a[1,1:3] = [[1,2,3]]', scope), math.matrix([[1, 2, 3]]))
      assert.deepStrictEqual(scope.a, math.matrix([[1, 2, 3]]))
      assert.deepStrictEqual(parseAndEval('a[2,:] = [[4,5,6]]', scope), math.matrix([[4, 5, 6]]))
      assert.deepStrictEqual(scope.a, math.matrix([[1, 2, 3], [4, 5, 6]]))
    })

    it('should get/set the matrix correctly', function () {
      const scope = {}
      parseAndEval('a=[1,2;3,4]', scope)
      parseAndEval('a[1,1] = 100', scope)
      assert.deepStrictEqual(scope.a.size(), [2, 2])
      assert.deepStrictEqual(scope.a, math.matrix([[100, 2], [3, 4]]))
      parseAndEval('a[2:3,2:3] = [10,11;12,13]', scope)
      assert.deepStrictEqual(scope.a.size(), [3, 3])
      assert.deepStrictEqual(scope.a, math.matrix([[100, 2, 0], [3, 10, 11], [0, 12, 13]]))
      const a = scope.a
      // note: after getting subset, uninitialized elements are replaced by elements with an undefined value
      assert.deepStrictEqual(a.subset(math.index(new Range(0, 3), new Range(0, 2))), math.matrix([[100, 2], [3, 10], [0, 12]]))
      assert.deepStrictEqual(parseAndEval('a[1:3,1:2]', scope), math.matrix([[100, 2], [3, 10], [0, 12]]))

      scope.b = [[1, 2], [3, 4]]
      assert.deepStrictEqual(parseAndEval('b[1,:]', scope), [1, 2])
    })

    it('should get/set the matrix correctly for 3d matrices', function () {
      const scope = {}
      assert.deepStrictEqual(parseAndEval('f=[1,2;3,4]', scope), math.matrix([[1, 2], [3, 4]]))
      assert.deepStrictEqual(parseAndEval('size(f)', scope), [2, 2])

      parseAndEval('f[:,:,2]=[5,6;7,8]', scope)
      assert.deepStrictEqual(scope.f, math.matrix([
        [
          [1, 5],
          [2, 6]
        ],
        [
          [3, 7],
          [4, 8]
        ]
      ]))

      assert.deepStrictEqual(parseAndEval('size(f)', scope), [2, 2, 2])
      assert.deepStrictEqual(parseAndEval('f[:,:,1]', scope), math.matrix([[1, 2], [3, 4]]))
      assert.deepStrictEqual(parseAndEval('f[:,:,2]', scope), math.matrix([[5, 6], [7, 8]]))
      assert.deepStrictEqual(parseAndEval('f[:,2,:]', scope), math.matrix([[2, 6], [4, 8]]))
      assert.deepStrictEqual(parseAndEval('f[2,:,:]', scope), math.matrix([[3, 7], [4, 8]]))

      parseAndEval('a=diag([1,2,3,4])', scope)
      assert.deepStrictEqual(parseAndEval('a[3:end, 3:end]', scope), math.matrix([[3, 0], [0, 4]]))
      parseAndEval('a[3:end, 2:end]=9*ones(2,3)', scope)
      assert.deepStrictEqual(scope.a, math.matrix([
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 9, 9, 9],
        [0, 9, 9, 9]
      ]))
      assert.deepStrictEqual(parseAndEval('a[2:end-1, 2:end-1]', scope), math.matrix([[2, 0], [9, 9]]))
    })

    it('should get and set broadcasted submatrices in the parser', function () {
      const scope = {}
      parseAndEval('A = [1, 2, 3, 4]', scope)
      assert.deepStrictEqual(parseAndEval('A[A>2]', scope), math.matrix([3, 4]))
      parseAndEval('A[A>2] = 20', scope)
      assert.deepStrictEqual(scope.A, math.matrix([1, 2, 20, 20]))
      parseAndEval('A = [1, 2, 3, 4]', scope)
      parseAndEval('A[A > 2] = [15]', scope)
      assert.deepStrictEqual(scope.A, math.matrix([1, 2, 15, 15]))
    })

    it('should merge nested matrices', function () {
      const scope = {}
      parseAndEval('a=[1,2;3,4]', scope)
    })

    it('should parse matrix concatenations', function () {
      const scope = {}
      parseAndEval('a=[1,2;3,4]', scope)
      parseAndEval('b=[5,6;7,8]', scope)
      assert.deepStrictEqual(parseAndEval('c=concat(a,b)', scope), math.matrix([[1, 2, 5, 6], [3, 4, 7, 8]]))
      assert.deepStrictEqual(parseAndEval('c=concat(a,b,1)', scope), math.matrix([[1, 2], [3, 4], [5, 6], [7, 8]]))
      assert.deepStrictEqual(parseAndEval('c=concat(concat(a,b), concat(b,a), 1)', scope), math.matrix([[1, 2, 5, 6], [3, 4, 7, 8], [5, 6, 1, 2], [7, 8, 3, 4]]))
      assert.deepStrictEqual(parseAndEval('c=concat([[1,2]], [[3,4]], 1)', scope), math.matrix([[1, 2], [3, 4]]))
      assert.deepStrictEqual(parseAndEval('c=concat([[1,2]], [[3,4]], 2)', scope), math.matrix([[1, 2, 3, 4]]))
      assert.deepStrictEqual(parseAndEval('c=concat([[1]], [2;3], 1)', scope), math.matrix([[1], [2], [3]]))
      assert.deepStrictEqual(parseAndEval('d=1:3', scope), math.matrix([1, 2, 3]))
      assert.deepStrictEqual(parseAndEval('concat(d,d)', scope), math.matrix([1, 2, 3, 1, 2, 3]))
      assert.deepStrictEqual(parseAndEval('e=1+d', scope), math.matrix([2, 3, 4]))
      assert.deepStrictEqual(parseAndEval('size(e)', scope), [3])
      assert.deepStrictEqual(parseAndEval('concat(e,e)', scope), math.matrix([2, 3, 4, 2, 3, 4]))
      assert.deepStrictEqual(parseAndEval('[[],[]]', scope), math.matrix([[], []]))
      assert.deepStrictEqual(parseAndEval('[[],[]]', scope).size(), [2, 0])
      assert.deepStrictEqual(parseAndEval('size([[],[]])', scope), [2, 0])
    })

    it('should disable arrays as range in a matrix index', function () {
      const scope = {
        a: [[1, 2, 3], [4, 5, 6]]
      }

      assert.throws(function () {
        parseAndEval('a[2, 2+3i]', scope)
      }, /TypeError: Dimension must be an Array,.*or Range/)
    })

    it('should throw an error for invalid matrix', function () {
      assert.throws(function () { parseAndEval('[1, 2') }, /End of matrix ] expected/)
      assert.throws(function () { parseAndEval('[1; 2') }, /End of matrix ] expected/)
    })

    it('should throw an error when matrix rows mismatch', function () {
      assert.throws(function () { parseAndEval('[1, 2; 1, 2, 3]') }, /Column dimensions mismatch/)
    })

    it('should throw an error for invalid matrix subsets', function () {
      const scope = { a: [1, 2, 3] }
      assert.throws(function () { parseAndEval('a[1', scope) }, /Parenthesis ] expected/)
    })

    it('should throw an error for invalid matrix concatenations', function () {
      const scope = {}
      assert.throws(function () { parseAndEval('c=concat(a, [1,2,3])', scope) })
    })
  })

  describe('objects', function () {
    it('should get an object property', function () {
      assert.deepStrictEqual(parseAndEval('obj["foo"]', { obj: { foo: 2 } }), 2)
    })

    it('should get an object property using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]', { obj: { foo: 2 } }), 2)
    })

    it('should return undefined accessing a property of undefined using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]', { obj: undefined }), undefined)
    })

    it('should return undefined accessing a property of null using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]', { obj: null }), undefined)
    })

    it('should get a nested object property', function () {
      assert.deepStrictEqual(parseAndEval('obj["foo"]["bar"]', { obj: { foo: { bar: 2 } } }), 2)
    })

    it('should get a nested object property using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.["bar"]', { obj: { foo: { bar: 2 } } }), 2)
    })

    it('should return undefined accessing a nested property of undefined using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj["foo"]?.["bar"]', { obj: { foo: undefined } }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]["bar"]', { obj: undefined }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.["bar"]', { obj: undefined }), undefined)
    })

    it('should return undefined accessing a nested property of null using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj["foo"]?.["bar"]', { obj: { foo: null } }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]["bar"]', { obj: null }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.["bar"]', { obj: null }), undefined)
    })

    it('should throw an error accessing a nested property of undefined using optional chaining', function () {
      assert.throws(function () { parseAndEval('obj["foo"]?.["bar"]', { obj: undefined }) }, TypeError)
      assert.throws(function () { parseAndEval('obj?.["foo"]["bar"]', { obj: { foo: undefined } }) }, TypeError)
    })

    it('should throw an error accessing a nested null of null using optional chaining', function () {
      assert.throws(function () { parseAndEval('obj["foo"]?.["bar"]', { obj: null }) }, TypeError)
      assert.throws(function () { parseAndEval('obj?.["foo"]["bar"]', { obj: { foo: null } }) }, TypeError)
    })

    it('should get a nested matrix subset from an object property', function () {
      assert.deepStrictEqual(parseAndEval('obj.foo[2]', { obj: { foo: [1, 2, 3] } }), 2)
      assert.deepStrictEqual(parseAndEval('obj.foo[end]', { obj: { foo: [1, 2, 3] } }), 3)
      assert.deepStrictEqual(parseAndEval('obj.foo[2][3]', { obj: { foo: ['hello', 'world'] } }), 'r')
      assert.deepStrictEqual(parseAndEval('obj.foo[2][end]', { obj: { foo: ['hello', 'world'] } }), 'd')
      assert.deepStrictEqual(parseAndEval('obj.foo[1].bar', { obj: { foo: [{ bar: 4 }] } }), 4)
    })

    it('should get a property with the name of an operator like "to" or "in"', function () {
      assert.deepStrictEqual(parseAndEval('obj.mod', { obj: { mod: 42 } }), 42)
      assert.deepStrictEqual(parseAndEval('obj.in', { obj: { in: 42 } }), 42)
      assert.deepStrictEqual(parseAndEval('obj.to', { obj: { to: 42 } }), 42)
    })

    it('should set an object property', function () {
      const scope = { obj: { a: 3 } }
      const res = parseAndEval('obj["b"] = 2', scope)
      assert.strictEqual(res, 2)
      assert.deepStrictEqual(scope, { obj: { a: 3, b: 2 } })
      assert.deepStrictEqual(
        parseAndEval('b = {}; b.a = 2; b').valueOf(), [{ a: 2 }])
    })

    it('should set a nested object property', function () {
      const scope = { obj: { foo: {} } }
      const res = parseAndEval('obj["foo"]["bar"] = 2', scope)
      assert.strictEqual(res, 2)
      assert.deepStrictEqual(scope, { obj: { foo: { bar: 2 } } })
    })

    it(
      'should not set an object property through optional chaining',
      function () {
        assert.throws(
          () => parseAndEval('obj = {a: 2}; obj?.b = 7'), SyntaxError)
        assert.throws(
          () => parseAndEval('obj = {a: 2}; obj?.["b"] = 7'), SyntaxError)
        assert.throws(
          () => parseAndEval('obj = {a: {}}; obj.a?.b = 7'), SyntaxError)
      })

    it('should throw an error when trying to apply a matrix index as object property', function () {
      const scope = { a: {} }
      assert.throws(function () {
        parseAndEval('a[2] = 6', scope)
      }, /Cannot apply a numeric index as object property/)
    })

    it('should set a nested matrix subset from an object property (1)', function () {
      const scope = { obj: { foo: [1, 2, 3] } }
      assert.deepStrictEqual(parseAndEval('obj.foo[2] = 6', scope), 6)
      assert.deepStrictEqual(scope, { obj: { foo: [1, 6, 3] } })

      assert.deepStrictEqual(parseAndEval('obj.foo[end] = 8', scope), 8)
      assert.deepStrictEqual(scope, { obj: { foo: [1, 6, 8] } })
    })

    it('should set a nested matrix subset from an object property (2)', function () {
      const scope = { obj: { foo: [{ bar: 4 }] } }
      assert.deepStrictEqual(parseAndEval('obj.foo[1].bar = 6', scope), 6)
      assert.deepStrictEqual(scope, { obj: { foo: [{ bar: 6 }] } })
    })

    it('should set a nested matrix subset from an object property (3)', function () {
      const scope = { obj: { foo: [{ bar: {} }] } }
      assert.deepStrictEqual(parseAndEval('obj.foo[1].bar.baz = 6', scope), 6)
      assert.deepStrictEqual(scope, { obj: { foo: [{ bar: { baz: 6 } }] } })
    })

    it('should set a nested matrix subset from an object property (4)', function () {
      const scope = { obj: { foo: ['hello', 'world'] } }
      assert.deepStrictEqual(parseAndEval('obj.foo[1][end] = "a"', scope), 'a')
      assert.deepStrictEqual(scope, { obj: { foo: ['hella', 'world'] } })
      assert.deepStrictEqual(parseAndEval('obj.foo[end][end] = "!"', scope), '!')
      assert.deepStrictEqual(scope, { obj: { foo: ['hella', 'worl!'] } })
    })

    // TODO: test whether 1-based IndexErrors are thrown

    it('should get an object property with dot notation', function () {
      assert.deepStrictEqual(parseAndEval('obj.foo', { obj: { foo: 2 } }), 2)
    })

    it('should get an object property with dot notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.foo', { obj: { foo: 2 } }), 2)
    })

    it('should return undefined accessing a property of undefined with dot notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.foo', { obj: undefined }), undefined)
    })

    it('should return undefined accessing a property of null with dot notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.foo', { obj: null }), undefined)
    })

    it('should get an object property from an object inside parentheses', function () {
      assert.deepStrictEqual(parseAndEval('(obj).foo', { obj: { foo: 2 } }), 2)
    })

    it('should get an object property from an object inside parentheses using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('(obj)?.foo', { obj: { foo: 2 } }), 2)
    })

    it('should get a nested object property with dot notation', function () {
      assert.deepStrictEqual(parseAndEval('obj.foo.bar', { obj: { foo: { bar: 2 } } }), 2)
    })

    it('should get a nested object property with dot notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.foo?.bar', { obj: { foo: { bar: 2 } } }), 2)
    })

    it('should return undefined accessing a nested property of undefined with dot notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj.foo?.bar', { obj: { foo: undefined } }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.foo?.bar', { obj: undefined }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.foo.bar', { obj: undefined }), undefined)
    })

    it('should return undefined accessing a nested property of null with dot notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj.foo?.bar', { obj: { foo: null } }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.foo.bar', { obj: null }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.foo?.bar', { obj: null }), undefined)
    })

    it('should throw an error accessing a nested property of undefined with dot notation using optional chaining', function () {
      assert.throws(function () { parseAndEval('obj.foo?.bar', { obj: undefined }) }, TypeError)
      assert.throws(function () { parseAndEval('obj?.foo.bar', { obj: { foo: undefined } }) }, TypeError)
    })

    it('should throw an error accessing a nested property of null with dot notation using optional chaining', function () {
      assert.throws(function () { parseAndEval('obj.foo?.bar', { obj: null }) }, TypeError)
      assert.throws(function () { parseAndEval('obj?.foo.bar', { obj: { foo: null } }) }, TypeError)
    })

    it('should get a nested object property e using dot notation', function () {
      // in the past, the parser was trying to parse '.e' as a number
      const scope = { a: { e: { x: 2 } } }
      assert.deepStrictEqual(parseAndEval('a.e', scope), { x: 2 })
      assert.strictEqual(parseAndEval('a.e.x', scope), 2)
    })

    it('should invoke a function in an object', function () {
      const scope = {
        obj: {
          fn: function (x) {
            return x * x
          }
        }
      }
      assert.deepStrictEqual(parseAndEval('obj.fn(2)', scope), 4)
      assert.deepStrictEqual(parseAndEval('obj["fn"](2)', scope), 4)
    })

    it('should invoke a function in an object using optional chaining', function () {
      const scope = {
        obj: {
          fn: function (x) {
            return x * x
          }
        }
      }
      assert.deepStrictEqual(parseAndEval('obj?.fn(2)', scope), 4)
      assert.deepStrictEqual(parseAndEval('obj?.["fn"](2)', scope), 4)
    })

    it('should return undefined when invoking an undefined function using optional chaining', function () {
      const scope = { obj: undefined }
      assert.deepStrictEqual(parseAndEval('obj?.fn(2)', scope), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["fn"](2)', scope), undefined)
    })

    it('should return undefined when invoking a null function using optional chaining', function () {
      const scope = { obj: null }
      assert.deepStrictEqual(parseAndEval('obj?.fn(2)', scope), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["fn"](2)', scope), undefined)
    })

    it('should get a object property from a function result using optional chaining', function () {
      const scope = {
        obj: {
          fn: function (x) {
            return { foo: x }
          }
        }
      }
      assert.deepStrictEqual(parseAndEval('obj.fn(2)?.foo', scope), 2)
      assert.deepStrictEqual(parseAndEval('obj["fn"](2)?.foo', scope), 2)
    })

    it('should return undefined accessing an undefined function result using optional chaining', function () {
      const scope = {
        obj: {
          fn: function () {
            return undefined
          }
        }
      }
      assert.deepStrictEqual(parseAndEval('obj.fn(2)?.foo', scope), undefined)
      assert.deepStrictEqual(parseAndEval('obj["fn"](2)?.foo', scope), undefined)
    })

    it('should return undefined accessing a null function result using optional chaining', function () {
      const scope = {
        obj: {
          fn: function () {
            return null
          }
        }
      }
      assert.deepStrictEqual(parseAndEval('obj.fn(2)?.foo', scope), undefined)
      assert.deepStrictEqual(parseAndEval('obj["fn"](2)?.foo', scope), undefined)
    })

    it('should apply implicit multiplication after a function call', function () {
      assert.deepStrictEqual(parseAndEval('sqrt(4)(1+2)'), 6)
      assert.deepStrictEqual(parseAndEval('sqrt(4)(1+2)(2)'), 12)
    })

    it('should invoke a function on an object with the right context', function () {
      approxEqual(parseAndEval('(2.54 cm).toNumeric("inch")'), 1)
      assert.deepStrictEqual(parseAndEval('bignumber(2).plus(3)'), math.bignumber(5))
      assert.deepStrictEqual(parseAndEval('bignumber(2)["plus"](3)'), math.bignumber(5))
    })

    it('should invoke native methods on a number', function () {
      assert.strictEqual(parseAndEval('(3).toString()'), '3')
      assert.strictEqual(parseAndEval('(3.2).toFixed()'), '3')
    })

    it('should get nested object property with mixed dot- and index-notation', function () {
      assert.deepStrictEqual(parseAndEval('obj.foo["bar"].baz', { obj: { foo: { bar: { baz: 2 } } } }), 2)
      assert.deepStrictEqual(parseAndEval('obj["foo"].bar["baz"]', { obj: { foo: { bar: { baz: 2 } } } }), 2)
    })

    it('should get nested object property with mixed dot- and index-notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.foo?.["bar"]?.baz', { obj: { foo: { bar: { baz: 2 } } } }), 2)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.bar?.["baz"]', { obj: { foo: { bar: { baz: 2 } } } }), 2)
    })

    it('should return undefined accessing a property of undefined with mixed dot- and index-notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.foo?.["bar"]?.baz', { obj: undefined }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.bar?.["baz"]', { obj: undefined }), undefined)

      assert.deepStrictEqual(parseAndEval('obj?.foo?.["bar"]?.baz', { obj: { foo: undefined } }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.bar?.["baz"]', { obj: { foo: undefined } }), undefined)

      assert.deepStrictEqual(parseAndEval('obj?.foo?.["bar"]?.baz', { obj: { foo: { bar: undefined } } }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.bar?.["baz"]', { obj: { foo: { bar: undefined } } }), undefined)
    })

    it('should return undefined accessing a property of null with mixed dot- and index-notation using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('obj?.foo?.["bar"]?.baz', { obj: null }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.bar?.["baz"]', { obj: null }), undefined)

      assert.deepStrictEqual(parseAndEval('obj?.foo?.["bar"]?.baz', { obj: { foo: null } }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.bar?.["baz"]', { obj: { foo: null } }), undefined)

      assert.deepStrictEqual(parseAndEval('obj?.foo?.["bar"]?.baz', { obj: { foo: { bar: null } } }), undefined)
      assert.deepStrictEqual(parseAndEval('obj?.["foo"]?.bar?.["baz"]', { obj: { foo: { bar: null } } }), undefined)
    })

    it('should throw an error accessing a nested property of undefined with mixed dot- and index-notation using optional chaining', function () {
      assert.throws(function () { parseAndEval('obj.foo?.["bar"]?.baz', { obj: undefined }) }, TypeError)
      assert.throws(function () { parseAndEval('obj.foo["bar"]?.baz', { obj: { foo: undefined } }) }, TypeError)
      assert.throws(function () { parseAndEval('obj.foo["bar"].baz', { obj: { foo: { bar: undefined } } }) }, TypeError)
    })

    it('should throw an error accessing a nested property of null with mixed dot- and index-notation using optional chaining', function () {
      assert.throws(function () { parseAndEval('obj.foo?.["bar"]?.baz', { obj: null }) }, TypeError)
      assert.throws(function () { parseAndEval('obj.foo["bar"]?.baz', { obj: { foo: null } }) }, TypeError)
      assert.throws(function () { parseAndEval('obj.foo["bar"].baz', { obj: { foo: { bar: null } } }) }, TypeError)
    })

    it('should throw an error when using double-dot after optional chaining operator', function () {
      // ?.. is not valid in JavaScript and should be rejected
      assert.throws(function () { parseAndEval('{a: 3}?..a') }, /SyntaxError: Property name expected after optional chain \(char 9\)/)
      assert.throws(function () { parseAndEval('obj?..foo', { obj: { foo: 2 } }) }, /SyntaxError: Property name expected after optional chain \(char 6\)/)
      assert.throws(function () { parseAndEval('obj?.["a"]?..b', { obj: { a: { b: 2 } } }) }, /SyntaxError: Property name expected after optional chain \(char 13\)/)
    })

    it('should set an object property with dot notation', function () {
      const scope = { obj: {} }
      parseAndEval('obj.foo = 2', scope)
      assert.deepStrictEqual(scope, { obj: { foo: 2 } })
    })

    it('should set an object property with dot notation', function () {
      const scope = { obj: {} }
      parseAndEval('obj.foo = 2', scope)
      assert.deepStrictEqual(scope, { obj: { foo: 2 } })
    })

    it('should set a nested object property with dot notation', function () {
      const scope = { obj: { foo: {} } }
      parseAndEval('obj.foo.bar = 2', scope)
      assert.deepStrictEqual(scope, { obj: { foo: { bar: 2 } } })
    })

    it('should throw an error in case of invalid property with dot notation', function () {
      assert.throws(function () { parseAndEval('obj. +foo') }, /SyntaxError: Property name expected after dot \(char 6\)/)
      assert.throws(function () { parseAndEval('obj.["foo"]') }, /SyntaxError: Property name expected after dot \(char 5\)/)
    })

    it('should create an empty object', function () {
      assert.deepStrictEqual(parseAndEval('{}'), {})
    })

    it('should spread a object over multiple lines', function () {
      assert.deepStrictEqual(parseAndEval('{\na:2+3,\nb:"foo"\n}'), { a: 5, b: 'foo' })
    })

    it('should create an object with quoted keys', function () {
      assert.deepStrictEqual(parseAndEval('{"a":2+3,"b":"foo"}'), { a: 5, b: 'foo' })
    })

    it('should create an object with unquoted keys', function () {
      assert.deepStrictEqual(parseAndEval('{a:2+3,b:"foo"}'), { a: 5, b: 'foo' })
    })

    it('should create an object with unquoted keys that are keywords', function () {
      assert.deepStrictEqual(parseAndEval('{ mod: 1, and: 1, not: 1, or: 1, xor: 1, to: 1, in: 1 }'), { mod: 1, and: 1, not: 1, or: 1, xor: 1, to: 1, in: 1 })
    })

    it('should create an object with child object', function () {
      assert.deepStrictEqual(parseAndEval('{a:{b:2}}'), { a: { b: 2 } })
    })

    it('should get a property from a just created object', function () {
      assert.deepStrictEqual(parseAndEval('{foo:2}["foo"]'), 2)
    })

    it('should get a property from a just created object using optional chaining', function () {
      assert.deepStrictEqual(parseAndEval('{foo:2}?.["foo"]'), 2)
    })

    it('should parse an object containing a function assignment', function () {
      const obj = parseAndEval('{f: f(x)=x^2}')
      assert.deepStrictEqual(Object.keys(obj), ['f'])
      assert.strictEqual(obj.f(2), 4)
    })

    it('should not parse a function assignment in an accessor node', function () {
      assert.throws(function () {
        const scope = {}
        parseAndEval('a["b"](x)=x^2', scope)
      }, /SyntaxError: Invalid left hand side of assignment operator =/)
    })

    it('should parse an object containing a variable assignment', function () {
      const scope = {}
      assert.deepStrictEqual(parseAndEval('{f: a=42}', scope), { f: 42 })
      assert.strictEqual(scope.a, 42)
    })

    it('should throw an exception in case of invalid object key', function () {
      assert.throws(function () { parseAndEval('{a b: 2}') }, /SyntaxError: Colon : expected after object key \(char 4\)/)
      assert.throws(function () { parseAndEval('{a: }') }, /SyntaxError: Value expected \(char 5\)/)
    })
  })

  describe('boolean', function () {
    it('should parse boolean values', function () {
      assert.strictEqual(parseAndEval('true'), true)
      assert.strictEqual(parseAndEval('false'), false)
    })
  })

  describe('constants', function () {
    it('should parse symbolic constants', function () {
      assert.strictEqual(parse('i').type, 'SymbolNode')
      assert.deepStrictEqual(parseAndEval('i'), new Complex(0, 1))
      approxEqual(parseAndEval('pi'), Math.PI)
      approxEqual(parseAndEval('e'), Math.E)
    })

    it('should parse constants', function () {
      assert.strictEqual(parse('true').type, 'ConstantNode')
      assert.deepStrictEqual(parse('true'), new ConstantNode(true))
      assert.deepStrictEqual(parse('false'), new ConstantNode(false))
      assert.deepStrictEqual(parse('null'), new ConstantNode(null))
      assert.deepStrictEqual(parse('undefined'), new ConstantNode(undefined))
    })

    it('should parse numeric constants', function () {
      const nanConstantNode = parse('NaN')
      assert.deepStrictEqual(nanConstantNode.type, 'ConstantNode')
      assert.ok(isNaN(nanConstantNode.value))
      assert.deepStrictEqual(parse('Infinity'), new ConstantNode(Infinity))
    })

    it('should evaluate constants', function () {
      // Do these tests really belong in constants.test.js ?
      approxEqual(math.sin(math.pi / 2), 1)

      assert.deepStrictEqual(math.round(math.add(1, math.pow(math.e, math.multiply(math.pi, math.i))), 5), math.complex(0))
      assert.deepStrictEqual(math.round(math.evaluate('1+e^(pi*i)'), 5), math.complex(0))

      assert.deepStrictEqual(math.sqrt(-1), math.i)
      assert.deepStrictEqual(math.evaluate('i'), math.complex(0, 1))

      assert.strictEqual(math.evaluate('true'), true)
      assert.strictEqual(math.evaluate('false'), false)
    })
  })

  describe('variables', function () {
    it('should parse valid variable assignments', function () {
      const scope = {}
      assert.strictEqual(parseAndEval('a = 0.75', scope), 0.75)
      assert.strictEqual(parseAndEval('a + 2', scope), 2.75)
      assert.strictEqual(parseAndEval('a = 2', scope), 2)
      assert.strictEqual(parseAndEval('a + 2', scope), 4)
      approxEqual(parseAndEval('pi * 2', scope), 6.283185307179586)
    })

    it('should throw an error on undefined symbol', function () {
      assert.throws(function () { parseAndEval('qqq + 2') })
    })

    it('should throw an error on invalid assignments', function () {
      // assert.throws(function () {parseAndEval('sin(2) = 0.75')}, SyntaxError); // TODO: should this throw an exception?
      assert.throws(function () { parseAndEval('sin + 2 = 3') }, SyntaxError)
    })

    it('should parse nested assignments', function () {
      const scope = {}
      assert.strictEqual(parseAndEval('c = d = (e = 4.5)', scope), 4.5)
      assert.strictEqual(scope.c, 4.5)
      assert.strictEqual(scope.d, 4.5)
      assert.strictEqual(scope.e, 4.5)
      assert.deepStrictEqual(parseAndEval('a = [1,2,f=3]', scope), math.matrix([1, 2, 3]))
      assert.strictEqual(scope.f, 3)
      assert.strictEqual(parseAndEval('2 + (g = 3 + 4)', scope), 9)
      assert.strictEqual(scope.g, 7)
    })

    it('should parse variable assignment inside a function call', function () {
      const scope = {}
      assert.deepStrictEqual(parseAndEval('sqrt(x=4)', scope), 2)
      assert.deepStrictEqual(scope, { x: 4 })
    })

    it('should parse variable assignment inside an accessor', function () {
      const scope = { A: [10, 20, 30] }
      assert.deepStrictEqual(parseAndEval('A[x=2]', scope), 20)
      assert.deepStrictEqual(scope, { A: [10, 20, 30], x: 2 })
    })
  })

  describe('functions', function () {
    it('should parse functions', function () {
      assert.strictEqual(parseAndEval('sqrt(4)'), 2)
      assert.strictEqual(parseAndEval('sqrt(6+3)'), 3)
      assert.strictEqual(parseAndEval('atan2(2,2)'), 0.7853981633974483)
      assert.deepStrictEqual(parseAndEval('sqrt(-4)'), new Complex(0, 2))
      assert.strictEqual(parseAndEval('abs(-4.2)'), 4.2)
      assert.strictEqual(parseAndEval('add(2, 3)'), 5)
      approxDeepEqual(parseAndEval('1+exp(pi*i)'), new Complex(0, 0))
      assert.strictEqual(parseAndEval('unequal(2, 3)'), true)
    })

    it('should get a subset of a matrix returned by a function', function () {
      const scope = {
        test: function () {
          return [1, 2, 3, 4]
        }
      }
      assert.strictEqual(parseAndEval('test()[2]', scope), 2)
    })

    it('should parse column function', function () {
      const a = [
        [0, 2, 0, 0, 0],
        [0, 1, 0, 2, 4],
        [0, 0, 0, 0, 0],
        [8, 4, 0, 3, 0],
        [0, 0, 0, 6, 0]
      ]
      const m = math.matrix(a)
      const c = math.matrix([[2], [1], [0], [4], [0]])
      const scope = {
        test: function () {
          return m
        }
      }
      assert.deepStrictEqual(parseAndEval('column(test(),2)', scope), c)
    })

    it('should parse row function', function () {
      const a = [
        [0, 2, 0, 0, 0],
        [0, 1, 0, 2, 4],
        [0, 0, 0, 0, 0],
        [8, 4, 0, 3, 0],
        [0, 0, 0, 6, 0]
      ]
      const m = math.matrix(a)
      const r = math.matrix([[0, 1, 0, 2, 4]])
      const scope = {
        test: function () {
          return m
        }
      }
      assert.deepStrictEqual(parseAndEval('row(test(),2)', scope), r)
    })

    it('should parse functions without parameters', function () {
      assert.strictEqual(parseAndEval('r()', { r: function () { return 2 } }), 2)
    })

    it('should parse function assignments', function () {
      const scope = {}
      parseAndEval('x=100', scope) // for testing scoping of the function variables
      assert.strictEqual(parseAndEval('f(x) = x^2', scope).syntax, 'f(x)')
      assert.strictEqual(parseAndEval('f(3)', scope), 9)
      assert.strictEqual(scope.f(3), 9)
      assert.strictEqual(scope.x, 100)
      assert.strictEqual(parseAndEval('g(x, y) = x^y', scope).syntax, 'g(x, y)')
      assert.strictEqual(parseAndEval('g(4,5)', scope), 1024)
      assert.strictEqual(scope.g(4, 5), 1024)
    })

    it('should correctly evaluate variables in assigned functions', function () {
      const scope = {}
      assert.strictEqual(parseAndEval('a = 3', scope), 3)
      assert.strictEqual(parseAndEval('f(x) = a * x', scope).syntax, 'f(x)')
      assert.strictEqual(parseAndEval('f(2)', scope), 6)
      assert.strictEqual(parseAndEval('a = 5', scope), 5)
      assert.strictEqual(parseAndEval('f(2)', scope), 10)
      assert.strictEqual(parseAndEval('g(x) = x^q', scope).syntax, 'g(x)')
      assert.strictEqual(parseAndEval('q = 4/2', scope), 2)
      assert.strictEqual(parseAndEval('g(3)', scope), 9)
    })

    it('should throw an error for undefined variables in an assigned function', function () {
      const scope = {}
      assert.strictEqual(parseAndEval('g(x) = x^q', scope).syntax, 'g(x)')
      assert.throws(function () {
        parseAndEval('g(3)', scope)
      }, function (err) {
        return (err instanceof Error) && (err.toString() === 'Error: Undefined symbol q')
      })
    })

    it('should throw an error on invalid left hand side of a function assignment', function () {
      assert.throws(function () {
        const scope = {}
        parseAndEval('g(x, 2) = x^2', scope)
      }, SyntaxError)

      assert.throws(function () {
        const scope = {}
        parseAndEval('2(x, 2) = x^2', scope)
      }, SyntaxError)
    })

    it('should call functions via optional chaining', function () {
      assert.strictEqual(parseAndEval('square?.(2)'), 4)
      assert.deepStrictEqual(parseAndEval('f(x) = x+x; f?.(2)').valueOf(), [4])
      assert.strictEqual(parseAndEval('(_(x) = x^x)?.(2)'), 4)
      assert.strictEqual(parseAndEval('foo?.(2)', { foo: x => x * x }), 4)
      assert.deepStrictEqual(
        parseAndEval('f(x) = 4x/x; bar = {a: f}; bar.a?.(2)').valueOf(), [4])
    })

    it(
      'should shortcircuit undefined functions via optional chaining',
      function () {
        assert.strictEqual(
          parseAndEval('foo?.(2)', { foo: undefined }), undefined)
        assert.strictEqual(parseAndEval('{a: 3}.foo?.(2)'), undefined)
        assert.strictEqual(
          parseAndEval('foo.bar?.(2)', { foo: {} }), undefined)
        assert.deepStrictEqual(
          parseAndEval('f(x) = undefined; f(0)?.(2)').valueOf(), [undefined])
        assert.strictEqual(parseAndEval('(undefined)?.(2)'), undefined)
        assert.strictEqual(parseAndEval('foo?.(2)'), undefined)
      })

    it('should throw with optional chain call on non-function', function () {
      // I guess it is OK to consider this a syntax error since we know just
      // by reading the expression that the function call can't succeed.
      assert.throws(() => parseAndEval('7?.(2)'), SyntaxError)
      assert.throws(() => parseAndEval('a = 7; a?.(2)'), TypeError)
      assert.throws(() => parseAndEval('(3+4)?.(2)'), TypeError)
      assert.throws(() => parseAndEval('add(3,4)?.(2)'), TypeError)
      assert.throws(() => parseAndEval('{a: true}.a?.(2)'), Error)
      assert.throws(() => parseAndEval('[3, 4]?.(2)'), TypeError)
    })
  })

  describe('parentheses', function () {
    it('should parse parentheses overriding the default precedence', function () {
      approxEqual(parseAndEval('2 - (2 - 2)'), 2)
      approxEqual(parseAndEval('2 - ((2 - 2) - 2)'), 4)
      approxEqual(parseAndEval('3 * (2 + 3)'), 15)
      approxEqual(parseAndEval('(2 + 3) * 3'), 15)
    })

    it('should throw an error in case of unclosed parentheses', function () {
      assert.throws(function () { parseAndEval('3 * (1 + 2') }, /Parenthesis \) expected/)
    })
  })

  describe('operators', function () {
    it('should parse operations', function () {
      approxEqual(parseAndEval('(2+3)/4'), 1.25)
      approxEqual(parseAndEval('2+3/4'), 2.75)
      assert.strictEqual(parse('0 + 2').toString(), '0 + 2')
    })

    it('should parse add +', function () {
      assert.strictEqual(parseAndEval('2 + 3'), 5)
      assert.strictEqual(parseAndEval('2 + 3 + 4'), 9)
      assert.strictEqual(parseAndEval('2.+3'), 5) // test whether the decimal mark isn't confused
    })

    it('should parse divide /', function () {
      assert.strictEqual(parseAndEval('4 / 2'), 2)
      assert.strictEqual(parseAndEval('8 / 2 / 2'), 2)
    })

    it('should parse dotDivide ./', function () {
      assert.strictEqual(parseAndEval('4./2'), 2)
      assert.deepStrictEqual(parseAndEval('4./[2,4]'), math.matrix([2, 1]))
      assert.strictEqual(parseAndEval('4 ./ 2'), 2)
      assert.strictEqual(parseAndEval('8 ./ 4 / 2'), 1)
      assert.strictEqual(parseAndEval('8 ./ 2 / 2'), 2)

      assert.deepStrictEqual(parseAndEval('[1,2,3] ./ [1,2,3]'), math.matrix([1, 1, 1]))
    })

    it('should parse dotMultiply .*', function () {
      approxDeepEqual(parseAndEval('2.*3'), 6)
      approxDeepEqual(parseAndEval('2e3.*3'), 6e3)
      approxDeepEqual(parseAndEval('2 .* 3'), 6)
      approxDeepEqual(parseAndEval('4 .* 2'), 8)
      approxDeepEqual(parseAndEval('8 .* 2 .* 2'), 32)
      assert.deepStrictEqual(parseAndEval('a=3; a.*4'), new ResultSet([12]))

      assert.deepStrictEqual(parseAndEval('[1,2,3] .* [1,2,3]'), math.matrix([1, 4, 9]))
    })

    it('should parse dotPower .^', function () {
      approxDeepEqual(parseAndEval('2.^3'), 8)
      approxDeepEqual(parseAndEval('2 .^ 3'), 8)
      approxDeepEqual(parseAndEval('-2.^2'), -4) // -(2^2)
      approxDeepEqual(parseAndEval('2.^3.^4'), 2.41785163922926e+24) // 2^(3^4)

      assert.deepStrictEqual(parseAndEval('[2,3] .^ [2,3]'), math.matrix([4, 27]))
    })

    it('should parse equal ==', function () {
      assert.strictEqual(parseAndEval('2 == 3'), false)
      assert.strictEqual(parseAndEval('2 == 2'), true)
      assert.deepStrictEqual(parseAndEval('[2,3] == [2,4]'), math.matrix([true, false]))
    })

    it('should parse larger >', function () {
      assert.strictEqual(parseAndEval('2 > 3'), false)
      assert.strictEqual(parseAndEval('2 > 2'), false)
      assert.strictEqual(parseAndEval('2 > 1'), true)
    })

    it('should parse largerEq >=', function () {
      assert.strictEqual(parseAndEval('2 >= 3'), false)
      assert.strictEqual(parseAndEval('2 >= 2'), true)
      assert.strictEqual(parseAndEval('2 >= 1'), true)
    })

    it('should parse chained conditionals', function () {
      assert.strictEqual(parseAndEval('2 < 3 + 2 < 5 * 10'), true)
      assert.strictEqual(parseAndEval('2 < 3 < 4'), true)
      assert.strictEqual(parseAndEval('2 > 3 > 4'), false)
      assert.strictEqual(parseAndEval('2 < 3 > 4'), false)
      assert.strictEqual(parseAndEval('2 > 3 < 4'), false)
      assert.strictEqual(parseAndEval('2 < 4 > 3 <= 5 >= 5'), true)
    })

    it('should parse mod %', function () {
      approxEqual(parseAndEval('8 % 3'), 2)
      approxEqual(parseAndEval('80% pi'), 1.4601836602551685)
    })

    it('should parse mod % for negative divisors', function () {
      assert.strictEqual(parseAndEval('3%(-100)'), -97)
    })

    it('should parse % value', function () {
      approxEqual(parseAndEval('8 % '), 0.08)
      approxEqual(parseAndEval('100%'), 1)
    })

    it('should parse % with multiplication', function () {
      approxEqual(parseAndEval('100*50%'), 50)
      approxEqual(parseAndEval('50%*100'), 50)
      assert.throws(function () { parseAndEval('50%(*100)') }, SyntaxError)
    })

    it('should parse % with division', function () {
      approxEqual(parseAndEval('100/50%'), 200) // should be treated as 100/(50%)
      approxEqual(parseAndEval('100/50%*2'), 400) // should be treated as (100/(50%))×2
      approxEqual(parseAndEval('50%/100'), 0.005)
      approxEqual(parseAndEval('50%(13)'), 11) // should be treated as 50 % (13)
      assert.throws(function () { parseAndEval('50%(/100)') }, SyntaxError)
    })

    it('should parse unary % before division, binary % with division', function () {
      approxEqual(parseAndEval('10/200%%3'), 2) // should be treated as (10/(200%))%3
    })

    it('should reject repeated unary percentage operators', function () {
      assert.throws(function () { math.parse('17%%') }, SyntaxError)
      assert.throws(function () { math.parse('17%%*5') }, SyntaxError)
      assert.throws(function () { math.parse('10/200%%%3') }, SyntaxError)
    })

    it('should parse unary % before division, binary % with division', function () {
      approxEqual(parseAndEval('10/200%%3'), 2) // should be treated as (10/(200%))%3
    })

    it('should reject repeated unary percentage operators', function () {
      assert.throws(function () { math.parse('17%%') }, /Unexpected end of expression/)
      assert.throws(function () { math.parse('17%%*5') }, /Value expected \(char 5\)/)
      assert.throws(function () { math.parse('10/200%%%3') }, /Value expected \(char 9\)/)
    })

    it('should parse unary % with addition', function () {
      approxEqual(parseAndEval('100+3%'), 103)
      assert.strictEqual(parseAndEval('3%+100'), 3) // treat as 3 mod 100
    })

    it('should parse unary % with subtraction', function () {
      approxEqual(parseAndEval('100-3%'), 97)
      assert.strictEqual(parseAndEval('3%-100'), -97) // treat as 3 mod -100
    })

    it('should parse binary % with bitwise negation', function () {
      assert.strictEqual(parseAndEval('11%~1'), -1) // equivalent to 11 mod -2
      assert.strictEqual(parseAndEval('11%~-3'), 1) // equivalent to 11 mod 2
    })

    it('should parse operator mod', function () {
      approxEqual(parseAndEval('8 mod 3'), 2)
    })

    it('should give equal precedence to binary % and * operators', function () {
      approxEqual(parseAndStringifyWithParens('10 % 3 * 2'), '(10 % 3) * 2')
      approxEqual(parseAndStringifyWithParens('10 * 3 % 4'), '(10 * 3) % 4')
    })

    it('should give equal precedence to binary % and / operators', function () {
      approxEqual(parseAndStringifyWithParens('10 % 4 / 2'), '(10 % 4) / 2')
      approxEqual(parseAndStringifyWithParens('10 / 2 % 3'), '(10 / 2) % 3')
    })

    it('should give equal precedence to mod and * operators', function () {
      approxEqual(parseAndStringifyWithParens('8 mod 3 * 2'), '(8 mod 3) * 2')
      approxEqual(parseAndStringifyWithParens('8 * 3 mod 5'), '(8 * 3) mod 5')
    })

    it('should give equal precedence to mod and / operators', function () {
      approxEqual(parseAndStringifyWithParens('8 mod 3 / 2'), '(8 mod 3) / 2')
      approxEqual(parseAndStringifyWithParens('8 / 3 mod 2'), '(8 / 3) mod 2')
    })

    it('should give equal precedence to binary % and .* operators', function () {
      approxEqual(parseAndStringifyWithParens('10 % 3 .* 2'), '(10 % 3) .* 2')
      approxEqual(parseAndStringifyWithParens('10 .* 3 % 4'), '(10 .* 3) % 4')
    })

    it('should give equal precedence to binary % and ./ operators', function () {
      approxEqual(parseAndStringifyWithParens('10 % 4 ./ 2'), '(10 % 4) ./ 2')
      approxEqual(parseAndStringifyWithParens('10 ./ 2 % 3'), '(10 ./ 2) % 3')
    })

    it('should give equal precedence to mod and .* operators', function () {
      approxEqual(parseAndStringifyWithParens('8 mod 3 .* 2'), '(8 mod 3) .* 2')
      approxEqual(parseAndStringifyWithParens('8 .* 3 mod 5'), '(8 .* 3) mod 5')
    })

    it('should give equal precedence to mod and ./ operators', function () {
      approxEqual(parseAndStringifyWithParens('8 mod 3 ./ 2'), '(8 mod 3) ./ 2')
      approxEqual(parseAndStringifyWithParens('8 ./ 3 mod 2'), '(8 ./ 3) mod 2')
    })

    it('should evaluate complex expressions with mixed precedence equally', function () {
      approxEqual(parseAndStringifyWithParens('10 % 3 * 2 + 4 / 2'), '((10 % 3) * 2) + (4 / 2)')
      approxEqual(parseAndStringifyWithParens('8 mod 3 + 2 * 4 - 5'), '((8 mod 3) + (2 * 4)) - 5')
      approxEqual(parseAndStringifyWithParens('12 / 4 % 2 .* 5'), '((12 / 4) % 2) .* 5')
    })

    it('should handle cases with equal precedence among all operators', function () {
      approxEqual(parseAndStringifyWithParens('10 % 3 .* 2 ./ 2'), '((10 % 3) .* 2) ./ 2')
      approxEqual(parseAndStringifyWithParens('10 ./ 2 % 3 * 2'), '((10 ./ 2) % 3) * 2')
    })

    it('should parse multiply *', function () {
      approxEqual(parseAndEval('4 * 2'), 8)
      approxEqual(parseAndEval('8 * 2 * 2'), 32)
    })

    it('should parse implicit multiplication', function () {
      assert.strictEqual(parseAndStringifyWithParens('4a'), '4 a')
      assert.strictEqual(parseAndStringifyWithParens('4 a'), '4 a')
      assert.strictEqual(parseAndStringifyWithParens('a b'), 'a b')
      assert.strictEqual(parseAndStringifyWithParens('2a b'), '(2 a) b')
      assert.strictEqual(parseAndStringifyWithParens('2a * b'), '(2 a) * b')
      assert.strictEqual(parseAndStringifyWithParens('2a / b'), '(2 a) / b')
      assert.strictEqual(parseAndStringifyWithParens('a b c'), '(a b) c')
      assert.strictEqual(parseAndStringifyWithParens('a b*c'), '(a b) * c')
      assert.strictEqual(parseAndStringifyWithParens('a*b c'), 'a * (b c)')
      assert.strictEqual(parseAndStringifyWithParens('a/b c'), 'a / (b c)')

      assert.strictEqual(parseAndStringifyWithParens('1/2a'), '(1 / 2) a')
      assert.strictEqual(parseAndStringifyWithParens('8/2a/2'), '((8 / 2) a) / 2')
      assert.strictEqual(parseAndStringifyWithParens('8/2a*2'), '((8 / 2) a) * 2')
      assert.strictEqual(parseAndStringifyWithParens('4*2a'), '4 * (2 a)')
      assert.strictEqual(parseAndStringifyWithParens('3!10'), '(3!) 10')

      assert.strictEqual(parseAndStringifyWithParens('(2+3)a'), '(2 + 3) a')
      assert.strictEqual(parseAndStringifyWithParens('(2+3)2'), '(2 + 3) 2')
      assert.strictEqual(parseAndStringifyWithParens('(2)(3)+4'), '(2 3) + 4')
      assert.strictEqual(parseAndStringifyWithParens('2(3+4)'), '2 (3 + 4)')
      assert.strictEqual(parseAndStringifyWithParens('(2+3)-2'), '(2 + 3) - 2') // no implicit multiplication, just a unary minus
      assert.strictEqual(parseAndStringifyWithParens('a(2+3)'), 'a(2 + 3)') // function call
      assert.strictEqual(parseAndStringifyWithParens('a.b(2+3)'), 'a.b(2 + 3)') // function call
      assert.strictEqual(parseAndStringifyWithParens('(2+3)(4+5)'), '(2 + 3) (4 + 5)') // implicit multiplication
      assert.strictEqual(parseAndStringifyWithParens('(2+3)(4+5)(3-1)'), '((2 + 3) (4 + 5)) (3 - 1)') // implicit multiplication

      assert.strictEqual(parseAndStringifyWithParens('(2a)^3'), '(2 a) ^ 3')
      assert.strictEqual(parseAndStringifyWithParens('2a^3'), '2 (a ^ 3)')
      assert.strictEqual(parseAndStringifyWithParens('2(a)^3'), '2 (a ^ 3)')
      assert.strictEqual(parseAndStringifyWithParens('(2)a^3'), '2 (a ^ 3)')
      assert.strictEqual(parseAndStringifyWithParens('2^3a'), '(2 ^ 3) a')
      assert.strictEqual(parseAndStringifyWithParens('2^3(a)'), '(2 ^ 3) a')
      assert.strictEqual(parseAndStringifyWithParens('2^(3)(a)'), '(2 ^ 3) a')
      assert.strictEqual(parseAndStringifyWithParens('sqrt(2a)'), 'sqrt(2 a)')

      assert.deepStrictEqual(parseAndEval('[2, 3] 2'), math.matrix([4, 6]))
      assert.deepStrictEqual(parseAndEval('[2, 3] a', { a: 2 }), math.matrix([4, 6]))
      assert.deepStrictEqual(parseAndEval('A [2,2]', { A: [[1, 2], [3, 4]] }), 4) // index
      assert.deepStrictEqual(parseAndEval('(A) [2,2]', { A: [[1, 2], [3, 4]] }), 4) // index

      assert.deepStrictEqual(parseAndEval('[1,2;3,4] [2,2]'), 4) // index
      assert.deepStrictEqual(parseAndEval('([1,2;3,4])[2,2]'), 4) // index
      assert.throws(function () { parseAndEval('2[1,2,3]') }, /Unexpected operator/)// index
    })

    it('should index when the number config is bigint', function () {
      const bimath = math.create({ number: 'bigint' })
      assert.strictEqual(bimath.evaluate('[1,2;3,4][2,2]'), 4n)
      assert.strictEqual(bimath.evaluate('[5,6,7][2]'), 6n)
    })

    it('should tell the OperatorNode about implicit multiplications', function () {
      assert.strictEqual(parse('2 + 3').implicit, false)
      assert.strictEqual(parse('4 * a').implicit, false)

      assert.strictEqual(parse('4a').implicit, true)
      assert.strictEqual(parse('4 a').implicit, true)
      assert.strictEqual(parse('a b').implicit, true)
      assert.strictEqual(parse('2a b').implicit, true)
      assert.strictEqual(parse('a b c').implicit, true)

      assert.strictEqual(parse('(2+3)a').implicit, true)
      assert.strictEqual(parse('(2+3)2').implicit, true)
      assert.strictEqual(parse('2(3+4)').implicit, true)
    })

    it('should correctly order consecutive multiplications and implicit multiplications', function () {
      assert.strictEqual(parseAndStringifyWithParens('9km*3km'), '(9 km) * (3 km)')
    })

    it('should follow precedence rules for implicit multiplication and division', function () {
      assert.strictEqual(parseAndStringifyWithParens('2 / 3 x'), '(2 / 3) x')
      assert.strictEqual(parseAndStringifyWithParens('-2/3x'), '((-2) / 3) x')
      assert.strictEqual(parseAndStringifyWithParens('+2/3x'), '((+2) / 3) x')
      assert.strictEqual(parseAndStringifyWithParens('2!/3x'), '(2!) / (3 x)')
      assert.strictEqual(parseAndStringifyWithParens('(2)/3x'), '2 / (3 x)')
      assert.strictEqual(parseAndStringifyWithParens('2/3!x'), '2 / ((3!) x)')
      assert.strictEqual(parseAndStringifyWithParens('2/(3)x'), '2 / (3 x)')
      assert.strictEqual(parseAndStringifyWithParens('(2+4)/3x'), '(2 + 4) / (3 x)')
      assert.strictEqual(parseAndStringifyWithParens('2/(3+4)x'), '2 / ((3 + 4) x)')
      assert.strictEqual(parseAndStringifyWithParens('2.5 / 5 kg'), '(2.5 / 5) kg')
      assert.strictEqual(parseAndStringifyWithParens('2.5 / 5 x y'), '((2.5 / 5) x) y')
      assert.strictEqual(parseAndStringifyWithParens('2 x / 5 y'), '(2 x) / (5 y)')
      assert.strictEqual(parseAndStringifyWithParens('17 h / 1 h'), '(17 h) / (1 h)')
      assert.strictEqual(parseAndStringifyWithParens('1 / 2 x'), '(1 / 2) x')
      assert.strictEqual(parseAndStringifyWithParens('+1/2x'), '((+1) / 2) x')
      assert.strictEqual(parseAndStringifyWithParens('~1/2x'), '((~1) / 2) x')
      assert.strictEqual(parseAndStringifyWithParens('1 / -2 x'), '1 / ((-2) x)')
      assert.strictEqual(parseAndStringifyWithParens('-1 / -2 x'), '(-1) / ((-2) x)')
      assert.strictEqual(parseAndStringifyWithParens('1 / 2 * x'), '(1 / 2) * x')
      assert.strictEqual(parseAndStringifyWithParens('1 / 2 x y'), '((1 / 2) x) y')
      assert.strictEqual(parseAndStringifyWithParens('1 / 2 (x y)'), '(1 / 2) (x y)')
      assert.strictEqual(parseAndStringifyWithParens('1 / 2x * y'), '((1 / 2) x) * y')
      assert.strictEqual(parseAndStringifyWithParens('y / 2 x'), 'y / (2 x)')
      assert.strictEqual(parseAndStringifyWithParens('y / 2 * x'), '(y / 2) * x')
      assert.strictEqual(parseAndStringifyWithParens('y / 2 x w'), 'y / ((2 x) w)')
      assert.strictEqual(parseAndStringifyWithParens('y / v x w'), 'y / ((v x) w)')
      assert.strictEqual(parseAndStringifyWithParens('1 h / (1+1) h'), '(1 h) / ((1 + 1) h)')
      assert.strictEqual(parseAndStringifyWithParens('4 lb + 1/2 lb'), '(4 lb) + ((1 / 2) lb)')
      assert.strictEqual(parseAndStringifyWithParens('4 lb + 1 lb^2 / 2 lb'), '(4 lb) + ((1 (lb ^ 2)) / (2 lb))')
      assert.strictEqual(parseAndStringifyWithParens('1 m/s^2 + 1 m / 2 s^2'), '((1 m) / (s ^ 2)) + ((1 m) / (2 (s ^ 2)))')
      assert.strictEqual(parseAndStringifyWithParens('8.314 J/mol K'), '(8.314 J) / (mol K)')
    })

    it('should handle precedence with implicit multiplication, division, and the "in" operator', function () {
      assert.strictEqual(parseAndStringifyWithParens('1/2 in'), '(1 / 2) in')
      assert.strictEqual(parseAndStringifyWithParens('1/2 kg'), '(1 / 2) kg')
      assert.strictEqual(parseAndStringifyWithParens('3 kg in lb'), '(3 kg) in lb')
      assert.strictEqual(parseAndStringifyWithParens('2 m / 1 s'), '(2 m) / (1 s)')
      assert.strictEqual(parseAndStringifyWithParens('5 / 10 in'), '(5 / 10) in')
      assert.strictEqual(parseAndStringifyWithParens('10 lb + 1/2 lb'), '(10 lb) + ((1 / 2) lb)')
    })

    it('should throw an error when having an implicit multiplication between two numbers', function () {
      assert.throws(function () { math.parse('2 3') }, /Unexpected part "3"/)
      assert.throws(function () { math.parse('2 * 3 4') }, /Unexpected part "4"/)
      assert.throws(function () { math.parse('2 * 3 4 * 5') }, /Unexpected part "4"/)
      assert.throws(function () { math.parse('2 / 3 4 5') }, /Unexpected part "4"/)
      assert.throws(function () { math.parse('2 + 3 4') }, /Unexpected part "4"/)
      assert.throws(function () { math.parse('-2 2') }, /Unexpected part "2"/)
      assert.throws(function () { math.parse('+3 3') }, /Unexpected part "3"/)
      assert.throws(function () { math.parse('2^3 4') }, /Unexpected part "4"/)
    })

    it('should parse pow ^', function () {
      approxEqual(parseAndEval('2^3'), 8)
      approxEqual(parseAndEval('-2^2'), -4) // -(2^2)
      approxEqual(parseAndEval('2^3^4'), 2.41785163922926e+24) // 2^(3^4)
    })

    it('should parse smaller <', function () {
      assert.strictEqual(parseAndEval('2 < 3'), true)
      assert.strictEqual(parseAndEval('2 < 2'), false)
      assert.strictEqual(parseAndEval('2 < 1'), false)
    })

    it('should parse smallerEq <=', function () {
      assert.strictEqual(parseAndEval('2 <= 3'), true)
      assert.strictEqual(parseAndEval('2 <= 2'), true)
      assert.strictEqual(parseAndEval('2 <= 1'), false)
    })

    it('should parse bitwise and &', function () {
      assert.strictEqual(parseAndEval('2 & 6'), 2)
      assert.strictEqual(parseAndEval('5 & 3'), 1)
      assert.strictEqual(parseAndEval('true & true'), 1)
      assert.strictEqual(parseAndEval('true & false'), 0)
      assert.strictEqual(parseAndEval('false & true'), 0)
      assert.strictEqual(parseAndEval('false & false'), 0)

      assert.strictEqual(parseAndEval('0 & undefined'), 0)
      assert.strictEqual(parseAndEval('false & undefined'), 0)
      assert.throws(function () { parseAndEval('true & undefined') }, TypeError)
    })

    it('should parse bitwise and & lazily', function () {
      const scope = {}
      parseAndEval('(a=false) & (b=true)', scope)
      assert.deepStrictEqual(scope, { a: false })
    })

    it('should parse bitwise xor ^|', function () {
      assert.strictEqual(parseAndEval('2 ^| 6'), 4)
      assert.strictEqual(parseAndEval('5 ^| 3'), 6)
      assert.strictEqual(parseAndEval('true ^| true'), 0)
      assert.strictEqual(parseAndEval('true ^| false'), 1)
      assert.strictEqual(parseAndEval('false ^| true'), 1)
      assert.strictEqual(parseAndEval('false ^| false'), 0)
    })

    it('should parse bitwise or |', function () {
      assert.strictEqual(parseAndEval('2 | 6'), 6)
      assert.strictEqual(parseAndEval('5 | 3'), 7)
      assert.strictEqual(parseAndEval('true | true'), 1)
      assert.strictEqual(parseAndEval('true | false'), 1)
      assert.strictEqual(parseAndEval('false | true'), 1)
      assert.strictEqual(parseAndEval('false | false'), 0)

      assert.strictEqual(parseAndEval('-1 | undefined'), -1)
      assert.strictEqual(parseAndEval('true | undefined'), 1)
      assert.throws(function () { parseAndEval('false | undefined') }, TypeError)
    })

    it('should parse bitwise or | lazily', function () {
      const scope = {}
      parseAndEval('(a=true) | (b=true)', scope)
      assert.deepStrictEqual(scope, { a: true })
    })

    it('should parse bitwise left shift <<', function () {
      assert.strictEqual(parseAndEval('23 << 1'), 46)
    })

    it('should parse bitwise right arithmetic shift >>', function () {
      assert.strictEqual(parseAndEval('32 >> 4'), 2)
      assert.strictEqual(parseAndEval('-12 >> 2'), -3)
    })

    it('should parse bitwise right logical shift >>>', function () {
      assert.strictEqual(parseAndEval('32 >>> 4'), 2)
      assert.strictEqual(parseAndEval('-12 >>> 2'), 1073741821)
    })

    it('should parse logical and', function () {
      assert.strictEqual(parseAndEval('2 and 6'), true)
      assert.strictEqual(parseAndEval('2 and 0'), false)
      assert.strictEqual(parseAndEval('true and true'), true)
      assert.strictEqual(parseAndEval('true and false'), false)
      assert.strictEqual(parseAndEval('false and true'), false)
      assert.strictEqual(parseAndEval('false and false'), false)

      assert.strictEqual(parseAndEval('0 and undefined'), false)
      assert.strictEqual(parseAndEval('false and undefined'), false)
      assert.throws(function () { parseAndEval('true and undefined') }, TypeError)
    })

    it('should parse logical and lazily', function () {
      const scope = {}
      parseAndEval('(a=false) and (b=true)', scope)
      assert.deepStrictEqual(scope, { a: false })
    })

    it('should parse logical and inside a function definition', function () {
      const scope = {}
      const f = parseAndEval('f(x) = x > 2 and x < 4', scope)
      assert.strictEqual(f(1), false)
      assert.strictEqual(f(3), true)
      assert.strictEqual(f(5), false)
    })

    it('should use a variable assignment with a rawArgs function inside a function definition', function () {
      const scope = {}
      const f = parseAndEval('f(x) = (a=false) and (b=true)', scope)
      assert.deepStrictEqual(parseAndEval('f(2)', scope), false)
      assert.deepStrictEqual(Object.keys(scope), ['f', 'a'])
      assert.strictEqual(scope.f, f)
      assert.strictEqual(scope.a, false)
    })

    it('should always pass a Map as scope to a rawArgs function', function () {
      const myMath = math.create()
      function myFunction (args, _math, _scope) {
        return {
          type: isObjectWrappingMap(_scope)
            ? 'ObjectWrappingMap'
            : isPartitionedMap(_scope)
              ? 'PartitionedMap'
              : isMap(_scope)
                ? 'Map'
                : 'unknown',
          scope: _scope
        }
      }
      myFunction.rawArgs = true
      myMath.import({ myFunction })

      assert.strictEqual(myMath.parse('myFunction()').evaluate({}).type, 'PartitionedMap')
      const map = new Map()
      assert.strictEqual(myMath.parse('myFunction()').evaluate(map).type, 'PartitionedMap')
      assert.strictEqual(myMath.parse('myFunction()').evaluate(map).scope.a, map)
      assert.strictEqual(myMath.parse('myFunction()').evaluate(new PartitionedMap(new Map(), new Map(), new Set('x'))).type, 'PartitionedMap')
      assert.deepStrictEqual(myMath.parse('f(x) = myFunction(x); f(2)').evaluate(new Map()).entries[0].type, 'PartitionedMap')
    })

    it('should parse logical xor', function () {
      assert.strictEqual(parseAndEval('2 xor 6'), false)
      assert.strictEqual(parseAndEval('2 xor 0'), true)
      assert.strictEqual(parseAndEval('true xor true'), false)
      assert.strictEqual(parseAndEval('true xor false'), true)
      assert.strictEqual(parseAndEval('false xor true'), true)
      assert.strictEqual(parseAndEval('false xor false'), false)
    })

    it('should parse logical or', function () {
      assert.strictEqual(parseAndEval('2 or 6'), true)
      assert.strictEqual(parseAndEval('2 or 0'), true)
      assert.strictEqual(parseAndEval('true or true'), true)
      assert.strictEqual(parseAndEval('true or false'), true)
      assert.strictEqual(parseAndEval('false or true'), true)
      assert.strictEqual(parseAndEval('false or false'), false)

      assert.strictEqual(parseAndEval('2 or undefined'), true)
      assert.strictEqual(parseAndEval('true or undefined'), true)
      assert.throws(function () { parseAndEval('false or undefined') }, TypeError)
    })

    it('should parse logical or inside a function definition', function () {
      const scope = {}
      const f = parseAndEval('f(x) = x < 2 or x > 4', scope)
      assert.strictEqual(f(1), true)
      assert.strictEqual(f(3), false)
      assert.strictEqual(f(5), true)
    })

    it('should parse logical or lazily', function () {
      const scope = {}
      parseAndEval('(a=true) or (b=true)', scope)
      assert.deepStrictEqual(scope, { a: true })
    })

    it('should parse logical not', function () {
      assert.strictEqual(parseAndEval('not 2'), false)
      assert.strictEqual(parseAndEval('not not 2'), true)
      assert.strictEqual(parseAndEval('not not not 2'), false)
      assert.strictEqual(parseAndEval('not true'), false)

      assert.strictEqual(parseAndEval('4*not 2'), 0)
      assert.strictEqual(parseAndEval('4 * not 2'), 0)
      assert.strictEqual(parseAndEval('4-not 2'), 4)
      assert.strictEqual(parseAndEval('4 - not 2'), 4)
      assert.strictEqual(parseAndEval('4+not 2'), 4)
      assert.strictEqual(parseAndEval('4 + not 2'), 4)

      assert.strictEqual(parseAndEval('10+not not 3'), 11)
    })

    it('should parse minus -', function () {
      assert.strictEqual(parseAndEval('4 - 2'), 2)
      assert.strictEqual(parseAndEval('8 - 2 - 2'), 4)
    })

    it('should parse unary minus -', function () {
      assert.strictEqual(parseAndEval('-2'), -2)
      assert.strictEqual(parseAndEval('--2'), 2)
      assert.strictEqual(parseAndEval('---2'), -2)

      assert.strictEqual(parseAndEval('4*-2'), -8)
      assert.strictEqual(parseAndEval('4 * -2'), -8)
      assert.strictEqual(parseAndEval('4+-2'), 2)
      assert.strictEqual(parseAndEval('4 + -2'), 2)
      assert.strictEqual(parseAndEval('4--2'), 6)
      assert.strictEqual(parseAndEval('4 - -2'), 6)

      assert.strictEqual(parseAndEval('5-3'), 2)
      assert.strictEqual(parseAndEval('5--3'), 8)
      assert.strictEqual(parseAndEval('5---3'), 2)
      assert.strictEqual(parseAndEval('5+---3'), 2)
      assert.strictEqual(parseAndEval('5----3'), 8)
      assert.strictEqual(parseAndEval('5+--(2+1)'), 8)
    })

    it('should parse unary +', function () {
      assert.strictEqual(parseAndEval('+2'), 2)
      assert.strictEqual(parseAndEval('++2'), 2)
      assert.strictEqual(parseAndEval('+++2'), 2)
      assert.strictEqual(parseAndEval('+true'), 1)

      assert.strictEqual(parseAndEval('4*+2'), 8)
      assert.strictEqual(parseAndEval('4 * +2'), 8)
      assert.strictEqual(parseAndEval('4-+2'), 2)
      assert.strictEqual(parseAndEval('4 - +2'), 2)
      assert.strictEqual(parseAndEval('4++2'), 6)
      assert.strictEqual(parseAndEval('4 + +2'), 6)

      assert.strictEqual(parseAndEval('5+3'), 8)
      assert.strictEqual(parseAndEval('5++3'), 8)
    })

    it('should parse unary ~', function () {
      assert.strictEqual(parseAndEval('~2'), -3)
      assert.strictEqual(parseAndEval('~~2'), 2)
      assert.strictEqual(parseAndEval('~~~2'), -3)
      assert.strictEqual(parseAndEval('~true'), -2)

      assert.strictEqual(parseAndEval('4*~2'), -12)
      assert.strictEqual(parseAndEval('4 * ~2'), -12)
      assert.strictEqual(parseAndEval('4-~2'), 7)
      assert.strictEqual(parseAndEval('4 - ~2'), 7)
      assert.strictEqual(parseAndEval('4+~2'), 1)
      assert.strictEqual(parseAndEval('4 + ~2'), 1)

      assert.strictEqual(parseAndEval('10+~~3'), 13)
    })

    it('should parse unary plus and minus  +, -', function () {
      assert.strictEqual(parseAndEval('-+2'), -2)
      assert.strictEqual(parseAndEval('-+-2'), 2)
      assert.strictEqual(parseAndEval('+-+-2'), 2)
      assert.strictEqual(parseAndEval('+-2'), -2)
      assert.strictEqual(parseAndEval('+-+2'), -2)
      assert.strictEqual(parseAndEval('-+-+2'), 2)
    })

    it('should parse unary plus and bitwise not  +, ~', function () {
      assert.strictEqual(parseAndEval('~+2'), -3)
      assert.strictEqual(parseAndEval('~+~2'), 2)
      assert.strictEqual(parseAndEval('+~+~2'), 2)
      assert.strictEqual(parseAndEval('+~2'), -3)
      assert.strictEqual(parseAndEval('+~+2'), -3)
      assert.strictEqual(parseAndEval('~+~+2'), 2)
    })

    it('should parse unary minus and bitwise not  -, ~', function () {
      assert.strictEqual(parseAndEval('~-2'), 1)
      assert.strictEqual(parseAndEval('~-~2'), -4)
      assert.strictEqual(parseAndEval('-~-~2'), 4)
      assert.strictEqual(parseAndEval('-~2'), 3)
      assert.strictEqual(parseAndEval('-~-2'), -1)
      assert.strictEqual(parseAndEval('~-~-2'), 0)
    })

    it('should parse unary plus + and logical not', function () {
      assert.strictEqual(parseAndEval('not+2'), false)
      assert.strictEqual(parseAndEval('not + not 2'), true)
      assert.strictEqual(parseAndEval('+not+not 2'), 1)
      assert.strictEqual(parseAndEval('+ not 2'), 0)
      assert.strictEqual(parseAndEval('+ not +2'), 0)
      assert.strictEqual(parseAndEval('not + not +2'), true)
    })

    it('should parse bitwise not ~ and logical not', function () {
      assert.strictEqual(parseAndEval('~not 2'), -1)
      assert.strictEqual(parseAndEval('~not~2'), -1)
      assert.strictEqual(parseAndEval('not~not~2'), false)
      assert.strictEqual(parseAndEval('not~2'), false)
      assert.strictEqual(parseAndEval('not~not 2'), false)
      assert.strictEqual(parseAndEval('~not~not 2'), -1)
    })

    it('should parse unary minus and logical not', function () {
      assert.strictEqual(parseAndEval('not-2'), false)
      assert.strictEqual(parseAndEval('not-not 2'), true)
      assert.strictEqual(parseAndEval('-not-not 2'), -1)
      assert.strictEqual(parseAndEval('-not 2'), -0)
      assert.strictEqual(parseAndEval('-not-2'), -0)
      assert.strictEqual(parseAndEval('not-not-2'), true)
    })

    it('should parse unequal !=', function () {
      assert.strictEqual(parseAndEval('2 != 3'), true)
      assert.strictEqual(parseAndEval('2 != 2'), false)
      assert.deepStrictEqual(parseAndEval('[2,3] != [2,4]'), math.matrix([false, true]))
    })

    it('should parse conditional expression a ? b : c', function () {
      assert.strictEqual(parseAndEval('2 ? true : false'), true)
      assert.strictEqual(parseAndEval('0 ? true : false'), false)
      assert.strictEqual(parseAndEval('false ? true : false'), false)

      assert.strictEqual(parseAndEval('2 > 0 ? 1 : 2 < 0 ? -1 : 0'), 1)
      assert.strictEqual(parseAndEval('(2 > 0 ? 1 : 2 < 0) ? -1 : 0'), -1)
      assert.strictEqual(parseAndEval('-2 > 0 ? 1 : -2 < 0 ? -1 : 0'), -1)
      assert.strictEqual(parseAndEval('0 > 0 ? 1 : 0 < 0 ? -1 : 0'), 0)
    })

    it('should parse a conditional operator and not optional chaining when followed by a number', function () {
      assert.strictEqual(parseAndEval('true?.3:.7'), 0.3)
    })

    it('should lazily evaluate conditional expression a ? b : c', function () {
      const scope = {}
      math.parse('true ? (a = 2) : (b = 2)').compile().evaluate(scope)
      assert.deepStrictEqual(scope, { a: 2 })
    })

    it('should throw an error when false part of conditional expression is missing', function () {
      assert.throws(function () { parseAndEval('2 ? true') }, /False part of conditional expression expected/)
    })

    it('should forbid empty true part of conditional (#3578)', function () {
      assert.throws(() => parseAndEval('true ? : 3'), SyntaxError)
      assert.throws(() => parseAndEval('0?:false'), SyntaxError)
    })

    it(
      'should allow a range with implicit start as the false expr',
      function () {
        assert.strictEqual(parseAndEval('true?0::3'), 0)
        assert.deepStrictEqual(parseAndEval('false?0::3'), parseAndEval(':3'))
      })

    it('should parse : (range)', function () {
      assert.ok(parseAndEval('2:5') instanceof Matrix)
      assert.deepStrictEqual(parseAndEval('2:5'), math.matrix([2, 3, 4, 5]))
      assert.deepStrictEqual(parseAndEval('10:-2:0'), math.matrix([10, 8, 6, 4, 2, 0]))
      assert.deepStrictEqual(parseAndEval('2:4.0'), math.matrix([2, 3, 4]))
      assert.deepStrictEqual(parseAndEval('2:4.5'), math.matrix([2, 3, 4]))
      assert.deepStrictEqual(parseAndEval('2:4.1'), math.matrix([2, 3, 4]))
      assert.deepStrictEqual(parseAndEval('2:3.9'), math.matrix([2, 3]))
      assert.deepStrictEqual(parseAndEval('2:3.5'), math.matrix([2, 3]))
      assert.deepStrictEqual(parseAndEval('3:-1:0.5'), math.matrix([3, 2, 1]))
      assert.deepStrictEqual(parseAndEval('3:-1:0.5'), math.matrix([3, 2, 1]))
      assert.deepStrictEqual(parseAndEval('3:-1:0.1'), math.matrix([3, 2, 1]))
      assert.deepStrictEqual(parseAndEval('3:-1:-0.1'), math.matrix([3, 2, 1, 0]))
    })

    it('should parse to', function () {
      approxDeepEqual(parseAndEval('2.54 cm to inch'), math.unit(1, 'inch').to('inch'))
      approxDeepEqual(parseAndEval('2.54 cm + 2 inch to foot'), math.unit(0.25, 'foot').to('foot'))
    })

    it('should parse in', function () {
      approxDeepEqual(parseAndEval('2.54 cm in inch'), math.unit(1, 'inch').to('inch'))
    })

    it('should parse factorial !', function () {
      assert.deepStrictEqual(parseAndEval('5!'), 120)
      assert.deepStrictEqual(parseAndEval('[1,2,3,4]!'), math.matrix([1, 2, 6, 24]))
      assert.deepStrictEqual(parseAndEval('4!+2'), 26)
      assert.deepStrictEqual(parseAndEval('4!-2'), 22)
      assert.deepStrictEqual(parseAndEval('4!*2'), 48)
      assert.deepStrictEqual(parseAndEval('3!!'), 720)
      assert.deepStrictEqual(parseAndEval('[1,2;3,1]!\'!'), math.matrix([[1, 720], [2, 1]]))
      assert.deepStrictEqual(parseAndEval('[4,5]![2]'), 120) // index [2]
    })

    it('should parse transpose \'', function () {
      assert.deepStrictEqual(parseAndEval('23\''), 23)
      assert.deepStrictEqual(parseAndEval('[1,2,3;4,5,6]\''), math.matrix([[1, 4], [2, 5], [3, 6]]))
      assert.ok(parseAndEval('[1,2,3;4,5,6]\'') instanceof Matrix)
      assert.deepStrictEqual(parseAndEval('[1:5]'), math.matrix([[1, 2, 3, 4, 5]]))
      assert.deepStrictEqual(parseAndEval('[1:5]\''), math.matrix([[1], [2], [3], [4], [5]]))
      assert.deepStrictEqual(parseAndEval('size([1:5])'), [1, 5])
      assert.deepStrictEqual(parseAndEval('[1,2;3,4]\''), math.matrix([[1, 3], [2, 4]]))
    })

    describe('operator precedence', function () {
      it('should respect precedence of plus and minus', function () {
        assert.strictEqual(parseAndEval('4-2+3'), 5)
        assert.strictEqual(parseAndEval('4-(2+3)'), -1)
        assert.strictEqual(parseAndEval('4-2-3'), -1)
        assert.strictEqual(parseAndEval('4-(2-3)'), 5)
      })

      it('should respect precedence of plus/minus and multiply/divide', function () {
        assert.strictEqual(parseAndEval('2+3*4'), 14)
        assert.strictEqual(parseAndEval('2*3+4'), 10)
      })

      it('should respect precedence of plus/minus and pow', function () {
        assert.strictEqual(parseAndEval('2+3^2'), 11)
        assert.strictEqual(parseAndEval('3^2+2'), 11)
        assert.strictEqual(parseAndEval('8-2^2'), 4)
        assert.strictEqual(parseAndEval('4^2-2'), 14)
      })

      it('should respect precedence of multiply/divide and pow', function () {
        assert.strictEqual(parseAndEval('2*3^2'), 18)
        assert.strictEqual(parseAndEval('3^2*2'), 18)
        assert.strictEqual(parseAndEval('8/2^2'), 2)
        assert.strictEqual(parseAndEval('4^2/2'), 8)
      })

      it('should respect precedence of pow', function () {
        assert.strictEqual(parseAndEval('2^3'), 8)
        assert.strictEqual(parseAndEval('2^3^4'), Math.pow(2, Math.pow(3, 4)))
        assert.strictEqual(parseAndEval('1.5^1.5^1.5'), parseAndEval('1.5^(1.5^1.5)'))
        assert.strictEqual(parseAndEval('1.5^1.5^1.5^1.5'), parseAndEval('1.5^(1.5^(1.5^1.5))'))
      })

      it('should respect precedence of unary operations and pow', function () {
        assert.strictEqual(parseAndEval('-3^2'), -9)
        assert.strictEqual(parseAndEval('(-3)^2'), 9)
        assert.strictEqual(parseAndEval('2^-2'), 0.25)
        assert.strictEqual(parseAndEval('2^(-2)'), 0.25)

        assert.strictEqual(parseAndEval('+3^2'), 9)
        assert.strictEqual(parseAndEval('(+3)^2'), 9)
        assert.strictEqual(parseAndEval('2^(+2)'), 4)

        assert.strictEqual(parseAndEval('~3^2'), -10)
        assert.strictEqual(parseAndEval('(~3)^2'), 16)
        assert.strictEqual(parseAndEval('2^~2'), 0.125)
        assert.strictEqual(parseAndEval('2^(~2)'), 0.125)

        assert.strictEqual(parseAndEval('not 3^2'), false)
        assert.strictEqual(parseAndEval('(not 3)^2'), 0)
        assert.strictEqual(parseAndEval('2^not 2'), 1)
        assert.strictEqual(parseAndEval('2^(not 2)'), 1)
      })

      it('should respect precedence of factorial and pow', function () {
        assert.strictEqual(parseAndEval('2^3!'), 64)
        assert.strictEqual(parseAndEval('2^(3!)'), 64)
        assert.strictEqual(parseAndEval('3!^2'), 36)
      })

      it('should respect precedence of factorial and unary operations', function () {
        assert.strictEqual(parseAndEval('-4!'), -24)
        assert.strictEqual(parseAndEval('-(4!)'), -24)

        assert.strictEqual(parseAndEval('3!+2'), 8)
        assert.strictEqual(parseAndEval('(3!)+2'), 8)
        assert.strictEqual(parseAndEval('+4!'), 24)

        assert.strictEqual(parseAndEval('~4!+1'), -24)
        assert.strictEqual(parseAndEval('~(4!)+1'), -24)

        assert.strictEqual(parseAndEval('not 4!'), false)
        assert.strictEqual(parseAndEval('not not 4!'), true)
        assert.strictEqual(parseAndEval('not(4!)'), false)
        assert.strictEqual(parseAndEval('(not 4!)'), false)
        assert.strictEqual(parseAndEval('(not 4)!'), 1)
      })

      it('should respect precedence of transpose', function () {
        const node = math.parse('a + b\'')
        assert(node instanceof OperatorNode)
        assert.strictEqual(node.op, '+')
        assert.strictEqual(node.args[0].toString(), 'a')
        assert.strictEqual(node.args[1].toString(), 'b\'')
      })

      it('should respect precedence of transpose (2)', function () {
        const node = math.parse('a ^ b\'')
        assert(node instanceof OperatorNode)
        assert.strictEqual(node.op, '^')
        assert.strictEqual(node.args[0].toString(), 'a')
        assert.strictEqual(node.args[1].toString(), 'b\'')
      })

      it('should respect precedence of conditional operator and other operators', function () {
        assert.strictEqual(parseAndEval('2 > 3 ? true : false'), false)
        assert.strictEqual(parseAndEval('2 == 3 ? true : false'), false)
        assert.strictEqual(parseAndEval('3 ? 2 + 4 : 2 - 1'), 6)
        assert.deepStrictEqual(parseAndEval('3 ? true : false; 22'), new ResultSet([22]))
        assert.deepStrictEqual(parseAndEval('3 ? 5cm to m : 5cm in mm'), new Unit(5, 'cm').to('m'))
        assert.deepStrictEqual(parseAndEval('2 == 4-2 ? [1,2] : false'), math.matrix([1, 2]))
        assert.deepStrictEqual(parseAndEval('false ? 1:2:6'), math.matrix([2, 3, 4, 5, 6]))
      })

      it('should respect precedence between left/right shift and relational operators', function () {
        assert.strictEqual(parseAndEval('32 >> 4 == 2'), true)
        assert.strictEqual(parseAndEval('2 == 32 >> 4'), true)
        assert.strictEqual(parseAndEval('2 << 2 == 8'), true)
        assert.strictEqual(parseAndEval('8 == 2 << 2'), true)
      })

      it('should respect precedence between relational operators and bitwise and', function () {
        assert.strictEqual(parseAndEval('2 == 3 & 1'), 0)
        assert.strictEqual(parseAndEval('3 & 1 == 2'), 0)
        assert.strictEqual(parseAndEval('2 == (3 & 1)'), false)
      })

      it('should respect precedence between bitwise or | and logical and', function () {
        assert.strictEqual(parseAndEval('2 | 2 and 4'), true)
        assert.strictEqual(parseAndEval('4 and 2 | 2'), true)
      })

      it('should respect precedence between bitwise xor ^| and bitwise or |', function () {
        assert.strictEqual(parseAndEval('4 ^| 6 | 2'), 2)
        assert.strictEqual(parseAndEval('2 | 4 ^| 6'), 2)
        assert.strictEqual(parseAndEval('(2 | 4) ^| 6'), 0)
      })

      it('should respect precedence between bitwise and & and bitwise or |', function () {
        assert.strictEqual(parseAndEval('4 & 3 | 12'), 12)
        assert.strictEqual(parseAndEval('12 | 4 & 3'), 12)
        assert.strictEqual(parseAndEval('(12 | 4) & 3'), 0)
      })

      it('should respect precedence between logical and and or', function () {
        assert.strictEqual(parseAndEval('false and true or true'), true)
        assert.strictEqual(parseAndEval('false and (true or true)'), false)
        assert.strictEqual(parseAndEval('true or true and false'), true)
        assert.strictEqual(parseAndEval('(true or true) and false'), false)
      })

      it('should respect precedence of conditional operator and logical or', function () {
        const node = math.parse('1 or 0 ? 2 or 3 : 0 or 0')
        assert(node instanceof ConditionalNode)
        assert.strictEqual(node.condition.toString(), '1 or 0')
        assert.strictEqual(node.trueExpr.toString(), '2 or 3')
        assert.strictEqual(node.falseExpr.toString(), '0 or 0')
        assert.strictEqual(node.compile().evaluate(), true)
      })

      it('should respect precedence of conditional operator and relational operators', function () {
        const node = math.parse('a == b ? a > b : a < b')
        assert(node instanceof ConditionalNode)
        assert.strictEqual(node.condition.toString(), 'a == b')
        assert.strictEqual(node.trueExpr.toString(), 'a > b')
        assert.strictEqual(node.falseExpr.toString(), 'a < b')
      })

      it('should respect precedence of conditional operator and range operator', function () {
        const node = math.parse('a ? b : c : d')
        assert(node instanceof ConditionalNode)
        assert.strictEqual(node.condition.toString(), 'a')
        assert.strictEqual(node.trueExpr.toString(), 'b')
        assert.strictEqual(node.falseExpr.toString(), 'c:d')
      })

      it('should respect precedence of conditional operator and range operator (2)', function () {
        const node = math.parse('a ? (b : c) : (d : e)')
        assert(node instanceof ConditionalNode)
        assert.strictEqual(node.condition.toString(), 'a')
        assert.strictEqual(node.trueExpr.toString(), '(b:c)')
        assert.strictEqual(node.falseExpr.toString(), '(d:e)')
      })

      it('should respect precedence of conditional operator and range operator (2)', function () {
        const node = math.parse('a ? (b ? c : d) : (e ? f : g)')
        assert(node instanceof ConditionalNode)
        assert.strictEqual(node.condition.toString(), 'a')
        assert.strictEqual(node.trueExpr.toString(), '(b ? c : d)')
        assert.strictEqual(node.falseExpr.toString(), '(e ? f : g)')
      })

      it('should respect precedence of range operator and relational operators', function () {
        const node = math.parse('a:b == c:d')
        assert(node instanceof OperatorNode)
        assert.strictEqual(node.args[0].toString(), 'a:b')
        assert.strictEqual(node.args[1].toString(), 'c:d')
      })

      it('should respect precedence of range operator and operator plus and minus', function () {
        const node = math.parse('a + b : c - d')
        assert(node instanceof RangeNode)
        assert.strictEqual(node.start.toString(), 'a + b')
        assert.strictEqual(node.end.toString(), 'c - d')
      })

      it('should respect precedence of "to" operator and relational operators', function () {
        const node = math.parse('a == b to c')
        assert(node instanceof OperatorNode)
        assert.strictEqual(node.args[0].toString(), 'a')
        assert.strictEqual(node.args[1].toString(), 'b to c')
      })

      it('should respect precedence of "to" operator and relational operators (2)', function () {
        const node = math.parse('a to b == c')
        assert(node instanceof OperatorNode)
        assert.strictEqual(node.args[0].toString(), 'a to b')
        assert.strictEqual(node.args[1].toString(), 'c')
      })

      // TODO: extensively test operator precedence
    })
  })

  describe('functions', function () {
    it('should evaluate function "mod"', function () {
      approxEqual(parseAndEval('mod(8, 3)'), 2)
    })

    it('should evaluate function "to" ', function () {
      approxDeepEqual(parseAndEval('to(5.08 cm * 1000, inch)'),
        math.unit(2000, 'inch').to('inch'))
    })

    it('should evaluate function "sort" with a custom sort function', function () {
      const scope = {}
      parseAndEval('sortByLength(a, b) = size(a)[1] - size(b)[1]', scope)
      assert.deepStrictEqual(parseAndEval('sort(["Langdon", "Tom", "Sara"], sortByLength)', scope),
        math.matrix(['Tom', 'Sara', 'Langdon']))
    })
  })

  describe('bignumber', function () {
    const bigmath = math.create({
      number: 'BigNumber'
    })
    const BigNumber = bigmath.BigNumber

    it('should parse numbers as bignumber', function () {
      assert.deepStrictEqual(bigmath.bignumber('2.3'), new BigNumber('2.3'))
      assert.deepStrictEqual(bigmath.evaluate('2.3'), new BigNumber('2.3'))
      assert.deepStrictEqual(bigmath.evaluate('2.3e+500'), new BigNumber('2.3e+500'))
    })

    it('should evaluate functions supporting bignumbers', function () {
      assert.deepStrictEqual(bigmath.evaluate('0.1 + 0.2'), new BigNumber('0.3'))
    })

    it('should evaluate functions supporting bignumbers', function () {
      assert.deepStrictEqual(bigmath.evaluate('add(0.1, 0.2)'), new BigNumber('0.3'))
    })

    it('should work with mixed numbers and bignumbers', function () {
      approxEqual(bigmath.evaluate('pi + 1'), 4.141592653589793)
    })

    it('should evaluate functions not supporting bignumbers', function () {
      approxEqual(bigmath.evaluate('sin(0.1)'), 0.09983341664682815)
    })

    it('should create a range from bignumbers', function () {
      assert.deepStrictEqual(bigmath.evaluate('4:6'),
        bigmath.matrix([new BigNumber(4), new BigNumber(5), new BigNumber(6)]))
      assert.deepStrictEqual(bigmath.evaluate('0:2:4'),
        bigmath.matrix([new BigNumber(0), new BigNumber(2), new BigNumber(4)]))
    })

    it('should create a matrix with bignumbers', function () {
      assert.deepStrictEqual(bigmath.evaluate('[0.1, 0.2]'),
        bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]))
    })

    it('should get an element from a matrix with bignumbers', function () {
      const scope = {}
      assert.deepStrictEqual(bigmath.evaluate('a=[0.1, 0.2]', scope),
        bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]))

      assert.deepStrictEqual(bigmath.evaluate('a[1]', scope), new BigNumber(0.1))
      assert.deepStrictEqual(bigmath.evaluate('a[:]', scope),
        bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]))
      assert.deepStrictEqual(bigmath.evaluate('a[1:2]', scope),
        bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]))
    })

    it('should replace elements in a matrix with bignumbers', function () {
      const scope = {}
      assert.deepStrictEqual(bigmath.evaluate('a=[0.1, 0.2]', scope),
        bigmath.matrix([new BigNumber(0.1), new BigNumber(0.2)]))

      bigmath.evaluate('a[1] = 0.3', scope)
      assert.deepStrictEqual(scope.a, bigmath.matrix([new BigNumber(0.3), new BigNumber(0.2)]))
      bigmath.evaluate('a[:] = [0.5, 0.6]', scope)
      assert.deepStrictEqual(scope.a, bigmath.matrix([new BigNumber(0.5), new BigNumber(0.6)]))
      bigmath.evaluate('a[1:2] = [0.7, 0.8]', scope)
      assert.deepStrictEqual(scope.a, bigmath.matrix([new BigNumber(0.7), new BigNumber(0.8)]))
    })

    it('should work with complex numbers (downgrades bignumbers to number)', function () {
      assert.deepStrictEqual(bigmath.evaluate('3i'), new Complex(0, 3))
      assert.deepStrictEqual(bigmath.evaluate('2 + 3i'), new Complex(2, 3))
      assert.deepStrictEqual(bigmath.evaluate('2 * i'), new Complex(0, 2))
    })

    it('should work with units', function () {
      assert.deepStrictEqual(bigmath.evaluate('2 cm'), new bigmath.Unit(new bigmath.BigNumber(2), 'cm'))
    })
  })

  describe('bigint', function () {
    const bigmath = math.create({
      number: 'bigint'
    })

    it('should parse integer numbers as bigint', function () {
      assert.strictEqual(bigmath.evaluate('123123123123123123123'), 123123123123123123123n)
      assert.strictEqual(bigmath.evaluate('-123123123123123123123'), -123123123123123123123n)
      assert.strictEqual(bigmath.evaluate('2.3'), 2.3)
      assert.strictEqual(bigmath.evaluate('-2.3'), -2.3)
    })

    it('should parse hex, bin, oct numbers as bigint', function () {
      assert.strictEqual(bigmath.evaluate('0xA2'), 162n)
      assert.strictEqual(bigmath.evaluate('0b1011'), 11n)
      assert.strictEqual(bigmath.evaluate('0o70'), 56n)
    })

    it('should fallback on the configured numberFallback when parsing as bigint', function () {
      const bigmathFallback = math.create({
        number: 'bigint',
        numberFallback: 'BigNumber'
      })

      assert.strictEqual(bigmathFallback.evaluate('42'), 42n)
      assert.deepStrictEqual(bigmathFallback.evaluate('2.3'), bigmathFallback.bignumber('2.3'))
      assert.deepStrictEqual(bigmathFallback.evaluate('-2.3'), bigmathFallback.bignumber('-2.3'))
    })

    it('should evaluate units with bigint values (falling back to number)', function () {
      assert.strictEqual(bigmath.evaluate('5 mm').toString(), '5 mm')
      assert.strictEqual(bigmath.evaluate('5.5 mm').toString(), '5.5 mm')
      assert.strictEqual(bigmath.evaluate('2 * 5 mm').toString(), '10 mm')
      assert.strictEqual(bigmath.evaluate('2.5 * 4 mm').toString(), '10 mm')
    })
  })

  describe('scope', function () {
    it('should use a given scope for assignments', function () {
      const scope = {
        a: 3,
        b: 4
      }
      assert.deepStrictEqual(parse('a*b').compile().evaluate(scope), 12)
      assert.deepStrictEqual(parse('c=5').compile().evaluate(scope), 5)
      assert.deepStrictEqual(parse('f(x) = x^a').compile().evaluate(scope).syntax, 'f(x)')

      assert.deepStrictEqual(Object.keys(scope).length, 4)
      assert.deepStrictEqual(scope.a, 3)
      assert.deepStrictEqual(scope.b, 4)
      assert.deepStrictEqual(scope.c, 5)
      assert.deepStrictEqual(typeof scope.f, 'function')

      assert.strictEqual(scope.f(3), 27)
      scope.a = 2
      assert.strictEqual(scope.f(3), 9)
      scope.hello = function (name) {
        return 'hello, ' + name + '!'
      }
      assert.deepStrictEqual(parse('hello("jos")').compile().evaluate(scope), 'hello, jos!')
    })

    it('should parse undefined symbols, defining symbols, and removing symbols', function () {
      const scope = {}
      let n = parse('q')
      assert.throws(function () { n.compile().evaluate(scope) })
      parse('q=33').compile().evaluate(scope)
      assert.strictEqual(n.compile().evaluate(scope), 33)
      delete scope.q
      assert.throws(function () { n.compile().evaluate(scope) })

      n = parse('qq[1,1]=33')
      assert.throws(function () { n.compile().evaluate(scope) })
      parse('qq=[1,2;3,4]').compile().evaluate(scope)
      n.compile().evaluate(scope)
      assert.deepStrictEqual(scope.qq, math.matrix([[33, 2], [3, 4]]))
      parse('qq=[4]').compile().evaluate(scope)
      n.compile().evaluate(scope)
      assert.deepStrictEqual(scope.qq, math.matrix([[33]]))
      delete scope.qq
      assert.throws(function () { n.compile().evaluate(scope) })
    })

    it('should evaluate a symbol with value null or undefined', function () {
      assert.strictEqual(parse('a').compile().evaluate({ a: null }), null)
      assert.strictEqual(parse('a').compile().evaluate({ a: undefined }), undefined)
    })
  })

  describe('errors', function () {
    it('should return IndexErrors with one based indices', function () {
      // functions throw a zero-based error
      assert.throws(function () { math.subset([1, 2, 3], math.index(4)) }, /Index out of range \(4 > 2\)/)
      assert.throws(function () { math.subset([1, 2, 3], math.index(-2)) }, /Index out of range \(-2 < 0\)/)

      // evaluation via parser throws one-based error
      assert.throws(function () { math.evaluate('A[4]', { A: [1, 2, 3] }) }, /Index out of range \(4 > 3\)/)
      assert.throws(function () { math.evaluate('A[-2]', { A: [1, 2, 3] }) }, /IndexError: Index out of range \(-2 < 1\)/)
    })

    it('should return DimensionErrors with one based indices (subset)', function () {
      // TODO: it would be more clear when all errors where DimensionErrors

      // functions throw a zero-based error
      assert.throws(function () { math.subset([1, 2, 3], math.index(1, 1)) }, /DimensionError: Dimension mismatch \(2 != 1\)/)

      // evaluation via parser throws one-based error
      assert.throws(function () { math.evaluate('A[1,1]', { A: [1, 2, 3] }) }, /DimensionError: Dimension mismatch \(2 != 1\)/)
    })

    it('should return DimensionErrors with one based indices (concat)', function () {
      // TODO: it would be more clear when all errors where DimensionErrors

      // functions throw a zero-based error
      assert.throws(function () { math.concat([1, 2], [[3, 4]]) }, /DimensionError: Dimension mismatch \(1 != 2\)/)
      assert.throws(function () { math.concat([[1, 2]], [[3, 4]], 2) }, /IndexError: Index out of range \(2 > 1\)/)
      assert.throws(function () { math.concat([[1, 2]], [[3, 4]], -1) }, /IndexError: Index out of range \(-1 < 0\)/)

      // evaluation via parser throws one-based error
      assert.throws(function () { math.evaluate('concat([1,2], [[3,4]])') }, /DimensionError: Dimension mismatch \(1 != 2\)/)
      assert.throws(function () { math.evaluate('concat([[1,2]], [[3,4]], 3)') }, /IndexError: Index out of range \(3 > 2\)/)
      assert.throws(function () { math.evaluate('concat([[1,2]], [[3,4]], 0)') }, /IndexError: Index out of range \(0 < 1\)/)
    })

    it('should return DimensionErrors with one based indices (max)', function () {
      // TODO: it would be more clear when all errors where DimensionErrors

      // functions throw a zero-based error
      // TODO

      // evaluation via parser throws one-based error
      assert.deepStrictEqual(math.evaluate('max([[1,2], [3,4]])'), 4)
      assert.deepStrictEqual(math.evaluate('max([[1,2], [3,4]], 1)'), math.matrix([3, 4]))
      assert.deepStrictEqual(math.evaluate('max([[1,2], [3,4]], 2)'), math.matrix([2, 4]))
      assert.throws(function () { math.evaluate('max([[1,2], [3,4]], 3)') }, /IndexError: Index out of range \(3 > 2\)/)
      assert.throws(function () { math.evaluate('max([[1,2], [3,4]], 0)') }, /IndexError: Index out of range \(0 < 1\)/)
    })

    it('should return DimensionErrors with one based indices (min)', function () {
      // TODO: it would be more clear when all errors where DimensionErrors

      // functions throw a zero-based error
      // TODO

      // evaluation via parser throws one-based error
      assert.deepStrictEqual(math.evaluate('min([[1,2], [3,4]])'), 1)
      assert.deepStrictEqual(math.evaluate('min([[1,2], [3,4]], 1)'), math.matrix([1, 2]))
      assert.deepStrictEqual(math.evaluate('min([[1,2], [3,4]], 2)'), math.matrix([1, 3]))
      assert.throws(function () { math.evaluate('min([[1,2], [3,4]], 3)') }, /IndexError: Index out of range \(3 > 2\)/)
      assert.throws(function () { math.evaluate('min([[1,2], [3,4]], 0)') }, /IndexError: Index out of range \(0 < 1\)/)
    })

    it('should return DimensionErrors with one based indices (mean)', function () {
      // TODO: it would be more clear when all errors where DimensionErrors

      // functions throw a zero-based error
      // TODO

      // evaluation via parser throws one-based error
      assert.deepStrictEqual(math.evaluate('mean([[1,2], [3,4]])'), 2.5)
      assert.deepStrictEqual(math.evaluate('mean([[1,2], [3,4]], 1)'), math.matrix([2, 3]))
      assert.deepStrictEqual(math.evaluate('mean([[1,2], [3,4]], 2)'), math.matrix([1.5, 3.5]))
      assert.throws(function () { math.evaluate('mean([[1,2], [3,4]], 3)') }, /IndexError: Index out of range \(3 > 2\)/)
      assert.throws(function () { math.evaluate('mean([[1,2], [3,4]], 0)') }, /IndexError: Index out of range \(0 < 1\)/)
    })
  })

  describe('node tree', function () {
    // TODO: test parsing into a node tree

    it('should correctly stringify a node tree', function () {
      assert.strictEqual(parse('0').toString(), '0')
      assert.strictEqual(parse('"hello"').toString(), '"hello"')
      assert.strictEqual(parse('[1, 2 + 3i, 4]').toString(), '[1, 2 + 3 i, 4]')
      assert.strictEqual(parse('1/2a').toString(), '1 / 2 a')
    })

    it('should correctly stringify named operators', function () {
      assert.strictEqual(parse('7 mod 3').toString(), '7 mod 3')
      assert.strictEqual(parse('5 inch to cm').toString(), '5 inch to cm')
      assert.strictEqual(parse('5 inch in cm').toString(), '5 inch in cm')
      assert.strictEqual(parse('false and true').toString(), 'false and true')
      assert.strictEqual(parse('false xor true').toString(), 'false xor true')
      assert.strictEqual(parse('false or true').toString(), 'false or true')
      assert.strictEqual(parse('not true').toString(), 'not true')
      assert.strictEqual(parse('5!').toString(), '5!')
    })

    it('should correctly stringify an index with dot notation', function () {
      assert.strictEqual(parse('A[2]').toString(), 'A[2]')
      assert.strictEqual(parse('a["b"]').toString(), 'a["b"]')
      assert.strictEqual(parse('a.b').toString(), 'a.b')
    })

    describe('custom nodes', function () {
      // define a custom node
      function CustomNode (args) {
        this.args = args
      }
      CustomNode.prototype = new math.Node()
      CustomNode.prototype.toString = function () {
        return 'CustomNode'
      }
      CustomNode.prototype._compile = function (math, argNames) {
        const strArgs = []
        this.args.forEach(function (arg) {
          strArgs.push(arg.toString())
        })
        return function (scope, args, context) {
          return 'CustomNode(' + strArgs.join(', ') + ')'
        }
      }
      CustomNode.prototype.forEach = function (callback) {
        // we don't have childs
      }

      const options = {
        nodes: {
          custom: CustomNode
        }
      }

      it('should parse custom nodes', function () {
        const node = parse('custom(x, (2+x), sin(x))', options)
        assert.strictEqual(node.compile().evaluate(), 'CustomNode(x, (2 + x), sin(x))')
      })

      it('should parse custom nodes without parameters', function () {
        const node = parse('custom()', options)
        assert.strictEqual(node.compile().evaluate(), 'CustomNode()')
        assert.strictEqual(node.filter(function (node) { return node instanceof CustomNode }).length, 1)

        const node2 = parse('custom', options)
        assert.strictEqual(node2.compile().evaluate(), 'CustomNode()')
        assert.strictEqual(node2.filter(function (node) { return node instanceof CustomNode }).length, 1)
      })

      it('should throw an error on syntax errors in using custom nodes', function () {
        assert.throws(function () { parse('custom(x', options) }, /Parenthesis \) expected/)
        assert.throws(function () { parse('custom(x, ', options) }, /Unexpected end of expression/)
      })
    })
  })

  describe('expose test functions', function () {
    it('should expose isAlpha', function () {
      assert.ok('should expose isAlpha', typeof math.parse.isAlpha === 'function')
    })

    it('should expose isValidLatinOrGreek', function () {
      assert.ok('should expose isAlpha', typeof math.parse.isValidLatinOrGreek === 'function')
    })

    it('should expose isValidMathSymbol', function () {
      assert.ok('should expose isAlpha', typeof math.parse.isValidMathSymbol === 'function')
    })

    it('should expose isWhitespace', function () {
      assert.ok('should expose isAlpha', typeof math.parse.isWhitespace === 'function')
    })

    it('should expose isDecimalMark', function () {
      assert.ok('should expose isAlpha', typeof math.parse.isDecimalMark === 'function')
    })

    it('should expose isDigitDot', function () {
      assert.ok('should expose isAlpha', typeof math.parse.isDigitDot === 'function')
    })

    it('should expose isDigit', function () {
      assert.ok('should expose isAlpha', typeof math.parse.isDigit === 'function')
    })

    it('should allow overriding isAlpha', function () {
      const originalIsAlpha = math.parse.isAlpha

      // override isAlpha with one accepting $ characters too
      math.parse.isAlpha = function (c, cPrev, cNext) {
        return /^[a-zA-Z_$]$/.test(c)
      }

      const node = math.parse('$foo')
      const result = node.evaluate({ $foo: 42 })
      assert.strictEqual(result, 42)

      // restore original isAlpha
      math.parse.isAlpha = originalIsAlpha
    })
  })

  it('Should not allow crashing math by placing a clone function in the config', function () {
    const mathClone = math.create()

    try {
      mathClone.evaluate('f(x)=1;config({clone:f})')
    } catch (err) { }

    assert.strictEqual(mathClone.evaluate('2'), 2)
  })
})
