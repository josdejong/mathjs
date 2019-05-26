import { clone, mapObject, deepExtend } from '../../utils/object'
import { DEFAULT_CONFIG } from '../config'

export const MATRIX_OPTIONS = ['Matrix', 'Array'] // valid values for option matrix
export const NUMBER_OPTIONS = ['number', 'BigNumber', 'Fraction'] // valid values for option number

export function configFactory (config, emit) {
  /**
   * Set configuration options for math.js, and get current options.
   * Will emit a 'config' event, with arguments (curr, prev, changes).
   *
   * This function is only available on a mathjs instance created using `create`.
   *
   * Syntax:
   *
   *     math.config(config: Object): Object
   *
   * Examples:
   *
   *
   *     import { create, all } from 'mathjs'
   *
   *     // create a mathjs instance
   *     const math = create(all)
   *
   *     math.config().number                // outputs 'number'
   *     math.evaluate('0.4')                // outputs number 0.4
   *     math.config({number: 'Fraction'})
   *     math.evaluate('0.4')                // outputs Fraction 2/5
   *
   * @param {Object} [options] Available options:
   *                            {number} epsilon
   *                              Minimum relative difference between two
   *                              compared values, used by all comparison functions.
   *                            {string} matrix
   *                              A string 'Matrix' (default) or 'Array'.
   *                            {string} number
   *                              A string 'number' (default), 'BigNumber', or 'Fraction'
   *                            {number} precision
   *                              The number of significant digits for BigNumbers.
   *                              Not applicable for Numbers.
   *                            {string} parenthesis
   *                              How to display parentheses in LaTeX and string
   *                              output.
   *                            {string} randomSeed
   *                              Random seed for seeded pseudo random number generator.
   *                              Set to null to randomly seed.
   * @return {Object} Returns the current configuration
   */
  function _config (options) {
    if (options) {
      const prev = mapObject(config, clone)

      // validate some of the options
      validateOption(options, 'matrix', MATRIX_OPTIONS)
      validateOption(options, 'number', NUMBER_OPTIONS)

      // merge options
      deepExtend(config, options)

      const curr = mapObject(config, clone)

      const changes = mapObject(options, clone)

      // emit 'config' event
      emit('config', curr, prev, changes)

      return curr
    } else {
      return mapObject(config, clone)
    }
  }

  // attach the valid options to the function so they can be extended
  _config.MATRIX_OPTIONS = MATRIX_OPTIONS
  _config.NUMBER_OPTIONS = NUMBER_OPTIONS

  // attach the config properties as readonly properties to the config function
  Object.keys(DEFAULT_CONFIG).forEach(key => {
    Object.defineProperty(_config, key, {
      get: () => config[key],
      enumerable: true,
      configurable: true
    })
  })

  return _config
}

/**
 * Test whether an Array contains a specific item.
 * @param {Array.<string>} array
 * @param {string} item
 * @return {boolean}
 */
function contains (array, item) {
  return array.indexOf(item) !== -1
}

/**
 * Find a string in an array. Case insensitive search
 * @param {Array.<string>} array
 * @param {string} item
 * @return {number} Returns the index when found. Returns -1 when not found
 */
function findIndex (array, item) {
  return array
    .map(function (i) {
      return i.toLowerCase()
    })
    .indexOf(item.toLowerCase())
}

/**
 * Validate an option
 * @param {Object} options         Object with options
 * @param {string} name            Name of the option to validate
 * @param {Array.<string>} values  Array with valid values for this option
 */
function validateOption (options, name, values) {
  if (options[name] !== undefined && !contains(values, options[name])) {
    const index = findIndex(values, options[name])
    if (index !== -1) {
      // right value, wrong casing
      // TODO: lower case values are deprecated since v3, remove this warning some day.
      console.warn('Warning: Wrong casing for configuration option "' + name + '", should be "' + values[index] + '" instead of "' + options[name] + '".')

      options[name] = values[index] // change the option to the right casing
    } else {
      // unknown value
      console.warn('Warning: Unknown value "' + options[name] + '" for configuration option "' + name + '". Available options: ' + values.map(JSON.stringify).join(', ') + '.')
    }
  }
}
