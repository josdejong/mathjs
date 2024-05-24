// test exp
import assert from 'assert'

import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const mathPredictable = math.create({ predictable: true })
const bignumber = math.bignumber
const fraction = math.fraction
const complex = math.complex
const matrix = math.matrix
const unit = math.unit
const pow = math.pow

describe('pow', function () {
  it('should exponentiate a number to the given power', function () {
    approxDeepEqual(pow(2, 3), 8)
    approxDeepEqual(pow(2, 4), 16)
    approxDeepEqual(pow(-2, 2), 4)
    approxDeepEqual(pow(3, 3), 27)
    approxDeepEqual(pow(3, -2), 0.111111111111111)
    approxDeepEqual(pow(-3, -2), 0.111111111111111)
    approxDeepEqual(pow(3, -3), 0.0370370370370370)
    approxDeepEqual(pow(-3, -3), -0.0370370370370370)
    approxDeepEqual(pow(2, 1.5), 2.82842712474619)
  })

  it('should exponentiate a bigint to the given power', function () {
    assert.strictEqual(pow(2n, 3n), 8n)
    assert.strictEqual(pow(2n, 4n), 16n)
    assert.strictEqual(pow(-2n, 2n), 4n)
    assert.strictEqual(pow(3n, 3n), 27n)
    assert.throws(() => pow(3n, -2n))
  })

  it('should exponentiate a negative number to a non-integer power', function () {
    approxDeepEqual(pow(-2, 1.5), complex(0, -2.82842712474619))
    approxDeepEqual(pow(-8, 1 / 3), complex(1, 1.732050807568877))
  })

  it('should exponentiate a negative number to a non-integer power with predictable:true', function () {
    const res = mathPredictable.pow(-2, 1.5)
    assert.strictEqual(typeof res, 'number')
    assert(isNaN(res))
    assert.strictEqual(mathPredictable.pow(-8, 1 / 3), -2)
  })

  it('should return a real-valued root if one exists with predictable:true', function () {
    approxEqual(mathPredictable.pow(-8, 1 / 3), -2)
    approxEqual(mathPredictable.pow(-8, 2 / 3), 4)
    approxEqual(mathPredictable.pow(-8, 3 / 3), -8)
    approxEqual(mathPredictable.pow(-8, 4 / 3), 16)
    approxEqual(mathPredictable.pow(-8, 5 / 3), -32)
    approxEqual(mathPredictable.pow(-8, -5 / 3), -0.03125)
    approxEqual(mathPredictable.pow(-1, 2 / 3), 1)
    approxEqual(mathPredictable.pow(-1, 50 / 99), 1)
    approxEqual(mathPredictable.pow(-1, 49 / 99), -1)
    approxEqual(mathPredictable.pow(-17, 29 / 137), -1.8216292479175)
    approxEqual(mathPredictable.pow(-1, 0), 1)
    approxEqual(mathPredictable.pow(-1, 0.2), -1)
    approxEqual(mathPredictable.pow(-1, 1), -1)

    approxEqual(mathPredictable.pow(4, 2), 16)
    approxEqual(mathPredictable.pow(4, 0.5), 2)
    approxEqual(mathPredictable.pow(-4, 2), 16)

    assert(isNaN(mathPredictable.pow(-1, 49 / 100)))
    assert(isNaN(mathPredictable.pow(-17, 29 / 138)))
    assert(isNaN(mathPredictable.pow(-17, 3.14159265358979)))
  })

  it('should exponentiate booleans to the given power', function () {
    assert.strictEqual(pow(true, true), 1)
    assert.strictEqual(pow(true, false), 1)
    assert.strictEqual(pow(false, true), 0)
    assert.strictEqual(pow(false, false), 1)
  })

  it('should exponentiate mixed numbers and booleans', function () {
    assert.strictEqual(pow(2, true), 2)
    assert.strictEqual(pow(2, false), 1)
    assert.strictEqual(pow(true, 2), 1)
    assert.strictEqual(pow(false, 2), 0)
  })

  it('should exponentiate bignumbers', function () {
    assert.deepStrictEqual(pow(bignumber(2), bignumber(3)), bignumber(8))
    assert.deepStrictEqual(pow(bignumber(100), bignumber(500)), bignumber('1e1000'))

    assert.deepStrictEqual(pow(bignumber(-1), bignumber(2)), bignumber('1'))
    assert.deepStrictEqual(pow(bignumber(2), bignumber(1.5)), bignumber('2.828427124746190097603377448419396157139343750753896146353359476'))
  })

  it('should exponentiate a negative bignumber to a non-integer power', function () {
    approxDeepEqual(pow(bignumber(-2), bignumber(1.5)), complex(0, -2.82842712474619))
    approxDeepEqual(pow(-2, bignumber(1.5)), complex(0, -2.82842712474619))
    approxDeepEqual(pow(bignumber(-2), 1.5), complex(0, -2.82842712474619))
  })

  it('should exponentiate a negative bignumber to a non-integer power', function () {
    assert.ok(mathPredictable.pow(bignumber(-2), bignumber(1.5)).isNaN())
  })

  it('should exponentiate mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(pow(bignumber(2), 3), bignumber(8))
    assert.deepStrictEqual(pow(2, bignumber(3)), bignumber(8))

    assert.throws(function () { pow(1 / 3, bignumber(2)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { pow(bignumber(1), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should exponentiate mixed booleans and bignumbers', function () {
    assert.deepStrictEqual(pow(true, bignumber(3)), bignumber(1))
    assert.deepStrictEqual(pow(false, bignumber(3)), bignumber(0))
    assert.deepStrictEqual(pow(bignumber(3), false), bignumber(1))
    assert.deepStrictEqual(pow(bignumber(3), true), bignumber(3))
  })

  it('should exponentiate a fraction to an integer power', function () {
    assert.deepStrictEqual(math.pow(fraction(3), fraction(2)), fraction(9))
    assert.deepStrictEqual(math.pow(fraction(1.5), fraction(2)), fraction(2.25))
    assert.deepStrictEqual(math.pow(fraction(1.5), fraction(-2)), fraction(4, 9))
    assert.deepStrictEqual(math.pow(fraction(1.5), 2), fraction(2.25))
  })

  it('should exponentiate a fraction to an non-integer power', function () {
    assert.deepStrictEqual(math.pow(fraction(27, 8), fraction(2, 3)), fraction(9, 4))

    approxDeepEqual(math.pow(fraction(4), 1.5114), 8.127434364206053)
    approxDeepEqual(math.pow(fraction(4), fraction(1.5114)), 8.127434364206053)

    assert.throws(function () { mathPredictable.pow(fraction(3), fraction(1.5114)) },
      /Result of pow is non-rational and cannot be expressed as a fraction/)
  })

  it('should throw an error if used with wrong number of arguments', function () {
    assert.throws(function () { pow(1) }, /TypeError: Too few arguments in function pow/)
    assert.throws(function () { pow(1, 2, 3) }, /TypeError: Too many arguments in function pow \(expected: 2, actual: 3\)/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { pow(null, 2) }, /TypeError: Unexpected type of argument/)
  })

  it('should handle infinite exponents', function () {
    const Ptbl = mathPredictable

    // TODO replace isNaN with complexInfinity when complex.js updates

    assert.strictEqual(math.pow(3, Infinity), Infinity)
    assert.strictEqual(math.pow(3, -Infinity), 0)
    assert(isNaN(Ptbl.pow(-3, Infinity)))
    assert(math.pow(-3, Infinity).isNaN())
    assert.strictEqual(math.pow(-3, -Infinity), 0)

    assert.strictEqual(math.pow(0.3, Infinity), 0)
    assert.strictEqual(math.pow(0.3, -Infinity), Infinity)
    assert.strictEqual(math.pow(-0.3, Infinity), 0)
    assert(isNaN(Ptbl.pow(-0.3, -Infinity)))
    assert(math.pow(-0.3, -Infinity).isNaN())

    assert.strictEqual(math.pow(Infinity, Infinity), Infinity)
    assert.strictEqual(math.pow(Infinity, -Infinity), 0) // https://www.wolframalpha.com/input/?i=infinity%5E(-infinity)
    assert(isNaN(Ptbl.pow(-Infinity, Infinity)))
    assert(math.pow(-Infinity, Infinity).isNaN())
    assert.strictEqual(math.pow(-Infinity, -Infinity), 0)
  })

  it('should exponentiate a complex number to the given power', function () {
    approxDeepEqual(pow(complex(3, 0), 2), complex(9, 0))
    approxDeepEqual(pow(complex(0, 2), 2), complex(-4, 0))

    approxDeepEqual(pow(complex(-1, -1), complex(-1, -1)), complex('-0.0284750589322119 +  0.0606697332231795i'))
    approxDeepEqual(pow(complex(-1, -1), complex(-1, 1)), complex('-6.7536199239765713 +  3.1697803027015614i'))
    approxDeepEqual(pow(complex(-1, -1), complex(0, -1)), complex('0.0891447921553914 - 0.0321946742909677i'))
    approxDeepEqual(pow(complex(-1, -1), complex(0, 1)), complex('9.92340022667813 + 3.58383962127501i'))
    approxDeepEqual(pow(complex(-1, -1), complex(1, -1)), complex('-0.1213394664463591 -  0.0569501178644237i'))
    approxDeepEqual(pow(complex(-1, -1), complex(1, 1)), complex('-6.3395606054031211 - 13.5072398479531426i'))
    approxDeepEqual(pow(complex(-1, 1), complex(-1, -1)), complex('-6.7536199239765713 -  3.1697803027015614i'))
    approxDeepEqual(pow(complex(-1, 1), complex(-1, 1)), complex('-0.0284750589322119 -  0.0606697332231795i'))
    approxDeepEqual(pow(complex(-1, 1), complex(0, -1)), complex('9.92340022667813 - 3.58383962127501i'))
    approxDeepEqual(pow(complex(-1, 1), complex(0, 1)), complex('0.0891447921553914 + 0.0321946742909677i'))
    approxDeepEqual(pow(complex(-1, 1), complex(1, -1)), complex('-6.3395606054031211 + 13.5072398479531426i'))
    approxDeepEqual(pow(complex(-1, 1), complex(1, 1)), complex('-0.1213394664463591 +  0.0569501178644237i'))

    approxDeepEqual(pow(complex(0, -1), complex(-1, -1)), complex('0.000000000000000 + 0.207879576350762i'))
    approxDeepEqual(pow(complex(0, -1), complex(-1, 1)), complex('0.000000000000000 + 4.810477380965351i'))
    approxDeepEqual(pow(complex(0, -1), complex(1, -1)), complex('0.000000000000000 - 0.207879576350762i'))
    approxDeepEqual(pow(complex(0, -1), complex(1, 1)), complex('0.000000000000000 - 4.810477380965351i'))
    approxDeepEqual(pow(complex(0, 1), complex(-1, -1)), complex('0.000000000000000 - 4.810477380965351i'))
    approxDeepEqual(pow(complex(0, 1), complex(-1, 1)), complex('0.000000000000000 - 0.207879576350762i'))
    approxDeepEqual(pow(complex(0, 1), complex(1, -1)), complex('0.000000000000000 + 4.810477380965351i'))
    approxDeepEqual(pow(complex(0, 1), complex(1, 1)), complex('0.000000000000000 + 0.207879576350762i'))

    approxDeepEqual(pow(complex(1, -1), complex(-1, -1)), complex('0.2918503793793073 +  0.1369786269150605i'))
    approxDeepEqual(pow(complex(1, -1), complex(-1, 1)), complex('0.6589325864505904 +  1.4039396486303144i'))
    approxDeepEqual(pow(complex(1, -1), complex(0, -1)), complex('0.428829006294368 - 0.154871752464247i'))
    approxDeepEqual(pow(complex(1, -1), complex(0, 1)), complex('2.062872235080905 + 0.745007062179724i'))
    approxDeepEqual(pow(complex(1, -1), complex(1, -1)), complex('0.2739572538301211 -  0.5837007587586147i'))
    approxDeepEqual(pow(complex(1, -1), complex(1, 1)), complex('2.8078792972606288 -  1.3178651729011805i'))
    approxDeepEqual(pow(complex(1, 1), complex(-1, -1)), complex('0.6589325864505904 -  1.4039396486303144i'))
    approxDeepEqual(pow(complex(1, 1), complex(-1, 1)), complex('0.2918503793793073 -  0.1369786269150605i'))
    approxDeepEqual(pow(complex(1, 1), complex(0, -1)), complex('2.062872235080905 - 0.745007062179724i'))
    approxDeepEqual(pow(complex(1, 1), complex(0, 1)), complex('0.428829006294368 + 0.154871752464247i'))
    approxDeepEqual(pow(complex(1, 1), complex(1, -1)), complex('2.8078792972606288 +  1.3178651729011805i'))
    approxDeepEqual(pow(complex(1, 1), complex(1, 1)), complex('0.2739572538301211 +  0.5837007587586147i'))
  })

  it('should exponentiate a complex number to the given bignumber power', function () {
    approxDeepEqual(pow(complex(3, 0), math.bignumber(2)), complex(9, 0))
    approxDeepEqual(pow(complex(0, 2), math.bignumber(2)), complex(-4, 0))
  })

  it('should correctly calculate unit ^ number', function () {
    assert.strictEqual(pow(unit('4 N'), 2).toString(), '16 N^2')
    assert.strictEqual(pow(unit('0.25 m/s'), -0.5).toString(), '2 s^0.5 / m^0.5')
    assert.strictEqual(pow(unit('123 hogshead'), 0).toString(), '1')
  })

  it('should correctly calculate unit ^ BigNumber', function () {
    assert.strictEqual(pow(unit('4 N'), math.bignumber(2)).toString(), '16 N^2')
    assert.deepStrictEqual(pow(unit(math.bignumber(4), 'N'), math.bignumber(2)).toNumeric('N^2'), math.bignumber(16))
  })

  it('should return a cloned value and not affect the argument', function () {
    const unit1 = unit('2 m')
    const unit2 = pow(unit1, 2)

    assert.strictEqual(unit1.toString(), '2 m')
    assert.strictEqual(unit2.toString(), '4 m^2')
  })

  it('should return a valuelessUnit when calculating valuelessUnit ^ number', function () {
    assert.strictEqual(pow(unit('kg^0.5 m^0.5 s^-1'), 2).toString(), '(kg m) / s^2')
  })

  it('should throw an error when doing number ^ unit', function () {
    assert.throws(function () { pow(2, unit('5cm')) })
  })

  it('should throw an error if used with a string', function () {
    assert.throws(function () { pow('text', 2) })
    assert.throws(function () { pow(2, 'text') })
  })

  it('should raise a square matrix to the power 2', function () {
    const a = [[1, 2], [3, 4]]
    const res = [[7, 10], [15, 22]]
    approxDeepEqual(pow(a, 2), res)
    approxDeepEqual(pow(matrix(a), 2), matrix(res))
  })

  it('should raise an inverted matrix for power -1', function () {
    const a = [
      [2, -1, 0],
      [-1, 2, -1],
      [0, -1, 2]
    ]
    const res = [
      [3 / 4, 1 / 2, 1 / 4],
      [1 / 2, 1, 1 / 2],
      [1 / 4, 1 / 2, 3 / 4]
    ]
    approxDeepEqual(pow(a, -1), res)
    approxDeepEqual(pow(matrix(a), -1), matrix(res))
  })

  it('should return identity matrix for power 0', function () {
    const a = [[1, 2], [3, 4]]
    const res = [[1, 0], [0, 1]]
    approxDeepEqual(pow(a, 0), res)
    approxDeepEqual(pow(matrix(a), 0), matrix(res))
  })

  it('should compute large size of square matrix', function () {
    const a = math.identity(30).valueOf()
    approxDeepEqual(pow(a, 1000), a)
    approxDeepEqual(pow(matrix(a), 1000), matrix(a))
  })

  it('should throw an error when calculating the power of a non square matrix', function () {
    assert.throws(function () { pow([1, 2, 3, 4], 2) })
    assert.throws(function () { pow([[1, 2, 3], [4, 5, 6]], 2) })
    assert.throws(function () { pow([[1, 2, 3], [4, 5, 6]], 2) })
  })

  it('should throw an error when raising a matrix to a non-integer power', function () {
    const a = [[1, 2], [3, 4]]
    assert.throws(function () { pow(a, 2.5) })
    assert.throws(function () { pow(a, [2, 3]) })
  })

  it('should throw an error when raising a non-invertible matrix to a negative integer power', function () {
    const a = [[1, 1, 1], [1, 0, 0], [0, 0, 0]]
    assert.throws(function () { pow(a, -1) })
  })

  it('should LaTeX pow', function () {
    const expression = math.parse('pow(2,10)')
    assert.strictEqual(expression.toTex(), '\\left(2\\right)^{10}')
  })
})
