import { factory } from '../../utils/factory.js'
import { createMatAlgo01xDSid } from '../../type/matrix/utils/matAlgo01xDSid.js'
import { createMatAlgo03xDSf } from '../../type/matrix/utils/matAlgo03xDSf.js'
import { createMatAlgo05xSfSf } from '../../type/matrix/utils/matAlgo05xSfSf.js'
import { createMatAlgo10xSids } from '../../type/matrix/utils/matAlgo10xSids.js'
import { createMatAlgo12xSfs } from '../../type/matrix/utils/matAlgo12xSfs.js'
import { createMatrixAlgorithmSuite } from '../../type/matrix/utils/matrixAlgorithmSuite.js'

const name = 'subtract'
const dependencies = [
  'typed',
  'matrix',
  'equalScalar',
  'addScalar',
  'unaryMinus',
  'DenseMatrix'
]

export const createSubtract = /* #__PURE__ */ factory(name, dependencies, ({ typed, matrix, equalScalar, addScalar, unaryMinus, DenseMatrix }) => {
  // TODO: split function subtract in two: subtract and subtractScalar

  const matAlgo01xDSid = createMatAlgo01xDSid({ typed })
  const matAlgo03xDSf = createMatAlgo03xDSf({ typed })
  const matAlgo05xSfSf = createMatAlgo05xSfSf({ typed, equalScalar })
  const matAlgo10xSids = createMatAlgo10xSids({ typed, DenseMatrix })
  const matAlgo12xSfs = createMatAlgo12xSfs({ typed, DenseMatrix })
  const matrixAlgorithmSuite = createMatrixAlgorithmSuite({ typed, matrix })

  /**
   * Subtract two values, `x - y`.
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.subtract(x, y)
   *
   * Examples:
   *
   *    math.subtract(5.3, 2)        // returns number 3.3
   *
   *    const a = math.complex(2, 3)
   *    const b = math.complex(4, 1)
   *    math.subtract(a, b)          // returns Complex -2 + 2i
   *
   *    math.subtract([5, 7, 4], 4)  // returns Array [1, 3, 0]
   *
   *    const c = math.unit('2.1 km')
   *    const d = math.unit('500m')
   *    math.subtract(c, d)          // returns Unit 1.6 km
   *
   * See also:
   *
   *    add
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} x
   *            Initial value
   * @param  {number | BigNumber | Fraction | Complex | Unit | Array | Matrix} y
   *            Value to subtract from `x`
   * @return {number | BigNumber | Fraction | Complex | Unit | Array | Matrix}
   *            Subtraction of `x` and `y`
   */
  return typed(
    name,
    {
      'number, number': (x, y) => x - y,
      'Complex, Complex': (x, y) => x.sub(y),
      'BigNumber, BigNumber': (x, y) => x.minus(y),
      'Fraction, Fraction': (x, y) => x.sub(y),

      'Unit, Unit': function (x, y) {
        if (x.value === null) {
          throw new Error('Parameter x contains a unit with undefined value')
        }

        if (y.value === null) {
          throw new Error('Parameter y contains a unit with undefined value')
        }

        if (!x.equalBase(y)) {
          throw new Error('Units do not match')
        }

        const res = x.clone()
        res.value = this(res.value, y.value)
        res.fixPrefix = false

        return res
      }
    },
    matrixAlgorithmSuite({
      SS: matAlgo05xSfSf,
      DS: matAlgo01xDSid,
      SD: matAlgo03xDSf,
      Ss: matAlgo12xSfs,
      sS: matAlgo10xSids
    })
  )
})
