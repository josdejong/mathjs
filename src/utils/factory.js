import { contains } from './array'
import { pickShallow } from './object'

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
 *     const dependencies = ['config', 'typed', 'divideScalar', 'Complex']
 *
 *     export const createLog = factory(name, dependencies, ({ typed, config, divideScalar, Complex }) => {
 *       // ... create the function log here and return it
 *     }
 *
 * @param {string} name           Name of the function to be created
 * @param {string[]} dependencies The names of all required dependencies
 * @param {function} create       Callback function called with an object with all dependencies
 * @param {Object} [meta]         Optional object with meta information that will be attached
 *                                to the created factory function as property `meta`.
 * @returns {function}
 */
export function factory (name, dependencies, create, meta) {
  function assertAndCreate (scope) {
    // we only pass the requested dependencies to the factory function
    // to prevent functions to rely on dependencies that are not explicitly
    // requested.
    const deps = pickShallow(scope, dependencies.map(stripOptionalNotation))

    assertDependencies(name, dependencies, scope)

    return create(deps)
  }

  assertAndCreate.isFactory = true
  assertAndCreate.fn = name
  assertAndCreate.dependencies = dependencies.slice().sort()
  if (meta) {
    assertAndCreate.meta = meta
  }

  return assertAndCreate
}

/**
 * Sort all factories such that when loading in order, the dependencies are resolved.
 *
 * @param {Array} factories
 * @returns {Array} Returns a new array with the sorted factories.
 */
export function sortFactories (factories) {
  const factoriesByName = {}

  factories.forEach(factory => {
    factoriesByName[factory.fn] = factory
  })

  function containsDependency (factory, dependency) {
    // TODO: detect circular references
    if (isFactory(factory)) {
      if (contains(factory.dependencies, dependency.fn || dependency.name)) {
        return true
      }

      if (factory.dependencies.some(d => containsDependency(factoriesByName[d], dependency))) {
        return true
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
    .every(dependency => scope[dependency] !== undefined)

  if (!allDefined) {
    const missingDependencies = dependencies.filter(dependency => scope[dependency] === undefined)

    // TODO: create a custom error class for this, a MathjsError or something like that
    throw new Error(`Cannot create function "${name}", ` +
      `some dependencies are missing: ${missingDependencies.map(d => `"${d}"`).join(', ')}.`)
  }
}

export function isOptionalDependency (dependency) {
  return dependency && dependency[0] === '?'
}

export function stripOptionalNotation (dependency) {
  return dependency && dependency[0] === '?'
    ? dependency.slice(1)
    : dependency
}
