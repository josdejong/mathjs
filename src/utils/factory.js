/**
 * Test whether an object is a factory. This is the case when it has
 * properties name, dependencies, and a function create.
 * @param {any} obj
 * @returns {boolean}
 */
export function isFactory (obj) {
  return typeof obj === 'object' &&
    typeof obj.name === 'string' &&
    Array.isArray(obj.dependencies) &&
    typeof obj.create === 'function'
}

/**
 * Compare two factory objects to sort them such that the dependencies
 * are resolved in correct order
 * @param {*} a
 * @param {*} b
 * @returns {number}
 */
export function compareFactories (a, b) {
  if (!isFactory(a)) {
    return -1
  }

  if (!isFactory(b)) {
    return 1
  }

  const aNeedsB = a.dependencies.indexOf(b.name) !== -1
  const bNeedsA = b.dependencies.indexOf(a.name) !== -1

  return aNeedsB
    ? bNeedsA
      ? 0 // circular dependency, leave order as is
      : 1
    : bNeedsA
      ? -1
      : 0
}
