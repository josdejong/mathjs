import { factory } from '../../utils/factory'
import { isBigNumber, isComplex, isFraction } from '../../utils/is'
import { deepMap } from '../../utils/collection'
import { cbrtNumber } from '../../plain/number'

const name = 'cbrt'
const dependencies = [
  'config',
  'typed',
  'isNegative',
  'unaryMinus',
  'matrix',
  'Complex',
  'BigNumber',
  'Fraction'
]

export const createCbrt = /* #__PURE__ */ factory(name, dependencies, ({ config, typed, isNegative, unaryMinus, matrix, Complex, BigNumber, Fraction }) => {
  /**
   * Calculate the cubic root of a value.
   *
   * For matrices, the function is evaluated element wise.
   *
   * Syntax:
   *
   *    math.cbrt(x)
   *    math.cbrt(x, allRoots)
   *
   * Examples:
   *
   *    math.cbrt(27)                  // returns 3
   *    math.cube(3)                   // returns 27
   *    math.cbrt(-64)                 // returns -4
   *    math.cbrt(math.unit('27 m^3')) // returns Unit 3 m
   *    math.cbrt([27, 64, 125])       // returns [3, 4, 5]
   *
   *    const x = math.complex('8i')
   *    math.cbrt(x)                   // returns Complex 1.7320508075689 + i
   *    math.cbrt(x, true)             // returns Matrix [
   *                                    //    1.7320508075689 + i
   *                                    //   -1.7320508075689 + i
   *                                    //   -2i
   *                                    // ]
   *
   * See also:
   *
   *    square, sqrt, cube
   *
   * @param {number | BigNumber | Complex | Unit | Array | Matrix} x
   *            Value for which to calculate the cubic root.
   * @param {boolean} [allRoots]  Optional, false by default. Only applicable
   *            when `x` is a number or complex number. If true, all complex
   *            roots are returned, if false (default) the principal root is
   *            returned.
   * @return {number | BigNumber | Complex | Unit | Array | Matrix}
   *            Returns the cubic root of `x`
   */
  return typed(name, {
    number: cbrtNumber,
    // note: signature 'number, boolean' is also supported,
    //       created by typed as it knows how to convert number to Complex

    Complex: _cbrtComplex,

    'Complex, boolean': _cbrtComplex,

    BigNumber: function (x) {
      return x.cbrt()
    },

    Unit: _cbrtUnit,

    'Array | Matrix': function (x) {
      // deep map collection, skip zeros since cbrt(0) = 0
      return deepMap(x, this, true)
    }
  })

  /**
   * Calculate the cubic root for a complex number
   * @param {Complex} x
   * @param {boolean} [allRoots]   If true, the function will return an array
   *                               with all three roots. If false or undefined,
   *                               the principal root is returned.
   * @returns {Complex | Array.<Complex> | Matrix.<Complex>} Returns the cubic root(s) of x
   * @private
   */
  function _cbrtComplex (x, allRoots) {
    // https://www.wikiwand.com/en/Cube_root#/Complex_numbers

    const arg3 = x.arg() / 3
    const abs = x.abs()

    // principal root:
    const principal = new Complex(cbrtNumber(abs), 0).mul(new Complex(0, arg3).exp())

    if (allRoots) {
      const all = [
        principal,
        new Complex(cbrtNumber(abs), 0).mul(new Complex(0, arg3 + Math.PI * 2 / 3).exp()),
        new Complex(cbrtNumber(abs), 0).mul(new Complex(0, arg3 - Math.PI * 2 / 3).exp())
      ]

      return (config.matrix === 'Array') ? all : matrix(all)
    } else {
      return principal
    }
  }

  /**
   * Calculate the cubic root for a Unit
   * @param {Unit} x
   * @return {Unit} Returns the cubic root of x
   * @private
   */
  function _cbrtUnit (x) {
    if (x.value && isComplex(x.value)) {
      let result = x.clone()
      result.value = 1.0
      result = result.pow(1.0 / 3) // Compute the units
      result.value = _cbrtComplex(x.value) // Compute the value
      return result
    } else {
      const negate = isNegative(x.value)
      if (negate) {
        x.value = unaryMinus(x.value)
      }

      // TODO: create a helper function for this
      let third
      if (isBigNumber(x.value)) {
        third = new BigNumber(1).div(3)
      } else if (isFraction(x.value)) {
        third = new Fraction(1, 3)
      } else {
        third = 1 / 3
      }

      const result = x.pow(third)

      if (negate) {
        result.value = unaryMinus(result.value)
      }

      return result
    }
  }
})
