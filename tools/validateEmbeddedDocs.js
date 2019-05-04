/**
 * Validate whether all functions in math.js are documented in math.docs
 * we use the minified bundle to also check whether that bundle is valid.
 */
const log = require('fancy-log')
const math = require('../dist/math.min.js')
let prop

// names to ignore
const ignore = [
  // functions not supported or relevant for the parser:
  'chain', 'print',
  'compile', 'parse', 'parser', // TODO: add embedded docs for compile, parse, and parser?
  'reviver', // TODO: add embedded docs for reviver?
  'apply', // FIXME: apply is not supported right now because of security concerns
  'eye', 'var', 'eval', 'typeof', // deprecated functions
  'addScalar', 'divideScalar', 'multiplyScalar', 'equalScalar'
]

// test whether all functions are documented
let undocumentedCount = 0
for (prop in math.expression.mathWithTransform) {
  if (math.expression.mathWithTransform.hasOwnProperty(prop)) {
    const obj = math[prop]
    if (math['typeOf'](obj) !== 'Object') {
      try {
        if (ignore.indexOf(prop) === -1) {
          math.help(prop).toString()
        }
      } catch (err) {
        undocumentedCount++
        log('WARNING: Function ' + prop + ' is undocumented')
      }
    }
  }
}

// test whether there is documentation for non existing functions
let nonExistingCount = 0
const docs = math.docs
for (prop in docs) {
  if (docs.hasOwnProperty(prop)) {
    if (math[prop] === undefined) {
      log('WARNING: Documentation for a non-existing function "' + prop + '"')
      nonExistingCount++
    }
  }
}

// done. Output results
if (undocumentedCount === 0 && nonExistingCount === 0) {
  log('Validation successful: all functions are documented.')
} else {
  log('Validation failed: not all functions are documented.')
}
