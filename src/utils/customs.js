import { hasOwnProperty } from './object.js'

/**
 * Get a property of a plain object or array
 * Throws an error in case the object is not a plain object or the
 * property is not defined on the object itself
 * @param {Object} object
 * @param {string} prop
 * @return {*} Returns the property value when safe
 */
export function getSafeProperty (object, prop) {
  if (isSafeObjectProperty(object, prop) || isSafeArrayProperty(object, prop)) {
    return object[prop]
  }

  if (isSafeMethod(object, prop)) {
    throw new Error(`Cannot access method "${prop}" as a property`)
  }

  if (object === null || object === undefined) {
    throw new TypeError(`Cannot access property "${prop}": object is ${object}`)
  }

  throw new Error('No access to property "' + prop + '"')
}

/**
 * Set a property on a plain object or array.
 * Throws an error in case the object is not a plain object or the
 * property would override an inherited property like .constructor or .toString
 * @param {Object} object
 * @param {string} prop
 * @param {*} value
 * @return {*} Returns the value
 */
export function setSafeProperty (object, prop, value) {
  if (isSafeObjectProperty(object, prop) || isSafeArrayProperty(object, prop)) {
    object[prop] = value
    return value
  }

  throw new Error(`No access to property "${prop}"`)
}

/**
 * Test whether a property is safe for reading and writing on an object
 * For example .constructor and .__proto__ are not safe
 * @param {Object} object
 * @param {string} prop
 * @return {boolean} Returns true when safe
 */
export function isSafeObjectProperty (object, prop) {
  if (!isPlainObject(object)) {
    return false
  }

  return !(prop in Object.prototype)
}

/**
 * Test whether a property is safe for reading and writing on an Array
 * For example .__proto__ and .constructor are not safe
 * @param {unknown} array
 * @param {string | number} prop
 * @return {boolean} Returns true when safe
 */
export function isSafeArrayProperty (array, prop) {
  if (!Array.isArray(array)) {
    return false
  }

  return (
    typeof prop === 'number' ||
    (typeof prop === 'string' && isInteger(prop)) ||
    prop === 'length'
  )
}

function isInteger (prop) {
  return /^\d+$/.test(prop)
}

/**
 * Validate whether a method is safe.
 * Throws an error when that's not the case.
 * @param {Object} object
 * @param {string} method
 * @return {function} Returns the method when valid
 */
export function getSafeMethod (object, method) {
  if (!isSafeMethod(object, method)) {
    throw new Error('No access to method "' + method + '"')
  }

  return object[method]
}

/**
 * Check whether a method is safe.
 * Throws an error when that's not the case (for example for `constructor`).
 * @param {Object} object
 * @param {string} method
 * @return {boolean} Returns true when safe, false otherwise
 */
export function isSafeMethod (object, method) {
  if (
    object === null ||
    object === undefined ||
    typeof object[method] !== 'function'
  ) {
    return false
  }

  // UNSAFE: ghosted
  // e.g overridden toString
  // Note that IE10 doesn't support __proto__ and we can't do this check there.
  if (
    hasOwnProperty(object, method) &&
    Object.getPrototypeOf &&
    method in Object.getPrototypeOf(object)
  ) {
    return false
  }

  // SAFE: whitelisted
  // e.g toString
  if (safeNativeMethods.has(method)) {
    return true
  }

  // UNSAFE: inherited from Object prototype
  // e.g constructor
  if (method in Object.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Object.prototype is a root object
    return false
  }

  // UNSAFE: inherited from Function prototype
  // e.g call, apply
  if (method in Function.prototype) {
    // 'in' is used instead of hasOwnProperty for nodejs v0.10
    // which is inconsistent on root prototypes. It is safe
    // here because Function.prototype is a root object
    return false
  }

  return true
}

export function isPlainObject (object) {
  return typeof object === 'object' && object && object.constructor === Object
}

const safeNativeMethods = new Set(['toString', 'valueOf', 'toLocaleString'])
