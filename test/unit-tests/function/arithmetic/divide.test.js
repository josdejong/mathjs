// test divide
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const divide = math.divide
const bignumber = math.bignumber
const complex = math.complex

describe('divide', function () {
  it('should divide two numbers', function () {
    assert.strictEqual(divide(4, 2), 2)
    assert.strictEqual(divide(-4, 2), -2)
    assert.strictEqual(divide(4, -2), -2)
    assert.strictEqual(divide(-4, -2), 2)
    assert.strictEqual(divide(4, 0), Infinity)
    assert.strictEqual(divide(-4, 0), -Infinity)
    assert.strictEqual(divide(0, -5), -0)
    assert.ok(isNaN(divide(0, 0)))
  })

  it('should divide bigint', function () {
    assert.strictEqual(divide(6n, 3n), 2n)
  })

  it('should divide booleans', function () {
    assert.strictEqual(divide(true, true), 1)
    assert.strictEqual(divide(true, false), Infinity)
    assert.strictEqual(divide(false, true), 0)
    assert.ok(isNaN(divide(false, false)))
  })

  it('should divide mixed numbers and booleans', function () {
    assert.strictEqual(divide(2, true), 2)
    assert.strictEqual(divide(2, false), Infinity)
    approxEqual(divide(true, 2), 0.5)
    assert.strictEqual(divide(false, 2), 0)
  })

  it('should divide mixed numbers and bigint', function () {
    assert.strictEqual(divide(6, 3n), 2)
    assert.strictEqual(divide(6n, 3), 2)

    assert.throws(function () { divide(123123123123123123123n, 1) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
    assert.throws(function () { divide(1, 123123123123123123123n) }, /Cannot implicitly convert bigint to number: value exceeds the max safe integer value/)
  })

  it('should divide bignumbers', function () {
    assert.deepStrictEqual(divide(bignumber(0.3), bignumber(0.2)), bignumber(1.5))
    assert.deepStrictEqual(divide(bignumber('2.6e5000'), bignumber('2')), bignumber('1.3e5000'))
  })

  it('should divide mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(divide(bignumber(0.3), 0.2), bignumber(1.5))
    assert.deepStrictEqual(divide(0.3, bignumber(0.2)), bignumber(1.5))
    assert.deepStrictEqual(divide(bignumber('2.6e5000'), 2), bignumber('1.3e5000'))

    assert.throws(function () { divide(1 / 3, bignumber(2)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { divide(bignumber(1), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should divide mixed booleans and bignumbers', function () {
    assert.deepStrictEqual(divide(bignumber(0.3), true), bignumber(0.3))
    assert.deepStrictEqual(divide(bignumber(0.3), false).toString(), 'Infinity')
    assert.deepStrictEqual(divide(false, bignumber('2')), bignumber(0))
    assert.deepStrictEqual(divide(true, bignumber('2')), bignumber(0.5))
  })

  it('should divide two complex numbers', function () {
    approxDeepEqual(divide(complex('2+3i'), 2), complex('1+1.5i'))
    approxDeepEqual(divide(complex('2+3i'), complex('4i')), complex('0.75 - 0.5i'))
    approxDeepEqual(divide(complex('2i'), complex('4i')), complex('0.5'))
    approxDeepEqual(divide(4, complex('1+2i')), complex('0.8 - 1.6i'))
    approxDeepEqual(divide(math.i, 0), complex(Infinity, Infinity))
    approxDeepEqual(divide(complex(0, 1), 0), complex(Infinity, Infinity))
    approxDeepEqual(divide(complex(1, 0), 0), complex(Infinity, Infinity))
    approxDeepEqual(divide(complex(0, 1), complex(0, 0)), complex(Infinity, Infinity))
    approxDeepEqual(divide(complex(1, 1), complex(0, 0)), complex(Infinity, Infinity))
    approxDeepEqual(divide(complex(1, -1), complex(0, 0)), complex(Infinity, -Infinity))
    approxDeepEqual(divide(complex(-1, 1), complex(0, 0)), complex(-Infinity, Infinity))
    approxDeepEqual(divide(complex(1, 1), complex(0, 1)), complex(1, -1))
    approxDeepEqual(divide(complex(1, 1), complex(1, 0)), complex(1, 1))

    approxDeepEqual(divide(complex(2, 3), complex(4, 5)), complex('0.5609756097560976 + 0.0487804878048781i'))
    approxDeepEqual(divide(complex(2, 3), complex(4, -5)), complex('-0.170731707317073 + 0.536585365853659i'))
    approxDeepEqual(divide(complex(2, 3), complex(-4, 5)), complex('0.170731707317073 - 0.536585365853659i'))
    approxDeepEqual(divide(complex(2, 3), complex(-4, -5)), complex('-0.5609756097560976 - 0.0487804878048781i'))
    approxDeepEqual(divide(complex(2, -3), complex(4, 5)), complex('-0.170731707317073 - 0.536585365853659i'))
    approxDeepEqual(divide(complex(2, -3), complex(4, -5)), complex('0.5609756097560976 - 0.0487804878048781i'))
    approxDeepEqual(divide(complex(2, -3), complex(-4, 5)), complex('-0.5609756097560976 + 0.0487804878048781i'))
    approxDeepEqual(divide(complex(2, -3), complex(-4, -5)), complex('0.170731707317073 + 0.536585365853659i'))
    approxDeepEqual(divide(complex(-2, 3), complex(4, 5)), complex('0.170731707317073 + 0.536585365853659i'))
    approxDeepEqual(divide(complex(-2, 3), complex(4, -5)), complex('-0.5609756097560976 + 0.0487804878048781i'))
    approxDeepEqual(divide(complex(-2, 3), complex(-4, 5)), complex('0.5609756097560976 - 0.0487804878048781i'))
    approxDeepEqual(divide(complex(-2, 3), complex(-4, -5)), complex('-0.170731707317073 - 0.536585365853659i'))
    approxDeepEqual(divide(complex(-2, -3), complex(4, 5)), complex('-0.5609756097560976 - 0.0487804878048781i'))
    approxDeepEqual(divide(complex(-2, -3), complex(4, -5)), complex('0.170731707317073 - 0.536585365853659i'))
    approxDeepEqual(divide(complex(-2, -3), complex(-4, 5)), complex('-0.170731707317073 + 0.536585365853659i'))
    approxDeepEqual(divide(complex(-2, -3), complex(-4, -5)), complex('0.5609756097560976 + 0.0487804878048781i'))
  })

  it('should divide mixed complex numbers and numbers', function () {
    assert.deepStrictEqual(divide(math.complex(6, -4), 2), math.complex(3, -2))
    assert.deepStrictEqual(divide(1, math.complex(2, 4)), math.complex(0.1, -0.2))
  })

  it('should divide mixed complex numbers and bignumbers', function () {
    assert.deepStrictEqual(divide(math.complex(6, -4), bignumber(2)), math.complex(3, -2))
    assert.deepStrictEqual(divide(bignumber(1), math.complex(2, 4)), math.complex(0.1, -0.2))
  })

  it('should divide two fractions', function () {
    const a = math.fraction(1, 4)
    assert.strictEqual(divide(a, math.fraction(1, 2)).toString(), '0.5')
    assert.strictEqual(a.toString(), '0.25')
  })

  it('should divide mixed fractions and numbers', function () {
    assert.deepStrictEqual(divide(1, math.fraction(3)), math.fraction(1, 3))
    assert.deepStrictEqual(divide(math.fraction(1), 3), math.fraction(1, 3))
  })

  it('should divide mixed fractions and bigints', function () {
    assert.deepStrictEqual(divide(1n, math.fraction(3)), math.fraction(1, 3))
    assert.deepStrictEqual(divide(math.fraction(1), 3n), math.fraction(1, 3))
  })

  it('should divide units by a number', function () {
    assert.strictEqual(divide(math.unit('5 m'), 10).toString(), '0.5 m')
  })

  it('should divide valueless units by a number', function () {
    assert.strictEqual(divide(math.unit('m'), 2).toString(), '0.5 m')
  })

  it('should divide a number by a unit', function () {
    assert.strictEqual(divide(20, math.unit('4 N s')).toString(), '5 N^-1 s^-1')
    assert.strictEqual(divide(4, math.unit('W')).toString(), '4 W^-1')
    assert.strictEqual(divide(2.5, math.unit('1.25 mm')).toString(), '2 mm^-1')
    assert.strictEqual(divide(10, math.unit('4 mg/s')).toString(), '2.5 s / mg')
    assert.strictEqual(divide(10, math.unit(math.fraction(4), 'mg/s')).toString(), '5/2 s / mg')
    assert.strictEqual(divide(math.fraction(10), math.unit(4, 'mg/s')).toString(), '5/2 s / mg')
    assert.strictEqual(divide(math.fraction(10), math.unit(math.fraction(4), 'mg/s')).toString(), '5/2 s / mg')

    approxEqual(math.format(divide(10, math.unit(math.complex(1, 2), 'm/s')), 14), '(2 - 4i) s / m')
  })

  it('should divide two units', function () {
    assert.strictEqual(divide(math.unit('75 mi/h'), math.unit('40 mi/gal')).to('gal/minute').toString(), '0.03125 gal / minute')

    const a = math.unit(math.fraction(75), 'mi/h')
    const b = math.unit(math.fraction(40), 'mi/gal')
    assert.strictEqual(divide(a, b).to('gal/minute').toString(), '1/32 gal / minute')

    const c = math.unit(math.complex(21, 1), 'kg')
    const d = math.unit(math.complex(2, -3), 's')
    assert.strictEqual(divide(c, d).toString(), '(3 + 5.000000000000001i) kg / s')
  })

  it('should divide one valued unit by a valueless unit and vice-versa', function () {
    assert.strictEqual(divide(math.unit('4 gal'), math.unit('L')).toString(), '15.141647136')
    assert.strictEqual(divide(math.unit('gal'), math.unit('4 L')).toString(), '0.946352946')

    assert.strictEqual(divide(math.unit('inch'), math.unit(math.fraction(1), 'cm')).toFraction(), '127/50')
  })

  it('should divide (but not simplify) two valueless units', function () {
    assert.strictEqual(divide(math.unit('gal'), math.unit('L')).toString(), 'gal / L')
  })

  it('should divide units by a big number', function () {
    assert.strictEqual(divide(math.unit('5 m'), bignumber(10)).toString(), '0.5 m')
    assert.strictEqual(divide(bignumber(80), math.unit('day')).format({ precision: 50 }), '0.92592592592592592592592592592592592592592592592593 mHz')
    assert.strictEqual(divide(bignumber(80), math.unit('1 day')).format({ precision: 50 }), '0.92592592592592592592592592592592592592592592592593 mHz')
    assert.strictEqual(divide(math.unit('day'), bignumber(81)).format({ precision: 50 }), '0.012345679012345679012345679012345679012345679012346 day')
    assert.strictEqual(divide(math.unit('1 day'), bignumber(81)).format({ precision: 50 }), '0.012345679012345679012345679012345679012345679012346 day')

    assert.strictEqual(math.create({ number: 'BigNumber' }).evaluate('round(80 / day * 5 days, 30)').toString(), '400')
  })

  it('should divide each elements in a matrix by a number', function () {
    assert.deepStrictEqual(divide([2, 4, 6], 2), [1, 2, 3])
    const a = math.matrix([[1, 2], [3, 4]])
    assert.deepStrictEqual(divide(a, 2), math.matrix([[0.5, 1], [1.5, 2]]))
    assert.deepStrictEqual(divide(a.valueOf(), 2), [[0.5, 1], [1.5, 2]])
    assert.deepStrictEqual(divide([], 2), [])
    assert.deepStrictEqual(divide([], 2), [])
  })

  it('should divide 1 over a matrix (matrix inverse)', function () {
    approxDeepEqual(divide(1, [
      [1, 4, 7],
      [3, 0, 5],
      [-1, 9, 11]
    ]), [
      [5.625, -2.375, -2.5],
      [4.75, -2.25, -2],
      [-3.375, 1.625, 1.5]
    ])
  })

  it('should perform matrix division', function () {
    const a = math.matrix([[1, 2], [3, 4]])
    const b = math.matrix([[5, 6], [7, 8]])
    assert.deepStrictEqual(divide(a, b), math.matrix([[3, -2], [2, -1]]))
  })

  it('should divide a matrix by a matrix containing a scalar', function () {
    const a = math.matrix([[1, 2], [3, 4]])
    assert.throws(function () { divide(a, [[1]]) })
  })

  /*
  // These are supported now --ericman314
  it('should throw an error if dividing a number by a unit', function() {
    assert.throws(function () {divide(10, math.unit('5 m')).toString()})
  })

  it('should throw an error if dividing a unit by a non-number', function() {
    assert.throws(function () {divide(math.unit('5 m'), math.unit('5cm')).toString()})
  })
  */

  it('should throw an error if there\'s wrong number of arguments', function () {
    assert.throws(function () { divide(2, 3, 4) })
    assert.throws(function () { divide(2) })
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { divide(null, 2) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX divide', function () {
    const expression = math.parse('divide(1,2)')
    assert.strictEqual(expression.toTex(), '\\frac{1}{2}')
  })
})
