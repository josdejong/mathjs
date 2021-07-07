import { setSafeProperty, hasSafeProperty, getSafeProperty } from './customs.js'
import { isObject } from './is.js'

/**
 * A map facade on a bare object.
 *
 * The small number of methods needed to implement a scope,
 * forwarding on to the SafeProperty functions. Over time, the codebase
 * will stop using this method, as all objects will be Maps, rather than
 * more security prone objects.
 */
export class ObjectWrappingMap {
  constructor (object) {
    this.wrappedObject = object
  }

  keys () {
    return Object.keys(this.wrappedObject)
  }

  get (key) {
    return getSafeProperty(this.wrappedObject, key)
  }

  set (key, value) {
    setSafeProperty(this.wrappedObject, key, value)
    return this
  }

  has (key) {
    return hasSafeProperty(this.wrappedObject, key)
  }
}

/**
 * A lazy map implementation
 *
 * instead of setting a value, a value resolver can be set using `LazyMap.setLazy`.
 * The value will be resolved the first time it is requested, and is resolved only once.
 */
export class LazyMap {
  constructor () {
    this.values = new Map()
    this.valueResolvers = new Map()
  }

  keys () {
    return this.valueResolvers.keys()
  }

  /**
   * @param {string} key
   * @returns {*}
   */
  get (key) {
    if (!this.values.has(key)) {
      if (this.valueResolvers.has(key)) {
        const resolver = this.valueResolvers.get(key)
        const value = resolver()
        this.values.set(key, value)
      }
    }

    return this.values.get(key)
  }

  /**
   * @param {string} key
   * @param {*} value
   * @returns {LazyMap}
   */
  set (key, value) {
    this.values.set(key, value)
    this.valueResolvers.set(key, () => value)
    return this
  }

  /**
   * @param {string} key
   * @param {function() : *} resolver
   * @returns {LazyMap}
   */
  setLazy (key, resolver) {
    if (typeof resolver !== 'function') {
      throw new TypeError('Value resolver must be a function')
    }

    this.values.delete(key)
    this.valueResolvers.set(key, resolver)
    return this
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  has (key) {
    return this.valueResolvers.has(key)
  }
}

/**
 * Creates an empty map, or whatever your platform's polyfill is.
 *
 * @returns an empty Map or Map like object.
 */
export function createEmptyMap () {
  return new Map()
}

/**
 * Creates a Map from the given object.
 *
 * @param { Map | Object<string, *> } [mapOrObject]
 * @returns
 */
export function createMap (mapOrObject) {
  if (!mapOrObject) {
    return createEmptyMap()
  }
  if (isMap(mapOrObject)) {
    return mapOrObject
  }
  if (isObject(mapOrObject)) {
    return new ObjectWrappingMap(mapOrObject)
  }

  throw new Error('createMap can create maps from objects or Maps')
}

/**
 * Unwraps a map into an object.
 *
 * @param {Map} map
 * @returns { [key: string]: unknown }
 */
export function toObject (map) {
  if (map instanceof ObjectWrappingMap) {
    return map.wrappedObject
  }
  const object = {}
  for (const key of map.keys()) {
    const value = map.get(key)
    setSafeProperty(object, key, value)
  }
  return object
}

/**
 * Returns `true` if the passed object appears to be a Map (i.e. duck typing).
 *
 * Methods looked for are `get`, `set`, `keys` and `has`.
 *
 * @param {Map | object} object
 * @returns
 */
export function isMap (object) {
  // We can use the fast instanceof, or a slower duck typing check.
  // The duck typing method needs to cover enough methods to not be confused with DenseMatrix.
  if (!object) {
    return false
  }
  return object instanceof Map ||
    object instanceof ObjectWrappingMap ||
    (
      typeof object.set === 'function' &&
      typeof object.get === 'function' &&
      typeof object.keys === 'function' &&
      typeof object.has === 'function'
    )
}

/**
 * Copies the contents of key-value pairs from each `objects` in to `map`.
 *
 * Object is `objects` can be a `Map` or object.
 *
 * This is the `Map` analog to `Object.assign`.
 */
export function assign (map, ...objects) {
  for (const args of objects) {
    if (!args) {
      continue
    }
    if (isMap(args)) {
      for (const key of args.keys()) {
        map.set(key, args.get(key))
      }
    } else if (isObject(args)) {
      for (const key of Object.keys(args)) {
        map.set(key, args[key])
      }
    }
  }
  return map
}
