import assert from 'node:assert'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { approxEqual, approxDeepEqual } from '../../tools/approx.js'
import { collectDocs } from '../../tools/docgenerator.js'
import { create, all } from '../../lib/esm/index.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const math = create(all)
const debug = process.argv.includes('--debug-docs')

function extractExpectation (comment, optional = false) {
  if (comment === '') return undefined
  const returnsParts = comment.split('eturns').map(s => s.trim())
  if (returnsParts.length > 1) return extractValue(returnsParts[1])
  const outputsParts = comment.split('utputs')
  if (outputsParts.length > 1) {
    let output = outputsParts[1]
    if (output[0] === ':') output = output.substring(1)
    return extractValue(output.trim())
  }
  // None of the usual flags; if we need a value,
  // assume the whole comment is the desired value. Otherwise return undefined
  if (optional) return undefined
  return extractValue(comment)
}

function extractValue (spec) {
  // First check for a leading keyword:
  const words = spec.split(' ')
  // If the last word end in 'i' and the value is not labeled as complex,
  // label it for the comment writer:
  if (words[words.length - 1].substr(-1) === 'i' && words[0] !== 'Complex') {
    words.unshift('Complex')
  }
  // Collapse 'Dense Matrix' into 'DenseMatrix'
  if (words[0] === 'Dense' && words[1] === 'Matrix') {
    words.shift()
    words[0] = 'DenseMatrix'
  }
  const keywords = {
    number: 'Number(_)',
    BigNumber: 'math.bignumber(_)',
    Fraction: 'math.fraction(_)',
    Complex: "math.complex('_')",
    Unit: "math.unit('_')",
    Array: '_',
    Matrix: 'math.matrix(_)',
    DenseMatrix: "math.matrix(_, 'dense')",
    string: '_',
    Node: 'math.parse(_)',
    value: 'math._',
    throws: "'_'"
  }
  if (words[0] in keywords) {
    const template = keywords[words[0]]
    const spot = template.indexOf('_')
    let filler = words.slice(1).join(' ')
    if (words[0] === 'Complex') { // a bit of a hack here :(
      filler = words.slice(1).join('')
    }
    spec = template.substring(0, spot) + filler + template.substr(spot + 1)
  }
  if (spec.substring(0, 7) === 'matrix(') {
    spec = 'math.' + spec // More hackery :(
  }
  let value
  try {
    value = eval(spec) // eslint-disable-line no-eval
  } catch (err) {
    if (spec[0] === '[') {
      // maybe it was an array with mathjs expressions in it
      try {
        value = math.evaluate(spec).toArray()
      } catch (newError) {
        value = spec
      }
    } else if (err instanceof SyntaxError || err instanceof ReferenceError) {
      value = spec
    } else {
      throw err
    }
  }
  if (words[0] === 'Node') { // and even more :(
    delete value.comment
  }
  return value
}

const ignoreFunctions = new Set([
  'config'
])

const knownProblems = new Set([
  'setUnion', 'unequal', 'equal', 'deepEqual', 'compareNatural', 'randomInt',
  'random', 'pickRandom', 'kldivergence',
  'parser', 'compile', 're', 'im',
  'subset', 'squeeze', 'rotationMatrix',
  'rotate', 'reshape', 'partitionSelect', 'matrixFromFunction',
  'matrixFromColumns', 'getMatrixDataType', 'eigs', 'diff',
  'nthRoots', 'nthRoot',
  'mod', 'floor', 'fix', 'expm1', 'exp',
  'ceil', 'cbrt', 'add', 'slu',
  'rationalize', 'qr', 'lusolve', 'lup', 'derivative',
  'symbolicEqual', 'schur', 'sylvester', 'freqz', 'round',
  'import', 'typed',
  'unit', 'sparse', 'matrix', 'index', 'bignumber', 'fraction', 'complex',
  'parse'
])

let issueCount = 0

function maybeCheckExpectation (name, expected, expectedFrom, got, gotFrom) {
  if (knownProblems.has(name)) {
    try {
      checkExpectation(expected, got)
    } catch (err) {
      issueCount++
      if (debug) {
        console.log(
          `PLEASE RESOLVE: '${gotFrom}' was supposed to '${expectedFrom}'`)
        console.log('    but', err.toString())
      }
    }
  } else {
    checkExpectation(expected, got)
  }
}

function checkExpectation (want, got) {
  if (Array.isArray(want)) {
    if (!Array.isArray(got)) {
      got = want.valueOf()
    }
    return approxDeepEqual(got, want, 1e-9)
  }
  if (want instanceof math.Unit && got instanceof math.Unit) {
    if (got.fixPrefix !== want.fixPrefix) {
      issueCount++
      if (debug) {
        console.log('  Note: Ignoring different fixPrefix in Unit comparison')
      }
      got.fixPrefix = want.fixPrefix
    }
    return approxDeepEqual(got, want, 1e-9)
  }
  if (want instanceof math.Complex && got instanceof math.Complex) {
    return approxDeepEqual(got, want, 1e-9)
  }
  if (typeof want === 'number' && typeof got === 'number' && want !== got) {
    issueCount++
    if (debug) {
      console.log(`  Note: return value ${got} not exactly as expected: ${want}`)
    }
    return approxEqual(got, want, 1e-9)
  }
  if (
    typeof want === 'string' &&
    typeof got === 'string' &&
    want.endsWith('Error') &&
    got.startsWith(want)
  ) {
    return true // we obtained the expected error type
  }
  if (want && got && want.isBigNumber && got.isBigNumber) {
    return approxEqual(got, want, 1e-50)
  }
  if (typeof want !== 'undefined') {
    return approxDeepEqual(got, want)
  } else {
    // don't check if we don't know what the result is supposed to be
  }
}

const OKundocumented = new Set([
  'apply', // deprecated backwards-compatibility synonym of mapSlices
  'addScalar', 'subtractScalar', 'divideScalar', 'multiplyScalar', 'equalScalar',
  'docs', 'FibonacciHeap',
  'IndexError', 'DimensionError', 'ArgumentsError'
])

const knownUndocumented = new Set([
  'all',
  'isNumber',
  'isComplex',
  'isBigNumber',
  'isBigInt',
  'isFraction',
  'isUnit',
  'isString',
  'isArray',
  'isMatrix',
  'isCollection',
  'isDenseMatrix',
  'isSparseMatrix',
  'isRange',
  'isIndex',
  'isBoolean',
  'isResultSet',
  'isHelp',
  'isFunction',
  'isDate',
  'isRegExp',
  'isObject',
  'isMap',
  'isPartitionedMap',
  'isObjectWrappingMap',
  'isNull',
  'isUndefined',
  'isAccessorNode',
  'isArrayNode',
  'isAssignmentNode',
  'isBlockNode',
  'isConditionalNode',
  'isConstantNode',
  'isFunctionAssignmentNode',
  'isFunctionNode',
  'isIndexNode',
  'isNode',
  'isObjectNode',
  'isOperatorNode',
  'isParenthesisNode',
  'isRangeNode',
  'isRelationalNode',
  'isSymbolNode',
  'isChain',
  'on',
  'off',
  'once',
  'emit',
  'config',
  'expression',
  'import',
  'create',
  'factory',
  'AccessorNode',
  'ArrayNode',
  'AssignmentNode',
  'atomicMass',
  'avogadro',
  'BigNumber',
  'bignumber',
  'BlockNode',
  'bohrMagneton',
  'bohrRadius',
  'boltzmann',
  'boolean',
  'chain',
  'Chain',
  'classicalElectronRadius',
  'complex',
  'Complex',
  'ConditionalNode',
  'conductanceQuantum',
  'ConstantNode',
  'coulomb',
  'coulombConstant',
  'createUnit',
  'DenseMatrix',
  'deuteronMass',
  'e',
  'efimovFactor',
  'electricConstant',
  'electronMass',
  'elementaryCharge',
  'false',
  'faraday',
  'fermiCoupling',
  'fineStructure',
  'firstRadiation',
  'fraction',
  'Fraction',
  'FunctionAssignmentNode',
  'FunctionNode',
  'gasConstant',
  'gravitationConstant',
  'gravity',
  'hartreeEnergy',
  'Help',
  'i',
  'ImmutableDenseMatrix',
  'index',
  'Index',
  'IndexNode',
  'Infinity',
  'inverseConductanceQuantum',
  'klitzing',
  'LN10',
  'LN2',
  'LOG10E',
  'LOG2E',
  'loschmidt',
  'magneticConstant',
  'magneticFluxQuantum',
  'matrix',
  'Matrix',
  'molarMass',
  'molarMassC12',
  'molarPlanckConstant',
  'molarVolume',
  'NaN',
  'neutronMass',
  'Node',
  'nuclearMagneton',
  'null',
  'number',
  'bigint',
  'ObjectNode',
  'OperatorNode',
  'ParenthesisNode',
  'parse',
  'Parser',
  'phi',
  'pi',
  'planckCharge',
  'planckConstant',
  'planckLength',
  'planckMass',
  'planckTemperature',
  'planckTime',
  'protonMass',
  'quantumOfCirculation',
  'Range',
  'RangeNode',
  'reducedPlanckConstant',
  'RelationalNode',
  'replacer',
  'ResultSet',
  'reviver',
  'rydberg',
  'SQRT1_2',
  'SQRT2',
  'sackurTetrode',
  'secondRadiation',
  'Spa',
  'sparse',
  'SparseMatrix',
  'speedOfLight',
  'splitUnit',
  'stefanBoltzmann',
  'string',
  'SymbolNode',
  'tau',
  'thomsonCrossSection',
  'true',
  'typed',
  'Unit',
  'unit',
  'E',
  'PI',
  'vacuumImpedance',
  'version',
  'weakMixingAngle',
  'wienDisplacement'
])

describe('Testing examples from (jsdoc) comments', function () {
  const allNames = Object.keys(math)
  const srcPath = path.resolve(__dirname, '../../src') + '/'
  const allDocs = collectDocs(allNames, srcPath)

  it("should cover all names (but doesn't yet)", function () {
    const documented = new Set(Object.keys(allDocs))
    const badUndocumented = allNames.filter(name => {
      return !(documented.has(name) ||
               OKundocumented.has(name) ||
               knownUndocumented.has(name) ||
               name.substr(0, 1) === '_' ||
               name.substr(-12) === 'Dependencies' ||
               name.substr(0, 6) === 'create'
      )
    })
    assert.deepEqual(badUndocumented, [])
  })
  const byCategory = {}
  for (const fun of Object.values(allDocs)) {
    if (!(fun.category in byCategory)) {
      byCategory[fun.category] = []
    }
    byCategory[fun.category].push(fun.doc)
  }
  for (const category in byCategory) {
    describe('category: ' + category, function () {
      for (const doc of byCategory[category]) {
        if (ignoreFunctions.has(doc.name)) {
          continue
        }

        it('satisfies ' + doc.name, function () {
          if (debug) {
            console.log(`      Testing ${doc.name} ...`) // can remove once no known failures; for now it clarifies "PLEASE RESOLVE"
          }
          const lines = doc.examples
          lines.push('//') // modifies doc but OK for test
          let accumulation = ''
          let expectation
          let expectationFrom = ''
          for (const line of lines) {
            if (line.includes('//')) {
              let parts = line.split('//')
              if (parts[0] && !parts[0].trim()) {
                // Indented comment, unusual in examples
                // assume this is a comment within some code to evaluate
                // i.e., ignore it
                continue
              }
              // Comment specifying a future value or the return of prior code
              parts = parts.map(s => s.trim())
              if (parts[0] !== '') {
                if (accumulation) { accumulation += '\n' }
                accumulation += parts[0]
              }
              if (accumulation !== '' && expectation === undefined) {
                expectationFrom = parts[1]
                expectation = extractExpectation(expectationFrom)
                parts[1] = ''
              }
              if (accumulation && !accumulation.includes('console.log(')) {
                // note: we ignore examples that contain a console.log to keep the output of the tests clean
                let value
                try {
                  value = eval(accumulation) // eslint-disable-line no-eval
                } catch (err) {
                  value = err.toString()
                }
                maybeCheckExpectation(
                  doc.name, expectation, expectationFrom, value, accumulation)
                accumulation = ''
              }
              expectationFrom = parts[1]
              expectation = extractExpectation(expectationFrom, 'requireSignal')
            } else {
              if (line !== '') {
                if (accumulation) { accumulation += '\n' }
                accumulation += line
              }
            }
          }
        })
      }
    })
  }

  after(function () {
    if (debug) {
      if (knownProblems.size > 0) {
        console.log(`\nWARNING: ${knownProblems.size} known errors converted ` +
          'to PLEASE RESOLVE warnings.')
      }
      if (knownUndocumented.size > 0) {
        console.log(`\nWARNING: ${knownUndocumented.size} symbols in math are known to ` +
          'be undocumented; PLEASE EXTEND the documentation.')
      }
    }

    if (issueCount > 0) {
      console.log(`\nWARNING: ${issueCount} issues found in the JSDoc comments.` + (!debug
        ? ' Run the tests again with "npm run test:node -- --debug-docs" to see detailed information'
        : ''))
    }
  })
})
