import { isBigNumber, isComplex, isFraction, isMatrix, isUnit } from '../../utils/is'
import { isFactory, stripOptionalNotation } from '../../utils/factory'
import { hasOwnProperty, isLegacyFactory, lazy, traverse } from '../../utils/object'
import { contains } from '../../utils/array'
import { ArgumentsError } from '../../error/ArgumentsError'
import { warnOnce } from '../../utils/log'

export function importFactory (typed, load, math, importedFactories) {
  /**
   * Import functions from an object or a module.
   *
   * This function is only available on a mathjs instance created using `create`.
   *
   * Syntax:
   *
   *    math.import(functions)
   *    math.import(functions, options)
   *
   * Where:
   *
   * - `functions: Object`
   *   An object with functions or factories to be imported.
   * - `options: Object` An object with import options. Available options:
   *   - `override: boolean`
   *     If true, existing functions will be overwritten. False by default.
   *   - `silent: boolean`
   *     If true, the function will not throw errors on duplicates or invalid
   *     types. False by default.
   *   - `wrap: boolean`
   *     If true, the functions will be wrapped in a wrapper function
   *     which converts data types like Matrix to primitive data types like Array.
   *     The wrapper is needed when extending math.js with libraries which do not
   *     support these data type. False by default.
   *
   * Examples:
   *
   *    import { create, all } from 'mathjs'
   *    import * as numbers from 'numbers'
   *
   *    // create a mathjs instance
   *    const math = create(all)
   *
   *    // define new functions and variables
   *    math.import({
   *      myvalue: 42,
   *      hello: function (name) {
   *        return 'hello, ' + name + '!'
   *      }
   *    })
   *
   *    // use the imported function and variable
   *    math.myvalue * 2               // 84
   *    math.hello('user')             // 'hello, user!'
   *
   *    // import the npm module 'numbers'
   *    // (must be installed first with `npm install numbers`)
   *    math.import(numbers, {wrap: true})
   *
   *    math.fibonacci(7) // returns 13
   *
   * @param {Object | Array} functions  Object with functions to be imported.
   * @param {Object} [options]          Import options.
   */
  function mathImport (functions, options) {
    const num = arguments.length
    if (num !== 1 && num !== 2) {
      throw new ArgumentsError('import', num, 1, 2)
    }

    if (!options) {
      options = {}
    }

    function flattenImports (flatValues, value, name) {
      if (isLegacyFactory(value)) {
        // legacy factories don't always have a name,
        // let's not handle them via the new flatValues
        _importLegacyFactory(value, options)
      } else if (Array.isArray(value)) {
        value.forEach(item => flattenImports(flatValues, item))
      } else if (typeof value === 'object') {
        for (const name in value) {
          if (hasOwnProperty(value, name)) {
            flattenImports(flatValues, value[name], name)
          }
        }
      } else if (isFactory(value) || name !== undefined) {
        const flatName = isFactory(value)
          ? isTransformFunctionFactory(value)
            ? (value.fn + '.transform') // TODO: this is ugly
            : value.fn
          : name

        // we allow importing the same function twice if it points to the same implementation
        if (hasOwnProperty(flatValues, flatName) && flatValues[flatName] !== value && !options.silent) {
          throw new Error('Cannot import "' + flatName + '" twice')
        }

        flatValues[flatName] = value
      } else {
        if (!options.silent) {
          throw new TypeError('Factory, Object, or Array expected')
        }
      }
    }

    const flatValues = {}
    flattenImports(flatValues, functions)

    for (const name in flatValues) {
      if (hasOwnProperty(flatValues, name)) {
        // console.log('import', name)
        const value = flatValues[name]

        if (isFactory(value)) {
          // we ignore name here and enforce the name of the factory
          // maybe at some point we do want to allow overriding it
          // in that case we can implement an option overrideFactoryNames: true
          _importFactory(value, options)
        } else if (isSupportedType(value)) {
          _import(name, value, options)
        } else {
          if (!options.silent) {
            throw new TypeError('Factory, Object, or Array expected')
          }
        }
      }
    }
  }

  /**
   * Add a property to the math namespace
   * @param {string} name
   * @param {*} value
   * @param {Object} options  See import for a description of the options
   * @private
   */
  function _import (name, value, options) {
    // TODO: refactor this function, it's to complicated and contains duplicate code
    if (options.wrap && typeof value === 'function') {
      // create a wrapper around the function
      value = _wrap(value)
    }

    // turn a plain function with a typed-function signature into a typed-function
    if (hasTypedFunctionSignature(value)) {
      value = typed(name, {
        [value.signature]: value
      })
    }

    if (isTypedFunction(math[name]) && isTypedFunction(value)) {
      if (options.override) {
        // give the typed function the right name
        value = typed(name, value.signatures)
      } else {
        // merge the existing and typed function
        value = typed(math[name], value)
      }

      math[name] = value
      delete importedFactories[name]

      _importTransform(name, value)
      math.emit('import', name, function resolver () {
        return value
      })
      return
    }

    if (math[name] === undefined || options.override) {
      math[name] = value
      delete importedFactories[name]

      _importTransform(name, value)
      math.emit('import', name, function resolver () {
        return value
      })
      return
    }

    if (!options.silent) {
      throw new Error('Cannot import "' + name + '": already exists')
    }
  }

  function _importTransform (name, value) {
    if (value && typeof value.transform === 'function') {
      math.expression.transform[name] = value.transform
      if (allowedInExpressions(name)) {
        math.expression.mathWithTransform[name] = value.transform
      }
    } else {
      // remove existing transform
      delete math.expression.transform[name]
      if (allowedInExpressions(name)) {
        math.expression.mathWithTransform[name] = value
      }
    }
  }

  function _deleteTransform (name) {
    delete math.expression.transform[name]
    if (allowedInExpressions(name)) {
      math.expression.mathWithTransform[name] = math[name]
    } else {
      delete math.expression.mathWithTransform[name]
    }
  }

  /**
   * Create a wrapper a round an function which converts the arguments
   * to their primitive values (like convert a Matrix to Array)
   * @param {Function} fn
   * @return {Function} Returns the wrapped function
   * @private
   */
  function _wrap (fn) {
    const wrapper = function wrapper () {
      const args = []
      for (let i = 0, len = arguments.length; i < len; i++) {
        const arg = arguments[i]
        args[i] = arg && arg.valueOf()
      }
      return fn.apply(math, args)
    }

    if (fn.transform) {
      wrapper.transform = fn.transform
    }

    return wrapper
  }

  /**
   * Import an instance of a factory into math.js
   * @param {{factory: Function, name: string, path: string, math: boolean}} factory
   * @param {Object} options  See import for a description of the options
   * @private
   */
  // TODO: _importLegacyFactory is deprecated since v6.0.0, clean up some day
  function _importLegacyFactory (factory, options) {
    warnOnce('Factories of type { name, factory } are deprecated since v6. ' +
      'Please create your factory functions using the math.factory function.')

    if (typeof factory.name === 'string') {
      const name = factory.name
      const existingTransform = name in math.expression.transform
      const namespace = factory.path ? traverse(math, factory.path) : math
      const existing = hasOwnProperty(namespace, name) ? namespace[name] : undefined

      const resolver = function () {
        let instance = load(factory)
        if (instance && typeof instance.transform === 'function') {
          throw new Error('Transforms cannot be attached to factory functions. ' +
              'Please create a separate function for it with exports.path="expression.transform"')
        }

        if (isTypedFunction(existing) && isTypedFunction(instance)) {
          if (options.override) {
            // replace the existing typed function (nothing to do)
          } else {
            // merge the existing and new typed function
            instance = typed(existing, instance)
          }

          return instance
        }

        if (existing === undefined || options.override) {
          return instance
        }

        if (options.silent) {
          return existing
        } else {
          throw new Error('Cannot import "' + name + '": already exists')
        }
      }

      if (factory.lazy !== false) {
        lazy(namespace, name, resolver)

        if (existingTransform) {
          _deleteTransform(name)
        } else {
          if (factory.path === 'expression.transform' || legacyFactoryAllowedInExpressions(factory)) {
            lazy(math.expression.mathWithTransform, name, resolver)
          }
        }
      } else {
        namespace[name] = resolver()

        if (existingTransform) {
          _deleteTransform(name)
        } else {
          if (factory.path === 'expression.transform' || legacyFactoryAllowedInExpressions(factory)) {
            math.expression.mathWithTransform[name] = resolver()
          }
        }
      }

      const key = factory.path ? (factory.path + '.' + factory.name) : factory.name
      importedFactories[key] = factory

      math.emit('import', name, resolver, factory.path)
    } else {
      // unnamed factory.
      // no lazy loading
      load(factory)
    }
  }

  /**
   * Import an instance of a factory into math.js
   * @param {function(scope: object)} factory
   * @param {Object} options  See import for a description of the options
   * @param {string} [name=factory.name] Optional custom name
   * @private
   */
  function _importFactory (factory, options, name = factory.fn) {
    if (contains(name, '.')) {
      throw new Error('Factory name should not contain a nested path. ' +
        'Name: ' + JSON.stringify(name))
    }

    const namespace = isTransformFunctionFactory(factory)
      ? math.expression.transform
      : math

    const existingTransform = name in math.expression.transform
    const existing = hasOwnProperty(namespace, name) ? namespace[name] : undefined

    const resolver = function () {
      // collect all dependencies, handle finding both functions and classes and other special cases
      const dependencies = {}
      factory.dependencies
        .map(stripOptionalNotation)
        .forEach(dependency => {
          if (contains(dependency, '.')) {
            throw new Error('Factory dependency should not contain a nested path. ' +
              'Name: ' + JSON.stringify(dependency))
          }

          if (dependency === 'math') {
            dependencies.math = math
          } else if (dependency === 'mathWithTransform') {
            dependencies.mathWithTransform = math.expression.mathWithTransform
          } else if (dependency === 'classes') { // special case for json reviver
            dependencies.classes = math
          } else {
            dependencies[dependency] = math[dependency]
          }
        })

      const instance = /* #__PURE__ */ factory(dependencies)

      if (instance && typeof instance.transform === 'function') {
        throw new Error('Transforms cannot be attached to factory functions. ' +
            'Please create a separate function for it with exports.path="expression.transform"')
      }

      if (existing === undefined || options.override) {
        return instance
      }

      if (isTypedFunction(existing) && isTypedFunction(instance)) {
        // merge the existing and new typed function
        return typed(existing, instance)
      }

      if (options.silent) {
        // keep existing, ignore imported function
        return existing
      } else {
        throw new Error('Cannot import "' + name + '": already exists')
      }
    }

    // TODO: add unit test with non-lazy factory
    if (!factory.meta || factory.meta.lazy !== false) {
      lazy(namespace, name, resolver)

      // FIXME: remove the `if (existing &&` condition again. Can we make sure subset is loaded before subset.transform? (Name collision, and no dependencies between the two)
      if (existing && existingTransform) {
        _deleteTransform(name)
      } else {
        if (isTransformFunctionFactory(factory) || factoryAllowedInExpressions(factory)) {
          lazy(math.expression.mathWithTransform, name, () => namespace[name])
        }
      }
    } else {
      namespace[name] = resolver()

      // FIXME: remove the `if (existing &&` condition again. Can we make sure subset is loaded before subset.transform? (Name collision, and no dependencies between the two)
      if (existing && existingTransform) {
        _deleteTransform(name)
      } else {
        if (isTransformFunctionFactory(factory) || factoryAllowedInExpressions(factory)) {
          lazy(math.expression.mathWithTransform, name, () => namespace[name])
        }
      }
    }

    // TODO: improve factories, store a list with imports instead which can be re-played
    importedFactories[name] = factory

    math.emit('import', name, resolver)
  }

  /**
   * Check whether given object is a type which can be imported
   * @param {Function | number | string | boolean | null | Unit | Complex} object
   * @return {boolean}
   * @private
   */
  function isSupportedType (object) {
    return typeof object === 'function' ||
        typeof object === 'number' ||
        typeof object === 'string' ||
        typeof object === 'boolean' ||
        object === null ||
        isUnit(object) ||
        isComplex(object) ||
        isBigNumber(object) ||
        isFraction(object) ||
        isMatrix(object) ||
        Array.isArray(object)
  }

  /**
   * Test whether a given thing is a typed-function
   * @param {*} fn
   * @return {boolean} Returns true when `fn` is a typed-function
   */
  function isTypedFunction (fn) {
    return typeof fn === 'function' && typeof fn.signatures === 'object'
  }

  function hasTypedFunctionSignature (fn) {
    return typeof fn === 'function' && typeof fn.signature === 'string'
  }

  function allowedInExpressions (name) {
    return !hasOwnProperty(unsafe, name)
  }

  function legacyFactoryAllowedInExpressions (factory) {
    return factory.path === undefined && !hasOwnProperty(unsafe, factory.name)
  }

  function factoryAllowedInExpressions (factory) {
    return factory.fn.indexOf('.') === -1 && // FIXME: make checking on path redundant, check on meta data instead
      !hasOwnProperty(unsafe, factory.fn) &&
      (!factory.meta || !factory.meta.isClass)
  }

  function isTransformFunctionFactory (factory) {
    return (factory !== undefined &&
      factory.meta !== undefined &&
      factory.meta.isTransformFunction === true) || false
  }

  // namespaces and functions not available in the parser for safety reasons
  const unsafe = {
    expression: true,
    type: true,
    docs: true,
    error: true,
    json: true,
    chain: true // chain method not supported. Note that there is a unit chain too.
  }

  return mathImport
}
