import { clone, deepExtend } from '../../utils/object.js'
import { DEFAULT_CONFIG, ALLOWED_CONFIG } from '../config.js'

// object of options that are deprecated or discontinued, possibly with
// a synonymous current option.
const REMAP_CONFIG = {
  epsilon: [
    'discontinued',
    'compute.defaultRelTol and/or compute.defaultAbsTol'
  ],
  relTol: ['deprecated', ['compute', 'defaultRelTol']],
  absTol: ['deprecated', ['compute', 'defaultAbsTol']],
  matrix: ['deprecated', ['compute', 'Matrix', 'defaultType']],
  numberFallback: ['deprecated', ['parse', 'numberFallback']],
  precision: ['deprecated', ['compute', 'BigNumber', 'precision']],
  predictable: ['deprecated', ['compute', 'uniformType']],
  randomSeed: ['deprecated', ['compute', 'randomSeed']],
  legacySubset: ['deprecated', ['compatibility', 'subset']],
  compatibility: {
    subset: 'deprecated'
  }
}

export function configFactory (config, emit) {
  /**
   * Set configuration options for math.js, and get current options.
   * Will emit a 'config' event, with arguments (curr, prev, changes).
   *
   * This function is only available on a mathjs instance created using `create`.
   *
   * Syntax:
   *
   *     math.config()
   *     math.config(config)
   *
   * Where:
   *
   * The argument `config` is a plain object specifying new configuration
   * options that this instance should use. Available options:
   * <Insert config options from docs/core/configuration.md here>
   * The `config` function returns an object reporting the values of all
   * configuration options after the new ones, if any, have been set.
   *
   * Examples:
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
   * @param {Object} [options] Configuration options to be set
   * @return {Object} Returns the current configuration
   */
  function _config (options) {
    if (!options) return clone(config)
    // The following modernize call always clones options
    options = modernizeOptions(options, REMAP_CONFIG)
    // Special case for backward compatibility:
    if (options.number === 'BigNumber' &&
        !options.compute?.numberApproximate &&
        config.number === 'number' &&
        config.compute.numberApproximate === 'number'
    ) {
      console.warn(
        'For backward compatibility, copying number option setting of ' +
        `'${options.number}' to compute.numberApproximate. To avoid this ` +
        'warning, set compute.numberApproximate explicitly.'
      )
      if (!options.compute) options.compute = {}
      options.compute.numberApproximate = options.number
    }
    validateOptions(options, ALLOWED_CONFIG)
    const prev = clone(config)
    deepExtend(config, options) // merge options
    const curr = clone(config)
    emit('config', curr, prev, options)
    return curr
  }

  // attach the valid options to the function so they can be extended
  _config.ALLOWED_CONFIG = ALLOWED_CONFIG

  // attach the config properties as readonly properties to the config function
  Object.keys(DEFAULT_CONFIG).forEach(key => {
    Object.defineProperty(_config, key, {
      get: () => {
        const res = config[key]
        if (typeof res !== 'object') return res
        return Object.freeze(clone(res))
      },
      enumerable: true,
      configurable: true
    })
  })

  return _config
}

/**
 * Translate options to current synonyms and warn about
 * discontinued options. Throws on discontinued options.
 * @param {Object} options      Object with options
 * @param {Object} remapping    Object specifying remapping
 * @param {Function} warn       Function to call with warnings
 * @param {Array} path          the nested path being processed
 * @param {Object} base         where to put remapped options
 * @returns {Object}  a clone of options with modified parameters if necessary
 */
export function modernizeOptions ( // exported solely for testing
  options, remapping, warn = console.warn, path = [], base = clone(options)
) {
  for (const key in remapping) {
    if (!Object.prototype.hasOwnProperty.call(remapping, key)) continue
    const newPath = [...path, key]
    if (key in options) {
      let state = 'normal'
      let translations = []
      if (typeof remapping[key] === 'string') {
        state = remapping[key]
      } else if (Array.isArray(remapping[key])) {
        state = remapping[key][0]
        translations = remapping[key].slice(1)
      } else { // subobject remapping
        const adjusted = modernizeOptions(
          options[key], remapping[key], warn, newPath, base)
        if (Object.keys(adjusted).length === 0) {
          delete objectAt(base, path)[key]
        }
        continue
      }
      if (state === 'discontinued') {
        throw new Error(
          `attempt to set discontinued config option '${newPath.join('.')}' ` +
          `use '${translations}' instead.`)
      } else if (state === 'deprecated') {
        if (translations.length > 0) {
          warn(
            `Translating deprecated config option '${newPath.join('.')}' ` +
            'to its equivalent ' +
            `'${translations.map(tran => tran.join('.')).join("' and '")}'.`)
        } else {
          if (options[key]) {
            warn(`Setting deprecated config option '${newPath.join('.')}'.`)
          }
        }
      }
      if (translations.length > 0) {
        for (const translation of translations) {
          const tPathLen = translation.length - 1
          const tPath = translation.slice(0, tPathLen)
          const tKey = translation[tPathLen]
          objectAt(base, tPath)[tKey] = options[key]
        }
        delete objectAt(base, path)[key]
      }
    }
  }
  return objectAt(base, path)
}

/**
 * Returns a subobject at a path of successive keys
 * @param {Object} base     any object
 * @param {Array} path      Array of successive keys
 * @returns base[path[0]][path[1]]...
 */
function objectAt (base, path) {
  if (path.length === 0) return base
  const key = path[0]
  if (!(key in base)) base[key] = {}
  if (path.length === 1) return base[key]
  return objectAt(base[key], path.slice(1))
}

/**
 * Validate options. A guard is either a list of allowed values or a boolean
 * predicate on values.
 * @param {Object} options         Object with options
 * @param {Object} guards          Object with guards
 * @param {Array}  path            used only in recursive calls to track path
 */
function validateOptions (options, guards, path = []) {
  for (const key in options) {
    if (!Object.prototype.hasOwnProperty.call(options, key)) continue
    const newPath = [...path, key]
    if (!(key in guards)) {
      // TODO: Should this be an error?
      console.warn(
        `No validation guards for ${newPath.join('.')} in config options;` +
        'are you trying to set an unrecognized option?')
      continue
    }
    // Special case: don't descend into randomSeed,
    // because the intended value might be an object :/
    if (key !== 'randomSeed' &&
        !Array.isArray(options[key]) &&
        typeof options[key] === 'object'
    ) {
      validateOptions(options[key], guards[key], newPath)
    } else {
      if (Array.isArray(guards[key])) {
        if (!guards[key].includes(options[key])) {
          throw new Error(
            `Attempt to set config option ${newPath.join('.')} to ` +
            `'${options[key]}', not in allowed values ${guards[key]}.`)
        }
      } else {
        if (!guards[key](options[key])) {
          throw new Error(
            `Attempt to set config option ${newPath.join('.')} to ` +
            `'${options[key]}', not satisfying: ${guards[key].name}.`)
        }
      }
    }
  }
}
