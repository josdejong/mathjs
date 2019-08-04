import * as UnitMath from 'unitmath'
import { factory } from '../../../utils/factory'
import { deepMap } from '../../../utils/collection'
// TODO: Should we import this another way, in case the bundle does not include bignumber?
import { createBigNumberPi as createPi } from '../../../utils/bignumber/constants'

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
  'round',
  'fix',
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
  round,
  fix,
  format,
  isComplex,
  isBigNumber,
  isFraction,
  BigNumber,
  Complex,
  Fraction

}) => {

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

  
  /**
   * Create an instance of unitmath using the currrent math.config options
   */
  function createUnitmathInstance() {
    console.log('In createUnitmathInstance, config.number = ' + config.number + config.precision)
    // Override certain units to give higher precision if config.number is BigNumber
    let overrideUnits = {}

    if (config.number === 'BigNumber') {
      console.log("Calling createPi")
      const pi = createPi(BigNumber)
      console.log("Pi is: ")
      console.log(pi.toString())
      console.log("pi / 180 = ")
      console.log(pi.div(180).toString())    // This is correct so far
      Object.assign(overrideUnits, {
        deg: {
          value: [pi.div(180), 'rad'],
          aliases: ['degree', 'degrees']
        },
        grad: {
          prefixes: 'SHORT',
          commonPrefixes: ['c'],
          value: [pi.div(200), 'rad']
        },
        gradian: {
          prefixes: 'LONG',
          commonPrefixes: ['centi', ''],
          value: [pi.div(200), 'rad'],
          aliases: ['gradians']
        },
        cycle: {
          value: [pi.times(2), 'rad'],
          aliases: ['cycles']
        },
        arcmin: {
          value: [pi.div(10800), 'rad'],
          aliases: ['arcminute', 'arcminutes']
        },
        arcsec: {
          value: [pi.div(648000), 'rad'],
          aliases: ['arcsecond', 'arcseconds']
        }
      })
    }

    // TODO: Should this be unitmath.config instead, to keep old configs? Or does it not matter?
    if(overrideUnits.deg) {
      console.log("Providing this value to UnitMath.config:")
      console.log(overrideUnits.deg.value.toString())
    }

    let retUnit = UnitMath.config({
      parentheses: true,
      simplifyThreshold: 1,
      definitions: { units: overrideUnits },
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
        round: round,
        trunc: fix,
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

    console.log("Checking to make sure value is correct:")
    console.log(retUnit.definitions().units.deg.value.toString())

    console.log("Double-checking to make sure value is correct:")
    console.log(retUnit._unitStore.defs.units.deg.value.toString())    // Yes it is correct so far

    return retUnit

  }

  // TODO: After getting it to work like this, see if we can get rid of this devilry
  let _unitmath = createUnitmathInstance()
  const unitmath = () => _unitmath

  // TODO: think the way to check whether something is a unit through. Must be secure (checks against the prototype)
  // TODO: Have to repeat this in createUnitInstance?
  const u = unitmath()()
  u.constructor.prototype.isUnit = true
  u.constructor.prototype.type = 'unit'

  // TODO: is listening for config changes still needed?
  if (on) {
    // recalculate the values on change of configuration
    on('config', function (curr, prev) {

      // Relevant config properties that may change: what needs to be done
      // number: nothing, the new type is used automatically anywhere config.number appears

      console.log('Configuration changed.')
      console.log('prev:')
      console.log(prev)
      console.log('curr:')
      console.log(curr)
      if (curr.number !== prev.number || curr.precision !== prev.precision) {
        // TODO: do we need to recalculate angle values like before?
        console.log("calling createUnitmathInstance")
        _unitmath = createUnitmathInstance()
        
        console.log('New unitmath definitions after returning from createUnitmathInstance:')
        console.log(unitmath().definitions().units.deg.value.toString())
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

    'string': (...args) => unitmath()(...args),

    'number, string': function (...args) {
      // Upgrade number to configured type
      args[0] = numeric(args[0], config.number)
      let u = unitmath()(...args)
      return u
    },

    'BigNumber | Fraction | Complex, string': function (...args) {
      let u = unitmath()(...args)
      return u
    },

    'Array | Matrix': function (x) {
      return deepMap(x, unit)
    }
  })

  // expose static exists function
  unit.exists = (singleUnitString) => unitmath().exists(singleUnitString)

  /**
   * createUnit
   * @param {Object} obj The unit definitions
   * @param {Object} options Options
   * @returns {unit} The new unit
   */
  unit.createUnit = (obj, options) => {
    console.log('createUnit was called with')
    console.log(obj)
    console.log(options)

    /**
     * Here we have a lot of work to do:
     * 1. Convert the definitions in obj to a form UnitMath understands
     * 2. Throw errors if any units already exist (except if options.override is given)
     * 3. Make sure custom units created previously are included
     * 4. Call createUnitmathInstance, passing in both the new and old custom units
     **/
    
  }

  unit.unitmath = unitmath
  
  return unit
})
