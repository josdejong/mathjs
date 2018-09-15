// test eval
const assert = require('assert')
const approx = require('../../../tools/approx')
const math = require('../../../src/main')
const Complex = math.type.Complex
const Unit = math.type.Unit
const ResultSet = math.type.ResultSet

describe('eval', function () {
  it('should evaluate expressions', function () {
    approx.equal(math.eval('(2+3)/4'), 1.25)
    assert.deepStrictEqual(math.eval('sqrt(-4)'), new Complex(0, 2))
  })

  it('should eval a list of expressions', function () {
    assert.deepStrictEqual(math.eval(['1+2', '3+4', '5+6']), [3, 7, 11])
    assert.deepStrictEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12])
    assert.deepStrictEqual(math.eval(math.matrix(['a=3', 'b=4', 'a*b'])), math.matrix([3, 4, 12]))
    assert.deepStrictEqual(math.eval(['a=3', 'b=4', 'a*b']), [3, 4, 12])
  })

  it('should eval a series of expressions', function () {
    assert.deepStrictEqual(math.eval('a=3\nb=4\na*b'), new ResultSet([3, 4, 12]))
    assert.deepStrictEqual(math.eval('f(x) = a * x; a=2; f(4)'), new ResultSet([8]))
    assert.deepStrictEqual(math.eval('b = 43; b * 4'), new ResultSet([172]))
  })

  it('should throw an error if wrong number of arguments', function () {
    assert.throws(function () { math.eval() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.eval('', {}, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an error with a unit', function () {
    assert.throws(function () { math.eval(new Unit(5, 'cm')) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error with a complex number', function () {
    assert.throws(function () { math.eval(new Complex(2, 3)) }, /TypeError: Unexpected type of argument/)
  })

  it('should throw an error with a boolean', function () {
    assert.throws(function () { math.eval(true) }, TypeError)
  })

  it('should handle the given scope', function () {
    let scope = {
      a: 3,
      b: 4
    }
    assert.deepStrictEqual(math.eval('a*b', scope), 12)
    assert.deepStrictEqual(math.eval('c=5', scope), 5)
    assert.deepStrictEqual(math.format(math.eval('f(x) = x^a', scope)), 'f(x)')

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
    assert.deepStrictEqual(math.eval('hello("jos")', scope), 'hello, jos!')
  })

  it('should LaTeX eval', function () {
    const expr1 = math.parse('eval(expr)')
    const expr2 = math.parse('eval(expr,scope)')

    assert.strictEqual(expr1.toTex(), '\\mathrm{eval}\\left( expr\\right)')
    assert.strictEqual(expr2.toTex(), '\\mathrm{eval}\\left( expr, scope\\right)')
  })
})
