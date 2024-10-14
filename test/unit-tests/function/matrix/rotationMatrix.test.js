import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxDeepEqual } from '../../../../tools/approx.js'

const bignumber = math.bignumber
const complex = math.complex
const unit = math.unit
const multiply = math.multiply
const matrix = math.matrix
const cos = math.cos
const sin = math.sin
const rotationMatrix = math.rotationMatrix

describe('rotationMatrix', function () {
  const sqrtTwoInv = 0.7071067811865476 // = 1 / sqrt(2)
  const minusSqrtTwoInv = -0.7071067811865476 // = - 1 / sqrt(2)

  it('should create an empty matrix', function () {
    assert.deepStrictEqual(rotationMatrix(), matrix())
    assert.deepStrictEqual(rotationMatrix('sparse'), matrix('sparse'))
    assert.deepStrictEqual(rotationMatrix('dense'), matrix('dense'))

    const mathArray = math.create({ matrix: 'Array' })
    assert.deepStrictEqual(mathArray.rotationMatrix(), [])
  })

  it('should create a 2D rotation matrix of given angle', function () {
    approxDeepEqual(rotationMatrix(0.0), matrix([[1, 0.0], [0.0, 1]]))
    approxDeepEqual(rotationMatrix(math.pi / 2), matrix([[0.0, -1], [1, 0.0]]))
    approxDeepEqual(rotationMatrix(1), matrix([[cos(1), -sin(1)], [sin(1), cos(1)]]))
    approxDeepEqual(rotationMatrix(math.pi / 4), matrix([[sqrtTwoInv, -sqrtTwoInv], [sqrtTwoInv, sqrtTwoInv]]))
  })

  it('should return a 2D rotation array if requesting results as array', function () {
    const mathArray = math.create({ matrix: 'Array' })
    approxDeepEqual(mathArray.rotationMatrix(0.0), [[1, 0.0], [0.0, 1]])
    approxDeepEqual(mathArray.rotationMatrix(mathArray.pi / 2), [[0.0, -1], [1, 0.0]])
    approxDeepEqual(mathArray.rotationMatrix(1), [[cos(1), -sin(1)], [sin(1), cos(1)]])
    approxDeepEqual(mathArray.rotationMatrix(mathArray.pi / 4), [[sqrtTwoInv, -sqrtTwoInv], [sqrtTwoInv, sqrtTwoInv]])
  })

  it('should create a 2D rotation matrix of given bignumber angle', function () {
    approxDeepEqual(rotationMatrix(bignumber(0.0)), matrix([[1, 0.0], [0.0, 1]]))

    const bigmath = math.create({ number: 'BigNumber' })
    const minusOne = bigmath.bignumber(-1)
    const cos1 = bigmath.cos(bigmath.bignumber(1))
    const sin1 = bigmath.sin(bigmath.bignumber(1))
    const minusSin1 = bigmath.multiply(sin1, minusOne)
    assert.deepStrictEqual(bigmath.rotationMatrix(bigmath.bignumber(1)),
      bigmath.matrix([[cos1, minusSin1], [sin1, cos1]]))

    const cos25 = bigmath.cos(bigmath.bignumber(2.5))
    const sin25 = bigmath.sin(bigmath.bignumber(2.5))
    const minusSin25 = bigmath.multiply(sin25, minusOne)
    assert.deepStrictEqual(bigmath.rotationMatrix(bigmath.bignumber(2.5)),
      bigmath.matrix([[cos25, minusSin25], [sin25, cos25]]))
  })

  it('should create a 2D rotation matrix of given complex angle', function () {
    const reI = 1.54308063481524
    const imI = 1.17520119364380
    approxDeepEqual(rotationMatrix(math.i), matrix([[complex(reI, 0.0), complex(0.0, -imI)],
      [complex(0.0, imI), complex(reI, 0.0)]]))

    const reCos = 4.18962569096881
    const imCos = 9.10922789375534
    const reSin = 9.15449914691142
    const imSin = 4.16890695996656
    const cosComplex = complex(-reCos, -imCos)
    const sinComplex = complex(reSin, -imSin)
    approxDeepEqual(rotationMatrix(complex('2+3i')), matrix([[cosComplex, multiply(-1.0, sinComplex)], [sinComplex, cosComplex]]))
  })

  it('should create a 2D rotation matrix of given unit angle', function () {
    approxDeepEqual(rotationMatrix(unit('45deg')), matrix([[sqrtTwoInv, minusSqrtTwoInv], [sqrtTwoInv, sqrtTwoInv]]))
    approxDeepEqual(rotationMatrix(unit('-135deg')), matrix([[minusSqrtTwoInv, sqrtTwoInv], [minusSqrtTwoInv, minusSqrtTwoInv]]))

    const cosComplex = complex(0.833730025131149, -0.988897705762865)
    const sinComplex = complex(1.298457581415977, 0.6349639147847361)
    approxDeepEqual(rotationMatrix(unit(complex(1, 1), 'rad')), matrix([[cosComplex, multiply(-1.0, sinComplex)], [sinComplex, cosComplex]]))
  })

  it('should create a 2D rotation matrix of given angle and given storage type', function () {
    assert.deepStrictEqual(rotationMatrix(0.0, 'sparse'), matrix([[1.0, 0.0], [0.0, 1.0]], 'sparse'))
    assert.deepStrictEqual(rotationMatrix(math.pi / 2, 'sparse'), matrix([[0, -1], [1, 0]], 'sparse'))
    approxDeepEqual(rotationMatrix(math.pi / 4, 'sparse'), matrix([[sqrtTwoInv, -sqrtTwoInv], [sqrtTwoInv, sqrtTwoInv]], 'sparse'))
  })

  it('should create a 3D rotation matrix by given angle around given axis provided as array', function () {
    assert.deepStrictEqual(math.rotationMatrix(0.0, [1, 1, 1]), [[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]])
    approxDeepEqual(math.rotationMatrix(math.pi / 2, [1, 0, 0]), [[1.0, 0.0, 0.0], [0.0, 0.0, -1.0], [0.0, 1.0, 0.0]])
    approxDeepEqual(math.rotationMatrix(math.pi / 2, [0, 1, 0]), [[0.0, 0.0, 1.0], [0.0, 1.0, 0.0], [-1.0, 0.0, 0.0]])
    approxDeepEqual(math.rotationMatrix(math.pi / 2, [0, 0, 1]), [[0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]])

    approxDeepEqual(math.rotationMatrix(-math.pi / 4, [1, 0, 0]),
      [[1.0, 0.0, 0.0], [0.0, sqrtTwoInv, sqrtTwoInv], [0.0, minusSqrtTwoInv, sqrtTwoInv]])
    approxDeepEqual(math.rotationMatrix(-math.pi / 4, [0, 1, 0]),
      [[sqrtTwoInv, 0.0, minusSqrtTwoInv], [0.0, 1.0, 0.0], [sqrtTwoInv, 0.0, sqrtTwoInv]])
    approxDeepEqual(math.rotationMatrix(-math.pi / 4, [0, 0, 1]),
      [[sqrtTwoInv, sqrtTwoInv, 0.0], [minusSqrtTwoInv, sqrtTwoInv, 0.0], [0.0, 0.0, 1.0]])

    assert.deepStrictEqual(math.rotationMatrix(1, [1, 0, 0]),
      [[1, 0, 0],
        [0, cos(1), -sin(1)],
        [0, sin(1), cos(1)]])
  })

  it('should create a 3D rotation matrix by given angle around given vector provided as matrix', function () {
    assert.deepStrictEqual(math.rotationMatrix(0.0, matrix([1, 1, 1])),
      matrix([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]]))
    approxDeepEqual(math.rotationMatrix(math.pi / 2, matrix([1, 0, 0])),
      matrix([[1.0, 0.0, 0.0], [0.0, 0.0, -1.0], [0.0, 1.0, 0.0]]))
    approxDeepEqual(math.rotationMatrix(math.pi / 2, matrix([0, 1, 0])),
      matrix([[0.0, 0.0, 1.0], [0.0, 1.0, 0.0], [-1.0, 0.0, 0.0]]))
    approxDeepEqual(math.rotationMatrix(math.pi / 2, matrix([0, 0, 1])),
      matrix([[0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]]))

    approxDeepEqual(math.rotationMatrix(-math.pi / 4, matrix([1, 0, 0])),
      matrix([[1.0, 0.0, 0.0], [0.0, sqrtTwoInv, sqrtTwoInv], [0.0, minusSqrtTwoInv, sqrtTwoInv]]))
    approxDeepEqual(math.rotationMatrix(-math.pi / 4, matrix([0, 1, 0])),
      matrix([[sqrtTwoInv, 0.0, minusSqrtTwoInv], [0.0, 1.0, 0.0], [sqrtTwoInv, 0.0, sqrtTwoInv]]))
    approxDeepEqual(math.rotationMatrix(-math.pi / 4, matrix([0, 0, 1])),
      matrix([[sqrtTwoInv, sqrtTwoInv, 0.0], [minusSqrtTwoInv, sqrtTwoInv, 0.0], [0.0, 0.0, 1.0]]))

    assert.deepStrictEqual(math.rotationMatrix(1, matrix([1, 0, 0])),
      matrix([[1, 0, 0],
        [0, cos(1), -sin(1)],
        [0, sin(1), cos(1)]]))
  })

  it('should create a unitary 3D rotation matrix around non-unit vector', function () {
    approxDeepEqual(math.rotationMatrix(math.pi / 2, matrix([1000, 0, 0])),
      matrix([[1.0, 0.0, 0.0], [0.0, 0.0, -1.0], [0.0, 1.0, 0.0]]))

    approxDeepEqual(math.rotationMatrix(math.pi / 2, matrix([1000, 0, 1000])),
      matrix([[0.5, minusSqrtTwoInv, 0.5], [sqrtTwoInv, 0.0, minusSqrtTwoInv], [0.5, sqrtTwoInv, 0.5]]))

    approxDeepEqual(math.rotationMatrix(math.pi / 2, [0, 0, 1000]),
      [[0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]])

    approxDeepEqual(math.rotationMatrix(math.pi / 2, [0, 200, 200]),
      [[0.0, minusSqrtTwoInv, sqrtTwoInv], [sqrtTwoInv, 0.5, 0.5], [minusSqrtTwoInv, 0.5, 0.5]])
  })

  it('should create a 3D rotation matrix by given bignumber angle around given axis', function () {
    const zero = bignumber(0)
    const one = bignumber(1)
    const cos2 = cos(bignumber(2))
    const sin2 = sin(bignumber(2))
    const minusSin2 = multiply(bignumber(-1), sin2)

    assert.deepStrictEqual(math.rotationMatrix(bignumber(2), matrix([1, 0, 0])),
      matrix([[one, zero, zero],
        [zero, cos2, minusSin2],
        [zero, sin2, cos2]]))
    assert.deepStrictEqual(math.rotationMatrix(bignumber(2), matrix([0, 1, 0])),
      matrix([[cos2, zero, sin2],
        [zero, one, zero],
        [minusSin2, zero, cos2]]))
    assert.deepStrictEqual(math.rotationMatrix(bignumber(2), matrix([0, 0, 1])),
      matrix([[cos2, minusSin2, zero],
        [sin2, cos2, zero],
        [zero, zero, one]]))

    assert.deepStrictEqual(math.rotationMatrix(bignumber(2), matrix([0, 0, 1])),
      matrix([[cos2, minusSin2, zero],
        [sin2, cos2, zero],
        [zero, zero, one]]))
  })

  it('should create a 3D rotation matrix by given complex angle around given axis', function () {
    const complexZero = math.complex(0)
    const cosTheta = math.cos(complex('2+3i'))
    const sinTheta = math.sin(complex('2+3i'))
    const minusSinTheta = math.multiplyScalar(-1, sinTheta)

    assert.deepStrictEqual(math.rotationMatrix(complex('2+3i'), matrix([1, 0, 0])),
      math.complex(matrix([[1, 0, 0],
        [complexZero, cosTheta, minusSinTheta],
        [complexZero, sinTheta, cosTheta]])))
    assert.deepStrictEqual(math.rotationMatrix(complex('2+3i'), matrix([0, 1, 0])),
      math.complex(matrix([[cosTheta, 0.0, sinTheta],
        [0.0, 1.0, 0.0],
        [minusSinTheta, 0.0, cosTheta]])))
    assert.deepStrictEqual(math.rotationMatrix(complex('2+3i'), [0, 0, 1]),
      math.complex([[cosTheta, minusSinTheta, 0.0],
        [sinTheta, cosTheta, 0.0],
        [0.0, 0.0, 1.0]]))

    assert.deepStrictEqual(math.rotationMatrix(complex('2+3i'), [0, 1, 0]),
      math.complex([[cosTheta, 0.0, sinTheta],
        [0.0, 1.0, 0.0],
        [minusSinTheta, 0.0, cosTheta]]))
  })

  it('should create a 3D rotation matrix by given unit angle around given axis', function () {
    approxDeepEqual(math.rotationMatrix(unit('45deg'), [1, 0, 0]),
      [[1.0, 0.0, 0.0], [0.0, sqrtTwoInv, minusSqrtTwoInv], [0.0, sqrtTwoInv, sqrtTwoInv]])
    approxDeepEqual(math.rotationMatrix(unit('45deg'), [0, 1, 0]),
      [[sqrtTwoInv, 0.0, sqrtTwoInv], [0.0, 1.0, 0.0], [minusSqrtTwoInv, 0.0, sqrtTwoInv]])
    approxDeepEqual(math.rotationMatrix(unit('45deg'), [0, 0, 1]),
      [[sqrtTwoInv, minusSqrtTwoInv, 0.0], [sqrtTwoInv, sqrtTwoInv, 0.0], [0.0, 0.0, 1.0]])

    approxDeepEqual(math.rotationMatrix(unit('-135deg'), [1, 0, 0]),
      [[1.0, 0.0, 0.0], [0.0, minusSqrtTwoInv, sqrtTwoInv], [0.0, minusSqrtTwoInv, minusSqrtTwoInv]])
    approxDeepEqual(math.rotationMatrix(unit('-135deg'), [0, 1, 0]),
      [[minusSqrtTwoInv, 0.0, minusSqrtTwoInv], [0.0, 1.0, 0.0], [sqrtTwoInv, 0.0, minusSqrtTwoInv]])
    approxDeepEqual(math.rotationMatrix(unit('-135deg'), [0, 0, 1]),
      [[minusSqrtTwoInv, sqrtTwoInv, 0.0], [minusSqrtTwoInv, minusSqrtTwoInv, 0.0], [0.0, 0.0, 1.0]])

    approxDeepEqual(rotationMatrix(unit(complex(1, 1), 'rad'), matrix([1, 0, 1])),
      math.evaluate('matrix([[0.5 * (1 + cos(1+i)), -sin(1+i) / sqrt(2), 0.5 * (1 - cos(1+i))],' +
        '[sin(1+i) / sqrt(2), cos(1+i), -sin(1+i) / sqrt(2)],' +
        '[0.5 * (1 - cos(1+i)), sin(1+i) / sqrt(2), 0.5 * (1 + cos(1+i))]])'))

    approxDeepEqual(math.rotationMatrix(unit('45deg'), matrix([0, 0, 1])),
      matrix([[sqrtTwoInv, minusSqrtTwoInv, 0.0], [sqrtTwoInv, sqrtTwoInv, 0.0], [0.0, 0.0, 1.0]]))

    approxDeepEqual(math.rotationMatrix(unit('-135deg'), matrix([1, 0, 0])),
      matrix([[1.0, 0.0, 0.0], [0.0, minusSqrtTwoInv, sqrtTwoInv], [0.0, minusSqrtTwoInv, minusSqrtTwoInv]]))
  })

  it('should create a 3D rotation matrix of given angle around given axis and given storage type', function () {
    assert.deepStrictEqual(rotationMatrix(0.0, [0, 0, 1], 'sparse'),
      matrix([[1.0, 0.0, 0.0], [0.0, 1.0, 0.0], [0.0, 0.0, 1.0]], 'sparse'))
    assert.deepStrictEqual(rotationMatrix(math.pi / 2, [0, 0, 1], 'sparse'),
      matrix([[0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]], 'sparse'))
    approxDeepEqual(rotationMatrix(math.pi / 4, [0, 1, 0], 'sparse'),
      matrix([[sqrtTwoInv, 0.0, sqrtTwoInv], [0, 1, 0], [minusSqrtTwoInv, 0.0, sqrtTwoInv]], 'sparse'))
    approxDeepEqual(rotationMatrix(math.pi / 4, matrix([0, 1, 0]), 'sparse'),
      matrix([[sqrtTwoInv, 0.0, sqrtTwoInv], [0, 1, 0], [minusSqrtTwoInv, 0.0, sqrtTwoInv]], 'sparse'))
  })

  it('should return an array when mathjs is configured for this', function () {
    const mathArray = math.create({ matrix: 'Array' })
    approxDeepEqual(mathArray.rotationMatrix(mathArray.pi / 4),
      [[sqrtTwoInv, minusSqrtTwoInv], [sqrtTwoInv, sqrtTwoInv]])
    approxDeepEqual(mathArray.rotationMatrix(mathArray.pi / 2, [0, 0, 1]),
      [[0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]])
    approxDeepEqual(mathArray.rotationMatrix(mathArray.pi / 2, matrix([0, 0, 1])),
      matrix([[0.0, -1.0, 0.0], [1.0, 0.0, 0.0], [0.0, 0.0, 1.0]]))
  })

  it('should throw an error with an invalid input', function () {
    assert.throws(function () { rotationMatrix('') }, /TypeError: Unknown matrix type /)
    assert.throws(function () { rotationMatrix(null) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { rotationMatrix(0, []) }, /RangeError: Vector must be of dimensions 1x3/)
    assert.throws(function () { rotationMatrix(0, [1]) }, /RangeError: Vector must be of dimensions 1x3/)
    assert.throws(function () { rotationMatrix(0, [0, 1]) }, /RangeError: Vector must be of dimensions 1x3/)
    assert.throws(function () { rotationMatrix(0, [0, 1, 0], 'something') }, /TypeError: Unknown matrix type/)
    assert.throws(function () { rotationMatrix(0, [0, 1, 0], 'sparse', 4) }, /TypeError: Too many arguments/)
    assert.throws(function () { rotationMatrix(1, [0.0, 0.0, 0.0]) }, /Rotation around zero vector/)
  })

  it('should LaTeX rotationMatrix', function () {
    const expression = math.parse('rotationMatrix(1)')
    assert.strictEqual(expression.toTex(), '\\mathrm{rotationMatrix}\\left(1\\right)')
  })
})
