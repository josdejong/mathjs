const fs = require('fs')
const path = require('path')
const Handlebars = require('handlebars')

const ENTRY_FOLDER = path.join(__dirname, '../src/entry')

const IGNORED_DEPENDENCIES = {
  'on': true,
  'config': true,
  'math': true,
  'mathWithTransform': true,
  'classes': true
}

const IGNORED_FACTORIES = {
  'typeof': true,
  'var': true,
  'eval': true,
  'E': true,
  'PI': true
}

const FACTORY_NAMES_ES6_MAPPING = {
  'true': '_true',
  'false': '_false',
  'NaN': '_NaN',
  'null': '_null',
  'Infinity': '_Infinity'
}

const IGNORED_DEPENDENCIES_ES6 = {
  'on': true
}

const dependenciesIndexTemplate = Handlebars.compile(`/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
{{#factories}}
export { {{name}} } from '{{fileName}}'{{eslintComment}}
{{/factories}}

export { all } from './allFactories{{suffix}}.js'
`)

const dependenciesFileTemplate = Handlebars.compile(`/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
{{#dependencies}}
import { {{name}} } from '{{fileName}}'
{{/dependencies}}
import { {{factoryName}} } from '../../factories{{suffix}}.js'{{eslintComment}}

export const {{name}} = {{braceOpen}}{{eslintComment}}
  {{#dependencies}}
  {{name}},
  {{/dependencies}}
  {{factoryName}}
}
`)

const pureFunctionsTemplate = Handlebars.compile(`/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
import { config } from './configReadonly'
import {
  {{#factories}}
  {{factoryName}}{{#unless @last}},{{/unless}}{{eslintComment}}
  {{/factories}}
} from '../factories{{suffix}}'

{{#factories}}
export const {{name}} = /* #__PURE__ */ {{factoryName ~}}
({{braceOpen}}{{#if dependencies}} {{/if ~}}
{{#dependencies ~}}
{{name}}{{#unless @last}}, {{/unless ~}}
{{/dependencies ~}}
{{#if dependencies}} {{/if ~}}})
{{/factories}}
`)

exports.generateEntryFiles = function () {
  const factoriesAny = require('../lib/factoriesAny')
  const factoriesNumber = require('../lib/factoriesNumber')

  generateDependenciesFiles({
    suffix: 'Any',
    factories: factoriesAny,
    entryFolder: ENTRY_FOLDER
  })

  generateDependenciesFiles({
    suffix: 'Number',
    factories: factoriesNumber,
    entryFolder: ENTRY_FOLDER
  })

  generateFunctionsFiles({
    suffix: 'Any',
    factories: factoriesAny,
    entryFolder: ENTRY_FOLDER
  })

  generateFunctionsFiles({
    suffix: 'Number',
    factories: factoriesNumber,
    entryFolder: ENTRY_FOLDER
  })
}

exports.generateEntryFiles() // FIXME: cleanup

/**
 * Generate index files like
 *   dependenciesAny.generated.js
 *   dependenciesNumber.generated.js
 * And the individual files for every dependencies collection.
 */
function generateDependenciesFiles ({ suffix, factories, entryFolder }) {
  const braceOpen = '{' // a hack to be able to create a single brace open character in handlebars

  // a map containing:
  // {
  //   'sqrt': true,
  //   'subset': true,
  //   ...
  // }
  const exists = {}
  Object.keys(factories).forEach(factoryName => {
    const factory = factories[factoryName]
    exists[factory.fn] = true
  })

  mkdirSyncIfNotExists(path.join(entryFolder, 'dependencies' + suffix))

  const data = {
    suffix,
    factories: Object.keys(factories).map((factoryName) => {
      const factory = factories[factoryName]

      return {
        suffix,
        factoryName,
        braceOpen,
        name: getDependenciesName(factoryName, factories), // FIXME: rename name with dependenciesName, and functionName with name
        fileName: './dependencies' + suffix + '/' + getDependenciesFileName(factoryName) + '.generated',
        eslintComment: factoryName === 'createSQRT1_2'
          ? ' // eslint-disable-line camelcase'
          : undefined,

        dependencies: factory.dependencies
          .map(stripOptionalNotation)
          .filter(dependency => !IGNORED_DEPENDENCIES[dependency])
          .filter(dependency => {
            if (!exists[dependency]) {
              if (factory.dependencies.indexOf(dependency) !== -1) {
                throw new Error(`Required dependency "${dependency}" missing for factory "${factory.fn}"`)
              }

              return false
            }

            return true
          })
          .map(dependency => {
            const factoryName = findFactoryName(factories, dependency)
            const name = getDependenciesName(factoryName, factories)
            const fileName = './' + getDependenciesFileName(factoryName) + '.generated'

            return {
              suffix,
              name,
              fileName
            }
          })
      }
    })
  }

  // generate a file for every dependency
  data.factories.forEach(factoryData => {
    const generatedFactory = dependenciesFileTemplate(factoryData)

    const p = path.join(entryFolder, factoryData.fileName + '.js')
    fs.writeFileSync(p, generatedFactory)
  })

  // generate a file with links to all dependencies
  const generated = dependenciesIndexTemplate(data)
  fs.writeFileSync(path.join(entryFolder, 'dependencies' + suffix + '.generated.js'), generated)
}

/**
 * Generate index files like
 *   functionsAny.generated.js
 *   evaluateAny.generated.js
 */
function generateFunctionsFiles ({ suffix, factories, entryFolder }) {
  const braceOpen = '{' // a hack to be able to create a single brace open character in handlebars

  // sort the factories, and split them in three groups:
  // - transform: the transform functions
  // - impure: the functions that depend on `math` or `mathWithTransform` (directly or indirectly),
  // - pure: the rest
  const pureFactories = []
  const impureFactories = []
  const transformFactories = []
  sortFactories(values(factories))
    .filter(factory => !IGNORED_FACTORIES[factory.fn])
    .forEach(factory => {
      if (isTransform(factory)) {
        transformFactories.push(factory)
      } else if (
        contains(factory.dependencies, 'math') ||
        contains(factory.dependencies, 'mathWithTransform') ||
        contains(factory.dependencies, 'classes') ||
        isTransform(factory) ||
        factory.dependencies.some(dependency => {
          return impureFactories.find(f => f.fn === stripOptionalNotation(dependency))
        })
      ) {
        impureFactories.push(factory)
      } else {
        pureFactories.push(factory)
      }
    })

  // a map containing:
  // {
  //   'sqrt': true,
  //   'subset': true,
  //   ...
  // }
  const pureExists = {
    config: true
  }
  pureFactories.forEach(factory => {
    pureExists[factory.fn] = true
  })

  // create file with all functions: functionsAny.js, functionsNumber.js
  fs.writeFileSync(path.join(entryFolder, 'functions' + suffix + '.generated.js'), pureFunctionsTemplate({
    suffix,
    factories: pureFactories.map(factory => {
      const name = FACTORY_NAMES_ES6_MAPPING[factory.fn] || factory.fn

      return {
        braceOpen,
        factoryName: findKey(factories, factory), // TODO: find a better way to match the factory names
        eslintComment: name === 'SQRT1_2'
          ? ' // eslint-disable-line camelcase'
          : undefined,
        name,
        dependencies: factory.dependencies
          .map(stripOptionalNotation)
          .filter(dependency => !IGNORED_DEPENDENCIES_ES6[dependency])
          .filter(dependency => {
            // TODO: this code is duplicated. extract it in a separate function
            if (!pureExists[dependency]) {
              if (factory.dependencies.indexOf(dependency) !== -1) {
                throw new Error(`Required dependency "${dependency}" missing for factory "${factory.fn}"`)
              }

              return false
            }

            return true
          })
          .map(dependency => ({ name: dependency }))
      }
    })
  }))
}

function getDependenciesName (factoryName, factories) {
  if (!factories) {
    throw new Error(`Cannot create dependencies name: factories is undefined`)
  }

  const factory = factories[factoryName]
  const transform = isTransform(factory) ? 'Transform' : ''

  return factory.fn + transform + 'Dependencies'
}

function getDependenciesFileName (factoryName) {
  if (factoryName.indexOf('create') !== 0) {
    throw new Error(`Cannot create dependencies name from factoryName "${factoryName}". Should start with "create..."`)
  }

  return 'dependencies' + factoryName.slice(6)
}

function findFactoryName (factories, name) {
  for (const factoryName in factories) {
    if (factories.hasOwnProperty(factoryName)) {
      if (factories[factoryName].fn === name) {
        return factoryName
      }
    }
  }

  return undefined
}

function findKey (object, value) {
  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      if (object[key] === value) {
        return key
      }
    }
  }

  return undefined
}

/**
 * Sort the factories in such a way that their dependencies are resolved.
 * @param {Array} factories
 * @return {Array} Returns sorted factories
 */
exports.sortFactories = sortFactories

function sortFactories (factories) {
  const loaded = {}
  const leftOverFactories = factories.slice()
  const sortedFactories = []

  const exists = {}
  factories.forEach(factory => {
    exists[factory.fn] = true
  })

  function allDependenciesResolved (dependencies) {
    return dependencies.every(dependency => {
      const d = stripOptionalNotation(dependency)
      return loaded[d] === true ||
        IGNORED_DEPENDENCIES[d] === true ||
        (dependency[0] === '?' && !exists[d])
    })
  }

  let changed = true
  while (leftOverFactories.length > 0 && changed) {
    changed = false

    for (let i = 0; i < leftOverFactories.length; i++) {
      const factory = leftOverFactories[i]
      if (allDependenciesResolved(factory.dependencies)) {
        if (!isTransform(factory)) {
          loaded[factory.fn] = true
        }
        sortedFactories.push(factory)
        leftOverFactories.splice(i, 1)
        changed = true
      }
    }
  }

  if (leftOverFactories.length > 0) {
    const first = leftOverFactories[0]
    throw new Error('Cannot resolve dependencies of factory "' + first.fn + '". ' +
      'Dependencies: ' + first.dependencies.map(d => '"' + d + '"').join(', '))
  }

  return sortedFactories
}

function values (object) {
  return Object.keys(object).map(key => object[key])
}

function contains (array, item) {
  return array.indexOf(item) !== -1
}

function isTransform (factory) {
  return (factory && factory.meta && factory.meta.isTransformFunction === true) || false
}

function stripOptionalNotation (dependency) {
  return dependency && dependency[0] === '?'
    ? dependency.slice(1)
    : dependency
}

// function will check if a directory exists, and create it if it doesn't
// https://blog.raananweber.com/2015/12/15/check-if-a-directory-exists-in-node-js/
function mkdirSyncIfNotExists (directory) {
  try {
    fs.statSync(directory)
  } catch (error) {
    fs.mkdirSync(directory)
  }
}
