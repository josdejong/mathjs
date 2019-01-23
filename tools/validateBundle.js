//
// WARNING: don't use code here that can't run natively in node.js (like import)
//
const assert = require('assert')

function validateBundle (expectedBundleStructure, bundle) {
  // see whether all expected functions and objects are there
  traverse(expectedBundleStructure, (expectedType, path) => {
    const actualValue = get(bundle, path)
    const actualType = validateTypeOf(actualValue)

    const message = (actualType === 'undefined')
      ? `Missing entity in bundle (path=${JSON.stringify(path)})`
      : `Unexpected type in bundle (path=${JSON.stringify(path)})`

    // if (actualType !== expectedType) {
    //   console.warn(message, actualType, expectedType)
    // }

    assert.strictEqual(actualType, expectedType, message)
  })

  // see whether there are any functions or objects that shouldn't be there
  traverse(bundle, (actualValue, path) => {
    const actualType = validateTypeOf(actualValue)
    const expectedType = get(expectedBundleStructure, path) || 'undefined'

    if (path.join('.').indexOf('expression.docs') !== -1) {
      // ignore the contents of docs
      return true
    }

    const message = (expectedType === 'undefined')
      ? `Unknown entity in bundle (path=${JSON.stringify(path)}). ` +
      'Is there a new function added which is missing in this snapshot test?'
      : `Unexpected type in bundle (path=${JSON.stringify(path)})`

    // if (actualType !== expectedType) {
    //   console.warn(message, actualType, expectedType)
    // }

    assert.strictEqual(actualType, expectedType, message)
  })
}

function traverse (obj, callback = (value, path) => {}, path = []) {
  if (validateTypeOf(obj) === 'Array') {
    obj.map((item, index) => traverse(item, callback, path.concat(index)))
  } else if (validateTypeOf(obj) === 'Object') {
    Object.keys(obj).forEach(key => {
      traverse(obj[key], callback, path.concat(key))
    })
  } else {
    callback(obj, path)
  }
}

function get (object, path) {
  let child = object

  for (let i = 0; i < path.length; i++) {
    const key = path[i]
    child = child ? child[key] : undefined
  }

  return child
}

function validateTypeOf (x) {
  if (x && x.type === 'Unit') {
    return 'Unit'
  }

  if (x && x.type === 'Complex') {
    return 'Complex'
  }

  if (Array.isArray(x)) {
    return 'Array'
  }

  if (x === null) {
    return 'null'
  }

  if (typeof x === 'function') {
    return 'Function'
  }

  if (typeof x === 'object') {
    return 'Object'
  }

  return typeof x
}

exports.validateBundle = validateBundle
exports.validateTypeOf = validateTypeOf
