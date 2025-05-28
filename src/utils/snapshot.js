/**
 * This file contains helper methods to create expected snapshot structures
 * of both instance and ES6 exports.
 *
 * The files are located here and not under /test or /tools so it's transpiled
 * into ES5 code under /lib and can be used straight by node.js
 */
import assert from 'assert'
import * as allIsFunctions from './is.js'
import { create } from '../core/create.js'
import { endsWith } from './string.js'

export const validateTypeOf = allIsFunctions.typeOf

export function validateBundle (expectedBundleStructure, bundle) {
  const originalWarn = console.warn

  console.warn = function (...args) {
    if (args.join(' ').includes('is moved to') && args.join(' ').includes('Please use the new location instead')) {
      // Ignore warnings like:
      // Warning: math.type.isNumber is moved to math.isNumber in v6.0.0. Please use the new location instead.
      return
    }

    originalWarn.apply(console, args)
  }

  try {
    const issues = []

    // see whether all expected functions and objects are there
    traverse(expectedBundleStructure, (expectedType, path) => {
      const actualValue = get(bundle, path)
      const actualType = validateTypeOf(actualValue)

      const message = (actualType === 'undefined')
        ? 'Missing entry in bundle. ' +
        `Path: ${JSON.stringify(path)}, expected type: ${expectedType}, actual type: ${actualType}`
        : 'Unexpected entry type in bundle. ' +
        `Path: ${JSON.stringify(path)}, expected type: ${expectedType}, actual type: ${actualType}`

      if (actualType !== expectedType) {
        issues.push({ actualType, expectedType, message })

        console.warn(message)
      }
    })

    // see whether there are any functions or objects that shouldn't be there
    traverse(bundle, (actualValue, path) => {
      const actualType = validateTypeOf(actualValue)
      const expectedType = get(expectedBundleStructure, path) || 'undefined'

      // FIXME: ugly to have these special cases
      if (path.join('.').includes('docs.')) {
        // ignore the contents of docs
        return
      }
      if (path.join('.').includes('all.')) {
        // ignore the contents of all dependencies
        return
      }

      const message = (expectedType === 'undefined')
        ? 'Unknown entry in bundle. ' +
        'Is there a new function added which is missing in this snapshot test? ' +
        `Path: ${JSON.stringify(path)}, expected type: ${expectedType}, actual type: ${actualType}`
        : 'Unexpected entry type in bundle. ' +
        `Path: ${JSON.stringify(path)}, expected type: ${expectedType}, actual type: ${actualType}`

      if (actualType !== expectedType) {
        issues.push({ actualType, expectedType, message })

        console.warn(message)
      }
    })

    // assert on the first issue (if any)
    if (issues.length > 0) {
      const { actualType, expectedType, message } = issues[0]

      console.warn(`${issues.length} bundle issues found`)

      assert.strictEqual(actualType, expectedType, message)
    }
  } finally {
    console.warn = originalWarn
  }
}

/**
 * Based on an object with factory functions, create the expected
 * structures for ES6 export and a mathjs instance.
 * @param {Object} factories
 * @return {{expectedInstanceStructure: Object, expectedES6Structure: Object}}
 */
export function createSnapshotFromFactories (factories) {
  const math = create(factories)

  const allFactoryFunctions = {}
  const allFunctionsConstantsClasses = {}
  const allFunctionsConstants = {}
  const allTransformFunctions = {}
  const allDependencyCollections = {}
  const allClasses = {}
  const allNodeClasses = {}

  Object.keys(factories).forEach(factoryName => {
    const factory = factories[factoryName]
    const name = factory.fn
    const isTransformFunction = factory.meta && factory.meta.isTransformFunction
    const isClass = !isLowerCase(name[0]) && (validateTypeOf(math[name]) === 'function')
    const dependenciesName = factory.fn +
      (isTransformFunction ? 'Transform' : '') +
      'Dependencies'
    const former = factory.meta?.formerly ?? ''

    allFactoryFunctions[factoryName] = 'function'
    allFunctionsConstantsClasses[name] = validateTypeOf(math[name])
    if (former) {
      allFunctionsConstantsClasses[former] = allFunctionsConstantsClasses[name]
    }
    allDependencyCollections[dependenciesName] = 'Object'

    if (isTransformFunction) {
      allTransformFunctions[name] = 'function'
      if (former) allTransformFunctions[former] = 'function'
    }

    if (isClass) {
      if (endsWith(name, 'Node')) {
        allNodeClasses[name] = 'function'
      } else {
        allClasses[name] = 'function'
      }
    } else {
      allFunctionsConstants[name] = validateTypeOf(math[name])
      if (former) allFunctionsConstants[former] = allFunctionsConstants[name]
    }
  })

  let embeddedDocs = {}
  Object.keys(factories).forEach(factoryName => {
    const factory = factories[factoryName]
    const name = factory.fn

    if (isLowerCase(factory.fn[0])) { // ignore class names starting with upper case
      embeddedDocs[name] = 'Object'
    }
  })
  embeddedDocs = exclude(embeddedDocs, [
    'equalScalar',
    'addScalar',
    'subtractScalar',
    'multiplyScalar',
    'print',
    'divideScalar',
    'parse',
    'compile',
    'parser',
    'chain',
    'coulomb',
    'reviver',
    'replacer'
  ])

  const allTypeChecks = {}
  Object.keys(allIsFunctions).forEach(name => {
    if (name.indexOf('is') === 0) {
      allTypeChecks[name] = 'function'
    }
  })

  const allErrorClasses = {
    ArgumentsError: 'function',
    DimensionError: 'function',
    IndexError: 'function'
  }

  const expectedInstanceStructure = {
    ...allFunctionsConstantsClasses,

    on: 'function',
    off: 'function',
    once: 'function',
    emit: 'function',
    import: 'function',
    config: 'function',
    create: 'function',
    factory: 'function',

    ...allTypeChecks,
    ...allErrorClasses,

    expression: {
      transform: {
        ...allTransformFunctions
      },
      mathWithTransform: {
        // note that we don't have classes here,
        // only functions and constants are allowed in the editor
        ...exclude(allFunctionsConstants, [
          'chain'
        ]),
        config: 'function'
      }
    }
  }

  const expectedES6Structure = {
    // functions
    ...exclude(allFunctionsConstantsClasses, [
      'E',
      'false',
      'Infinity',
      'NaN',
      'null',
      'PI',
      'true'
    ]),
    create: 'function',
    config: 'function',
    factory: 'function',
    _true: 'boolean',
    _false: 'boolean',
    _null: 'null',
    _Infinity: 'number',
    _NaN: 'number',

    ...allTypeChecks,
    ...allErrorClasses,
    ...allDependencyCollections,
    ...allFactoryFunctions,

    docs: embeddedDocs
  }

  return {
    expectedInstanceStructure,
    expectedES6Structure
  }
}

function traverse (obj, callback = (value, path) => {}, path = []) {
  // FIXME: ugly to have these special cases
  if (path.length > 0 && path[0].includes('Dependencies')) {
    // special case for objects holding a collection of dependencies
    callback(obj, path)
  } else if (validateTypeOf(obj) === 'Array') {
    obj.map((item, index) => traverse(item, callback, path.concat(index)))
  } else if (validateTypeOf(obj) === 'Object') {
    Object.keys(obj).forEach(key => {
      // FIXME: ugly to have these special cases
      // ignore special case of deprecated docs
      if (key === 'docs' && path.join('.') === 'expression') {
        return
      }

      traverse(obj[key], callback, path.concat(key))
    })
  } else {
    callback(obj, path)
  }
}

function get (object, path) {
  let child = object

  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    child = child ? child[key] : undefined
  }

  return child
}

/**
 * Create a copy of the provided `object` and delete
 * all properties listed in `excludedProperties`
 * @param {Object} object
 * @param {string[]} excludedProperties
 * @return {Object}
 */
function exclude (object, excludedProperties) {
  const strippedObject = Object.assign({}, object)

  excludedProperties.forEach(excludedProperty => {
    delete strippedObject[excludedProperty]
  })

  return strippedObject
}

function isLowerCase (text) {
  return typeof text === 'string' && text.toLowerCase() === text
}
