const assert = require('assert')
const path = require('path')

const approx = require('../../tools/approx.js')
const docgenerator = require('../../tools/docgenerator.js')
const math = require('../..')

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
    if (err instanceof SyntaxError || err instanceof ReferenceError) {
      value = spec
    } else {
      throw err
    }
  }
  if (words[0] === 'Unit') { // more hackishness here :(
    value.fixPrefix = true
  }
  if (words[0] === 'Node') { // and even more :(
    delete value.comment
  }
  return value
}

const knownProblems = new Set([
  'numeric', 'isZero', 'isPositive', 'isNumeric', 'isNegative', 'isNaN',
  'isInteger', 'hasNumericValue', 'clone', 'print', 'hex', 'format', 'to', 'sin',
  'cos', 'atan2', 'atan', 'asin', 'asec', 'acsc', 'acoth', 'acot', 'max',
  'setUnion', 'unequal', 'equal', 'deepEqual', 'compareNatural', 'randomInt',
  'random', 'pickRandom', 'kldivergence', 'xor', 'or', 'not', 'and', 'distance',
  'parser', 'compile', 're', 'im', 'rightLogShift', 'rightArithShift',
  'leftShift', 'bitNot', 'apply', 'subset', 'squeeze', 'rotationMatrix',
  'rotate', 'reshape', 'partitionSelect', 'matrixFromRows', 'matrixFromFunction',
  'matrixFromColumns', 'getMatrixDataType', 'forEach', 'eigs', 'diff',
  'ctranspose', 'concat', 'sqrtm', 'subtract', 'nthRoots', 'nthRoot', 'multiply',
  'mod', 'invmod', 'floor', 'fix', 'expm1', 'exp', 'dotPow', 'dotMultiply',
  'dotDivide', 'divide', 'ceil', 'cbrt', 'add', 'usolveAll', 'usolve', 'slu',
  'rationalize', 'qr', 'lusolve', 'lup', 'lsolveAll', 'lsolve', 'derivative',
  'symbolicEqual', 'map'
])

function maybeCheckExpectation (name, expected, expectedFrom, got, gotFrom) {
  if (knownProblems.has(name)) {
    try {
      checkExpectation(expected, got)
    } catch (err) {
      console.log(
        `PLEASE RESOLVE: '${gotFrom}' was supposed to '${expectedFrom}'`)
      console.log('    but', err.toString())
    }
  } else {
    checkExpectation(expected, got)
  }
}

function checkExpectation (want, got) {
  if (Array.isArray(want) && !Array.isArray(got)) {
    approx.deepEqual(got, math.matrix(want), 1e-9)
  } else if (want instanceof math.Unit && got instanceof math.Unit) {
    approx.deepEqual(got, want, 1e-9)
  } else if (want instanceof math.Complex && got instanceof math.Complex) {
    approx.deepEqual(got, want, 1e-9)
  } else if (typeof want === 'number' &&
             typeof got === 'number' &&
             want !== got) {
    approx.equal(got, want, 1e-9)
    console.log(`  Note: return value ${got} not exactly as expected: ${want}`)
  } else {
    assert.deepEqual(got, want)
  }
}

const OKundocumented = new Set([
  'addScalar', 'divideScalar', 'multiplyScalar', 'equalScalar',
  'docs', 'FibonacciHeap',
  'IndexError', 'DimensionError', 'ArgumentsError'
])

const knownUndocumented = new Set([
  'all',
  'isNumber',
  'isComplex',
  'isBigNumber',
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

const bigwarning = `WARNING: ${knownProblems.size} known errors converted ` +
      'to PLEASE RESOLVE warnings.' +
      `\n  WARNING: ${knownUndocumented.size} symbols in math are known to ` +
      'be undocumented; PLEASE EXTEND the documentation.'

describe(bigwarning + '\n  Testing examples from (jsdoc) comments', function () {
  const allNames = Object.keys(math)
  const srcPath = path.resolve(__dirname, '../../src') + '/'
  const allDocs = docgenerator.collectDocs(allNames, srcPath)
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
        it('satisfies ' + doc.name, function () {
          console.log(`      Testing ${doc.name} ...`) // can remove once no known failures; for now it clarifies "PLEASE RESOLVE"
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
              if (accumulation) {
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
})
