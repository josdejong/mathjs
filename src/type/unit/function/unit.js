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
  'abs',
  '?BigNumber',
  '?Complex',
  '?Fraction'
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
  abs,
  BigNumber,
  Complex,
  Fraction

}) => {
  // TODO: allow passing configuration for unitmath

  const conv = (value) => {
    if (typeof value === 'string') {
      return numeric(value, config.number)
    // } else if (typeof value === 'number') {
    //   return numeric(value.toString(), config.number)
    } else {
      return value
    }
  }

  const promoteArgs = (fn, ...args) => {
    let types = {}
    args.forEach(a => { types[a.type || typeof a] = true })
    const numTypes = Object.keys(types).length
    // We expect to have these types:
    // number
    // Complex
    // BigNumber
    // Fraction

    if (numTypes === 1) {
      // No alteration is necessary
      return fn(...args)
    } else if (numTypes === 2) {
      // May need to convert one or more of the arguments
      if (types.hasOwnProperty('number')) {
        if (types.hasOwnProperty('Complex')) {
          // Convert all args to Complex
          return fn(...args.map(a => typeof a === 'number' ? new Complex(a, 0) : a))
        } else if (types.hasOwnProperty('Fraction')) {
          // Convert all args to Fraction
          return fn(...args.map(a => typeof a === 'number' ? new Fraction(a) : a))
        } else if (types.hasOwnProperty('BigNumber')) {
          // Convert all args to BigNumber
          return fn(...args.map(a => typeof a === 'number' ? new BigNumber(a) : a))
        }
      }
    }
    
    // All valid paths should have returned by now
    // Throw this error when debugging, or for more consistent error messages, try it anyway and let typed.js throw
    throw new Error('unit.js attempted to perform an operation between the following incompatible types: ' + Object.keys(types).join(', '))
    //return fn(...args)
  }

  const unitmath = UnitMath.config({
    parentheses: true,
    type: {
      clone: clone,
      conv: conv,
      add: (a, b) => promoteArgs(add, a, b),
      sub: (a, b) => promoteArgs(subtract, a, b),
      mul: (a, b) => promoteArgs(multiply, a, b),
      div: (a, b) => promoteArgs(divide, a, b),
      pow: (a, b) => promoteArgs(pow, a, b),
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
