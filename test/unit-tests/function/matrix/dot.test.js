import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const dot = math.dot
const matrix = math.matrix
const sparse = math.sparse
const complex = math.complex
const unit = math.unit
const bignumber = math.bignumber
const fraction = math.fraction

describe('dot', function () {
  it('should calculate dot product for two 1-dim arrays', function () {
    assert.strictEqual(dot([2, 4, 1], [2, 2, 3]), 15)
    assert.strictEqual(dot([7, 3], [2, 4]), 26)
  })

  it('should calculate dot product for two column arrays', function () {
    assert.strictEqual(dot([[2], [4], [1]], [[2], [2], [3]]), 15)
    assert.strictEqual(dot([[7], [3]], [[2], [4]]), 26)
  })

  it('should calculate dot product for two 1-dim vectors', function () {
    assert.strictEqual(dot(matrix([2, 4, 1]), matrix([2, 2, 3])), 15)
    assert.strictEqual(dot(matrix([7, 3]), matrix([2, 4])), 26)
  })

  it('should calculate dot product for two column vectors', function () {
    assert.strictEqual(dot(matrix([[2], [4], [1]]), matrix([[2], [2], [3]])), 15)
    assert.strictEqual(dot(matrix([[7], [3]]), matrix([[2], [4]])), 26)
  })

  it('should calculate dot product for mixed 1-dim arrays and column arrays', function () {
    assert.strictEqual(dot([2, 4, 1], [[2], [2], [3]]), 15)
    assert.strictEqual(dot([[7], [3]], [2, 4]), 26)
  })

  it('should calculate dot product for mixed 1-dim arrays and 1-dim vectors', function () {
    assert.strictEqual(dot([2, 4, 1], matrix([2, 2, 3])), 15)
    assert.strictEqual(dot(matrix([7, 3]), [2, 4]), 26)
  })

  it('should calculate dot product for mixed 1-dim arrays and column vectors', function () {
    assert.strictEqual(dot([2, 4, 1], matrix([[2], [2], [3]])), 15)
    assert.strictEqual(dot(matrix([[7], [3]]), [2, 4]), 26)
  })

  it('should calculate dot product for mixed column arrays and 1-dim vectors', function () {
    assert.strictEqual(dot([[2], [4], [1]], matrix([2, 2, 3])), 15)
    assert.strictEqual(dot(matrix([7, 3]), [[2], [4]]), 26)
  })

  it('should calculate dot product for mixed column arrays and column vectors', function () {
    assert.strictEqual(dot([[2], [4], [1]], matrix([[2], [2], [3]])), 15)
    assert.strictEqual(dot(matrix([[7], [3]]), [[2], [4]]), 26)
  })

  it('should calculate dot product for mixed 1-dim vectors and column vectors', function () {
    assert.strictEqual(dot(matrix([2, 4, 1]), matrix([[2], [2], [3]])), 15)
    assert.strictEqual(dot(matrix([[7], [3]]), matrix([2, 4])), 26)
  })

  it('should calculate dot product for two 1-dim unit arrays', function () {
    assert.strictEqual(dot([unit('2m'), unit('4m'), unit('1m')], [2, 2, 3]).toString(), '15 m')
    assert.strictEqual(dot([7, 3], [unit('2m'), unit('4m')]).toString(), '26 m')
    assert.strictEqual(dot([unit('2m'), unit('4m'), unit('1m')], [unit('2m'), unit('2m'), unit('3m')]).toString(), '15 m^2')
  })

  it('should calculate dot product for two column unit arrays', function () {
    assert.strictEqual(dot([[unit('2g')], [unit('4g')], [unit('1g')]], [[2], [2], [3]]).toString(), '15 g')
    assert.strictEqual(dot([[unit('7g')], [unit('3g')]], [[2], [4]]).toString(), '26 g')
  })

  it('should calculate dot product for two 1-dim unit vectors', function () {
    assert.strictEqual(dot(matrix([2, 4, 1]), matrix([unit('2g'), unit('2g'), unit('3g')])).toString(), '15 g')
    assert.strictEqual(dot(matrix([unit('7m'), unit('3m')]), matrix([unit('2m'), unit('4m')])).toString(), '26 m^2')
  })

  it('should calculate dot product for two column unit vectors', function () {
    assert.strictEqual(dot(matrix([[unit('2m')], [unit('4m')], [unit('1m')]]), matrix([[unit('2m')], [unit('2m')], [unit('3m')]])).toString(), '15 m^2')
    assert.strictEqual(dot(matrix([[7], [3]]), matrix([[unit('2g')], [unit('4g')]])).toString(), '26 g')
  })

  it('should calculate dot product for two 1-dim unit with complex value vectors', function () {
    assert.deepEqual(dot(matrix([unit(complex(2, 3), 'm'), unit(complex(4, 5), 'm')]), matrix([unit(complex(1, 1), 'm'), unit(complex(2, 4), 'm')])).toNumeric(), complex(33, 5))
    assert.strictEqual(dot(matrix([unit(complex(2, 3), 'm'), unit(complex(4, 5), 'm')]), matrix([unit(complex(1, 1), 'm'), unit(complex(2, 4), 'm')])).toString(), '(33 + 5i) m^2')
  })

  it('should calculate dot product for two 1-dim unit with BigNumber value vectors', function () {
    assert.strictEqual(dot(matrix([[unit(bignumber(7), 'g')], [unit(bignumber(3), 'g')]]), matrix([[unit(bignumber(2), 'g')], [unit(bignumber(4), 'g')]])).toString(), '26 g^2')
  })

  it('should calculate dot product for two 1-dim unit with Fraction value vectors', function () {
    assert.strictEqual(dot(matrix([[unit(fraction(0.4), 'm')], [unit(fraction('0.5'), 'm')]]), matrix([[unit(fraction(1, 4), 'm')], [unit(fraction('3/4'), 'm')]])).toString(), '19/40 m^2')
  })

  it('should calculate dot product for sparse vectors', function () {
    assert.strictEqual(dot(sparse([0, 0, 2, 4, 4, 1]), sparse([1, 0, 2, 2, 0, 3])), 15)
    assert.strictEqual(dot(sparse([7, 1, 2, 3]), sparse([2, 0, 0, 4])), 26)
  })

  for (const { name, x, y, expected } of [
    { name: 'complex self-products', x: [[complex(1, 1)], [0], [2]], y: [[complex(1, 1)], [0], [2]], expected: complex(6, 0) },
    { name: 'imaginary self-products', x: [[complex(0, 1)], [0], [complex(0, 2)]], y: [[complex(0, 1)], [0], [complex(0, 2)]], expected: complex(5, 0) },
    { name: 'complex products with nonmatching zero positions', x: [[complex(1, 2)], [0], [complex(3, -1)], [0]], y: [[complex(2, -1)], [4], [complex(0, 2)], [0]], expected: complex(-2, 1) }
  ]) {
    it('should conjugate the first sparse vector for ' + name, function () {
      const a = sparse(x)
      const b = sparse(y)
      const beforeA = a.clone()
      const beforeB = b.clone()

      assert.deepStrictEqual(dot(a, b), expected)
      assert.deepStrictEqual(dot(x, y), expected)
      assert.deepStrictEqual(dot(matrix(x), matrix(y)), expected)
      assert.deepStrictEqual(a, beforeA)
      assert.deepStrictEqual(b, beforeB)
    })
  }

  it('should return zero for sparse vectors without overlapping nonzero entries', function () {
    const a = sparse([[complex(1, 2)], [0], [complex(3, -1)]])
    const b = sparse([[0], [complex(2, 1)], [0]])
    const zero = sparse([[0], [0], [0]])

    assert.strictEqual(dot(a, b), 0)
    assert.strictEqual(dot(a, zero), 0)
    assert.strictEqual(dot(zero, a), 0)
  })

  it('should throw an error for unsupported types of arguments', function () {
    assert.throws(function () { dot([2, 4, 1], 2) }, TypeError)
  })

  it('should throw an error for multi dimensional matrix input', function () {
    assert.throws(function () { dot([[1, 2], [3, 4]], [[1, 2], [3, 4]]) }, /Expected a column vector, instead got a matrix of size \(2, 2\)/)
  })

  it('should throw an error in case of vectors with unequal length', function () {
    assert.throws(function () { dot([2, 3], [1, 2, 3]) }, /Vectors must have equal length \(2 != 3\)/)
  })

  it('should throw an error in case of empty vectors', function () {
    assert.throws(function () { dot([], []) }, /Cannot calculate the dot product of empty vectors/)
  })

  it('should LaTeX dot', function () {
    const expression = math.parse('dot([1,2],[3,4])')
    assert.strictEqual(expression.toTex(), '\\left(\\begin{bmatrix}1\\\\2\\end{bmatrix}\\cdot\\begin{bmatrix}3\\\\4\\end{bmatrix}\\right)')
  })

  it('should be antilinear in the first argument', function () {
    const I = complex(0, 1)
    assert.deepStrictEqual(dot([I, 2], [1, I]), I)

    const v = matrix([2, I, 1])
    assert.deepStrictEqual(dot(v, v).sqrt(), complex(math.norm(v)))
  })
})
