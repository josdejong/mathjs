import typedFunction from 'typed-function'
import { ArgumentsError } from '../error/ArgumentsError.js'
import { DimensionError } from '../error/DimensionError.js'
import { IndexError } from '../error/IndexError.js'
import { factory, isFactory } from '../utils/factory.js'
import {
  isAccessorNode,
  isArray,
  isArrayNode,
  isAssignmentNode,
  isBigInt,
  isBigNumber,
  isBlockNode,
  isBoolean,
  isChain,
  isCollection,
  isComplex,
  isConditionalNode,
  isConstantNode,
  isDate,
  isDenseMatrix,
  isFraction,
  isFunction,
  isFunctionAssignmentNode,
  isFunctionNode,
  isHelp,
  isIndex,
  isIndexNode,
  isMap,
  isMatrix,
  isNode,
  isNull,
  isNumber,
  isObject,
  isObjectNode,
  isObjectWrappingMap,
  isOperatorNode,
  isParenthesisNode,
  isPartitionedMap,
  isRange,
  isRangeNode,
  isRegExp,
  isRelationalNode,
  isResultSet,
  isSparseMatrix,
  isString,
  isSymbolNode,
  isUndefined,
  isUnit
} from '../utils/is.js'
import { deepFlatten, isLegacyFactory } from '../utils/object.js'
import * as emitter from './../utils/emitter.js'
import { DEFAULT_CONFIG } from './config.js'
import { configFactory } from './function/config.js'
import { importFactory } from './function/import.js'

/**
 * Create a mathjs instance from given factory functions and optionally config
 *
 * Usage:
 *
 *     const mathjs1 = create({ createAdd, createMultiply, ...})
 *     const config = { number: 'BigNumber' }
 *     const mathjs2 = create(all, config)
 *
 * @param {Object} [factories] An object with factory functions
 *                             The object can contain nested objects,
 *                             all nested objects will be flattened.
 * @param {Object} [config]    Available options:
 *                            {number} relTol
 *                              Minimum relative difference between two
 *                              compared values, used by all comparison functions.
 *                            {number} absTol
 *                              Minimum absolute difference between two
 *                              compared values, used by all comparison functions.
 *                            {string} matrix
 *                              A string 'Matrix' (default) or 'Array'.
 *                            {string} number
 *                              A string 'number' (default), 'BigNumber', or 'Fraction'
 *                            {number} precision
 *                              The number of significant digits for BigNumbers.
 *                              Not applicable for Numbers.
 *                            {boolean} predictable
 *                              Predictable output type of functions. When true,
 *                              output type depends only on the input types. When
 *                              false (default), output type can vary depending
 *                              on input values. For example `math.sqrt(-4)`
 *                              returns `complex('2i')` when predictable is false, and
 *                              returns `NaN` when true.
 *                            {string} randomSeed
 *                              Random seed for seeded pseudo random number generator.
 *                              Set to null to randomly seed.
 * @returns {Object} Returns a bare-bone math.js instance containing
 *                   functions:
 *                   - `import` to add new functions
 *                   - `config` to change configuration
 *                   - `on`, `off`, `once`, `emit` for events
 */
export function create (factories, config) {
  const configInternal = Object.assign({}, DEFAULT_CONFIG, config)

  // simple test for ES5 support
  if (typeof Object.create !== 'function') {
    throw new Error('ES5 not supported by this JavaScript engine. ' +
      'Please load the es5-shim and es5-sham library for compatibility.')
  }

  // create the mathjs instance
  const math = emitter.mixin({
    // only here for backward compatibility for legacy factory functions
    isNumber,
    isComplex,
    isBigNumber,
    isBigInt,
    isFraction,
    isUnit,
    isString,
    isArray,
    isMatrix,
    isCollection,
    isDenseMatrix,
    isSparseMatrix,
    isRange,
    isIndex,
    isBoolean,
    isResultSet,
    isHelp,
    isFunction,
    isDate,
    isRegExp,
    isObject,
    isMap,
    isPartitionedMap,
    isObjectWrappingMap,
    isNull,
    isUndefined,

    isAccessorNode,
    isArrayNode,
    isAssignmentNode,
    isBlockNode,
    isConditionalNode,
    isConstantNode,
    isFunctionAssignmentNode,
    isFunctionNode,
    isIndexNode,
    isNode,
    isObjectNode,
    isOperatorNode,
    isParenthesisNode,
    isRangeNode,
    isRelationalNode,
    isSymbolNode,

    isChain
  })

  // load config function and apply provided config
  math.config = configFactory(configInternal, math.emit)

  math.expression = {
    transform: {},
    mathWithTransform: {
      config: math.config
    }
  }

  // cached factories and instances used by function load
  const legacyFactories = []
  const legacyInstances = []

  /**
   * Load a function or data type from a factory.
   * If the function or data type already exists, the existing instance is
   * returned.
   * @param {Function} factory
   * @returns {*}
   */
  function load (factory) {
    if (isFactory(factory)) {
      return factory(math)
    }

    const firstProperty = factory[Object.keys(factory)[0]]
    if (isFactory(firstProperty)) {
      return firstProperty(math)
    }

    if (!isLegacyFactory(factory)) {
      console.warn('Factory object with properties `type`, `name`, and `factory` expected', factory)
      throw new Error('Factory object with properties `type`, `name`, and `factory` expected')
    }

    const index = legacyFactories.indexOf(factory)
    let instance
    if (index === -1) {
      // doesn't yet exist
      if (factory.math === true) {
        // pass with math namespace
        instance = factory.factory(math.type, configInternal, load, math.typed, math)
      } else {
        instance = factory.factory(math.type, configInternal, load, math.typed)
      }

      // append to the cache
      legacyFactories.push(factory)
      legacyInstances.push(instance)
    } else {
      // already existing function, return the cached instance
      instance = legacyInstances[index]
    }

    return instance
  }

  const importedFactories = {}

  // load the import function
  function lazyTyped (...args) {
    return math.typed.apply(math.typed, args)
  }
  lazyTyped.isTypedFunction = typedFunction.isTypedFunction

  const internalImport = importFactory(lazyTyped, load, math, importedFactories)
  math.import = internalImport

  // listen for changes in config, import all functions again when changed
  // TODO: move this listener into the import function?
  math.on('config', () => {
    Object.values(importedFactories).forEach(factory => {
      if (factory && factory.meta && factory.meta.recreateOnConfigChange) {
        // FIXME: only re-create when the current instance is the same as was initially created
        // FIXME: delete the functions/constants before importing them again?
        internalImport(factory, { override: true })
      }
    })
  })

  // the create function exposed on the mathjs instance is bound to
  // the factory functions passed before
  math.create = create.bind(null, factories)

  // export factory function
  math.factory = factory

  // import the factory functions like createAdd as an array instead of object,
  // else they will get a different naming (`createAdd` instead of `add`).
  math.import(Object.values(deepFlatten(factories)))

  math.ArgumentsError = ArgumentsError
  math.DimensionError = DimensionError
  math.IndexError = IndexError

  return math
}
