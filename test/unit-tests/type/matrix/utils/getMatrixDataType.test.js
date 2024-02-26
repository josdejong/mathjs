import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
const DenseMatrix = math.DenseMatrix
const SparseMatrix = math.SparseMatrix
const getMatrixDataType = math.getMatrixDataType

describe('getMatrixDataType', function () {
  describe('array', function () {
    it('should return number for pure numbers', function () {
      const result = getMatrixDataType([[1, 2, 3], [4, 5, 6], [1, 8, 9]])
      assert.strictEqual('number', result)
    })

    it('should return number for pure numbers with NaN', function () {
      const result = getMatrixDataType([[1, 2, NaN], [4, 5, 6], [1, 8, 9]])
      assert.strictEqual('number', result)
    })

    it('should return string', function () {
      const result = getMatrixDataType([['string'], ['test']])
      assert.strictEqual('string', result)
    })

    it('should return boolean', function () {
      const result = getMatrixDataType([[true], [false]])
      assert.strictEqual('boolean', result)
    })

    it('should return undefined', function () {
      const result = getMatrixDataType([[undefined], [undefined]])
      assert.strictEqual('undefined', result)
    })

    it('should return null', function () {
      const result = getMatrixDataType([[null], [null]])
      assert.strictEqual('null', result)
    })

    it('should return mixed when number and null are given', function () {
      const result = getMatrixDataType([[1], [null]])
      assert.strictEqual('mixed', result)
    })

    it('should return mixed when number and string are given', function () {
      const result = getMatrixDataType([[1], ['string']])
      assert.strictEqual('mixed', result)
    })

    it('should return undefined if the input is not a matrix', function () {
      // Not equal in size and one is an empty array
      const result1 = getMatrixDataType([[1], []])
      // Not equal in size
      const result2 = getMatrixDataType([[1, 2, 3], [1, 2]])
      // Empty array as an input
      const result3 = getMatrixDataType([])

      assert.strictEqual(undefined, result1)
      assert.strictEqual(undefined, result2)
      assert.strictEqual(undefined, result3)
    })
  })

  describe('extra type BigNumber', function () {
    it('should return BigNumber', function () {
      const zero = math.bignumber(0)
      const bignumberMatrix = getMatrixDataType([[zero], [zero]])
      assert.strictEqual(bignumberMatrix, 'BigNumber')
    })

    it('should return mixed', function () {
      const zero = math.bignumber(0)
      const bignumberMatrix = getMatrixDataType([[zero], [2]])
      assert.strictEqual(bignumberMatrix, 'mixed')
    })

    it('should return undefined', function () {
      const zero = math.bignumber(0)
      const bignumberMatrix = getMatrixDataType([[zero], []])
      assert.strictEqual(bignumberMatrix, undefined)
    })
  })

  describe('extra type Unit', function () {
    it('should return Unit', function () {
      const x = math.unit('5cm')
      const unitMatrix = getMatrixDataType([[x], [x]])
      assert.strictEqual(unitMatrix, 'Unit')
    })

    it('should return mixed', function () {
      const x = math.unit('5cm')
      const unitMatrix = getMatrixDataType([[x], [2]])
      assert.strictEqual(unitMatrix, 'mixed')
    })

    it('should return undefined', function () {
      const x = math.unit('5cm')
      const unitMatrix = getMatrixDataType([[x], []])
      assert.strictEqual(unitMatrix, undefined)
    })
  })

  describe('extra type Fraction', function () {
    it('should return Fraction', function () {
      const x = math.fraction(1, 3)
      const fractionMatrix = getMatrixDataType([[x], [x]])
      assert.strictEqual(fractionMatrix, 'Fraction')
    })

    it('should return mixed', function () {
      const x = math.fraction(1, 3)
      const fractionMatrix = getMatrixDataType([[x], [2]])
      assert.strictEqual(fractionMatrix, 'mixed')
    })

    it('should return undefined', function () {
      const x = math.fraction(1, 3)
      const fractionMatrix = getMatrixDataType([[x], []])
      assert.strictEqual(fractionMatrix, undefined)
    })
  })

  describe('SparseMatrix', function () {
    it('should return number for pure numbers', function () {
      const matrix = new SparseMatrix([[1, 2, 3], [4, 5, 6], [1, 8, 9]])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('number', result1)
      assert.strictEqual('number', result2)
    })

    it('should return number for pure numbers with NaN', function () {
      const matrix = new SparseMatrix([[1, 2, NaN], [4, 5, 6], [1, 8, 9]])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('number', result1)
      assert.strictEqual('number', result2)
    })
  })

  describe('DenseMatrix', function () {
    it('should return number for pure numbers', function () {
      const matrix = new DenseMatrix([[1, 2, 3], [4, 5, 6], [1, 8, 9]])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('number', result1)
      assert.strictEqual('number', result2)
    })

    it('should return number for pure numbers with NaN', function () {
      const matrix = new DenseMatrix([[1, 2, NaN], [4, 5, 6], [1, 8, 9]])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('number', result1)
      assert.strictEqual('number', result2)
    })

    it('should return string', function () {
      const matrix = new DenseMatrix([['string'], ['test']])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('string', result1)
      assert.strictEqual('string', result2)
    })

    it('should return boolean', function () {
      const matrix = new DenseMatrix([[true], [false]])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('boolean', result1)
      assert.strictEqual('boolean', result2)
    })

    it('should return undefined', function () {
      const matrix = new DenseMatrix([[undefined], [undefined]])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('undefined', result1)
      assert.strictEqual('undefined', result2)
    })

    it('should return null', function () {
      const matrix = new DenseMatrix([[null], [null]])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('null', result1)
      assert.strictEqual('null', result2)
    })

    it('should return mixed when number and null are given', function () {
      const matrix = new DenseMatrix([[1], [null]])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('mixed', result1)
      assert.strictEqual('mixed', result2)
    })

    it('should return mixed when number and string are given', function () {
      const matrix = new DenseMatrix([[1], ['string']])
      const result1 = getMatrixDataType(matrix)
      const result2 = matrix.getDataType()
      assert.strictEqual('mixed', result1)
      assert.strictEqual('mixed', result2)
    })
  })
})
