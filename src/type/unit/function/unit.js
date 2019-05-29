import * as UnitMath from 'unitmath'
import { factory } from '../../../utils/factory'
import { deepMap } from '../../../utils/collection'

const name = 'unit'
const dependencies = [
  'typed',
  'config',
  '?on',
  'clone',
  'numeric',
  'add',
  'subtract',
  'multiply',
  'divide',
  'pow',
  'equal',
  'smaller',
  'smallerEq',
  'larger',
  'largerEq',
  'abs'
]

// This function is named createUnitFunction to prevent a naming conflict with createUnit
export const createUnitFunction = /* #__PURE__ */ factory(name, dependencies, ({
  typed,
  config,
  on,
  clone,
  numeric,
  add,
  subtract,
  multiply,
  divide,
  pow,
  equal,
  smaller,
  smallerEq,
  larger,
  largerEq,
  abs

}) => {
  // TODO: allow passing configuration for unitmath
  const unitmath = UnitMath.config({
    parentheses: true,
    type: {
      clone: clone,
      conv: (value) => value, // numeric(value, config.number), // TODO: This doesn't always work
      add: add,
      sub: subtract,
      mul: multiply,
      div: divide,
      pow: pow,
      eq: equal,
      lt: smaller,
      le: smallerEq,
      gt: larger,
      ge: largerEq,
      abs: abs
    }
  })

  // TODO: think the way to check whether something is a unit through. Must be secure (checks against the prototype)
  const u = unitmath()
  u.constructor.prototype.isUnit = true
  u.constructor.prototype.type = 'unit'

  // TODO: is listening for config changes still needed?
  if (on) {
    // recalculate the values on change of configuration
    on('config', function (curr, prev) {
      if (curr.number !== prev.number) {
        // TODO: do we need to recalculate angle values like before?
      }
    })
  }

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
    'Unit': function (x) {
      return x.clone()
    },

    'string': unitmath,

    'number | BigNumber | Fraction | Complex, string': function (...args) {
      let u = unitmath(...args)
      return u
    },

    'Array | Matrix': function (x) {
      return deepMap(x, unit)
    }
  })

  // expose static exists function
  unit.exists = (singleUnitString) => unitmath.exists(singleUnitString)

  return unit
})
