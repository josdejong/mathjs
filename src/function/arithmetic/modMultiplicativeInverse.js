import { factory } from '../../utils/factory'
import { modMultiplicativeInverseNumber } from '../../plain/number'

const name = 'modMultiplicativeInverse'
const dependencies = [
  'typed'
]

/**
 * Calculates the modular multiplicative inverse
 *
 * A modular multiplicative inverse of an integer a is an integer x such that the product ax is congruent to 1 with respect to the modulus m
 *
 * See https://en.wikipedia.org/wiki/Modular_multiplicative_inverse
 *
 * Syntax:
 *    math.modMultiplicativeInverse(x, y)
 *
 * Examples:
 *
 *    math.modMultiplicativeInverse(3, 7)                // returns 5
 *    math.modMultiplicativeInverse(10, 103)                // returns 31
 *
 * See also:
 *
 *    mode
 * @param {number} x
 * @param {number} y
 * @return {number} Returns the inverse of x (mod y)
 */
export const createModMultiplicativeInverse = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  const modeMultiplicativeInverse = typed(name, {

    'number, number': modMultiplicativeInverseNumber,

    'BigNumber, BigNumber': modMultiplicativeInverseNumber
  })

  return modeMultiplicativeInverse
})
