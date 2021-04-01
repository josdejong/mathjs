import { factory } from '../../utils/factory.js'

const name = 'matrixFromFunction'
const dependencies = ['typed', 'matrix']

export const createMatrixFromFunction = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix }) => {
  /**
   * Create a matrix by evaluating a generating function at each index.
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
   */
  return typed(name, {
    'Array | Matrix, function, string, string': function (size, fn, format, datatype) {
      return _create(size, fn, format, datatype)
    },
    'Array | Matrix, function, string': function (size, fn, format) {
      return _create(size, fn, format)
    },
    'Array | Matrix, function': function (size, fn) {
      return _create(size, fn, 'dense')
    },
    'Array | Matrix, string, function': function (size, format, fn) {
      return _create(size, fn, format)
    },
    'Array | Matrix, string, string, function': function (size, format, datatype, fn) {
      return _create(size, fn, format, datatype)
    }
  })

  function _create (size, fn, format, datatype) {
    const m = matrix(format, datatype)
    m.resize(size)
    m.forEach((_, index) => m.set(index, fn(index)))
  }
})
