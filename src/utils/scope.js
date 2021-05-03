import { createEmptyMap, isMap } from './map.js'

function assign (scope, ...objects) {
  for (const args of objects) {
    if (!args) {
      continue
    }
    if (isMap(args)) {
      for (const key of args.keys()) {
        scope.set(key, args.get(key))
      }
    } else {
      for (const key of Object.keys(args)) {
        scope.set(key, args[key])
      }
    }
  }
  return scope
}

/**
 * Create a new scope which can access the parent scope,
 * but does not affect it when written. This is suitable for variable definitions
 * within a block node, or function definition.
 *
 * If parent scope has a createSubScope method, it delegates to that. Otherwise,
 * creates an empty map, and copies the parent scope to it, adding in
 * the remaining `args`.
 *
 * @param {Map} parentScope
 * @param  {...any} args
 * @returns {Map}
 */
export function createSubScope (parentScope, ...args) {
  if (typeof parentScope.createSubScope === 'function') {
    return parentScope.createSubScope(...args)
  }

  return assign(createEmptyMap(), parentScope, ...args)
}
