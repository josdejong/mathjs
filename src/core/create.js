import './../utils/polyfills'
import { deepFlatten, isLegacyFactory, lazy, traverse, values } from './../utils/object'
import * as emitter from './../utils/emitter'
import { importFactory } from './function/import'
import { configFactory } from './function/config'
import { factory, isFactory } from '../utils/factory'
import {
  isAccessorNode,
  isArray,
  isArrayNode,
  isAssignmentNode,
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
  isMatrix,
  isNode,
  isNull,
  isNumber,
  isObject,
  isObjectNode,
  isOperatorNode,
  isParenthesisNode,
  isRange,
  isRangeNode,
  isRegExp,
  isResultSet,
  isSparseMatrix,
  isString,
  isSymbolNode,
  isUndefined,
  isUnit
} from '../utils/is'
import { initial, last } from '../utils/array'
import { warnOnce } from '../utils/log'
import { ArgumentsError } from '../error/ArgumentsError'
import { DimensionError } from '../error/DimensionError'
import { IndexError } from '../error/IndexError'
import { DEFAULT_CONFIG } from './config'

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
  const internalImport = importFactory(lazyTyped, load, math, importedFactories)
  math.import = internalImport

  // listen for changes in config, import all functions again when changed
  // TODO: move this listener into the import function?
  math.on('config', () => {
    values(importedFactories).forEach(factory => {
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
  math.import(values(deepFlatten(factories)))

  // TODO: deprecated since v6.0.0. Clean up some day
  const movedNames = [
    'type.isNumber',
    'type.isComplex',
    'type.isBigNumber',
    'type.isFraction',
    'type.isUnit',
    'type.isString',
    'type.isArray',
    'type.isMatrix',
    'type.isDenseMatrix',
    'type.isSparseMatrix',
    'type.isCollection',
    'type.isRange',
    'type.isIndex',
    'type.isBoolean',
    'type.isResultSet',
    'type.isHelp',
    'type.isFunction',
    'type.isDate',
    'type.isRegExp',
    'type.isObject',
    'type.isNull',
    'type.isUndefined',
    'type.isAccessorNode',
    'type.isArrayNode',
    'type.isAssignmentNode',
    'type.isBlockNode',
    'type.isConditionalNode',
    'type.isConstantNode',
    'type.isFunctionAssignmentNode',
    'type.isFunctionNode',
    'type.isIndexNode',
    'type.isNode',
    'type.isObjectNode',
    'type.isOperatorNode',
    'type.isParenthesisNode',
    'type.isRangeNode',
    'type.isSymbolNode',
    'type.isChain',
    'type.BigNumber',
    'type.Chain',
    'type.Complex',
    'type.Fraction',
    'type.Matrix',
    'type.DenseMatrix',
    'type.SparseMatrix',
    'type.Spa',
    'type.FibonacciHeap',
    'type.ImmutableDenseMatrix',
    'type.Index',
    'type.Range',
    'type.ResultSet',
    'type.Unit',
    'type.Help',
    'type.Parser',
    'expression.parse',
    'expression.Parser',
    'expression.node.AccessorNode',
    'expression.node.ArrayNode',
    'expression.node.AssignmentNode',
    'expression.node.BlockNode',
    'expression.node.ConditionalNode',
    'expression.node.ConstantNode',
    'expression.node.IndexNode',
    'expression.node.FunctionAssignmentNode',
    'expression.node.FunctionNode',
    'expression.node.Node',
    'expression.node.ObjectNode',
    'expression.node.OperatorNode',
    'expression.node.ParenthesisNode',
    'expression.node.RangeNode',
    'expression.node.RelationalNode',
    'expression.node.SymbolNode',
    'json.reviver',
    'error.ArgumentsError',
    'error.DimensionError',
    'error.IndexError'
  ]
  movedNames.forEach(fullName => {
    const parts = fullName.split('.')

    const path = initial(parts)
    const name = last(parts)
    const obj = traverse(math, path)

    lazy(obj, name, () => {
      warnOnce(`math.${fullName} is moved to math.${name} in v6.0.0. ` +
        'Please use the new location instead.')
      return math[name]
    })
  })
  lazy(math.expression, 'docs', () => {
    throw new Error('math.expression.docs has been moved. ' +
      'Please import via "import { docs } from \'mathjs\'"')
  })

  math.ArgumentsError = ArgumentsError
  math.DimensionError = DimensionError
  math.IndexError = IndexError

  return math
}
