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
  'format',
  'isComplex',
  'isBigNumber',
  'isFraction',
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
  format,
  isComplex,
  isBigNumber,
  isFraction,
  BigNumber,
  Complex,
  Fraction

}) => {
  // TODO: allow passing configuration for unitmath

  const conv = (value, exampleValue) => {
    // console.log(value, exampleValue, config.number)
    if (isComplex(exampleValue)) {
      return Complex(value, 0)
    } else if (isBigNumber(exampleValue)) {
      return numeric(value, 'BigNumber')
    } else if (isFraction(exampleValue)) {
      return numeric(value, 'Fraction')
    } else if (typeof value === 'string') {
      return numeric(value, config.number)
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

    let result

    if (numTypes === 1) {
      // No alteration is necessary
      result = fn(...args)
    } else if (numTypes === 2) {
      // May need to convert one or more of the arguments
      if (types.hasOwnProperty('number')) {
        if (types.hasOwnProperty('Complex')) {
          // Convert all args to Complex
          result = fn(...args.map(a => typeof a === 'number' ? new Complex(a, 0) : a))
        } else if (types.hasOwnProperty('Fraction')) {
          // Convert all args to Fraction
          result = fn(...args.map(a => typeof a === 'number' ? new Fraction(a) : a))
        } else if (types.hasOwnProperty('BigNumber')) {
          // Convert all args to BigNumber
          result = fn(...args.map(a => typeof a === 'number' ? new BigNumber(a) : a))
        }
      }
    }

    // All valid code paths would have set result by now
    if (typeof result === 'undefined') {
      // Throw this error when debugging, or for more consistent error messages, call fn(...args) anyway and let typed.js throw
      throw new Error('unit.js attempted to perform an operation between the following incompatible types: ' + Object.keys(types).join(', '))
      //return fn(...args)
    }

    // TODO: If { predictable: false } and result is unitless, convert result to its numeric value
    return result
  }

  // Converts a comparison function into one that compares the absolute values of complex numbers instead
  const ifComplexThenAbs = (fn) => {
    return (a, b) => {
      let aAbs = a.type === 'Complex' ? abs(a) : a
      let bAbs = b.type === 'Complex' ? abs(b) : b
      return fn(aAbs, bAbs)
    }
  }


  const unitmath = UnitMath.config({
    parentheses: true,
    simplifyThreshold: 1,
    type: {
      clone: clone,
      conv: conv,
      add: (a, b) => promoteArgs(add, a, b),
      sub: (a, b) => promoteArgs(subtract, a, b),
      mul: (a, b) => promoteArgs(multiply, a, b),
      div: (a, b) => promoteArgs(divide, a, b),
      pow: (a, b) => promoteArgs(pow, a, b),
      eq: (a, b) => promoteArgs(equal, a, b),
      lt: (a, b) => promoteArgs(ifComplexThenAbs(smaller), a, b),
      le: (a, b) => promoteArgs(ifComplexThenAbs(smallerEq), a, b),
      gt: (a, b) => promoteArgs(ifComplexThenAbs(larger), a, b),
      ge: (a, b) => promoteArgs(ifComplexThenAbs(largerEq), a, b),
      abs: abs,
      format: (a, b) => {
        let result
        if (typeof b !== 'undefined') {
          result = format(a, b)
        } else {
          result = format(a)
        }

        if (a && isComplex(a)) {
          result = '(' + result + ')' // Surround complex values with ( ) to enable better parsing
        }

        return result
      }
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
