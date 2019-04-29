const fs = require('fs')
const path = require('path')

const ENTRY_FOLDER = path.join(__dirname, '../src/entry')

const FACTORIES_ANY_LINK = '../factoriesAny.js'
const ALL_ANY_LINK = './allFactoriesAny.js'
const DEPENDENCIES_ANY_INDEX = 'dependenciesAny.generated.js'
const DEPENDENCIES_ANY_FOLDER = 'dependenciesAny'

const FACTORIES_NUMBER_LINK = '../factoriesNumber.js'
const ALL_NUMBER_LINK = './allFactoriesNumber.js'
const DEPENDENCIES_NUMBER_INDEX = 'dependenciesNumber.generated.js'
const DEPENDENCIES_NUMBER_FOLDER = 'dependenciesNumber'

const IGNORED_DEPENDENCIES = {
  'on': true,
  'config': true,
  'math': true,
  'mathWithTransform': true,
  'classes': true
}

exports.generateEntryFiles = function () {
  const factoriesAny = require('../lib/factoriesAny')
  const factoriesNumber = require('../lib/factoriesNumber')

  generateIndexFile({
    factories: factoriesAny,
    factoriesLink: FACTORIES_ANY_LINK,
    allLink: ALL_ANY_LINK,
    entryFolder: ENTRY_FOLDER,
    dependenciesFolder: DEPENDENCIES_ANY_FOLDER,
    dependenciesIndexFile: DEPENDENCIES_ANY_INDEX
  })

  generateIndexFile({
    factories: factoriesNumber,
    factoriesLink: FACTORIES_NUMBER_LINK,
    allLink: ALL_NUMBER_LINK,
    entryFolder: ENTRY_FOLDER,
    dependenciesFolder: DEPENDENCIES_NUMBER_FOLDER,
    dependenciesIndexFile: DEPENDENCIES_NUMBER_INDEX
  })
}

/**
 * Generate the following index files
 *   dependenciesAny.js
 *   dependenciesNumber.js
 */
function generateIndexFile ({
  factories,
  factoriesLink,
  allLink,
  entryFolder,
  dependenciesFolder,
  dependenciesIndexFile
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

  // TODO: create template files and fill these in
  const header = '/**\n' +
   ' * THIS FILE IS AUTO-GENERATED\n' +
   ' * DON\'T MAKE CHANGES HERE\n' +
   ' */\n'

  mkdirSyncIfNotExists(path.join(entryFolder, dependenciesFolder))

  // for each factory, create a separate file
  Object.keys(factories).map((factoryName) => {
    const factory = factories[factoryName]
    // const transform = factory.meta && factory.meta.isTransformFunction ? 'Transform' : ''
    const eslint = factory.fn === 'SQRT1_2' ? ' // eslint-disable-line camelcase' : ''
    // const name = factory.fn + transform + 'Dependencies'
    const name = getDependenciesName(factoryName, factories)
    const fileName = getDependenciesFileName(factoryName)

    const filteredDependencies = factory.dependencies
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

    // add header
    let src = header

    // imports
    filteredDependencies.forEach(dependency => {
      // const name = dependency + 'Dependencies'
      const factoryName = findFactoryName(factories, dependency)
      const name = getDependenciesName(factoryName, factories)
      const fileName = getDependenciesFileName(factoryName)
      src += `import { ${name} } from './${fileName}.generated'\n`
    })
    src += `import { ${factoryName} } from '../${factoriesLink}'${eslint}\n`
    src += '\n'

    // exports
    src += 'export const ' + name + ' = {' + eslint + '\n'
    filteredDependencies.forEach(dependency => {
      const name = getDependenciesName(findFactoryName(factories, dependency), factories)
      src += '  ' + name + ',\n'
    })
    src += '  ' + factoryName + '\n'
    src += '}\n'

    const p = path.join(entryFolder, dependenciesFolder, fileName + '.generated.js')
    fs.writeFileSync(p, src)
  })

  // create one index file linking to all dependencies files
  let src = header

  Object.keys(factories).map((factoryName) => {
    // const factory = factories[factoryName]
    // const transform = factory.meta && factory.meta.isTransformFunction ? 'Transform' : ''
    const eslint = factoryName === 'createSQRT1_2' ? ' // eslint-disable-line camelcase' : ''
    // const name = factory.fn + transform + 'Dependencies'
    const name = getDependenciesName(factoryName, factories)
    const fileName = getDependenciesFileName(factoryName)

    src += `export { ${name} } from './${dependenciesFolder}/${fileName}.generated'${eslint}\n`
  })

  src += '\n'
  src += 'export { all } from \'' + allLink + '\'\n'

  fs.writeFileSync(path.join(entryFolder, dependenciesIndexFile), src)
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
