import { factory } from '../../utils/factory.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatAlgo05xSfSf } from '../../type/matrix/utils/matAlgo05xSfSf.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'nullish'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'DenseMatrix',
  'concat'
]

export const createNullish = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, DenseMatrix, concat }) => {
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo05xSfSf = createMatAlgo05xSfSf({ typed, equalScalar })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix, concat })

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
  return typed(
    name,
    {
      'any, any': function (x, y) {
        return (x == null || x === undefined) ? y : x
      }
    },
    matrixAlgorithmSuite({
      SS: matAlgo05xSfSf,
      DS: matAlgo03xDSf,
      Ss: matAlgo12xSfs
    })
  )
})
