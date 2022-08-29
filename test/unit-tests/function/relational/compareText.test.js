// test compareText
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const bignumber = math.bignumber
const matrix = math.matrix
const sparse = math.sparse
const compareText = math.compareText

describe('compareText', function () {
  it('should perform lexical comparison for two strings', function () {
    assert.strictEqual(compareText('abd', 'abc'), 1)
    assert.strictEqual(compareText('abc', 'abc'), 0)
    assert.strictEqual(compareText('abc', 'abd'), -1)

    // lexical sorting of strings
    assert.strictEqual(compareText('2', '10'), 1)
    assert.strictEqual(compareText('10', '2'), -1)
    assert.strictEqual(compareText('10', '10'), 0)
  })

  describe('Array', function () {
    it('should compare array - scalar', function () {
      assert.deepStrictEqual(compareText('B', ['A', 'B', 'C']), [1, 0, -1])
      assert.deepStrictEqual(compareText(['A', 'B', 'C'], 'B'), [-1, 0, 1])
    })

    it('should compare array - array', function () {
      assert.deepStrictEqual(compareText([['D', 'E', 'C'], ['B', 'C', 'E']], [['F', 'B', 'C'], ['A', 'D', 'C']]), [[-1, 1, 0], [1, -1, 1]])
    })

    it('should compare array - dense matrix', function () {
      assert.deepStrictEqual(compareText([['D', 'E', 'C'], ['B', 'C', 'E']], matrix([['F', 'B', 'C'], ['A', 'D', 'C']])), matrix([[-1, 1, 0], [1, -1, 1]]))
    })
  })

  describe('DenseMatrix', function () {
    it('should compare dense matrix - scalar', function () {
      assert.deepStrictEqual(compareText('B', matrix(['A', 'B', 'C'])), matrix([1, 0, -1]))
      assert.deepStrictEqual(compareText(matrix(['A', 'B', 'C']), 'B'), matrix([-1, 0, 1]))
    })

    it('should compare dense matrix - array', function () {
      assert.deepStrictEqual(compareText(matrix([['D', 'E', 'C'], ['B', 'C', 'E']]), [['F', 'B', 'C'], ['A', 'D', 'C']]), matrix([[-1, 1, 0], [1, -1, 1]]))
    })

    it('should compare dense matrix - dense matrix', function () {
      assert.deepStrictEqual(compareText(matrix([['D', 'E', 'C'], ['B', 'C', 'E']]), matrix([['F', 'B', 'C'], ['A', 'D', 'C']])), matrix([[-1, 1, 0], [1, -1, 1]]))
    })
  })

  it('should throw an error in case of invalid type of arguments', function () {
    assert.throws(function () { compareText(1, 2) }, /TypeError: Unexpected type of argument in function compareText/)
    assert.throws(function () { compareText('A', sparse([['A', 'B'], ['C', 'D']])) }, /Cannot convert "A" to a number/)
    assert.throws(function () { compareText(bignumber(1), '2') }, /TypeError: Unexpected type of argument in function compareText/)
    assert.throws(function () { compareText('2', bignumber(1)) }, /TypeError: Unexpected type of argument in function compareText/)
  })

  it('should throw an error in case of invalid number of arguments', function () {
    assert.throws(function () { compareText(1) }, /TypeError: Too few arguments/)
    assert.throws(function () { compareText(1, 2, 3) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX compare', function () {
    const expression = math.parse('compareText(1,2)')
    assert.strictEqual(expression.toTex(), '\\mathrm{compareText}\\left(1,2\\right)')
  })
})
