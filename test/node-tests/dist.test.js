// Only use native node.js API's and references to ./lib here, this file is not transpiled!
const assert = require('assert')
const { createSnapshotFromFactories, validateBundle } = require('../../lib/utils/snapshot')
const factoriesAny = require('../../lib/factoriesAny')
const version = require('../../package.json').version
const embeddedDocs = require('../../lib/expression/embeddedDocs/embeddedDocs')

const { expectedInstanceStructure } = createSnapshotFromFactories(factoriesAny)

describe('dist', function () {
  it('should load dist/math.js', function () {
    const math = require('../../dist/math.js')

    assert.strictEqual(math.add(2, 3), 5)
    assert.strictEqual(math.version, version)
  })

  it('should load dist/math.min.js', function () {
    const math = require('../../dist/math.min.js')

    assert.strictEqual(math.add(2, 3), 5)
    assert.strictEqual(math.version, version)
  })

  it('should have all expected functions in dist/main.js', function () {
    // snapshot testing
    const math = require('../../dist/math.js')

    // don't output all warnings "math.foo.bar is move to math.bar, ..."
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (args.join(' ').indexOf('is moved to') === -1) {
        originalWarn.apply(console, args)
      }
    }

    validateBundle(expectedInstanceStructure, math)

    console.warn = originalWarn
  })

  it('should have all expected functions in dist/main.min.js', function () {
    // snapshot testing
    const math = require('../../dist/math.js')

    // don't output all warnings "math.foo.bar is move to math.bar, ..."
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (args.join(' ').indexOf('is moved to') === -1) {
        originalWarn.apply(console, args)
      }
    }

    validateBundle(expectedInstanceStructure, math)

    console.warn = originalWarn
  })

  it('should contain embedded docs for every function', function () {
    const math = require('../../dist/math.js')

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
    const missing = []
    Object.keys(math.expression.mathWithTransform).forEach(function (prop) {
      const obj = math[prop]
      if (math.typeOf(obj) !== 'Object') {
        try {
          if (ignore.indexOf(prop) === -1) {
            math.help(prop).toString()
          }
        } catch (err) {
          missing.push(prop)
        }
      }
    })

    // test whether there is documentation for non existing functions
    const redundant = Object.keys(embeddedDocs).filter(function (prop) {
      // TODO: figure out why a property embeddedDocs is exported too
      return prop !== 'embeddedDocs' && math[prop] === undefined
    })

    if (missing.length > 0 || redundant.length > 0) {
      let message = 'Validation failed: not all functions have embedded documentation. '

      if (missing.length > 0) {
        message += 'Undocumented functions: ' + missing.join(', ') + '. '
      }

      if (redundant.length > 0) {
        message += 'Documentation for non-existing functions: ' + redundant.join(', ') + '. '
      }

      message += 'Embedded documentation for the expression parser is defined in src/expression/embeddedDocs.'

      throw Error(message)
    }
  })
})
