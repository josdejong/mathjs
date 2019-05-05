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

exports.generateEntryFiles = function () {
  const factoriesAny = require('../lib/factoriesAny')
  const factoriesNumber = require('../lib/factoriesNumber')

  generateIndexFile({
    suffix: 'Any',
    factories: factoriesAny,
    entryFolder: ENTRY_FOLDER
  })

  generateIndexFile({
    suffix: 'Number',
    factories: factoriesNumber,
    entryFolder: ENTRY_FOLDER
  })
}

exports.generateEntryFiles() // TODO: cleanup

/**
 * Generate the following index files
 *   dependenciesAny.js
 *   dependenciesNumber.js
 */
// TODO: refactor this function: create template files and fill these in
function generateIndexFile ({
  suffix,
  factories,
  entryFolder
}) {
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
        braceOpen: '{',
        name: getDependenciesName(factoryName, factories),
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

function getDependenciesName (factoryName, factories) {
  if (!factories) {
    throw new Error(`Cannot create dependencies name: factories is undefined`)
  }

  const factory = factories[factoryName]
  const transform = factory.meta && factory.meta.isTransformFunction ? 'Transform' : ''

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

/**
 * Sort the factories in such a way that their dependencies are resolved.
 * @param {Array} factories
 * @return {Array} Returns sorted factories
 */
// TODO: cleanup the function sortFactories if we don't need it in the end
exports.sortFactories = function (factories) {
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
        if (!factory.meta || !factory.meta.isTransformFunction) {
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

// TODO: cleanup the function values if we don't need it in the end
exports.values = function (object) {
  return Object.keys(object).map(key => object[key])
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
