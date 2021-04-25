import { setSafeProperty, hasSafeProperty, getSafeProperty } from './customs.js'

export class ObjectScopeWrapper {
  constructor (objectScope) {
    this.objectScope = objectScope
  }

  keys () {
    return Object.keys(this.objectScope)
  }

  get (key) {
    return getSafeProperty(this.objectScope, key)
  }

  set (key, value) {
    setSafeProperty(this.objectScope, key, value)
    return this
  }

  has (key) {
    return hasSafeProperty(this.objectScope, key)
  }
}

export function createEmptyMap () {
  return new Map()
}

export function createMap (objectOrScope) {
  if (!objectOrScope) {
    return new Map()
  }
  if (isMap(objectOrScope)) {
    return objectOrScope
  }
  if (typeof objectOrScope === 'object') {
    return new ObjectScopeWrapper(objectOrScope)
  }
}

export function toObject (scope) {
  if (scope instanceof ObjectScopeWrapper) {
    return scope.objectScope
  }
  const object = {}
  for (const key of scope.keys()) {
    const value = scope.get(key)
    setSafeProperty(object, key, value)
  }
  return object
}

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

export function createSubScope (parentScope, ...args) {
  if (typeof parentScope.createSubScope === 'function') {
    return parentScope.createSubScope(...args)
  }

  return assign(createEmptyMap(), parentScope, ...args)
}

export function isMap (object) {
  // We can use the fast instanceof, or a slower duck typing check.
  // The duck typing method needs to cover enough methods to not be confused with DenseMatrix.
  return object instanceof Map ||
    ['set', 'get', 'keys', 'has'].reduce((soFarSoGood, methodName) => soFarSoGood && typeof object[methodName] === 'function', true)
}

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
