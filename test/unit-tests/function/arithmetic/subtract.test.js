// test subtract
import assert from 'assert'

import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const subtract = math.subtract

describe('subtract', function () {
  it('should subtract two numbers correctly', function () {
    assert.deepStrictEqual(subtract(4, 2), 2)
    assert.deepStrictEqual(subtract(4, -4), 8)
    assert.deepStrictEqual(subtract(-4, -4), 0)
    assert.deepStrictEqual(subtract(-4, 4), -8)
    assert.deepStrictEqual(subtract(2, 4), -2)
    assert.deepStrictEqual(subtract(3, 0), 3)
    assert.deepStrictEqual(subtract(0, 3), -3)
    assert.deepStrictEqual(subtract(0, 3), -3)
    assert.deepStrictEqual(subtract(0, 3), -3)
  })

  it('should subtract booleans', function () {
    assert.strictEqual(subtract(true, true), 0)
    assert.strictEqual(subtract(true, false), 1)
    assert.strictEqual(subtract(false, true), -1)
    assert.strictEqual(subtract(false, false), 0)
  })

  it('should subtract mixed numbers and booleans', function () {
    assert.strictEqual(subtract(2, true), 1)
    assert.strictEqual(subtract(2, false), 2)
    assert.strictEqual(subtract(true, 2), -1)
    assert.strictEqual(subtract(false, 2), -2)
  })

  it('should subtract bignumbers', function () {
    assert.deepStrictEqual(subtract(bignumber(0.3), bignumber(0.2)), bignumber(0.1))
    assert.deepStrictEqual(subtract(bignumber('2.3e5001'), bignumber('3e5000')), bignumber('2e5001'))
    assert.deepStrictEqual(subtract(bignumber('1e19'), bignumber('1')), bignumber('9999999999999999999'))
  })

  it('should subtract mixed numbers and bignumbers', function () {
    assert.deepStrictEqual(subtract(bignumber(0.3), 0.2), bignumber(0.1))
    assert.deepStrictEqual(subtract(0.3, bignumber(0.2)), bignumber(0.1))

    assert.throws(function () { subtract(1 / 3, bignumber(1).div(3)) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
    assert.throws(function () { subtract(bignumber(1).div(3), 1 / 3) }, /Cannot implicitly convert a number with >15 significant digits to BigNumber/)
  })

  it('should subtract mixed booleans and bignumbers', function () {
    assert.deepStrictEqual(subtract(bignumber(1.1), true), bignumber(0.1))
    assert.deepStrictEqual(subtract(bignumber(1.1), false), bignumber(1.1))
    assert.deepStrictEqual(subtract(false, bignumber(0.2)), bignumber(-0.2))
    assert.deepStrictEqual(subtract(true, bignumber(0.2)), bignumber(0.8))
  })

  it('should subtract two complex numbers correctly', function () {
    assert.deepStrictEqual(subtract(math.complex(3, 2), math.complex(8, 4)), math.complex('-5 - 2i'))
    assert.deepStrictEqual(subtract(math.complex(6, 3), math.complex(-2, -2)), math.complex('8 + 5i'))
    assert.deepStrictEqual(subtract(math.complex(3, 4), 10), math.complex('-7 + 4i'))
    assert.deepStrictEqual(subtract(math.complex(3, 4), -2), math.complex('5 + 4i'))
    assert.deepStrictEqual(subtract(math.complex(-3, -4), 10), math.complex('-13 - 4i'))
    assert.deepStrictEqual(subtract(10, math.complex(3, 4)), math.complex('7 - 4i'))
    assert.deepStrictEqual(subtract(10, math.i), math.complex('10 - i'))
    assert.deepStrictEqual(subtract(0, math.i), math.complex('-i'))
    assert.deepStrictEqual(subtract(10, math.complex(0, 1)), math.complex('10 - i'))
  })

  it('should throw an error for mixed complex numbers and big numbers', function () {
    assert.deepStrictEqual(subtract(math.complex(3, 4), math.bignumber(10)), math.complex(-7, 4))
    assert.deepStrictEqual(subtract(math.bignumber(10), math.complex(3, 4)), math.complex(7, -4))
  })

  it('should subtract two fractions', function () {
    const a = math.fraction(1, 3)
    assert.strictEqual(subtract(a, math.fraction(1, 6)).toString(), '0.1(6)')
    assert.strictEqual(a.toString(), '0.(3)')

    assert.strictEqual(subtract(math.fraction(3, 5), math.fraction(1, 5)).toString(), '0.4')
    assert.strictEqual(subtract(math.fraction(1), math.fraction(1, 3)).toString(), '0.(6)')
  })

  it('should subtract mixed fractions and numbers', function () {
    assert.deepStrictEqual(subtract(1, math.fraction(1, 3)), math.fraction(2, 3))
    assert.deepStrictEqual(subtract(math.fraction(1, 3), 1), math.fraction(-2, 3))
  })

  it('should subtract two quantities of the same unit', function () {
    approx.deepEqual(subtract(math.unit(5, 'km'), math.unit(100, 'mile')), math.unit(-155.93, 'km'))

    assert.deepStrictEqual(subtract(math.unit(math.bignumber(5), 'km'), math.unit(math.bignumber(2), 'km')), math.unit(math.bignumber(3), 'km'))

    assert.deepStrictEqual(subtract(math.unit(math.complex(10, 10), 'K'), math.unit(math.complex(3, 4), 'K')), math.unit(math.complex(7, 6), 'K'))
    assert.deepStrictEqual(subtract(math.unit(math.complex(10, 10), 'K'), math.unit(3, 'K')), math.unit(math.complex(7, 10), 'K'))
  })

  it('should subtract units even when they have offsets', function () {
    let t = math.unit(20, 'degC')
    assert.deepStrictEqual(subtract(t, math.unit(1, 'degC')), math.unit(19, 'degC'))
    t = math.unit(68, 'degF')
    approx.deepEqual(subtract(t, math.unit(2, 'degF')), math.unit(66, 'degF'))
    approx.deepEqual(subtract(t, math.unit(1, 'degC')), math.unit(66.2, 'degF'))
  })

  it('should throw an error if subtracting two quantities of different units', function () {
    assert.throws(function () {
      subtract(math.unit(5, 'km'), math.unit(100, 'gram'))
    })
  })

  it('should throw an error when one of the two units has undefined value', function () {
    assert.throws(function () {
      subtract(math.unit('km'), math.unit('5gram'))
    }, /Parameter x contains a unit with undefined value/)
    assert.throws(function () {
      subtract(math.unit('5 km'), math.unit('gram'))
    }, /Parameter y contains a unit with undefined value/)
  })

  it('should throw an error if subtracting numbers from units', function () {
    assert.throws(function () { subtract(math.unit(5, 'km'), 2) }, TypeError)
    assert.throws(function () { subtract(2, math.unit(5, 'km')) }, TypeError)
  })

  it('should throw an error if subtracting numbers from units', function () {
    assert.throws(function () { subtract(math.unit(5, 'km'), bignumber(2)) }, TypeError)
    assert.throws(function () { subtract(bignumber(2), math.unit(5, 'km')) }, TypeError)
  })

  it('should throw an error when used with a string', function () {
    assert.throws(function () { subtract('hello ', 'world') })
    assert.throws(function () { subtract('str', 123) })
    assert.throws(function () { subtract(123, 'str') })
  })

  describe('Array', function () {
    it('should subtract arrays correctly', function () {
      const a2 = [[10, 20], [30, 40]]
      const a3 = [[5, 6], [7, 8]]
      const a4 = subtract(a2, a3)
      assert.deepStrictEqual(a4, [[5, 14], [23, 32]])
    })

    it('should subtract a scalar and an array correctly', function () {
      assert.deepStrictEqual(subtract(2, [3, 4]), [-1, -2])
      assert.deepStrictEqual(subtract(2, [3, 0]), [-1, 2])
      assert.deepStrictEqual(subtract([3, 4], 2), [1, 2])
      assert.deepStrictEqual(subtract([3, 0], 2), [1, -2])
    })

    it('should subtract array and dense matrix correctly', function () {
      const a = [1, 2, 3]
      const b = math.matrix([3, 2, 1])
      const c = subtract(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([-2, 0, 2]))
    })

    it('should subtract array and dense matrix correctly', function () {
      const a = [[1, 2, 3], [4, 5, 6]]
      const b = math.sparse([[6, 5, 4], [3, 2, 1]])
      const c = subtract(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([[-5, -3, -1], [1, 3, 5]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should subtract matrices correctly', function () {
      const a2 = math.matrix([[10, 20], [30, 40]])
      const a3 = math.matrix([[5, 6], [7, 8]])
      const a4 = subtract(a2, a3)
      assert.ok(a4 instanceof math.Matrix)
      assert.deepStrictEqual(a4.size(), [2, 2])
      assert.deepStrictEqual(a4.valueOf(), [[5, 14], [23, 32]])
    })

    it('should subtract a scalar and a matrix correctly', function () {
      assert.deepStrictEqual(subtract(2, math.matrix([3, 4])), math.matrix([-1, -2]))
      assert.deepStrictEqual(subtract(math.matrix([3, 4]), 2), math.matrix([1, 2]))
    })

    it('should subtract matrix and array correctly', function () {
      const a = math.matrix([1, 2, 3])
      const b = [3, 2, 1]
      const c = subtract(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([-2, 0, 2]))
    })

    it('should subtract dense and sparse matrices correctly', function () {
      const a = math.matrix([[1, 2, 3], [1, 0, 0]])
      const b = math.sparse([[3, 2, 1], [0, 0, 1]])
      const c = subtract(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([[-2, 0, 2], [1, 0, -1]]))
    })
  })

  describe('SparseMatrix', function () {
    it('should subtract matrices correctly', function () {
      const a2 = math.matrix([[10, 20], [30, 0]], 'sparse')
      const a3 = math.matrix([[5, 6], [30, 8]], 'sparse')
      const a4 = subtract(a2, a3)
      assert.ok(a4 instanceof math.Matrix)
      assert.deepStrictEqual(a4, math.sparse([[5, 14], [0, -8]]))
    })

    it('should subtract a scalar and a matrix correctly', function () {
      assert.deepStrictEqual(subtract(2, math.matrix([[3, 4], [5, 6]], 'sparse')).valueOf(), [[-1, -2], [-3, -4]])
      assert.deepStrictEqual(subtract(2, math.matrix([[3, 4], [0, 6]], 'sparse')).valueOf(), [[-1, -2], [2, -4]])
      assert.deepStrictEqual(subtract(math.matrix([[3, 4], [5, 6]], 'sparse'), 2).valueOf(), [[1, 2], [3, 4]])
      assert.deepStrictEqual(subtract(math.matrix([[3, 4], [0, 6]], 'sparse'), 2).valueOf(), [[1, 2], [-2, 4]])
    })

    it('should subtract matrix and array correctly', function () {
      const a = math.matrix([[1, 2, 3], [1, 0, 0]], 'sparse')
      const b = [[3, 2, 1], [0, 0, 1]]
      const c = subtract(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c.valueOf(), [[-2, 0, 2], [1, 0, -1]])
    })

    it('should subtract sparse and dense matrices correctly', function () {
      const a = math.sparse([[1, 2, 3], [1, 0, 0]])
      const b = math.matrix([[3, 2, 1], [0, 0, 1]])
      const c = subtract(a, b)

      assert.ok(c instanceof math.Matrix)
      assert.deepStrictEqual(c, math.matrix([[-2, 0, 2], [1, 0, -1]]))
    })
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { subtract(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { subtract(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should throw an in case of wrong type of arguments', function () {
    assert.throws(function () { subtract(null, 2) }, /TypeError: Unexpected type of argument/)
  })

  it('should LaTeX subtract', function () {
    const expression = math.parse('subtract(2,1)')
    assert.strictEqual(expression.toTex(), '\\left(2-1\\right)')
  })
})
