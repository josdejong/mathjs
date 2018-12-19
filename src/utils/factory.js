import { contains } from './array'
import { deepEqual, deepExtend, get, pick } from './object'

/**
 * Create a factory function, which can be used to inject dependencies.
 *
 * The created functions are memoized, a consecutive call of the factory
 * with the exact same inputs will return the same function instance.
 * The memoized cache is exposed on `factory.cache` and can be cleared
 * if needed.
 *
 * Example:
 *
 *     const name = 'log'
 *     const dependencies = ['config', 'typed', 'divideScalar', 'type.Complex']
 *
 *     export const createLog = factory(name, dependencies, ({ typed, config, divideScalar, type: { Complex } }) => {
 *       // ... create the function log here and return it
 *     }
 *
 * @param {string} name           Name of the function to be created
 * @param {string[]} dependencies The names of all required dependencies
 * @param {function} create       Callback function called with an object with all dependencies
 * @returns {function}
 */
export function factory (name, dependencies, create) {
  function assertAndCreate (scope) {
    // we only pass the requested dependencies to the factory function
    const deps = pick(scope, dependencies.map(stripOptionalNotation))

    for (const cached of assertAndCreate.cache) {
      if (deepEqual(deps, cached.deps)) {
        // TODO: move this cache entry to the top so recently used entries move up?
        return cached.fn
      }
    }

    assertDependencies(name, dependencies, scope)

    const fn = create(deps)
    assertAndCreate.cache.unshift({ deps, fn })

    return fn
  }

  assertAndCreate.cache = [] // for memoization

  assertAndCreate.isFactory = true
  assertAndCreate.fn = name
  assertAndCreate.dependencies = dependencies.slice().sort()

  return assertAndCreate
}

/**
 * Provide part of the dependencies needed by a factory function.
 * Returns a new factory function which only requires the left over dependencies
 * to be provided in order to create the function.
 * @param {function} factory
 * @param {Object} partialDependencies
 * @returns {function}
 */
export function partial (factory, partialDependencies = {}) {
  // split the dependencies in a resolved and unresolved section
  const resolvedDependencies = []
  const unresolvedDependenciesMap = {}
  for (const name of factory.dependencies) {
    const value = get(partialDependencies, stripOptionalNotation(name))

    if (value) {
      resolvedDependencies.push(name)

      if (value.isFactory) {
        value.dependencies.forEach(d => {
          unresolvedDependenciesMap[d] = true
        })
      }
    } else {
      unresolvedDependenciesMap[name] = true
    }
  }

  resolvedDependencies.sort()
  const unresolvedDependencies = Object.keys(unresolvedDependenciesMap).sort()

  function createFromPartial (dependencies) {
    // resolve factory functions inside the partial dependencies
    const allDependencies = pick(partialDependencies, resolvedDependencies.map(stripOptionalNotation), (value, key) => {
      return (value && value.isFactory)
        ? value(dependencies)
        : value
    })

    // merge the resolved partial dependencies with the additional, left over dependencies
    deepExtend(allDependencies, dependencies)

    // all dependencies are complete, create the function
    return factory(allDependencies)
  }

  createFromPartial.cache = {}
  createFromPartial.isFactory = true
  createFromPartial.isPartial = true
  createFromPartial.fn = factory.fn
  createFromPartial.dependencies = unresolvedDependencies

  return createFromPartial
}

/**
 * Sort all factories such that when loading in order, the dependencies are resolved.
 *
 * @param {Array} factories
 * @returns {Array} Returns a new array with the sorted factories.
 */
export function sortFactories (factories) {
  const factoriesByName = {}
  for (const factory of factories) {
    factoriesByName[factory.fn] = factory
  }

  function containsDependency (factory, dependency) {
    // TODO: detect circular references
    if (isFactory(factory)) {
      if (contains(factory.dependencies, dependency.fn || dependency.name)) {
        return true
      }

      for (const d of factory.dependencies) {
        if (containsDependency(factoriesByName[d], dependency)) {
          return true
        }
      }
    }

    return false
  }

  const sorted = []

  function addFactory (factory) {
    let index = 0
    while (index < sorted.length && !containsDependency(sorted[index], factory)) {
      index++
    }

    sorted.splice(index, 0, factory)
  }

  // sort regular factory functions
  factories
    .filter(isFactory)
    .forEach(addFactory)

  // sort legacy factory functions AFTER the regular factory functions
  factories
    .filter(factory => !isFactory(factory))
    .forEach(addFactory)

  return sorted
}

// TODO: comment or cleanup if unused in the end
export function create (factories, scope = {}) {
  sortFactories(factories)
    .forEach(factory => factory(scope))

  return scope
}

/**
 * Test whether an object is a factory. This is the case when it has
 * properties name, dependencies, and a function create.
 * @param {*} obj
 * @returns {boolean}
 */
export function isFactory (obj) {
  return typeof obj === 'function' &&
    typeof obj.fn === 'string' &&
    Array.isArray(obj.dependencies)
}

/**
 * Assert that all dependencies of a list with dependencies are available in the provided scope.
 *
 * Will throw an exception when there are dependencies missing.
 *
 * @param {string} name   Name for the function to be created. Used to generate a useful error message
 * @param {string[]} dependencies
 * @param {Object} scope
 */
export function assertDependencies (name, dependencies, scope) {
  const allDefined = dependencies
    .filter(dependency => !isOptionalDependency(dependency)) // filter optionals
    .every(dependency => get(scope, dependency) !== undefined)

  if (!allDefined) {
    const missingDependencies = dependencies.filter(dependency => get(scope, dependency) === undefined)

    // TODO: create a custom error class for this, a MathjsError or something like that
    throw new Error(`Cannot create function "${name}", ` +
      `some dependencies are missing: ${missingDependencies.map(d => `"${d}"`).join(', ')}.`)
  }
}

function isOptionalDependency (dependency) {
  return dependency && dependency[0] === '?'
}

function stripOptionalNotation (dependency) {
  return dependency && dependency[0] === '?'
    ? dependency.slice(1)
    : dependency
}
