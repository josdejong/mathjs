import { factory } from '../../../utils/factory.js'
import { deepMap as map } from '../../../utils/array.js'

const name = 'matAlgo15xAs'
const dependencies = []

export const createMatAlgo15xAs = /* #__PURE__ */ factory(name, dependencies, () => {
  /**
   * Iterates over Array items and invokes the callback function f(Aij..z, b).
   * Callback function invoked once for each item.
   *
   * C(i,j,...z) = f(Aij..z, b)
   *
   * @param {Array}    a                 The Array instance (A)
   * @param {Scalar}   b                 The Scalar value
   * @param {Function} cf                The f(Aij..z,b) operation to invoke
   * @param {boolean}  inverse           A true value indicates callback should be invoked f(b,Aij..z)
   *
   * @return {Array}                    Array (C)
   *
   * https://github.com/josdejong/mathjs/pull/346#issuecomment-97659042
   */
  return function matAlgo15xAs (a, b, cf, inverse) {
    return inverse ? map(a, v => cf(b, v), true) : map(a, v => cf(v, b), true)
  }
})
