import assert from 'assert'
import { approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'

const unit = math.unit
const complex = math.complex
const cos = math.cos
const sin = math.sin
const add = math.add
const multiply = math.multiply
const matrix = math.matrix
const rotate = math.rotate

describe('rotate', function () {
  it('should return a rotated 1x2 vector when it is provided as array', function () {
    assert.deepStrictEqual(rotate([1, 0], 0), [1, 0])

    assert.deepStrictEqual(rotate([100, 0], 1), [100 * cos(1), 100 * sin(1)])
    assert.deepStrictEqual(rotate([2, 3], 2), [2 * cos(2) - 3 * sin(2), 2 * sin(2) + 3 * cos(2)])

    const cos45 = cos(unit('45deg'))
    const sin45 = sin(unit('45deg'))
    assert.deepStrictEqual(rotate([4, 5], unit('45deg')), [4 * cos45 - 5 * sin45,
      4 * cos45 + 5 * sin45])

    const reCos = 4.18962569096881
    const imCos = 9.10922789375534
    const reSin = 9.15449914691142
    const imSin = 4.16890695996656
    const cosComplex = complex(-reCos, -imCos)
    const sinComplex = complex(reSin, -imSin)
    approxDeepEqual(rotate([1, 1], complex('2+3i')),
      [add(cosComplex, multiply(-1.0, sinComplex)), add(cosComplex, sinComplex)])
  })

  it('should return a rotated 1x2 vector when it is provided as matrix', function () {
    assert.deepStrictEqual(rotate(matrix([100, 200]), 0), matrix([100, 200]))

    assert.deepStrictEqual(rotate(matrix([100, 0]), 1), matrix([100 * cos(1), 100 * sin(1)]))
    assert.deepStrictEqual(rotate(matrix([2, 3]), 2), matrix([2 * cos(2) - 3 * sin(2), 2 * sin(2) + 3 * cos(2)]))

    const cos45 = cos(unit('45deg'))
    const sin45 = sin(unit('45deg'))
    assert.deepStrictEqual(rotate(matrix([4, 5]), unit('45deg')), matrix([4 * cos45 - 5 * sin45,
      4 * cos45 + 5 * sin45]))

    const reCos = 4.18962569096881
    const imCos = 9.10922789375534
    const reSin = 9.15449914691142
    const imSin = 4.16890695996656
    const cosComplex = complex(-reCos, -imCos)
    const sinComplex = complex(reSin, -imSin)
    approxDeepEqual(rotate(matrix([1, 1]), complex('2+3i')),
      matrix([add(cosComplex, multiply(-1.0, sinComplex)), add(cosComplex, sinComplex)]))
  })

  it('should return a rotated 1x2 bignumber vector', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    const minusOne = bigmath.bignumber(-1)
    const cos1 = bigmath.cos(bigmath.bignumber(1))
    const sin1 = bigmath.sin(bigmath.bignumber(1))
    const minusSin1 = bigmath.multiply(sin1, minusOne)
    const big2 = bigmath.bignumber(2)
    const big3 = bigmath.bignumber(3)
    assert.deepStrictEqual(bigmath.rotate([big2, big3], bigmath.bignumber(1)),
      [add(cos1.times(big2), minusSin1.times(big3)), add(sin1.times(big2), cos1.times(big3))])

    assert.deepStrictEqual(bigmath.rotate(bigmath.matrix([big2, big3]), bigmath.bignumber(1)),
      bigmath.matrix([add(cos1.times(big2), minusSin1.times(big3)),
        add(sin1.times(big2), cos1.times(big3))]))
  })

  it('should return a rotated 1x3 vector when it is provided as an array', function () {
    assert.deepStrictEqual(rotate([11, 12, 13], 0.7, [0, 0, 1]),
      [11 * cos(0.7) - 12 * sin(0.7), 11 * sin(0.7) + 12 * cos(0.7), 13])
    assert.deepStrictEqual(rotate([11, 12, 13], 0.7, [0, 1, 0]),
      [11 * cos(0.7) + 13 * sin(0.7), 12, -11 * sin(0.7) + 13 * cos(0.7)])
    assert.deepStrictEqual(rotate([11, 12, 13], 0.7, [1, 0, 0]),
      [11, 12 * cos(0.7) - 13 * sin(0.7), 12 * sin(0.7) + 13 * cos(0.7)])

    const cos30 = cos(unit('30deg'))
    const sin30 = sin(unit('30deg'))
    assert.deepStrictEqual(rotate([11, 12, 13], unit('30deg'), [1, 0, 0]),
      [11, 12 * cos30 - 13 * sin30, 12 * sin30 + 13 * cos30])

    const reCos = 4.18962569096881
    const imCos = 9.10922789375534
    const reSin = 9.15449914691142
    const imSin = 4.16890695996656
    const cosComplex = complex(-reCos, -imCos)
    const sinComplex = complex(reSin, -imSin)
    approxDeepEqual(rotate([11, 12, 13], complex('2+3i'), [0, 0, 1]),
      [add(multiply(11, cosComplex), multiply(-12.0, sinComplex)),
        add(multiply(11, sinComplex), multiply(12, cosComplex)),
        13])
  })

  it('should return a rotated 1x3 vector when it is provided as matrix', function () {
    assert.deepStrictEqual(rotate(matrix([11, 12, 13]), 0.7, [0, 0, 1]),
      matrix([11 * cos(0.7) - 12 * sin(0.7), 11 * sin(0.7) + 12 * cos(0.7), 13]))
    assert.deepStrictEqual(rotate(matrix([11, 12, 13]), 0.7, [0, 1, 0]),
      matrix([11 * cos(0.7) + 13 * sin(0.7), 12, -11 * sin(0.7) + 13 * cos(0.7)]))
    assert.deepStrictEqual(rotate(matrix([11, 12, 13]), 0.7, [1, 0, 0]),
      matrix([11, 12 * cos(0.7) - 13 * sin(0.7), 12 * sin(0.7) + 13 * cos(0.7)]))

    const cos30 = cos(unit('30deg'))
    const sin30 = sin(unit('30deg'))
    assert.deepStrictEqual(rotate(matrix([11, 12, 13]), unit('30deg'), [1, 0, 0]),
      matrix([11, 12 * cos30 - 13 * sin30, 12 * sin30 + 13 * cos30]))

    const reCos = 4.18962569096881
    const imCos = 9.10922789375534
    const reSin = 9.15449914691142
    const imSin = 4.16890695996656
    const cosComplex = complex(-reCos, -imCos)
    const sinComplex = complex(reSin, -imSin)
    approxDeepEqual(rotate(matrix([11, 12, 13]), complex('2+3i'), [0, 0, 1]),
      matrix([add(multiply(11, cosComplex), multiply(-12.0, sinComplex)),
        add(multiply(11, sinComplex), multiply(12, cosComplex)),
        13]))
  })

  it('should return a rotated 1x3 bignumber vector', function () {
    const bigmath = math.create({ number: 'BigNumber' })
    const minusOne = bigmath.bignumber(-1)
    const cos1 = bigmath.cos(bigmath.bignumber(1))
    const sin1 = bigmath.sin(bigmath.bignumber(1))
    const minusSin1 = bigmath.multiply(sin1, minusOne)
    const big2 = bigmath.bignumber(2)
    const big3 = bigmath.bignumber(3)
    const big4 = bigmath.bignumber(4)
    assert.deepStrictEqual(bigmath.rotate([big2, big3, big4], bigmath.bignumber(1), [0, 0, 1]),
      [add(cos1.times(big2), minusSin1.times(big3)), add(sin1.times(big2), cos1.times(big3)), big4])

    assert.deepStrictEqual(bigmath.rotate(bigmath.matrix([big2, big3, big4]), bigmath.bignumber(1), [0, 0, 1]),
      bigmath.matrix([add(cos1.times(big2), minusSin1.times(big3)),
        add(sin1.times(big2), cos1.times(big3)), big4]))
  })

  it('should return an object of predictable type', function () {
    assert.deepStrictEqual(rotate([1, 0], 1), [cos(1), sin(1)])
    assert.deepStrictEqual(rotate([1, 0, 0], -1, [0, 0, 1]), [cos(-1), sin(-1), 0])

    assert.deepStrictEqual(rotate(matrix([1, 0]), 1),
      matrix([cos(1), sin(1)]))
    assert.deepStrictEqual(rotate(matrix([1, 0, 0]), -1, [0, 0, 1]),
      matrix([cos(-1), sin(-1), 0]))
  })

  it('should return a rotated 1x3 vector as sparse matrix', function () {
    const expectedX = 4 * cos(unit('-90deg')) - 5 * sin(unit('-90deg'))
    const expectedY = 4 * sin(unit('-90deg')) + 5 * cos(unit('-90deg'))
    assert.deepStrictEqual(rotate(matrix([4, 5], 'sparse'), unit('-90deg')), matrix([expectedX, expectedY], 'sparse'))
  })

  it('should throw an error with invalid number of arguments', function () {
    assert.throws(function () { rotate() }, /TypeError: Too few arguments/)
    assert.throws(function () { rotate(1) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rotate([], null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rotate([], 1, [], 2) }, /TypeError: Too many arguments/)
  })

  it('should throw an error with invalid type of arguments', function () {
    assert.throws(function () { rotate(1) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rotate([], 1, [], 2) }, /TypeError: Too many arguments/)

    assert.throws(function () { rotate([1, 0], math.pi / 2, [0, 0, 1]) }, /RangeError: Vector must be of dimensions 1x3/)
    assert.throws(function () { rotate(matrix([1, 0]), math.pi / 2, [0, 0, 1]) }, /RangeError: Vector must be of dimensions 1x3/)
    assert.throws(function () { rotate(matrix([[[1]], [[0]]]), math.pi / 2, [0, 0, 1]) }, /RangeError: Vector must be of dimensions 1x3/)
    assert.throws(function () { rotate(matrix([[1, 0], [1, 0]]), math.pi / 2, [0, 0, 1]) }, /RangeError: Vector must be of dimensions 1x3/)
    assert.throws(function () { rotate([1, 0, 0, 0], math.pi / 2, [0, 0, 1]) }, /RangeError: Vector must be of dimensions 1x3/)
    assert.throws(function () { rotate(matrix([1, 0, 0, 0]), math.pi / 2, [0, 0, 1]) }, /RangeError: Vector must be of dimensions 1x3/)

    assert.throws(function () { rotate([1, 0, 0], 1, [0.0, 0.0, 0.0]) }, /Rotation around zero vector/)
  })

  it('should LaTeX rotationMatrix', function () {
    const expression1 = math.parse('rotate([1, 2, 3], 1)')
    assert.strictEqual(expression1.toTex(), '\\mathrm{rotate}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix},1\\right)')

    const expression2 = math.parse('rotate([1, 2, 3], 1, [4, 5, 6])')
    assert.strictEqual(expression2.toTex(), '\\mathrm{rotate}\\left(\\begin{bmatrix}1\\\\2\\\\3\\end{bmatrix},1,' +
      '\\begin{bmatrix}4\\\\5\\\\6\\end{bmatrix}\\right)')
  })
})
