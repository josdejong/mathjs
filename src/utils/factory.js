import { contains } from './array'
import { get, pick } from './object'

/**
 * Create a factory function, which can be used to inject dependencies.
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
  const assertAndCreate = (scope) => {
    assertDependencies(name, dependencies, scope)

    // we only pass the requested dependencies to the factory function
    return create(pick(scope, dependencies))
  }

  assertAndCreate.fn = name
  assertAndCreate.dependencies = dependencies

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

// TODO: comment
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
  if (!dependencies.every(dependency => get(scope, dependency) !== undefined)) {
    const missingDependencies = dependencies.filter(dependency => get(scope, dependency) === undefined)

    // TODO: create a custom error class for this, a MathjsError or something like that
    throw new Error(`Cannot create function "${name}", ` +
      `some dependencies are missing: ${missingDependencies.map(d => `"${d}"`).join(', ')}.`)
  }
}
