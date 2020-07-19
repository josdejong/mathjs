import { factory } from '../../utils/factory'

const name = 'nthRoots'
const dependencies = ['config', 'typed', 'divideScalar', 'Complex']

export const createNthRoots = /* #__PURE__ */ factory(name, dependencies, ({ typed, config, divideScalar, Complex }) => {
  /**
   * Each function here returns a real multiple of i as a Complex value.
   * @param  {number} val
   * @return {Complex} val, i*val, -val or -i*val for index 0, 1, 2, 3
   */
  // This is used to fix float artifacts for zero-valued components.
  const _calculateExactResult = [
    function realPos (val) { return new Complex(val, 0) },
    function imagPos (val) { return new Complex(0, val) },
    function realNeg (val) { return new Complex(-val, 0) },
    function imagNeg (val) { return new Complex(0, -val) }
  ]

  /**
   * Calculate the nth root of a Complex Number a using De Movire's Theorem.
   * @param  {Complex} a
   * @param  {number} root
   * @return {Array} array of n Complex Roots
   */
  function _nthComplexRoots (a, root) {
    if (root < 0) throw new Error('Root must be greater than zero')
    if (root === 0) throw new Error('Root must be non-zero')
    if (root % 1 !== 0) throw new Error('Root must be an integer')
    if (a === 0 || a.abs() === 0) return [new Complex(0, 0)]
    const aIsNumeric = typeof (a) === 'number'
    let offset
    // determine the offset (argument of a)/(pi/2)
    if (aIsNumeric || a.re === 0 || a.im === 0) {
      if (aIsNumeric) {
        offset = 2 * (+(a < 0)) // numeric value on the real axis
      } else if (a.im === 0) {
        offset = 2 * (+(a.re < 0)) // complex value on the real axis
      } else {
        offset = 2 * (+(a.im < 0)) + 1 // complex value on the imaginary axis
      }
    }
    const arg = a.arg()
    const abs = a.abs()
    const roots = []
    const r = Math.pow(abs, 1 / root)
    for (let k = 0; k < root; k++) {
      const halfPiFactor = (offset + 4 * k) / root
      /**
       * If (offset + 4*k)/root is an integral multiple of pi/2
       * then we can produce a more exact result.
       */
      if (halfPiFactor === Math.round(halfPiFactor)) {
        roots.push(_calculateExactResult[halfPiFactor % 4](r))
        continue
      }
      roots.push(new Complex({ r: r, phi: (arg + 2 * Math.PI * k) / root }))
    }
    return roots
  }

  /**
   * Calculate the nth roots of a value.
   * An nth root of a positive real number A,
   * is a positive real solution of the equation "x^root = A".
   * This function returns an array of complex values.
   *
   * Syntax:
   *
   *    math.nthRoots(x)
   *    math.nthRoots(x, root)
   *
   * Examples:
   *
   *    math.nthRoots(1)
   *    // returns [
   *    //   {re: 1, im: 0},
   *    //   {re: -1, im: 0}
   *    // ]
   *    nthRoots(1, 3)
   *    // returns [
   *    //   { re: 1, im: 0 },
   *    //   { re: -0.4999999999999998, im: 0.8660254037844387 },
   *    //   { re: -0.5000000000000004, im: -0.8660254037844385 }
   *    ]
   *
   * See also:
   *
   *    nthRoot, pow, sqrt
   *
   * @param {number | BigNumber | Fraction | Complex} x Number to be rounded
   * @return {number | BigNumber | Fraction | Complex}            Rounded value
   */
  return typed(name, {
    Complex: function (x) {
      return _nthComplexRoots(x, 2)
    },
    'Complex, number': _nthComplexRoots
  })
})
