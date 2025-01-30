import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import Handlebars from 'handlebars'
import { hasOwnProperty } from './utils.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ENTRY_FOLDER = path.join(__dirname, '../src/entry')

const IGNORED_DEPENDENCIES = {
  on: true,
  config: true,
  math: true,
  mathWithTransform: true,
  classes: true
}

const DEPRECATED_FACTORIES = {
  typeof: 'typeOf',
  var: 'variance',
  eval: 'evaluate',
  E: 'e',
  PI: 'pi'
}

const FACTORY_NAMES_ES6_MAPPING = {
  true: '_true',
  false: '_false',
  NaN: '_NaN',
  null: '_null',
  Infinity: '_Infinity'
}

const IGNORED_DEPENDENCIES_ES6 = {
  on: true
}

const dependenciesIndexTemplate = Handlebars.compile(`/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
{{#factories}}
export { {{name}} } from '{{fileName}}.js'{{eslintComment}}
{{/factories}}

export { all } from './allFactories{{suffix}}.js'
`)

const dependenciesFileTemplate = Handlebars.compile(`/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
{{#dependencies}}
import { {{name}} } from '{{fileName}}.js'
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
import { config } from './configReadonly.js'
import {
  {{#pureFactories}}
  {{factoryName}}{{#unless @last}},{{/unless}}{{eslintComment}}
  {{/pureFactories}}
} from '../factories{{suffix}}.js'

{{#pureFactories}}
export const {{name}} = /* #__PURE__ */ {{factoryName ~}}
({{braceOpen}}{{#if dependencies}} {{/if ~}}
{{#dependencies ~}}
{{name}}{{#unless @last}}, {{/unless ~}}
{{/dependencies ~}}
{{#if dependencies}} {{/if ~}}})
{{#if formerly}}
export const {{formerly}} = {{name}}
{{/if}}
{{/pureFactories}}
`)

const impureFunctionsTemplate = Handlebars.compile(`/**
 * THIS FILE IS AUTO-GENERATED
 * DON'T MAKE CHANGES HERE
 */
import { config } from './configReadonly.js'
import {
  {{#impureFactories}}
  {{factoryName}},{{eslintComment}}
  {{/impureFactories}}
  {{#transformFactories}}
  {{factoryName}}{{#unless @last}},{{/unless}}{{eslintComment}}
  {{/transformFactories}}
} from '../factories{{suffix}}.js'
import {
  {{#pureFactories}}
  {{name}}{{#unless @last}},{{/unless}}{{eslintComment}}
  {{/pureFactories}}
} from './pureFunctions{{suffix}}.generated.js'

const math = {} // NOT pure!
const mathWithTransform = {} // NOT pure!
const classes = {} // NOT pure!

{{#impureFactories}}
export const {{name}} = {{factoryName ~}}
({{braceOpen}}{{#if dependencies}} {{/if ~}}
{{#dependencies ~}}
{{name}}{{#unless @last}}, {{/unless ~}}
{{/dependencies ~}}
{{#if dependencies}} {{/if ~}}})
{{/impureFactories}}

Object.assign(math, {
{{#math}}
{{#if renamed}}
  '{{name}}': {{renamed}},
{{else if mappedName}}
  {{name}}: {{mappedName}},
{{else}}
  {{name}},
{{/if}}
{{/math}}
  config
})

Object.assign(mathWithTransform, math, {
  {{#transformFactories}}
  {{name}}: {{factoryName ~}}
  ({{braceOpen}}{{#if dependencies}} {{/if ~}}
  {{#dependencies ~}}
  {{name}}{{#unless @last}}, {{/unless ~}}
  {{/dependencies ~}}
  {{#if dependencies}} {{/if ~}}}){{#unless @last}},{{/unless}}
  {{/transformFactories}}
})

Object.assign(classes, {
{{#classes}}
  {{name}}{{#unless @last}},{{/unless}}
{{/classes}}
})

Chain.createProxy(math)

export { embeddedDocs as docs } from '../expression/embeddedDocs/embeddedDocs.js'
`)

export async function generateEntryFiles () {
  const factoriesAny = await import('../src/factoriesAny.js')
  const factoriesNumber = await import('../src/factoriesNumber.js')

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
              if (factory.dependencies.includes(dependency)) {
                throw new Error(`Required dependency "${dependency}" missing for factory "${factory.fn}" (suffix: ${suffix})`)
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
 *   pureFunctionsAny.generated.js
 *   impureFunctionsAny.generated.js
 */
function generateFunctionsFiles ({ suffix, factories, entryFolder }) {
  const braceOpen = '{' // a hack to be able to create a single brace open character in handlebars

  const sortedFactories = sortFactories(Object.values(factories))

  // sort the factories, and split them in three groups:
  // - transform: the transform functions
  // - impure: the functions that depend on `math` or `mathWithTransform` (directly or indirectly),
  // - pure: the rest
  const pureFactories = []
  const impureFactories = []
  const transformFactories = []
  sortedFactories
    .filter(factory => !DEPRECATED_FACTORIES[factory.fn])
    .forEach(factory => {
      if (isTransform(factory)) {
        transformFactories.push(factory)
      } else if (
        factory.dependencies.includes('math') ||
        factory.dependencies.includes( 'mathWithTransform') ||
        factory.dependencies.includes( 'classes') ||
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

  const impureExists = {
    ...pureExists
  }
  impureFactories.forEach(factory => {
    impureExists[factory.fn] = true
  })

  const math = sortedFactories
    .filter(factory => !isClass(factory))
    .filter(factory => !isTransform(factory))
    .map(factory => {
      return {
        name: factory.fn,
        renamed: DEPRECATED_FACTORIES[factory.fn],
        mappedName: FACTORY_NAMES_ES6_MAPPING[factory.fn]
      }
    })

  const classes = sortedFactories
    .filter(factory => isClass(factory))
    .map(factory => ({ name: factory.fn }))

  const data = {
    suffix,
    pureFactories: pureFactories.map(factory => {
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
              if (factory.dependencies.includes(dependency)) {
                throw new Error(`Required dependency "${dependency}" missing for factory "${factory.fn}" (suffix: ${suffix})`)
              }

              return false
            }

            return true
          })
          .map(dependency => ({ name: dependency })),
        formerly: factory.meta?.formerly
      }
    }),

    impureFactories: impureFactories.map(factory => {
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
            if (dependency === 'math' || dependency === 'mathWithTransform' || dependency === 'classes') {
              return true
            }

            // TODO: this code is duplicated. extract it in a separate function
            if (!impureExists[dependency]) {
              // if (factory.dependencies.includes(dependency)) {
              //   throw new Error(`Required dependency "${dependency}" missing for factory "${factory.fn}"`)
              // }

              return false
            }

            return true
          })
          .map(dependency => ({ name: dependency }))
      }
    }),

    transformFactories: transformFactories.map(factory => {
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
            if (dependency === 'math' || dependency === 'mathWithTransform' || dependency === 'classes') {
              return true
            }

            // TODO: this code is duplicated. extract it in a separate function
            if (!impureExists[dependency]) {
              // if (factory.dependencies.includes(dependency)) {
              //   throw new Error(`Required dependency "${dependency}" missing for factory "${factory.fn}"`)
              // }

              return false
            }

            return true
          })
          .map(dependency => ({ name: dependency }))
      }
    }),

    math,
    classes
  }

  // create file with all functions: functionsAny.generated.js, functionsNumber.generated.js
  fs.writeFileSync(path.join(entryFolder, 'pureFunctions' + suffix + '.generated.js'), pureFunctionsTemplate(data))

  // create file with all functions: impureFunctions.generated.js, impureFunctions.generated.js
  fs.writeFileSync(path.join(entryFolder, 'impureFunctions' + suffix + '.generated.js'), impureFunctionsTemplate(data))
}

function getDependenciesName (factoryName, factories) {
  if (!factories) {
    throw new Error('Cannot create dependencies name: factories is undefined')
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
    if (hasOwnProperty(factories, factoryName)) {
      if (factories[factoryName].fn === name) {
        return factoryName
      }
    }
  }

  return undefined
}

function findKey (object, value) {
  for (const key in object) {
    if (hasOwnProperty(object, key)) {
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
export function sortFactories (factories) {
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

function isTransform (factory) {
  return (factory && factory.meta && factory.meta.isTransformFunction === true) || false
}

function isClass (factory) {
  return (factory && factory.meta && factory.meta.isClass === true) || false
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
