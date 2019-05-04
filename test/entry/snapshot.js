import * as allIsFunctions from '../../src/utils/is'
import { create } from '../../src/entry/instance'
import { validateTypeOf } from '../../tools/validateBundle'

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
      if (name.endsWith('Node')) {
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
    'eye',
    'print',
    'divideScalar',
    'parse',
    'compile',
    'parser',
    'chain',
    'reviver'
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
    'import': 'Function',
    'var': 'Function',
    'eval': 'Function',
    'typeof': 'Function',
    config: 'Function',
    core: 'Function',
    create: 'Function',

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
        'config': 'Function'
      },
      // deprecated stuff:
      // docs: embeddedDocs,
      node: {
        ...allNodeClasses
      },
      parse: 'Function',
      Parser: 'Function'
    },

    // deprecated stuff:
    type: {
      ...allTypeChecks,
      ...allClasses
    },
    json: {
      reviver: 'Function'
    },
    error: {
      ...allErrorClasses
    }
  }

  const expectedES6Structure = {
    // functions
    ...exclude(allFunctionsConstantsClasses, [
      'typeof',
      'eval',
      'var',
      'E',
      'false',
      'Infinity',
      'NaN',
      'null',
      'PI',
      'true'
    ]),
    core: 'Function',
    create: 'Function',
    config: 'Function',
    factory: 'Function',
    deprecatedEval: 'Function',
    deprecatedImport: 'Function',
    deprecatedVar: 'Function',
    deprecatedTypeof: 'Function',
    '_true': 'boolean',
    '_false': 'boolean',
    '_null': 'null',
    '_Infinity': 'number',
    '_NaN': 'number',

    ...allTypeChecks,
    ...allErrorClasses,
    ...allDependencyCollections,
    ...allFactoryFunctions,

    docs: embeddedDocs,

    // deprecated stuff:
    expression: {
      node: {
        ...allNodeClasses
      },
      parse: 'Function',
      Parser: 'Function'
    },
    type: {
      ...allTypeChecks,
      ...allClasses
    },
    json: {
      reviver: 'Function'
    },
    error: {
      ...allErrorClasses
    }
  }

  return {
    expectedInstanceStructure,
    expectedES6Structure
  }
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
