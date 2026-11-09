import assert from 'node:assert'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { collectDocs } from '../../tools/docgenerator.js'
import { create, all } from '../../lib/esm/index.js'
import { valueFromComment, compareWithExpected } from './docExpectations.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const math = create(all)
const debug = process.argv.includes('--debug-docs')

const ignoreFunctions = new Set([
  'config'
])

const knownProblems = new Set([
  'setUnion', 'randomInt',
  'random', 'pickRandom',
  'parser', 'compile',
  'subset', 'squeeze', 'rotationMatrix',
  'rotate', 'reshape', 'partitionSelect', 'matrixFromFunction',
  'matrixFromColumns', 'getMatrixDataType', 'eigs', 'diff', 'slu',
  'rationalize', 'qr', 'lusolve', 'lup',
  'schur', 'sylvester', 'freqz', 'round',
  'import', 'typed',
  'unit', 'sparse', 'matrix', 'index', 'bignumber', 'fraction', 'complex',
  'parse'
])

let issueCount = 0

function onIssue (note) {
  issueCount++
  if (debug) console.log(note)
}
const extractExpectation = (comment, optional) => valueFromComment(math, comment, optional)
const checkExpectation = (want, got) => compareWithExpected(math, want, got, onIssue)

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
    try {
      checkExpectation(expected, got)
    } catch (err) {
      console.error(`DOC ERROR: '${gotFrom}' was supposed to '${expectedFrom}'`)
      throw err
    }
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

// Functions yet to obtain individual History listings:
const knownNoHistory = new Set([
  'config', 'typed', 'leafCount', 'lsolve', 'lsolveAll', 'lup',
  'lusolve', 'lyap', 'qr', 'rationalize', 'resolve', 'schur', 'simplify',
  'simplifyConstant', 'slu', 'sylvester',
  'usolve', 'usolveAll', 'abs', 'cube', 'divide', 'expm',
  'hypot', 'log10', 'log1p', 'log2', 'multiply',
  'norm', 'pow', 'round', 'sign', 'sqrt', 'sqrtm',
  'square', 'unaryMinus', 'unaryPlus', 'bitNot',
  'bellNumbers', 'catalan', 'composition', 'arg', 'conj',
  'compile', 'evaluate', 'help', 'parser', 'distance', 'intersect',
  'not', 'nullish', 'column', 'count', 'cross',
  'ctranspose', 'det', 'diag', 'diff', 'dot', 'eigs', 'fft', 'filter',
  'flatten', 'forEach', 'getMatrixDataType', 'identity', 'ifft', 'inv', 'kron',
  'mapSlices', 'matrixFromColumns', 'matrixFromFunction', 'matrixFromRows',
  'ones', 'partitionSelect', 'pinv', 'range', 'reshape', 'resize', 'rotate',
  'rotationMatrix', 'row', 'size', 'sort', 'squeeze', 'subset', 'trace',
  'transpose', 'zeros', 'solveODE', 'bernoulli', 'combinations',
  'combinationsWithRep', 'factorial', 'gamma', 'lgamma',
  'multinomial', 'permutations', 'pickRandom', 'random', 'randomInt',
  'compareText', 'equalText',
  'setCartesian', 'setDifference', 'setDistinct', 'setIntersect', 'setIsSubset',
  'setMultiplicity', 'setPowerset', 'setSize', 'setSymDifference', 'setUnion',
  'freqz', 'zpk2tf', 'erf', 'zeta', 'corr', 'cumsum', 'mad', 'max', 'mean',
  'median', 'min', 'mode', 'prod', 'quantileSeq', 'std', 'sum', 'variance',
  'acos', 'acosh', 'acot', 'acoth', 'acsc', 'acsch', 'asec', 'asech', 'asin',
  'asinh', 'atan', 'atanh', 'cos', 'cosh', 'cot', 'coth', 'csc',
  'csch', 'sec', 'sech', 'sin', 'sinh', 'tan', 'tanh', 'toBest', 'bin',
  'clone', 'hasNumericValue', 'hex', 'isBounded', 'isInteger',
  'isNaN', 'isNegative', 'isNumeric', 'isPositive', 'isPrime', 'isZero',
  'oct', 'print', 'typeOf', 'bignumber', 'chain', 'number', 'splitUnit'
])

describe('Testing examples from (jsdoc) comments', function () {
  const allNames = Object.keys(math)
  const srcPath = path.resolve(__dirname, '../../src') + '/'
  const allDocs = collectDocs(allNames, srcPath)

  const ignoreInternals = name => name.substr(0, 1) === '_' ||
        name.substr(-12) === 'Dependencies' ||
        name.substr(0, 6) === 'create'

  it("should cover all names (but doesn't yet)", function () {
    const documented = new Set(Object.keys(allDocs))
    const badUndocumented = allNames.filter(name => {
      return !(documented.has(name) ||
               OKundocumented.has(name) ||
               knownUndocumented.has(name) ||
               ignoreInternals(name)
      )
    })
    assert.deepEqual(badUndocumented, [])
  })

  it("should have history for all functions (but doesn't yet)", function () {
    const badNoHistory = Object.keys(allDocs).filter(name => {
      if (ignoreInternals(name)) return false
      const doc = allDocs[name]
      const history = doc.doc?.history
      if (knownNoHistory.has(name)) return false
      if (history && Object.keys(history).length) return false
      return true
    })
    assert.deepEqual(badNoHistory, [])
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
              let discardAccumulation = true
              if (accumulation !== '' && expectation === undefined) {
                expectationFrom = parts[1]
                if (expectationFrom.endsWith('...')) {
                  expectationFrom = expectationFrom.slice(0, -3)
                  discardAccumulation = false
                }
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
                if (discardAccumulation) accumulation = ''
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
