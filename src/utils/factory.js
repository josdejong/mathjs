// TODO: comment
import { pick } from './object'

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

// TODO: comment
export function sortFactories (factories) {
  const sorted = []

  for (const factory of factories) {
    let index = 0
    while (index < sorted.length && canLoadAfter(factory, sorted[index])) {
      index++
    }

    sorted.splice(index, 0, factory)
  }

  return sorted
}

// helper function of sortFactories
function canLoadAfter (a, b) {
  // keep non-factory functions before factory functions
  if (!isFactory(a)) {
    // if b is also a non-factory function, insert after b to maintain the original order
    return !isFactory(b)
  }

  if (!isFactory(b)) {
    return true
  }

  return contains(b.dependencies, a.fn)
    ? contains(a.dependencies, b.fn) // if true, there is a circular dependency, leave order as is in that case
    : true
}

function contains (arr, item) {
  return arr.indexOf(item) !== -1
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
  if (!dependencies.every(dependency => dependency in scope)) {
    const missingDependencies = dependencies.filter(dependency => !(dependency in scope))

    // TODO: create a custom error class for this, a MathjsError or something like that
    throw new Error(`Cannot create function ${name}, ` +
      `some dependencies are missing: ${missingDependencies.join(', ')}.`)
  }
}
