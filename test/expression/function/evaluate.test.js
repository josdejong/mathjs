import assert from 'assert'
import approx from '../../../tools/approx'
import math from '../../../src/entry/bundleAny'

const Complex = math.Complex
const Unit = math.Unit
const ResultSet = math.ResultSet

describe('evaluate', function () {
  it('should evaluate expressions', function () {
    approx.equal(math.evaluate('(2+3)/4'), 1.25)
    assert.deepStrictEqual(math.evaluate('sqrt(-4)'), new Complex(0, 2))
  })

  it('should evaluate a list of expressions', function () {
    assert.deepStrictEqual(math.evaluate(['1+2', '3+4', '5+6']), [3, 7, 11])
    assert.deepStrictEqual(math.evaluate(['a=3', 'b=4', 'a*b']), [3, 4, 12])
    assert.deepStrictEqual(math.evaluate(math.matrix(['a=3', 'b=4', 'a*b'])), math.matrix([3, 4, 12]))
    assert.deepStrictEqual(math.evaluate(['a=3', 'b=4', 'a*b']), [3, 4, 12])
  })

  it('should evaluate a series of expressions', function () {
    assert.deepStrictEqual(math.evaluate('a=3\nb=4\na*b'), new ResultSet([3, 4, 12]))
    assert.deepStrictEqual(math.evaluate('f(x) = a * x; a=2; f(4)'), new ResultSet([8]))
    assert.deepStrictEqual(math.evaluate('b = 43; b * 4'), new ResultSet([172]))
  })

  it('should throw an error if wrong number of arguments', function () {
    assert.throws(function () { math.evaluate() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.evaluate('', {}, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error with a unit', function () {
    assert.throws(function () { math.evaluate(new Unit(5, 'cm')) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error with a complex number', function () {
    assert.throws(function () { math.evaluate(new Complex(2, 3)) }, /TypeError: Unexpected type of argument/)
  })

  it('should evaluate a boolean', function () {
    // TODO: this is odd. Boolean is turned in to string and then evaluated
    assert.strictEqual(math.evaluate(true), true)
  })

  it('should handle the given scope', function () {
    let scope = {
      a: 3,
      b: 4
    }
    assert.deepStrictEqual(math.evaluate('a*b', scope), 12)
    assert.deepStrictEqual(math.evaluate('c=5', scope), 5)
    assert.deepStrictEqual(math.format(math.evaluate('f(x) = x^a', scope)), 'f(x)')

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
    assert.deepStrictEqual(math.evaluate('hello("jos")', scope), 'hello, jos!')
  })

  it('should LaTeX evaluate', function () {
    const expr1 = math.parse('evaluate(expr)')
    const expr2 = math.parse('evaluate(expr,scope)')

    assert.strictEqual(expr1.toTex(), '\\mathrm{evaluate}\\left( expr\\right)')
    assert.strictEqual(expr2.toTex(), '\\mathrm{evaluate}\\left( expr, scope\\right)')
  })

  it('should still allow using the deprecated function math.evaluate', () => {
    // deprecated in v6.0.0. Clean up some day
    const warnOriginal = console.warn
    const logs = []
    console.warn = (...args) => logs.push(args)

    assert.strictEqual(math.eval('2+3'), 5)

    // Note that the following assertion will fail if math.evaluate is already used in a previous unit test
    assert.deepStrictEqual(logs, [
      ['Warning:', 'Function "eval" has been renamed to "evaluate" in v6.0.0, please use the new function instead.']
    ])

    console.warn = warnOriginal
  })
})
