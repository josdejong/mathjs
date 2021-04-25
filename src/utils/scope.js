import { setSafeProperty, hasSafeProperty, getSafeProperty, isMapLike } from './customs.js'

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
    return setSafeProperty(this.objectScope, key, value)
  }

  has (key) {
    return hasSafeProperty(this.objectScope, key)
  }
}

export function createEmptyScope () {
  return new Map()
}

export function createScope (objectOrScope) {
  if (!objectOrScope) {
    return new Map()
  }
  if (isMapLike(objectOrScope)) {
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

export function assign (scope, ...objects) {
  for (const args of objects) {
    if (!args) {
      continue
    }
    if (isMapLike(args)) {
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

  return assign(createEmptyScope(), parentScope, ...args)
}
