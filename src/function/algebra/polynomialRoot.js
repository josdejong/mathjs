import { factory } from '../../utils/factory.js'

const name = 'polynomialRoot'
const dependencies = [
  'typed',
  'isZero',
  'equalScalar',
  'add',
  'subtract',
  'multiply',
  'divide',
  'sqrt',
  'unaryMinus',
  'cbrt',
  'typeOf',
  'im',
  're'
]

export const createPolynomialRoot = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  isZero,
  equalScalar,
  add,
  subtract,
  multiply,
  divide,
  sqrt,
  unaryMinus,
  cbrt,
  typeOf,
  im,
  re
}) => {
  /**
   * Finds the numerical values of the distinct roots of a polynomial with real or complex coefficients.
   * Currently operates only on linear, quadratic, and cubic polynomials using the standard
   * formulas for the roots.
   *
   * Syntax:
   *
   *     math.polynomialRoot(constant, linearCoeff, quadraticCoeff, cubicCoeff)
   *
   * Examples:
   *     // linear
   *     math.polynomialRoot(6, 3)                                        // [-2]
   *     math.polynomialRoot(math.complex(6,3), 3)                        // [-2 - i]
   *     math.polynomialRoot(math.complex(6,3), math.complex(2,1))        // [-3 + 0i]
   *     // quadratic
   *     math.polynomialRoot(2, -3, 1)                                    // [2, 1]
   *     math.polynomialRoot(8, 8, 2)                                     // [-2]
   *     math.polynomialRoot(-2, 0, 1)                                    // [1.4142135623730951, -1.4142135623730951]
   *     math.polynomialRoot(2, -2, 1)                                    // [1 + i, 1 - i]
   *     math.polynomialRoot(math.complex(1,3), math.complex(-3, -2), 1)  // [2 + i, 1 + i]
   *     // cubic
   *     math.polynomialRoot(-6, 11, -6, 1)                               // [1, 3, 2]
   *     math.polynomialRoot(-8, 0, 0, 1)                                 // [-1 - 1.7320508075688774i, 2, -1 + 1.7320508075688774i]
   *     math.polynomialRoot(0, 8, 8, 2)                                  // [0, -2]
   *     math.polynomialRoot(1, 1, 1, 1)                                  // [-1 + 0i, 0 - i, 0 + i]
   *
   * See also:
   *     cbrt, sqrt
   *
   * @param {... number | Complex} coeffs
   *     The coefficients of the polynomial, starting with with the constant coefficent, followed
   *     by the linear coefficient and subsequent coefficients of increasing powers.
   * @return {Array} The distinct roots of the polynomial
   */

  return typed(name, {
    'number|Complex, ...number|Complex': (constant, restCoeffs) => {
      const coeffs = [constant, ...restCoeffs]
      while (coeffs.length > 0 && isZero(coeffs[coeffs.length - 1])) {
        coeffs.pop()
      }
      if (coeffs.length < 2) {
        throw new RangeError(
          `Polynomial [${constant}, ${restCoeffs}] must have a non-zero non-constant coefficient`)
      }
      switch (coeffs.length) {
        case 2: // linear
          return [unaryMinus(divide(coeffs[0], coeffs[1]))]
        case 3: { // quadratic
          const [c, b, a] = coeffs
          const denom = multiply(2, a)
          const d1 = multiply(b, b)
          const d2 = multiply(4, a, c)
          if (equalScalar(d1, d2)) return [divide(unaryMinus(b), denom)]
          const discriminant = sqrt(subtract(d1, d2))
          return [
            divide(subtract(discriminant, b), denom),
            divide(subtract(unaryMinus(discriminant), b), denom)
          ]
        }
        case 4: { // cubic, cf. https://en.wikipedia.org/wiki/Cubic_equation
          const [d, c, b, a] = coeffs
          const denom = unaryMinus(multiply(3, a))
          const D0_1 = multiply(b, b)
          const D0_2 = multiply(3, a, c)
          const D1_1 = add(multiply(2, b, b, b), multiply(27, a, a, d))
          const D1_2 = multiply(9, a, b, c)
          if (equalScalar(D0_1, D0_2) && equalScalar(D1_1, D1_2)) {
            return [divide(b, denom)]
          }
          const Delta0 = subtract(D0_1, D0_2)
          const Delta1 = subtract(D1_1, D1_2)
          const discriminant1 = add(
            multiply(18, a, b, c, d), multiply(b, b, c, c))
          const discriminant2 = add(
            multiply(4, b, b, b, d),
            multiply(4, a, c, c, c),
            multiply(27, a, a, d, d))
          if (equalScalar(discriminant1, discriminant2)) {
            return [
              divide(
                subtract(
                  multiply(4, a, b, c),
                  add(multiply(9, a, a, d), multiply(b, b, b))),
                multiply(a, Delta0)), // simple root
              divide(
                subtract(multiply(9, a, d), multiply(b, c)),
                multiply(2, Delta0)) // double root
            ]
          }
          // OK, we have three distinct roots
          let Ccubed
          if (equalScalar(D0_1, D0_2)) {
            Ccubed = Delta1
          } else {
            Ccubed = divide(
              add(
                Delta1,
                sqrt(subtract(
                  multiply(Delta1, Delta1), multiply(4, Delta0, Delta0, Delta0)))
              ),
              2)
          }
          const allRoots = true
          const rawRoots = cbrt(Ccubed, allRoots).toArray().map(
            C => divide(add(b, C, divide(Delta0, C)), denom))
          return rawRoots.map(r => {
            if (typeOf(r) === 'Complex' && equalScalar(re(r), re(r) + im(r))) {
              return re(r)
            }
            return r
          })
        }
        default:
          throw new RangeError(`only implemented for cubic or lower-order polynomials, not ${coeffs}`)
      }
    }
  })
})
