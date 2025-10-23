import { factory } from '../../utils/factory.js'
import { isComplex, isMatrix, isUnit } from '../../utils/is.js'

const name = 'scalarDivide'
const dependencies = [
  'typed', '?Unit', 'map', 'multiply', 'equal', 'deepEqual',
  'isInteger', 'isNumeric', 'isZero',
  'abs', 'add', 'divide', '?fraction'
]

export const createScalarDivide = /* #__PURE__ */ factory(name, dependencies, ({
  typed, Unit, map, multiply, equal, deepEqual,
  isInteger, isNumeric, isZero,
  abs, add, divide, fraction
}) => {
  const isScalar = x => isNumeric(x) || isComplex(x) || isUnit(x)

  /**
   * Determine what scalar multiple one entity is of another, if it is.
   * For scalar arguments, this function is essentially the same as `divide`,
   * except that it will always look for a result `r` of a more inclusive
   * type to solve `x = r*y` if there is no such result of the same type
   * as `y`.
   *
   * For collection arguments, this function first does a scalar divide
   * on the first nonzero entries of the collections, producing `r`,
   * and then checks whether the first argument is `r` times the second. If
   * so, it returns `r`, otherwise it returns undefined.
   *
   * Syntax:
   *
   *    math.scalarDivide(x, y)
   *
   * Examples:
   *
   *    math.scalarDivide(8, 2)                  // returns 4
   *    math.scalarDivide(12n, 3n)               // returns 4n
   *    math.scalarDivide(11n, 3n)               // Fraction 11,3
   *    math.scalarDivide(0, math.bignumber(7))  // returns 0
   *    math.scalarDivide(3, math.fraction(0))   // undefined
   *    math.scalarDivide([6, 9], [4, 6])        // returns 1.5
   *    math.scalarDivide([6, 10], [4, 6])       // undefined
   *
   * See also:
   *
   *    divide, dotDivide
   *
   * @param {MathType} x  Numerator
   * @param {MathType} y  Denominator
   * @return {MathScalarType | undefined}  scalar coefficient or undefined if not a scalar multiple
   */
  return typed(name, {
    'Array | Matrix, Array | Matrix': typed.referToSelf(self => (x, y) => {
      if (isMatrix(x)) x = x.valueOf()
      if (isMatrix(y)) y = y.valueOf()
      if (x.length === 0) {
        if (y.length === 0) return 0
        else return undefined
      }
      if (y.length === 0) return undefined
      let initialx = 0
      let initialy = 0
      let foundInit = false
      map(x, y, (eltx, elty) => {
        if (foundInit) return 0
        if (isZero(eltx) && isZero(elty)) return 0
        initialx = eltx
        initialy = elty
        foundInit = true
        return 1
      })
      const initialr = self(initialx, initialy)
      if (initialr === undefined) return undefined
      if (deepEqual(multiply(initialr, y), x)) return initialr
      return undefined
    }),
    'Array | Matrix, any': () => undefined,
    'any, Array | Matrix': () => undefined,
    'any, any': (x, y) => {
      if (!isScalar(x) || !isScalar(y)) return undefined
      if (isZero(y)) {
        if (isZero(x)) {
          if (isUnit(x)) {
            if (isUnit(y)) {
              const y1 = y.clone()
              y1.value = 1
              return divide(x, y)
            } else return divide(x, add(y, 1))
          } return x
        } else return undefined
      }
      if (isZero(x)) y = abs(y) // avoid `-0`
      if (typeof y === 'bigint' && fraction) {
        const quotient = fraction(x, y)
        if (isInteger(quotient)) return quotient.n
        return quotient
      }
      const quotient = divide(x, y)
      if (isNumeric(quotient)) return quotient
      if (isComplex(quotient)) {
        if (equal(quotient.re + quotient.im, quotient.re)) return quotient.re
        return quotient
      }
      if (isUnit(quotient)) {
        if (quotient.equalBase(Unit.BASE_UNITS.NONE)) return quotient.value
        return quotient
      }
      return undefined
    }
  })
})
