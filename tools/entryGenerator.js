const fs = require('fs')
const path = require('path')
const factoriesFull = require('../lib/factoriesFull')
const factoriesNumber = require('../lib/factoriesNumber')

const FACTORIES_FULL_LINK = '../factoriesFull.js'
const ALL_FULL_LINK = './allFull.js'
const DEPENDENCIES_FULL_DEST = path.join(__dirname, '../src/entry/dependenciesFull.generated.js')

const FACTORIES_NUMBER_LINK = '../factoriesNumber'
const ALL_NUMBER_LINK = './allNumber.js'
const DEPENDENCIES_NUMBER_DEST = path.join(__dirname, '../src/entry/dependenciesNumber.generated.js')

const IGNORED_DEPENDENCIES = {
  'on': true,
  'config': true,
  'math': true,
  'mathWithTransform': true,
  'classes': true
}

generateIndexFile(factoriesFull, FACTORIES_FULL_LINK, ALL_FULL_LINK, DEPENDENCIES_FULL_DEST)
generateIndexFile(factoriesNumber, FACTORIES_NUMBER_LINK, ALL_NUMBER_LINK, DEPENDENCIES_NUMBER_DEST)

/**
 * Generate the following index files
 *   dependenciesFull.js
 *   dependenciesNumber.js
 */
function generateIndexFile (factories, factoriesLink, allLink, dependenciesDest) {
  // a map containing:
  // {
  //   'sqrt': 'createSqrt',
  //   'subset{"isTransformFunction":true}': createSubsetTransform,
  //   ...
  // }
  const factoryNameMap = {}
  Object.keys(factories).forEach(factoryName => {
    const factory = factories[factoryName]
    const key = factory.fn + JSON.stringify(factory.meta)
    factoryNameMap[key] = factoryName
  })

  const unsortedFactories = values(factories)
  const sortedFactories = sortFactories(unsortedFactories)

  // a map containing:
  // {
  //   'sqrt': true,
  //   'subset': true,
  //   ...
  // }
  const exists = {}
  sortedFactories.forEach(factory => {
    exists[factory.fn] = true
  })

  let src = ''
  src += '/**\n'
  src += ' * THIS FILE IS AUTO-GENERATED\n'
  src += ' * DON\'T MAKE CHANGES HERE\n'
  src += ' */\n'

  // src += factoriesFullSrc.replace(/export /g, 'import ')
  src += 'import {\n'
  const count = Object.keys(factories).length
  Object.keys(factories).map((factoryName, index) => {
    const eslint = factoryName === 'createSQRT1_2' ? ' // eslint-disable-line camelcase' : ''
    const comma = index < count - 1 ? ',' : ''
    src += '  ' + factoryName + comma + eslint + '\n'
  })
  src += '} from \'' + factoriesLink + '\''

  src += '\n'
  src += 'export { all } from \'' + allLink + '\'\n'

  const loaded = {}
  sortedFactories.forEach(factory => {
    const transform = factory.meta && factory.meta.isTransformFunction ? 'Transform' : ''
    const eslint = factory.fn === 'SQRT1_2' ? ' // eslint-disable-line camelcase' : ''
    src += '\n'
    src += 'export const ' + factory.fn + transform + 'Dependencies = {' + eslint + '\n'

    factory.dependencies
      .map(stripOptionalNotation)
      .filter(dependency => !IGNORED_DEPENDENCIES[dependency])
      .filter(dependency => exists[dependency])
      .forEach(dependency => {
        src += '  ' + dependency + 'Dependencies,\n'
      })

    const key = factory.fn + JSON.stringify(factory.meta)
    src += '  ' + factoryNameMap[key] + '\n'

    src += '}\n'

    loaded[factory.fn] = true
  })

  fs.writeFileSync(dependenciesDest, src)

  console.log('Generated file ' + dependenciesDest)
}

/**
 * Sort the factories in such a way that their dependencies are resolved.
 * @param {Array} factories
 * @return {Array} Returns sorted factories
 */
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

function values (object) {
  return Object.keys(object).map(key => object[key])
}

function stripOptionalNotation (dependency) {
  return dependency && dependency[0] === '?'
    ? dependency.slice(1)
    : dependency
}
