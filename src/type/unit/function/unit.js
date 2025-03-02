import { factory } from '../../../utils/factory.js'
import { deepMap } from '../../../utils/collection.js'

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
   *     math.unit(value : number, valuelessUnit : Unit)
   *     math.unit(value : number, valuelessUnit : string)
   *
   * Examples:
   *
   *    math.unit('23 kg')              // returns Unit 23 kg
   *       // Valueless Units can be used to specify the unit type:
   *    const kph = math.unit('km/h')
   *    math.unit(25, kph)              // returns Unit 25 km/h
   *    const a = math.unit(5, 'cm')
   *    a.to('m')                       // returns Unit 0.05 m
   *
   * See also:
   *
   *    bigint, bignumber, boolean, complex, index, matrix, number, string, createUnit
   *
   * History:
   *
   *    v0.5   Created
   *    v0.16  Support conversion from BigNumber
   *    v2.5   Support BigNumber and Fraction values in units
   *    v2.6   Support Complex values in units
   *    v11.1  Allow the type of unit to be specifed by a unit (not just string)
   *
   * @param {* | Array | Matrix} args   A number and unit.
   * @return {Unit | Array | Matrix}    The created unit
   */

  return typed(name, {
    Unit: function (x) {
      return x.clone()
    },

    string: function (x) {
      if (Unit.isValuelessUnit(x)) {
        return new Unit(null, x) // a pure unit
      }

      return Unit.parse(x, { allowNoUnits: true }) // a unit with value, like '5cm'
    },

    'number | BigNumber | Fraction | Complex, string | Unit': function (value, unit) {
      return new Unit(value, unit)
    },

    'number | BigNumber | Fraction': function (value) {
      // dimensionless
      return new Unit(value)
    },

    'Array | Matrix': typed.referToSelf(self => x => deepMap(x, self))
  })
})
