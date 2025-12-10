import { factory } from '../../utils/factory.js'
import { extend } from '../../utils/object.js'

const name = 'one'
const dependencies = [
  'typed', '?BigNumber', '?Complex', '?Fraction', 'size', 'identity'
]
export const createOneNumber = /* #__PURE__ */ factory(
  name, ['typed'], ({ typed }) => {
    return typed(name, {
      number: () => 1
    })
  })

export const createOneUnitless = /* #__PURE__ */ factory(
  'oneUnitless', dependencies, ({
    typed, BigNumber, Complex, Fraction, size, identity
  }) => {
    /**
     * Like one() but doesn't handle units, to break circularity
     */
    return typed('oneUnitless', {
      number: () => 1,
      bigint: () => 1n,
      BigNumber: () => new BigNumber(1),
      Complex: () => new Complex(1),
      Fraction: () => new Fraction(1),
      boolean: () => true,
      Array: A => {
        const sz = size(A)
        if (sz.length === 2 && sz[0] === sz[1]) {
          return identity(sz[0]).valueOf()
        }
        throw new Error(`No identity of size ${sz}`)
      },
      Matrix: M => {
        const sz = size(M)
        if (sz.length === 2 && sz[0] === sz[1]) return identity(sz[0])
        throw new Error(`No identity matrix of size ${sz}`)
      }
    })
  })

export const createOne = /* #__PURE__ */ factory(
  name, ['typed', 'oneUnitless', '?unit'], ({
    typed, oneUnitless, unit
  }) => {
    /**
     * Return the multiplicative identity of the same type as the argument.
     *
     * Syntax:
     *
     *    math.one(x)
     *
     * Examples:
     *
     *    math.one(1.618)                   // returns 1
     *    math.one(math.bignumber(222))     // BigNumber 1
     *    math.one(math.fraction(1, 3))     // Fraction 1
     *    math.one(math.evaluate('0 + 2i')) // Complex 1+0i
     *    math.one([[2, 3], [4, 5]])        // [[1, 0], [0,1]]
     *
     * See also:
     *    typeOf, numeric, zero
     *
     * @param {MathType} x  Any entity mathjs understands
     * @return {MathType}  Multiplicative identity of same type as x
     */
    return typed(name, extend({
      Unit: u => {
        if (u.value === undefined || u.value === null) return unit(1)
        return oneUnitless(u.value)
      }
    }, oneUnitless.signatures))
  })
