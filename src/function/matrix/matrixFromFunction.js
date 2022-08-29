import { factory } from '../../utils/factory.js'

const name = 'matrixFromFunction'
const dependencies = ['typed', 'matrix', 'isZero']

export const createMatrixFromFunction = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, isZero }) => {
  /**
   * Create a matrix by evaluating a generating function at each index.
   * The simplest overload returns a multi-dimensional array as long as `size` is an array.
   * Passing `size` as a Matrix or specifying a `format` will result in returning a Matrix.
   *
   * Syntax:
   *
   *    math.matrixFromFunction(size, fn)
   *    math.matrixFromFunction(size, fn, format)
   *    math.matrixFromFunction(size, fn, format, datatype)
   *    math.matrixFromFunction(size, format, fn)
   *    math.matrixFromFunction(size, format, datatype, fn)
   *
   * Examples:
   *
   *    math.matrixFromFunction([3,3], i => i[0] - i[1]) // an antisymmetric matrix
   *    math.matrixFromFunction([100, 100], 'sparse', i => i[0] - i[1] === 1 ? 4 : 0) // a sparse subdiagonal matrix
   *    math.matrixFromFunction([5], i => math.random()) // a random vector
   *
   * See also:
   *
   *    matrix, zeros
   *
   * @param {Array | Matrix} size   The size of the matrix to be created
   * @param {function} fn           Callback function invoked for every entry in the matrix
   * @param {string} [format]       The Matrix storage format, either `'dense'` or `'sparse'`
   * @param {string} [datatype]     Type of the values
   * @return {Array | Matrix} Returns the created matrix
   */
  return typed(name, {
    'Array | Matrix, function, string, string': function (size, fn, format, datatype) {
      return _create(size, fn, format, datatype)
    },
    'Array | Matrix, function, string': function (size, fn, format) {
      return _create(size, fn, format)
    },
    'Matrix, function': function (size, fn) {
      return _create(size, fn, 'dense')
    },
    'Array, function': function (size, fn) {
      return _create(size, fn, 'dense').toArray()
    },
    'Array | Matrix, string, function': function (size, format, fn) {
      return _create(size, fn, format)
    },
    'Array | Matrix, string, string, function': function (size, format, datatype, fn) {
      return _create(size, fn, format, datatype)
    }
  })

  function _create (size, fn, format, datatype) {
    let m
    if (datatype !== undefined) {
      m = matrix(format, datatype)
    } else {
      m = matrix(format)
    }

    m.resize(size)
    m.forEach(function (_, index) {
      const val = fn(index)
      if (isZero(val)) return
      m.set(index, val)
    })

    return m
  }
})
