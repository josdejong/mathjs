import { factory } from '../../../utils/factory'

const name = 'matrix'
const dependencies = ['typed', 'Matrix', 'DenseMatrix', 'SparseMatrix']

export const createMatrix = /* #__PURE__ */ factory(name, dependencies, ({ typed, Matrix, DenseMatrix, SparseMatrix }) => {
  /**
   * Create a Matrix. The function creates a new `math.Matrix` object from
   * an `Array`. A Matrix has utility functions to manipulate the data in the
   * matrix, like getting the size and getting or setting values in the matrix.
   * Supported storage formats are 'dense' and 'sparse'.
   *
   * Syntax:
   *
   *    math.matrix()                         // creates an empty matrix using default storage format (dense).
   *    math.matrix(data)                     // creates a matrix with initial data using default storage format (dense).
   *    math.matrix('dense')                  // creates an empty matrix using the given storage format.
   *    math.matrix(data, 'dense')            // creates a matrix with initial data using the given storage format.
   *    math.matrix(data, 'sparse')           // creates a sparse matrix with initial data.
   *    math.matrix(data, 'sparse', 'number') // creates a sparse matrix with initial data, number data type.
   *
   * Examples:
   *
   *    let m = math.matrix([[1, 2], [3, 4]])
   *    m.size()                        // Array [2, 2]
   *    m.resize([3, 2], 5)
   *    m.valueOf()                     // Array [[1, 2], [3, 4], [5, 5]]
   *    m.get([1, 0])                    // number 3
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, number, string, unit, sparse
   *
   * @param {Array | Matrix} [data]    A multi dimensional array
   * @param {string} [format]          The Matrix storage format
   *
   * @return {Matrix} The created matrix
   */
  return typed(name, {
    '': function () {
      return _create([])
    },

    string: function (format) {
      return _create([], format)
    },

    'string, string': function (format, datatype) {
      return _create([], format, datatype)
    },

    Array: function (data) {
      return _create(data)
    },

    Matrix: function (data) {
      return _create(data, data.storage())
    },

    'Array | Matrix, string': _create,

    'Array | Matrix, string, string': _create
  })

  /**
   * Create a new Matrix with given storage format
   * @param {Array} data
   * @param {string} [format]
   * @param {string} [datatype]
   * @returns {Matrix} Returns a new Matrix
   * @private
   */
  function _create (data, format, datatype) {
    // get storage format constructor
    if (format === 'dense' || format === 'default' || format === undefined) {
      return new DenseMatrix(data, datatype)
    }

    if (format === 'sparse') {
      return new SparseMatrix(data, datatype)
    }

    throw new TypeError('Unknown matrix type ' + JSON.stringify(format) + '.')
  }
})
