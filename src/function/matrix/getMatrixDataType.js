import { factory } from '../../utils/factory'
import { getArrayDataType } from '../../utils/array'
import { typeOf } from '../../utils/is'

const name = 'getMatrixDataType'
const dependencies = ['typed']

export const createGetMatrixDataType = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Find the data type of all elements in a matrix or array,
   * for example 'number' if all items are a number and 'Complex' if all values
   * are complex numbers.
   * If a matrix contains more than one data type, it will return 'mixed'.
   *
   * Syntax:
   *
   *    math.getMatrixDataType(x)
   *
   * Examples:
   *
   *    const x = [ [1, 2, 3], [4, 5, 6] ]
   *    const mixedX = [ [1, true], [2, 3] ]
   *    const fractionX = [ [math.fraction(1, 3)], [math.fraction(1, 3] ]
   *    const unitX = [ [math.unit('5cm')], [math.unit('5cm')] ]
   *    const bigNumberX = [ [math.bignumber(1)], [math.bignumber(0)] ]
   *    const sparse = math.sparse(x)
   *    const dense = math.matrix(x)
   *    math.getMatrixDataType(x)   // returns 'number'
   *    math.getMatrixDataType(sparse)   // returns 'number'
   *    math.getMatrixDataType(dense)   // returns 'number'
   *    math.getMatrixDataType(mixedX) // returns 'mixed'
   *    math.getMatrixDataType(fractionX) // returns 'Fraction'
   *    math.getMatrixDataType(unitX) // returns 'Unit'
   *    math.getMatrixDataType(bigNumberX) // return 'BigNumber'
   *
   * See also:
   *  SparseMatrix, DenseMatrix
   *
   * @param {...Matrix | Array} x   The Matrix with values.
   *
   * @return {string} A string representation of the matrix type
   */
  return typed(name, {
    Array: function (x) {
      return getArrayDataType(x, typeOf)
    },
    Matrix: function (x) {
      return x.getDataType()
    }
  })
})
