/**
 * This file contains helper methods to create expected snapshot structures
 * of both instance and ES6 exports.
 *
 * The files are located here and not under /test or /tools so it's transpiled
 * into ES5 code under /lib and can be used straight by node.js
 */
import assert from 'assert'
import * as allIsFunctions from './is'
import { create } from '../core/create'
import { endsWith } from './string'

export function validateBundle (expectedBundleStructure, bundle) {
  const originalWarn = console.warn

  console.warn = function (...args) {
    if (args.join(' ').indexOf('is moved to') !== -1 && args.join(' ').indexOf('Please use the new location instead') !== -1) {
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
      if (path.join('.').indexOf('docs.') !== -1) {
        // ignore the contents of docs
        return
      }
      if (path.join('.').indexOf('all.') !== -1) {
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
    const isClass = !isLowerCase(name[0]) && (validateTypeOf(math[name]) === 'Function')
    const dependenciesName = factory.fn +
      (isTransformFunction ? 'Transform' : '') +
      'Dependencies'

    allFactoryFunctions[factoryName] = 'Function'
    allFunctionsConstantsClasses[name] = validateTypeOf(math[name])
    allDependencyCollections[dependenciesName] = 'Object'

    if (isTransformFunction) {
      allTransformFunctions[name] = 'Function'
    }

    if (isClass) {
      if (endsWith(name, 'Node')) {
        allNodeClasses[name] = 'Function'
      } else {
        allClasses[name] = 'Function'
      }
    } else {
      allFunctionsConstants[name] = validateTypeOf(math[name])
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
    'apply',
    'addScalar',
    'multiplyScalar',
    'print',
    'divideScalar',
    'parse',
    'compile',
    'parser',
    'chain',
    'reviver',
    'replacer'
  ])

  const allTypeChecks = {}
  Object.keys(allIsFunctions).forEach(name => {
    if (name.indexOf('is') === 0) {
      allTypeChecks[name] = 'Function'
    }
  })

  const allErrorClasses = {
    ArgumentsError: 'Function',
    DimensionError: 'Function',
    IndexError: 'Function'
  }

  const expectedInstanceStructure = {
    ...allFunctionsConstantsClasses,

    on: 'Function',
    off: 'Function',
    once: 'Function',
    emit: 'Function',
    import: 'Function',
    config: 'Function',
    create: 'Function',
    factory: 'Function',

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
        config: 'Function'
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
    create: 'Function',
    config: 'Function',
    factory: 'Function',
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

export function validateTypeOf (x) {
  if (x && x.type === 'Unit') {
    return 'Unit'
  }

  if (x && x.type === 'Complex') {
    return 'Complex'
  }

  if (Array.isArray(x)) {
    return 'Array'
  }

  if (x === null) {
    return 'null'
  }

  if (typeof x === 'function') {
    return 'Function'
  }

  if (typeof x === 'object') {
    return 'Object'
  }

  return typeof x
}

function traverse (obj, callback = (value, path) => {}, path = []) {
  // FIXME: ugly to have these special cases
  if (path.length > 0 && path[0].indexOf('Dependencies') !== -1) {
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
