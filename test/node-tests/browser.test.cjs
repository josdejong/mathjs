// Only use native node.js API's and references to ./lib here, this file is not transpiled!
const path = require('node:path')
const assert = require('node:assert')
const { createSnapshotFromFactories, validateBundle } = require('../../lib/cjs/utils/snapshot')
const factoriesAny = require('../../lib/cjs/factoriesAny')
const version = require('../../package.json').version
const embeddedDocs = require('../../lib/cjs/expression/embeddedDocs/embeddedDocs')

const { expectedInstanceStructure } = createSnapshotFromFactories(factoriesAny)

const mathjsBundle = '../../lib/browser/math.js'

describe('lib/browser', function () {
  it('should load lib/browser/math.js', function () {
    const math = require(mathjsBundle)

    assert.strictEqual(math.add(2, 3), 5)
    assert.strictEqual(math.version, version)
  })

  it('should have all expected functions in lib/browser/main.js', function () {
    // snapshot testing
    const math = require(mathjsBundle)

    // don't output all warnings "math.foo.bar is move to math.bar, ..."
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (!args.join(' ').includes('is moved to')) {
        originalWarn.apply(console, args)
      }
    }

    validateBundle(expectedInstanceStructure, math)

    console.warn = originalWarn
  })

  it('should be ES2020 compatible', async function () {
    const { runChecks } = require('es-check')

    const absBundlePath = path.join(__dirname, mathjsBundle)
      .replaceAll('\\', '/') // normalize as Unix path

    const result = await runChecks([{
      ecmaVersion: 'es2020',
      files: [absBundlePath],
      checkFeatures: true
    }])

    if (!result.success) {
      const message = `ES Check failed with ${result.errors.length} errors:\n` +
        result.errors.map(error => `- ${error.file}: ${error.err.message}`).join('\n')

      throw new Error(message)
    }
  })

  describe('typeOf should work on the minified bundle for all mathjs classes', function () {
    const math = require(mathjsBundle)

    const typeOfTests = [
      { value: math.bignumber(2), expectedType: 'BigNumber' },
      { value: math.fraction(1, 3), expectedType: 'Fraction' },
      { value: math.fraction(1, 3), expectedType: 'Fraction' },
      { value: math.complex(2, 4), expectedType: 'Complex' },
      { value: math.unit('5 cm'), expectedType: 'Unit' },
      { value: math.matrix([], 'dense'), expectedType: 'DenseMatrix' },
      { value: math.matrix([], 'sparse'), expectedType: 'SparseMatrix' },
      { value: math.parse('A[2]'), expectedType: 'AccessorNode' },
      { value: math.parse('[1, 2, 3]'), expectedType: 'ArrayNode' },
      { value: math.parse('x = 2'), expectedType: 'AssignmentNode' },
      { value: math.parse('x = 2; y = 3'), expectedType: 'BlockNode' },
      { value: math.parse('x < 0 ? 0 : x'), expectedType: 'ConditionalNode' },
      { value: math.parse('3'), expectedType: 'ConstantNode' },
      { value: math.parse('f(x) = x^2'), expectedType: 'FunctionAssignmentNode' },
      { value: math.parse('sqrt(4)'), expectedType: 'FunctionNode' },
      { value: new math.IndexNode([]), expectedType: 'IndexNode' },
      { value: math.parse('{}'), expectedType: 'ObjectNode' },
      { value: math.parse('(2 + 3)'), expectedType: 'ParenthesisNode' },
      { value: math.parse('1:10'), expectedType: 'RangeNode' },
      { value: math.parse('2 > 3 > 4'), expectedType: 'RelationalNode' },
      { value: math.parse('2 + 3'), expectedType: 'OperatorNode' }
    ]

    typeOfTests.forEach(({ value, expectedType }) => {
      it(`typeOf should return ${expectedType}`, function () {
        assert.strictEqual(math.typeOf(value), expectedType)
      })
    })
  })

  it('should contain embedded docs for every function', function () {
    const math = require(mathjsBundle)

    // names to ignore
    const ignore = [
      // functions not supported or relevant for the parser:
      'chain', 'print',
      'compile', 'parse', 'parser', // TODO: add embedded docs for compile, parse, and parser?
      'reviver', 'replacer', // TODO: add embedded docs for reviver and replacer?
      'apply', // FIXME: apply is not supported right now because of security concerns
      'addScalar', 'subtractScalar', 'divideScalar', 'multiplyScalar', 'equalScalar'
    ]

    // test whether all functions are documented
    const missing = []
    Object.keys(math.expression.mathWithTransform).forEach(function (prop) {
      const obj = math[prop]
      if (math.typeOf(obj) !== 'Object') {
        try {
          if (!ignore.includes(prop)) {
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
