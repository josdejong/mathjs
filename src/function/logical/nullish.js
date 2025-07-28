import { factory } from '../../utils/factory.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'
import { createMatAlgo11xS0s } from '../../type/matrix/utils/matAlgo11xS0s.js'
import { createMatAlgo09xS0Sf } from '../../type/matrix/utils/matAlgo09xS0Sf.js'
import { createMatAlgo02xDS0 } from '../../type/matrix/utils/matAlgo02xDS0.js'
import { createMatAlgo14xDs } from '../../type/matrix/utils/matAlgo14xDs.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'

const name = 'nullish'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'concat'
]

export const createNullish = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, concat }) => {
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix, concat })
  const matAlgo11xS0s = createMatAlgo11xS0s({ typed, equalScalar })
  const matAlgo09xS0Sf = createMatAlgo09xS0Sf({ typed, equalScalar })
  const matAlgo14xDs = createMatAlgo14xDs({ typed, equalScalar })
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo02xDS0 = createMatAlgo02xDS0({ typed, equalScalar })
  /**
   * Nullish coalescing operator (??). Returns the right-hand side operand
   * when the left-hand side operand is null or undefined, and otherwise
   * returns the left-hand side operand.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.nullish(x, y)
   *
   * Examples:
   *
   *    math.nullish(null, 42)        // returns 42
   *    math.nullish(undefined, 42)   // returns 42
   *    math.nullish(0, 42)           // returns 0
   *    math.nullish(false, 42)       // returns false
   *    math.nullish('', 42)          // returns ''
   *
   *    // Object property access with fallback
   *    const obj = {foo: 7, bar: 3}
   *    math.nullish(obj.baz, 0)      // returns 0 (undefined ?? 0)
   *
   * See also:
   *
   *    and, or, not
   *
   * @param  {*} x First value to check
   * @param  {*} y Fallback value
   * @return {*} Returns y when x is null or undefined, otherwise returns x
   */
  const suite = matrixAlgorithmSuite({
    SS: matAlgo09xS0Sf,
    DS: matAlgo03xDSf,
    SD: matAlgo02xDS0
  })
  const custom = {
    'any, any': (x, y) => (x == null || x === undefined) ? y : x,
    'any, SparseMatrix': (x, y) => (x == null || x === undefined) ? y : x,
    'any, DenseMatrix': (x, y) => (x == null || x === undefined) ? y : x,
    'any, Array': (x, y) => (x == null || x === undefined) ? y : x,
    'SparseMatrix, any': typed.referToSelf(self => (x, y) => matAlgo11xS0s(x, y, self, false)),
    'DenseMatrix, any': typed.referToSelf(self => (x, y) => matAlgo14xDs(x, y, self, false)),
    'Array, any': typed.referToSelf(self => (x, y) => matAlgo14xDs(matrix(x), y, self, false).valueOf())
  }
  return typed(name, { ...custom, ...suite })
})
