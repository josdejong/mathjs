import { factory } from '../../utils/factory'
import { addNumber } from '../../plain/number'

const name = 'addScalar'
const dependencies = ['typed']

export const createAddScalar = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Add two scalar values, `x + y`.
   * This function is meant for internal use: it is used by the public function
   * `add`
   *
   * This function does not support collections (Array or Matrix).
   *
   * @param  {number | BigNumber | Fraction | Complex | Unit} x   First value to add
   * @param  {number | BigNumber | Fraction | Complex} y          Second value to add
   * @return {number | BigNumber | Fraction | Complex | Unit}     Sum of `x` and `y`
   * @private
   */
  const addScalar = typed(name, {

    'number, number': addNumber,

    'Complex, Complex': function (x, y) {
      return x.add(y)
    },

    'BigNumber, BigNumber': function (x, y) {
      return x.plus(y)
    },

    'Fraction, Fraction': function (x, y) {
      return x.add(y)
    },

    'Unit, Unit': function (x, y) {
      if (x.value === null || x.value === undefined) throw new Error('Parameter x contains a unit with undefined value')
      if (y.value === null || y.value === undefined) throw new Error('Parameter y contains a unit with undefined value')
      if (!x.equalBase(y)) throw new Error('Units do not match')

      const res = x.clone()
      res.value = addScalar(res.value, y.value)
      res.fixPrefix = false
      return res
    }
  })

  return addScalar
})
