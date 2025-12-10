import { factory } from '../../utils/factory.js'

const name = 'zero'
const dependencies = [
  'typed', '?BigNumber', '?Complex', '?Fraction', '?unit'
]

export const createZeroNumber = /* #__PURE__ */ factory(
  name, ['typed'], ({ typed }) => {
    return typed(name, { number: () => 0 })
  })

export const createZero = /* #__PURE__ */ factory(name, dependencies, ({
  typed, BigNumber, Complex, Fraction, unit
}) => {
  /**
   * Return the additive identity of the same type as the argument.
   *
   * Syntax:
   *
   *    math.zero(x)
   *
   * Examples:
   *
   *    math.zero(1.618)                   // returns 0
   *    math.zero(math.bignumber(222))     // BigNumber 0
   *    math.zero(math.fraction(1, 3))     // Fraction 0
   *    math.zero(math.evaluate('0 + 2i')) // Complex 0+0i
   *    math.zero([[2, 3, 4], [4, 5, 6]])  // [[0, 0, 0], [0, 0, 0]]
   *
   * See also:
   *    typeOf, numeric, one
   *
   * @param {MathType} x  Any entity mathjs understands
   * @return {MathType}  Additive identity of same type as x
   */
  return typed(name, {
    number: () => 0,
    bigint: () => 0n,
    BigNumber: () => new BigNumber(0),
    Complex: () => new Complex(0),
    Fraction: () => new Fraction(0),
    boolean: () => false,
    Unit: typed.referToSelf(self => u => {
      // want 0 of the same units and value type as u
      const result = u.clone()
      result.value = self(u.value)
      return result
    }),
    Array: typed.referToSelf(self => A => _zeroArray(A, self)),
    Range: typed.referToSelf(self => R => {
      const z = self(R.start)
      return R.createRange({ start: z, step: z, length: R.length })
    }),
    // TODO: there should be a way to create the all-zero sparse matrix that
    // does not involve constructing an array of all zeros
    Matrix: typed.referToSelf(self => M =>
      M.create(_zeroArray(M.valueOf(), self)))
  })

  function _zeroArray (A, zeroer) {
    return A.map(elt => zeroer(elt))
  }
})
