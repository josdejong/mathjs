import { ObjectWrappingMap, PartitionedMap } from './map.js'

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
 * @param  {Object} args
 * @returns {PartitionedMap}
 */
export function createSubScope (parentScope, args) {
  return new PartitionedMap(
    parentScope,
    new ObjectWrappingMap(args),
    new Set(Object.keys(args))
  )
}
