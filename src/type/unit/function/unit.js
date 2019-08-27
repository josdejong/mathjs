import * as UnitMath from 'unitmath'
import { factory } from '../../../utils/factory'
import { deepMap } from '../../../utils/collection'
// TODO: Should we import this another way, in case the bundle does not include bignumber?
import { createBigNumberPi as createPi } from '../../../utils/bignumber/constants'
import { warnOnce } from '../../../utils/log';

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

  /**
   * Stateful record of all custom units we've created.
   * Each time we call createUnitmathInstance, each of these
   * units will need to be recreated. If math.create is called,
   * they will be reset.
   */
  let customUnits = {}
  let customBaseQuantities = []

  /**
   * Converts the given `value` to the type that matches `exampleValue`.
   * @param {number|BigNumber|Fraction|Complex|string} value The value to convert.
   * @param {number|BigNumber|Fraction|Complex} exampleValue An example value having the type that `value` will be converted to. If `exampleValue` is not a Complex, BigNumber, or Fraction, and `value` is a string, then `value` will be converted to the type given by `config.number`.
   * @returns The converted value.
   */
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

  /**
   * Given a function `fn`, and arguments `args`, will promote each of the `args` to match the highest type of all of the `args`. It will then call the function `fn` with the promoted `args`. For example, if `fn` is the add function, and `args` is a number and a BigNumber, the number will be promoted to a BigNumber, and then `add` will be called with the two BigNumbers.
   * @param {Function} fn The function to call.
   * @param  {...any} args Arguments to promote before passing to the function.
   * @returns The result of calling `fn` with the promoted arguments.
   */
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

  /**
   * Given a function that compares two numeric values, this will return a new comparison function that compares the absolute values of those numeric values if they are of type Complex, or otherwise leaves them unchanged.
   * @param {Function} fn 
   * @returns The result of comparing the two numbers.
   */
  const ifComplexThenAbs = (fn) => {
    return (a, b) => {
      let aAbs = a.type === 'Complex' ? abs(a) : a
      let bAbs = b.type === 'Complex' ? abs(b) : b
      return fn(aAbs, bAbs)
    }
  }

  /**
   * Create an instance of unitmath using the currrent math.config options and customUnits
   */
  function createUnitmathInstance() {
    // console.log('In createUnitmathInstance, config.number = ' + config.number + config.precision)
    // Override certain units to give higher precision if config.number is BigNumber
    let overrideUnits = {}

    if (config.number === 'BigNumber') {
      // console.log("Calling createPi")
      const pi = createPi(BigNumber)
      // console.log("Pi is: ")
      // console.log(pi.toString())
      // console.log("pi / 180 = ")
      // console.log(pi.div(180).toString())    // This is correct so far
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

    if (overrideUnits.deg) {
      // console.log("Providing this value to UnitMath.config:")
      // console.log(overrideUnits.deg.value.toString())
    }

    Object.assign(overrideUnits, customUnits)

    // TODO: Should this be unitmath.config instead, to keep old configs? Or does it not matter?
    // UPDATE: Probably does not matter. We are saving state in config and customUnits.
    let retUnit = UnitMath.config({
      parentheses: true,
      simplifyThreshold: 1,
      definitions: { units: overrideUnits, baseQuantities: customBaseQuantities },
      system: config.unitSystem,
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

    // console.log("Checking to make sure value is correct:")
    // console.log(retUnit.definitions().units.deg.value.toString())

    // console.log("Double-checking to make sure value is correct:")
    // console.log(retUnit._unitStore.defs.units.deg.value.toString())    // Yes it is correct so far

    // TODO: think the way to check whether something is a unit through. Must be secure (checks against the prototype)
    const u = retUnit()
    u.constructor.prototype.isUnit = true
    u.constructor.prototype.type = 'unit'

    /**
     * Get a JSON representation of the unit
     * @memberof Unit
     * @returns {Object} Returns a JSON object structured as:
     *                   `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixed": false}`
     */
    u.constructor.prototype.toJSON = function () {
      let asJSON = {
        mathjs: 'unit',
        value: this.getValue(),
        unit: this.getUnits().format()
      }
      if (this.fixed) {
        asJSON.fixed = this.fixed
      }
      // console.log('asJSON:')
      // console.log(asJSON)
      return asJSON
    }

    return retUnit

  }

  /**
   * This represents the current unitmath instance. Both changes to the config, as well as creating new units, require a new instance to be created. But the containing factory function is only called once (or whenever math.create is called) So use unitmath() to return the current instance, and take care to avoid using stale instances.
   */
  // TODO: Is it necessary to have unitmath() return _unitmath or can we just use _unitmath everywhere? Is there any way to prevent using stale versions of _unitmath? Can we have createUnitmathInstance just set _unitmath instead of having to assign to it each time we call createUnitmathInstance?
  let _unitmath = createUnitmathInstance()
  const unitmath = () => _unitmath


  if (on) {
    // recalculate the values on change of configuration
    on('config', function (curr, prev) {

      // Relevant config properties that may change, and what needs to be done about it
      // number: Will have to createUnitmathInstance because the angle definitions might change.
      // precision: Will have to createUnitmathInstance because the angle definitions might change.

      // console.log('Configuration changed.')
      // console.log('prev:')
      // console.log(prev)
      // console.log('curr:')
      // console.log(curr)
      if (curr.number !== prev.number
        || curr.precision !== prev.precision
        || curr.unitSystem !== prev.unitSystem) {
        // console.log("calling createUnitmathInstance")
        _unitmath = createUnitmathInstance()

        // console.log('New unitmath definitions after returning from createUnitmathInstance:')
        // console.log(unitmath().definitions().units.deg.value.toString())
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
   * createUnitSingle
   * Shortcut method for creating a single unit. Mostly here for backwards-compatibility.
   * @param {string} newUnitName The name of the new unit.
   * @param {object|string} definition The definition of the new unit.
   */
  unit.createUnitSingle = (newUnitName, definition, options) => {
    if (typeof newUnitName !== 'string') {
      throw new TypeError('The first parameter to createUnitSingle must be a string.')
    }

    let obj = { [newUnitName]: definition || {} }
    // console.log('in createUnitSingle, obj = ')
    // console.log(obj)
    return unit.createUnit(obj, options)
  }

  /**
   * createUnit
   * @param {Object} obj The unit definitions
   * @param {Object} options Options
   * @returns {unit} The new unit
   */
  unit.createUnit = (obj, options) => {
    // console.log('createUnit was called with')
    // console.log(obj)
    // console.log(options)

    let backupCustomUnits = Object.assign({}, customUnits)
    let backupBaseQuantities = customBaseQuantities.slice()


    if (typeof obj !== 'object') {
      throw new TypeError('The first parameter to createUnit must be an object.')
    }

    /**
     * Here we have a lot of work to do:
     * 1. Convert the definitions in obj to a form UnitMath understands
     * 2. Throw errors if any units already exist (except if options.override is given)
     * 3. Make sure custom units created previously are included
     * 4. Call createUnitmathInstance, passing in both the new and old custom units
     */

    if (!(options && options.override)) {
      for (let newUnit in obj) {
        if (unitmath().exists(newUnit)) {
          throw new Error(`Cannot create unit "${newUnit}": a unit with that name already exists. To override, use { override: true }`)
        }
        let aliases = obj[newUnit].aliases
        if (aliases) {
          aliases = aliases.valueOf() // aliases could be a Matrix, so convert to Array
          for (let i = 0; i < aliases.length; i++) {
            let newAlias = aliases[i]
            if (unitmath().exists(newAlias)) {
              throw new Error(`Cannot create unit "${newAlias}": a unit with that name already exists. To override, use { override: true }`)
            }
          }
        }
      }
    }

    for (let newUnit in obj) {

      customUnits[newUnit] = {}
      for (let i = customBaseQuantities.length - 1; i >= 0; i--) {
        if (customBaseQuantities[i] === newUnit + "_STUFF") {
          customBaseQuantities.splice(i, 1)
        }
      }


      // Copy the unit's definition
      let value
      if (typeof obj[newUnit] === 'string' && obj[newUnit] !== '') {
        value = obj[newUnit]
      }
      else if (obj[newUnit].type === 'Unit') {
        value = obj[newUnit]
      }
      else if (obj[newUnit].definition) {
        value = obj[newUnit].definition
      }

      if (value) {
        // Derived unit

        // If value is a unit, convert it to [value, unitStr]
        if (value.type === 'Unit') {
          value = [
            value.getValue(),
            value.getUnits().toString()
          ]
        }


        customUnits[newUnit].value = value
        if (obj[newUnit].aliases) {
          customUnits[newUnit].aliases = obj[newUnit].aliases.valueOf() // aliases could be a Matrix, so convert to Array
        }
        if (obj[newUnit].prefixes) {
          customUnits[newUnit].prefixes = obj[newUnit].prefixes.toUpperCase()
        }
        if (obj[newUnit].offset) {
          customUnits[newUnit].offset = obj[newUnit].offset
        }
        if (obj[newUnit].commonPrefixes) {
          customUnits[newUnit].commonPrefixes = obj[newUnit].commonPrefixes
        } else if (customUnits[newUnit].prefixes) {
          // No commonPrefixes given, so defaulting to all allowed prefixes
          let commonPrefixes = unitmath().definitions().prefixes[customUnits[newUnit].prefixes]
          if (commonPrefixes) {
            customUnits[newUnit].commonPrefixes = Object.keys(commonPrefixes)
          }
        }
      }
      else {
        // Base unit
        customBaseQuantities.push(newUnit + "_STUFF")
        customUnits[newUnit] = {
          value: '1',
          quantity: newUnit + "_STUFF"
        }
      }

    }

    // console.log('customUnits is now:')
    // console.log(customUnits)
    // console.log('customBaseQuantities is now:')
    // console.log(customBaseQuantities)


    try {
      _unitmath = createUnitmathInstance()
    }
    catch (ex) {
      // Roll back customUnits and customBaseQuantities
      // console.log('Rolling back custom units')
      // console.log(backupCustomUnits)
      // console.log(backupBaseQuantities)
      customUnits = backupCustomUnits
      customBaseQuantities = backupBaseQuantities
      throw new Error('createUnit failed with error: ' + ex.message)
    }


  }

  unit.setUnitSystem = function () {
    throw new Error('Cannot call setUnitSystem directly. Please use math.create({ unitSystem: ... }) instead.')
  }

  /**
   * Instantiate a Unit from a JSON object
   * @memberof Unit
   * @param {Object} json  A JSON object structured as:
   *                       `{"mathjs": "Unit", "value": 2, "unit": "cm", "fixed": false}`
   * @return {Unit}
   */
  unit.fromJSON = function (json) {
    // console.log(json)
    let unit = unitmath()(json.value, json.unit.replace(/[\(\)]/g, ''))
    if (json.fixed)
      unit = unit.to()
    return unit
  }

  unit.unitmath = unitmath

  return unit
})
