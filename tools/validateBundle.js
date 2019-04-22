//
// WARNING: don't use code here that can't run natively in node.js (like import)
//
const assert = require('assert')

function validateBundle (expectedBundleStructure, bundle) {
  const originalWarn = console.warn

  console.warn = function (...args) {
    if (args.join(' ').indexOf('is moved to') !== -1 && args.join(' ').indexOf('Please use the new location instead') !== -1) {
      // Ignore warnings like:
      // Warning: math.type.isNumber is moved to math.isNumber in v6.0.0. Please use the new location instead.
      return
    }

    originalWarn.apply(console, args)
  }

  try {
    const issues = []

    // see whether all expected functions and objects are there
    traverse(expectedBundleStructure, (expectedType, path) => {
      const actualValue = get(bundle, path)
      const actualType = validateTypeOf(actualValue)

      const message = (actualType === 'undefined')
        ? `Missing entry in bundle. ` +
        `Path: ${JSON.stringify(path)}, expected type: ${expectedType}, actual type: ${actualType}`
        : `Unexpected entry type in bundle. ` +
        `Path: ${JSON.stringify(path)}, expected type: ${expectedType}, actual type: ${actualType}`

      if (actualType !== expectedType) {
        issues.push({ actualType, expectedType, message })

        console.warn(message)
      }
    })

    // see whether there are any functions or objects that shouldn't be there
    traverse(bundle, (actualValue, path) => {
      const actualType = validateTypeOf(actualValue)
      const expectedType = get(expectedBundleStructure, path) || 'undefined'

      // FIXME: ugly to have these special cases
      if (path.join('.').indexOf('docs.') !== -1) {
        // ignore the contents of docs
        return
      }
      if (path.join('.').indexOf('all.') !== -1) {
        // ignore the contents of all dependencies
        return
      }

      const message = (expectedType === 'undefined')
        ? `Unknown entry in bundle. ` +
        'Is there a new function added which is missing in this snapshot test? ' +
        `Path: ${JSON.stringify(path)}, expected type: ${expectedType}, actual type: ${actualType}`
        : `Unexpected entry type in bundle. ` +
        `Path: ${JSON.stringify(path)}, expected type: ${expectedType}, actual type: ${actualType}`

      if (actualType !== expectedType) {
        issues.push({ actualType, expectedType, message })

        console.warn(message)
      }
    })

    // assert on the first issue (if any)
    if (issues.length > 0) {
      const { actualType, expectedType, message } = issues[0]

      console.warn(`${issues.length} bundle issues found`)

      assert.strictEqual(actualType, expectedType, message)
    }
  } finally {
    console.warn = originalWarn
  }
}

function traverse (obj, callback = (value, path) => {}, path = []) {
  // FIXME: ugly to have these special cases
  if (path.length > 0 && path[0].indexOf('Dependencies') !== -1) {
    // special case for objects holding a collection of dependencies
    callback(obj, path)
  } else if (validateTypeOf(obj) === 'Array') {
    obj.map((item, index) => traverse(item, callback, path.concat(index)))
  } else if (validateTypeOf(obj) === 'Object') {
    Object.keys(obj).forEach(key => {
      // FIXME: ugly to have these special cases
      // ignore special case of deprecated docs
      if (key === 'docs' && path.join('.') === 'expression') {
        return
      }

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
