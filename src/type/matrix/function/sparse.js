import { factory } from '../../../utils/factory.js'

const name = 'sparse'
const dependencies = ['typed', 'SparseMatrix']

export const createSparse = /* #__PURE__ */ factory(name, dependencies, ({ typed, SparseMatrix }) => {
  /**
   * Create a Sparse Matrix. The function creates a new `math.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   * Note that a Sparse Matrix is always 2-dimensional, so for example if
   * you create one from a plain array of _n_ numbers, you get an _n_ by 1
   * Sparse "column vector".
   *
   * Syntax:
   *
   *    math.sparse()               // creates an empty sparse matrix.
   *    math.sparse(data)           // creates a sparse matrix with initial data.
   *    math.sparse(data, 'number') // creates a sparse matrix with initial data, number datatype.
   *
   * Examples:
   *
   *    let m = math.sparse([[1, 2], [3, 4]])
   *    m.size()                        // Array [2, 2]
   *    m.resize([3, 2], 5)
   *    m.valueOf()                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *    let v = math.sparse([0, 0, 1])
   *    v.size()                        // Array [3, 1]
   *    v.get([2, 0])                   // number 1
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit, matrix
   *
   * @param {Array | Matrix} [data]    A two dimensional array
   *
   * @return {Matrix} The created matrix
   */
  return typed(name, {
    '': function () {
      return new SparseMatrix([])
    },

    string: function (datatype) {
      return new SparseMatrix([], datatype)
    },

    'Array | Matrix': function (data) {
      return new SparseMatrix(data)
    },

    'Array | Matrix, string': function (data, datatype) {
      return new SparseMatrix(data, datatype)
    }
  })
})
