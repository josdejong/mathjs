import { setSafeProperty, hasSafeProperty, getSafeProperty } from './customs.js'

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
 * @param { Map | { [key: string]: unknown } | undefined } mapOrObject
 * @returns
 */
export function createMap (mapOrObject) {
  if (!mapOrObject) {
    return createEmptyMap()
  }
  if (isMap(mapOrObject)) {
    return mapOrObject
  }
  if (typeof mapOrObject === 'object') {
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
  return object instanceof Map ||
    object instanceof ObjectWrappingMap ||
    (
      typeof object.set === 'function' &&
      typeof object.get === 'function' &&
      typeof object.keys === 'function' &&
      typeof object.has === 'function'
    )
}

/*
 * These wrapper functions are temporary. They provide scaffolding around calling the methods
 * directly. The simplest example is to a more helpful error message when things go wrong.
 */
export function setMapProperty (object, prop, value) {
  if (!isMap(object)) {
    throw new Error('Scope is not map like')
  }
  return object.set(prop, value)
}

export function getMapProperty (object, prop) {
  if (!isMap(object)) {
    throw new Error('Scope is not map like')
  }
  return object.get(prop)
}

export function getMapProperties (object) {
  if (!isMap(object)) {
    throw new Error('Scope is not map like')
  }
  return object.keys()
}

export function hasMapProperty (object, prop) {
  if (!isMap(object)) {
    throw new Error('Scope is not map like')
  }
  return object.has(prop)
}
