import { factory } from '../../../utils/factory'
import { deepMap } from '../../../utils/collection'

const name = 'unit'
const dependencies = ['typed', 'Unit']

// This function is named createUnitFunction to prevent a naming conflict with createUnit
export const createUnitFunction = /* #__PURE__ */ factory(name, dependencies, ({ typed, Unit }) => {
  /**
   * Create a unit. Depending on the passed arguments, the function
   * will create and return a new math.Unit object.
   * When a matrix is provided, all elements will be converted to units.
   *
   * Syntax:
   *
   *     math.unit(unit : string)
   *     math.unit(value : number, unit : string)
   *
   * Examples:
   *
   *    const a = math.unit(5, 'cm')    // returns Unit 50 mm
   *    const b = math.unit('23 kg')    // returns Unit 23 kg
   *    a.to('m')                       // returns Unit 0.05 m
   *
   * See also:
   *
   *    bignumber, boolean, complex, index, matrix, number, string, createUnit
   *
   * @param {* | Array | Matrix} args   A number and unit.
   * @return {Unit | Array | Matrix}    The created unit
   */

  const unit = typed(name, {
    Unit: function (x) {
      return x.clone()
    },

    string: function (x) {
      if (Unit.isValuelessUnit(x)) {
        return new Unit(null, x) // a pure unit
      }

      return Unit.parse(x, { allowNoUnits: true }) // a unit with value, like '5cm'
    },

    'number | BigNumber | Fraction | Complex, string': function (value, unit) {
      return new Unit(value, unit)
    },

    'Array | Matrix': function (x) {
      return deepMap(x, unit)
    }
  })

  return unit
})
