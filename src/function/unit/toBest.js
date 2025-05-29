import { factory } from '../../utils/factory.js'

const name = 'toBest'
const dependencies = ['typed']

export const createToBest = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Converts a unit to the most appropriate display unit.
   * When no preferred units are provided, the function automatically find the best prefix.
   * When preferred units are provided, it converts to
   * the unit that gives a value closest to 1.
   *
   * Syntax:
   *
   *    math.toBest()
   *    math.toBest(unitList)
   *    math.toBest(unitList, options)
   *
   * Where:
   * - `unitList` is an optional array of preferred target units as string or Unit.
   * - `options` is an optional object with options, formed as follows:
   *  - `offset`: number | BigNumber
   *
   * Examples:
   *
   *    math.unit(10, 'm').toBest(['cm', 'mm'])                           // returns Unit(500, 'cm')
   *    math.unit(2 / 3, 'cm').toBest()                                   // returns Unit(0.6666666666666666, 'cm')
   *    math.unit(10, 'm').toBest(['mm', 'km'], { offset: 1.5 })          // returns Unit(10000, 'mm')
   *
   * See also:
   *
   *    unit, to, format
   *
   * @param {Unit} x                          The unit to be converted
   * @param {Array<string>} [unitList=[]]     Optional array of preferred target units
   * @param {Object} [options]                Optional options object
   * @return {Unit}                           Value converted to the best matching unit
   */
  return typed(name, {
    '': function (x) {
      return x.toBest()
    },
    Unit: (x, units, options) => x.toBest(units, options)
  }
  )
})
