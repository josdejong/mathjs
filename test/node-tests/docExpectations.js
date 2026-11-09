// Helpers to read the expected value from an example comment and compare it
// with the actual result. Shared by doc.test.js (JSDoc examples) and
// docs-examples.test.js (the markdown pages under docs/). `math` is the
// instance the examples run in; `onIssue` is called with a note for
// differences that are tolerated, like inexact numbers.
import { approxEqual, approxDeepEqual } from '../../tools/approx.js'

export function extractExpectation (math, comment, optional = false) {
  if (comment === '') return undefined
  const returnsParts = comment.split('eturns').map(s => s.trim())
  if (returnsParts.length > 1) return extractValue(math, returnsParts[1])
  const outputsParts = comment.split('utputs')
  if (outputsParts.length > 1) {
    let output = outputsParts[1]
    if (output[0] === ':') output = output.substring(1)
    return extractValue(math, output.trim())
  }
  // None of the usual flags; if we need a value,
  // assume the whole comment is the desired value. Otherwise return undefined
  if (optional) return undefined
  return extractValue(math, comment)
}

function extractValue (math, spec) {
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
  // Collapse 'Complex Matrix' into 'ComplexMatrix', similarly for 'Array'
  if (words[0] === 'Complex') {
    if (words[1] === 'Matrix') {
      words.shift()
      words[0] = 'ComplexMatrix'
    } else if (words[1] === 'Array') {
      words.shift()
      words[0] = 'ComplexArray'
    } else if (words[1].startsWith('[')) {
      words[0] = 'ComplexArray'
    }
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
    ComplexArray: 'math.complex(_)',
    ComplexMatrix: 'math.complex(math.matrix(_))',
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

export function checkExpectation (math, want, got, onIssue = () => {}) {
  if (Array.isArray(want)) {
    if (!Array.isArray(got)) {
      got = want.valueOf()
    }
    return approxDeepEqual(got, want, 1e-9)
  }
  if (want instanceof math.Unit && got instanceof math.Unit) {
    if (got.fixPrefix !== want.fixPrefix ||
      got.skipAutomaticSimplification !== want.skipAutomaticSimplification
    ) {
      onIssue('  Note: Ignoring different flags in Unit comparison')
      got.fixPrefix = want.fixPrefix
      got.skipAutomaticSimplification = want.skipAutomaticSimplification
    }
    return approxDeepEqual(got, want, 1e-9)
  }
  if (want instanceof math.Complex && got instanceof math.Complex) {
    return approxDeepEqual(got, want, 1e-9)
  }
  if (typeof want === 'number' && typeof got === 'number' && want !== got) {
    onIssue(`  Note: return value ${got} not exactly as expected: ${want}`)
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
