import { factory } from '../../../utils/factory.js'

const name = 'splitUnit'
const dependencies = ['typed']

export const createSplitUnit = /* #__PURE__ */ factory(name, dependencies, ({ typed }) => {
  /**
   * Split a unit in an array of units whose sum is equal to the original unit.
   *
   * Syntax:
   *
   *     math.splitUnit(unit: Unit, parts: Array.<Unit>)
   *
   * Example:
   *
   *     let u = math.splitUnit(math.unit(1, 'm'), ['feet', 'inch'])
   *     u = u.map(part => part.toString())
   *     // returns [ '3 feet', '3.3700787401574765 inch' ]
   *
   * See also:
   *
   *     unit
   *
   * History:
   *
   *     v3.4  Created
   *
   * @param {Array} [parts] An array of strings or valueless units.
   * @return {Array} An array of units.
   */
  return typed(name, {
    'Unit, Array': function (unit, parts) {
      return unit.splitUnit(parts)
    }
  })
})
