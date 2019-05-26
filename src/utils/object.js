import { isBigNumber } from './is'

/**
 * Clone an object
 *
 *     clone(x)
 *
 * Can clone any primitive type, array, and object.
 * If x has a function clone, this function will be invoked to clone the object.
 *
 * @param {*} x
 * @return {*} clone
 */
export function clone (x) {
  const type = typeof x

  // immutable primitive types
  if (type === 'number' || type === 'string' || type === 'boolean' ||
      x === null || x === undefined) {
    return x
  }

  // use clone function of the object when available
  if (typeof x.clone === 'function') {
    return x.clone()
  }

  // array
  if (Array.isArray(x)) {
    return x.map(function (value) {
      return clone(value)
    })
  }

  if (x instanceof Date) return new Date(x.valueOf())
  if (isBigNumber(x)) return x // bignumbers are immutable
  if (x instanceof RegExp) throw new TypeError('Cannot clone ' + x) // TODO: clone a RegExp

  // object
  return mapObject(x, clone)
}

/**
 * Apply map to all properties of an object
 * @param {Object} object
 * @param {function} callback
 * @return {Object} Returns a copy of the object with mapped properties
 */
export function mapObject (object, callback) {
  const clone = {}

  for (const key in object) {
    if (hasOwnProperty(object, key)) {
      clone[key] = callback(object[key])
    }
  }

  return clone
}

/**
 * Extend object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @return {Object} a
 */
export function extend (a, b) {
  for (const prop in b) {
    if (hasOwnProperty(b, prop)) {
      a[prop] = b[prop]
    }
  }
  return a
}

/**
 * Deep extend an object a with the properties of object b
 * @param {Object} a
 * @param {Object} b
 * @returns {Object}
 */
export function deepExtend (a, b) {
  // TODO: add support for Arrays to deepExtend
  if (Array.isArray(b)) {
    throw new TypeError('Arrays are not supported by deepExtend')
  }

  for (const prop in b) {
    if (hasOwnProperty(b, prop)) {
      if (b[prop] && b[prop].constructor === Object) {
        if (a[prop] === undefined) {
          a[prop] = {}
        }
        if (a[prop] && a[prop].constructor === Object) {
          deepExtend(a[prop], b[prop])
        } else {
          a[prop] = b[prop]
        }
      } else if (Array.isArray(b[prop])) {
        throw new TypeError('Arrays are not supported by deepExtend')
      } else {
        a[prop] = b[prop]
      }
    }
  }
  return a
}

/**
 * Deep test equality of all fields in two pairs of arrays or objects.
 * Compares values and functions strictly (ie. 2 is not the same as '2').
 * @param {Array | Object} a
 * @param {Array | Object} b
 * @returns {boolean}
 */
export function deepStrictEqual (a, b) {
  let prop, i, len
  if (Array.isArray(a)) {
    if (!Array.isArray(b)) {
      return false
    }

    if (a.length !== b.length) {
      return false
    }

    for (i = 0, len = a.length; i < len; i++) {
      if (!deepStrictEqual(a[i], b[i])) {
        return false
      }
    }
    return true
  } else if (typeof a === 'function') {
    return (a === b)
  } else if (a instanceof Object) {
    if (Array.isArray(b) || !(b instanceof Object)) {
      return false
    }

    for (prop in a) {
      // noinspection JSUnfilteredForInLoop
      if (!(prop in b) || !deepStrictEqual(a[prop], b[prop])) {
        return false
      }
    }
    for (prop in b) {
      // noinspection JSUnfilteredForInLoop
      if (!(prop in a) || !deepStrictEqual(a[prop], b[prop])) {
        return false
      }
    }
    return true
  } else {
    return (a === b)
  }
}

/**
 * Recursively flatten a nested object.
 * @param {Object} nestedObject
 * @return {Object} Returns the flattened object
 */
export function deepFlatten (nestedObject) {
  const flattenedObject = {}

  _deepFlatten(nestedObject, flattenedObject)

  return flattenedObject
}

// helper function used by deepFlatten
function _deepFlatten (nestedObject, flattenedObject) {
  for (const prop in nestedObject) {
    if (nestedObject.hasOwnProperty(prop)) {
      const value = nestedObject[prop]
      if (typeof value === 'object' && value !== null) {
        _deepFlatten(value, flattenedObject)
      } else {
        flattenedObject[prop] = value
      }
    }
  }
}

/**
 * Test whether the current JavaScript engine supports Object.defineProperty
 * @returns {boolean} returns true if supported
 */
export function canDefineProperty () {
  // test needed for broken IE8 implementation
  try {
    if (Object.defineProperty) {
      Object.defineProperty({}, 'x', { get: function () {} })
      return true
    }
  } catch (e) {}

  return false
}

/**
 * Attach a lazy loading property to a constant.
 * The given function `fn` is called once when the property is first requested.
 *
 * @param {Object} object         Object where to add the property
 * @param {string} prop           Property name
 * @param {Function} valueResolver Function returning the property value. Called
 *                                without arguments.
 */
export function lazy (object, prop, valueResolver) {
  let _uninitialized = true
  let _value

  Object.defineProperty(object, prop, {
    get: function () {
      if (_uninitialized) {
        _value = valueResolver()
        _uninitialized = false
      }
      return _value
    },

    set: function (value) {
      _value = value
      _uninitialized = false
    },

    configurable: true,
    enumerable: true
  })
}

/**
 * Traverse a path into an object.
 * When a namespace is missing, it will be created
 * @param {Object} object
 * @param {string | string[]} path   A dot separated string like 'name.space'
 * @return {Object} Returns the object at the end of the path
 */
export function traverse (object, path) {
  if (path && typeof path === 'string') {
    return traverse(object, path.split('.'))
  }

  let obj = object

  if (path) {
    for (let i = 0; i < path.length; i++) {
      const key = path[i]
      if (!(key in obj)) {
        obj[key] = {}
      }
      obj = obj[key]
    }
  }

  return obj
}

/**
 * A safe hasOwnProperty
 * @param {Object} object
 * @param {string} property
 */
export function hasOwnProperty (object, property) {
  return object && Object.hasOwnProperty.call(object, property)
}

/**
 * Test whether an object is a factory. a factory has fields:
 *
 * - factory: function (type: Object, config: Object, load: function, typed: function [, math: Object])   (required)
 * - name: string (optional)
 * - path: string    A dot separated path (optional)
 * - math: boolean   If true (false by default), the math namespace is passed
 *                   as fifth argument of the factory function
 *
 * @param {*} object
 * @returns {boolean}
 */
export function isLegacyFactory (object) {
  return object && typeof object.factory === 'function'
}

/**
 * Get a nested property from an object
 * @param {Object} object
 * @param {string | string[]} path
 * @returns {Object}
 */
export function get (object, path) {
  if (typeof path === 'string') {
    if (isPath(path)) {
      return get(object, path.split('.'))
    } else {
      return object[path]
    }
  }

  let child = object

  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    child = child ? child[key] : undefined
  }

  return child
}

/**
 * Set a nested property in an object
 * Mutates the object itself
 * If the path doesn't exist, it will be created
 * @param {Object} object
 * @param {string | string[]} path
 * @param {*} value
 * @returns {Object}
 */
export function set (object, path, value) {
  if (typeof path === 'string') {
    if (isPath(path)) {
      return set(object, path.split('.'), value)
    } else {
      object[path] = value
      return object
    }
  }

  let child = object
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i]
    if (child[key] === undefined) {
      child[key] = {}
    }
    child = child[key]
  }

  if (path.length > 0) {
    const lastKey = path[path.length - 1]
    child[lastKey] = value
  }

  return object
}

/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} properties
 * @param {function} [transform] Optional value to transform a value when picking it
 * @return {Object}
 */
export function pick (object, properties, transform) {
  const copy = {}

  for (let i = 0; i < properties.length; i++) {
    const key = properties[i]
    const value = get(object, key)
    if (value !== undefined) {
      set(copy, key, transform ? transform(value, key) : value)
    }
  }

  return copy
}

/**
 * Shallow version of pick, creating an object composed of the picked object properties
 * but not for nested properties
 * @param {Object} object
 * @param {string[]} properties
 * @return {Object}
 */
export function pickShallow (object, properties) {
  const copy = {}

  for (let i = 0; i < properties.length; i++) {
    const key = properties[i]
    const value = object[key]
    if (value !== undefined) {
      copy[key] = value
    }
  }

  return copy
}

export function values (object) {
  return Object.keys(object).map(key => object[key])
}

// helper function to test whether a string contains a path like 'user.name'
function isPath (str) {
  return str.indexOf('.') !== -1
}
