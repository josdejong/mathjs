'use strict';

var hasOwnProperty = require('./object').hasOwnProperty;

/**
 * Get a property of a plain object
 * Throws an error in case the object is not a plain object or the
 * property is not defined on the object itself
 * @param {Object} object
 * @param {string} prop
 * @return {*} Returns the property value when safe
 */
function getSafeProperty (object, prop) {
  // only allow getting properties of a plain object
  if (isPlainObject(object)) {
    // only allow getting properties defined on the object itself,
    // not inherited from it's prototype.
    if (hasOwnProperty(object, prop)) {
      return object[prop];
    }

    if (!(prop in object)) {
      // this is a not existing property on a plain object
      return undefined;
    }
  }

  if (typeof object[prop] === 'function' && isSafeMethod(object, prop)) {
    throw new Error('Cannot access method "' + prop + '" as a property');
  }

  throw new Error('No access to property "' + prop + '"');
}

/**
 * Set a property on a plain object.
 * Throws an error in case the object is not a plain object or the
 * property would override an inherited property like .constructor or .toString
 * @param {Object} object
 * @param {string} prop
 * @param {*} value
 * @return {*} Returns the value
 */
// TODO: merge this function into access.js?
function setSafeProperty (object, prop, value) {
  // only allow setting properties of a plain object
  if (isPlainObject(object)) {
    // only allow setting properties defined on the object itself,
    // not inherited from it's prototype.
    if (prop in object) {
      // property already exists
      // override when the property is defined on the object itself.
      // don't allow overriding inherited properties like .constructor or .toString
      if (hasOwnProperty(object, prop)) {
        return object[prop] = value;
      }
    }
    else {
      // this is a new property, that's just ok
      return object[prop] = value;
    }
  }

  throw new Error('No access to property "' + prop + '"');
}

/**
 * Test whether a property is safe to use for an object.
 * For example .toString and .constructor are not safe
 * @param {string} prop
 * @return {boolean} Returns true when safe
 */
function isSafeProperty (prop) {
  return !(prop in {});
}

/**
 * Validate whether a method is safe.
 * Throws an error when that's not the case.
 * @param {Object} object
 * @param {string} method
 */
// TODO: merge this function into assign.js?
function validateSafeMethod (object, method) {
  if (!isSafeMethod(object, method)) {
    throw new Error('No access to method "' + method + '"');
  }
}

/**
 * Check whether a method is safe.
 * Throws an error when that's not the case (for example for `constructor`).
 * @param {Object} object
 * @param {string} method
 * @return {boolean} Returns true when safe, false otherwise
 */
function isSafeMethod (object, method) {
  // test for plain functions defined on the object (instead of a method)
  if (hasOwnProperty(object, method)) {
    return isPlainObject(object);
  }
  else {
    // only allow methods:
    // - defined on the prototype of this object
    // - not defined on the prototype of native Object
    //   i.e. constructor, __defineGetter__, hasOwnProperty, etc. are not allowed
    // - calling methods on a function (like bind) is not allowed
    // - A few safe native methods are allowed: toString, valueOf, toLocaleString
    return (object && typeof object !== 'function' &&
        (hasOwnProperty(object.constructor.prototype, method) ||
            hasOwnProperty(object.__proto__, method)) &&
        (!hasOwnProperty(Object.prototype, method) || hasOwnProperty(safeNativeMethods, method)));
  }
}

function isPlainObject (object) {
  return typeof object === 'object' && object && object.constructor === Object;
}

var safeNativeMethods = {
  toString: true,
  valueOf: true,
  toLocaleString: true
};

exports.getSafeProperty = getSafeProperty;
exports.setSafeProperty = setSafeProperty;
exports.isSafeProperty = isSafeProperty;
exports.validateSafeMethod = validateSafeMethod;
exports.isSafeMethod = isSafeMethod;
exports.isPlainObject = isPlainObject;
