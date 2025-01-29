import assert from 'assert'
import math from '../../../src/defaultInstance.js'
const numeric = math.numeric

describe('numeric', function () {
  it('should throw if called with wrong number of arguments', function () {
    assert.throws(() => { numeric() }, /Cannot convert/)
    assert.throws(() => { numeric(3.14, 'Fraction', 'pi') }, SyntaxError)
  })

  it('should default to converting to number', function () {
    assert.strictEqual(numeric('3.14'), 3.14)
  })

  it('should throw if called with invalid argument', function () {
    assert.throws(() => { numeric(true, 'number') }, /Cannot convert/)
    assert.throws(() => { numeric(null, 'number') }, /Cannot convert/)
    assert.throws(() => { numeric([], 'number') }, /Cannot convert/)
    assert.throws(() => { numeric({}, 'number') }, /Cannot convert/)
    assert.throws(() => { numeric('foo', 'number') }, /is not a valid number/)
    assert.throws(() => { numeric('2.3.4', 'number') }, /is not a valid number/)
    assert.throws(() => { numeric('234a', 'number') }, /is not a valid number/)
    assert.throws(() => { numeric('234 1', 'number') }, /is not a valid number/)
  })

  it('should return Infinity', function () {
    assert.strictEqual(numeric('Infinity', 'number'), Infinity)
  })

  it('should convert a Fraction to a BigNumber', function () {
    assert.deepStrictEqual(numeric(math.fraction(1, 7), 'BigNumber'), math.bignumber('0.1428571428571428571428571428571428571428571428571428571428571429'))
    assert.deepStrictEqual(numeric(math.fraction(-1, 8), 'BigNumber'), math.bignumber('-0.125'))
  })

  it('should convert a Fraction to a number', function () {
    assert.deepStrictEqual(numeric(math.fraction(1, 7), 'number'), 0.14285714285714285)
    assert.deepStrictEqual(numeric(math.fraction(-1, 8), 'number'), -0.125)
  })

  it('should convert a BigNumber to a Fraction', function () {
    assert.deepStrictEqual(numeric(math.bignumber('-0.125'), 'Fraction'), math.fraction(-1, 8))
    assert.deepStrictEqual(numeric(math.bignumber('0.142857142857142857142857'), 'Fraction'),
      math.fraction(142857142857142857142857n, 1000000000000000000000000n)
    )
  })

  it('should convert a BigNumber to a number', function () {
    assert.deepStrictEqual(numeric(math.bignumber(-0.125), 'number'), -0.125)
    assert.deepStrictEqual(numeric(math.bignumber(1e500), 'number'), Infinity) // eslint-disable-line no-loss-of-precision
  })

  it('should convert a number to a BigNumber', function () {
    assert.deepStrictEqual(numeric(-0.125, 'BigNumber'), math.bignumber(-0.125))
  })

  it('should convert a number to a Fraction', function () {
    assert.deepStrictEqual(numeric(0.142857142857, 'Fraction'), math.fraction(1, 7))
  })

  it('should convert a string to a BigNumber', function () {
    assert.deepStrictEqual(numeric('3.141592653589793238462643383279501', 'BigNumber'), math.bignumber('3.141592653589793238462643383279501'))
    assert.deepStrictEqual(numeric('2e-10000', 'BigNumber'), math.bignumber('2e-10000'))
    assert.deepStrictEqual(numeric('2e10000', 'BigNumber'), math.bignumber('2e10000'))
  })

  it('should convert a string to a Fraction', function () {
    assert.deepStrictEqual(numeric('0.625', 'Fraction'), math.fraction(5, 8))
  })

  it('should convert a string to a number', function () {
    assert.deepStrictEqual(numeric('8.314', 'number'), 8.314)
    assert.deepStrictEqual(numeric('2.1e-3', 'number'), 0.0021)
    assert.deepStrictEqual(numeric('2.1e3', 'number'), 2100)
  })

  it('should return the same object if input/output types match', function () {
    const bn1 = math.bignumber(123)
    assert.strictEqual(bn1, numeric(bn1, 'BigNumber'))

    const fr1 = math.fraction(1, 3)
    assert.strictEqual(fr1, numeric(fr1, 'Fraction'))
  })

  it('should throw an error if called with a complex number', function () {
    assert.throws(function () { numeric(math.complex(2, 3), 'number') }, TypeError)
  })

  it('should LaTeX numeric', function () {
    const expr1 = math.parse('numeric(3.14, "number")')
    const expr2 = math.parse('numeric("3.141592653589793238462643383279501", "BigNumber")')
    const expr3 = math.parse('numeric(22/7, "Fraction")')

    assert.strictEqual(expr1.toTex(), '3.14')
    assert.strictEqual(expr2.toTex(), '\\mathtt{"3.141592653589793238462643383279501"}')
    assert.strictEqual(expr3.toTex(), '\\frac{22}{7}')
  })
})
