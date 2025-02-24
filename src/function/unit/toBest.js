import { factory } from '../../utils/factory.js'

const name = 'toBest'
const dependencies = ['typed']

export const createToBest = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Converts a unit to the most appropriate display unit.
   * When no preferred units are provided, the function finds a prefix that results
   * in a value between 1-1000. When preferred units are provided, it converts to
   * the unit that gives a value closest to 1.
   *
   * Syntax:
   *
   *    math.toBest()
   *    math.toBest(preferredUnits)
   *
   * Examples:
   *
   *    math.unit(5000, 'm').toBest()                    // returns Unit 5 km
   *    math.unit(1500, 'mm').toBest(['mm', 'm'])        // returns Unit 1.5 m
   *    math.unit(0.005, 's').toBest()                   // returns Unit 5 ms
   *    math.unit(2500, 'N').toBest(['N', 'kN', 'MN'])   // returns Unit 2.5 kN
   *
   * See also:
   *
   *    unit, to
   *
   * @param {Unit} x                   The unit to be converted
   * @param {Array<string>} [preferredUnits=[]]  Optional array of preferred target units
   * @return {Unit}                    Value converted to the best matching unit
   */
  return typed(name, {
    '': function (x) {
      return x.toBest()
    },
    Unit: (x, preferredUnits) => x.toBest(preferredUnits)
  }
  )
})
