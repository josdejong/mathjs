// Helpers to read the expected value from an example comment and compare it
// with the actual result. Shared by doc.test.js (JSDoc examples) and
// docs-examples.test.js (the markdown pages under docs/), so this is the one
// place that defines which comments state a value. `math` is the instance the
// examples run in; `onIssue` is called with a note for differences that are
// tolerated, like inexact numbers.
import assert from 'node:assert'
import { approxEqual, approxDeepEqual } from '../../tools/approx.js'

// Return the value stated by an example comment, like "returns 5",
// "Matrix [1, 2]" or "'abc'". A comment that does not evaluate to a value is
// returned as is, or, when `proseIsNoValue` is set, gives undefined: the
// docs pages mix comments with values and comments with prose.
// Text after a semicolon is prose about the value, as in "6; *not* 10".
export function valueFromComment (math, comment, optional = false, proseIsNoValue = false) {
  comment = comment.split(';')[0].trim()
  if (comment === '') return undefined
  // "result: 5" is another way to write "returns 5"
  if (comment.startsWith('result:')) comment = 'returns' + comment.slice('result:'.length)
  const returnsParts = comment.split('eturns').map(s => s.trim())
  if (returnsParts.length > 1) return extractValue(math, returnsParts[1], proseIsNoValue)
  const outputsParts = comment.split('utputs')
  if (outputsParts.length > 1) {
    let output = outputsParts[1]
    if (output[0] === ':') output = output.substring(1)
    return extractValue(math, output.trim(), proseIsNoValue)
  }
  // None of the usual flags; if we need a value,
  // assume the whole comment is the desired value. Otherwise return undefined
  if (optional) return undefined
  return extractValue(math, comment, proseIsNoValue)
}

function extractValue (math, spec, proseIsNoValue) {
  // A comment like "SyntaxError: Unexpected end" states the error thrown
  if (/^\w*Error\b/.test(spec)) return spec
  // A comment like "Prints: 1, 4" is prose (eval would read a label)
  if (/^\w+:/.test(spec)) return proseIsNoValue ? undefined : spec
  // First check for a leading keyword:
  const words = spec.split(' ')
  // The docs pages also write the keyword with a comma, as in "Matrix, [1, 2]"
  if (words[0].endsWith(',')) words[0] = words[0].slice(0, -1)
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
    Number: 'Number(_)',
    bigint: '_',
    BigNumber: "math.bignumber('_')", // quoted to keep all digits
    Fraction: 'math.fraction(_)',
    Complex: "math.complex('_')",
    Unit: "math.unit('_')",
    Array: '_',
    Matrix: 'math.matrix(_)',
    DenseMatrix: "math.matrix(_, 'dense')",
    ComplexArray: 'math.complex(_)',
    ComplexMatrix: 'math.complex(math.matrix(_))',
    string: '_',
    String: '_',
    Node: 'math.parse(_)',
    ResultSet: 'new math.ResultSet(_)',
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
    // parentheses make an object like {a: 3} an object, not a block of code
    value = eval(spec[0] === '{' ? '(' + spec + ')' : spec) // eslint-disable-line no-eval
  } catch (err) {
    if (spec[0] === '[') {
      // maybe it was an array with mathjs expressions in it
      try {
        value = math.evaluate(spec).toArray()
      } catch (newError) {
        value = proseIsNoValue ? undefined : spec
      }
    } else if (err instanceof SyntaxError || err instanceof ReferenceError) {
      value = proseIsNoValue ? undefined : spec
    } else {
      throw err
    }
  }
  if (words[0] === 'Node' && value) { // and even more :(
    delete value.comment
  }
  return value
}

// The docs pages can state the size of a matrix or array, as in
// "Matrix, size [3, 2], [[0, 0], [0, 0], [0, 0]]" or "Array, size [3]",
// or only its type, as in "Matrix". Return the stated size, the type when
// the comment states no value besides it ('Matrix' or 'Array'), and the
// comment without the size.
export function sizeFromComment (comment) {
  let size
  const match = comment.match(/size (\[[\d, ]*\])/)
  if (match) {
    size = JSON.parse(match[1])
    comment = comment.replace(match[0], '') // like "Matrix, , [0, 0, 0]"
      .replace(/,\s*,/, ',').trim().replace(/,$/, '')
  }
  if (comment === 'Matrix' || comment === 'Array') return { size, type: comment, comment: '' }
  return { size, comment }
}

export function compareWithExpected (math, want, got, onIssue = () => {}) {
  if (Array.isArray(want)) {
    if (!Array.isArray(got)) {
      got = want.valueOf()
    }
    if (want.some(entry => entry?.isUnit)) { // compare the units as below
      assert.strictEqual(got.length, want.length)
      return want.forEach((entry, i) => compareWithExpected(math, entry, got[i], onIssue))
    }
    return approxDeepEqual(got, want, 1e-9)
  }
  if (want?.isUnit && got?.isUnit) { // also for units of another math instance
    if (got.fixPrefix !== want.fixPrefix ||
      got.skipAutomaticSimplification !== want.skipAutomaticSimplification
    ) {
      onIssue('  Note: Ignoring different flags in Unit comparison')
      got.fixPrefix = want.fixPrefix
      got.skipAutomaticSimplification = want.skipAutomaticSimplification
    }
    // the same units, in any order, like (m^3 Pa K) / mol, and the same value
    assert.strictEqual(got.formatUnits(), want.formatUnits())
    return approxEqual(got.value, want.value, 1e-9)
  }
  if (want?.isNode && got?.isNode) { // parentheses in the comment are not nodes
    return assert.strictEqual(got.toString(), want.toString())
  }
  if (want?.isComplex && got?.isComplex) {
    return approxDeepEqual(got, want, 1e-9)
  }
  if (typeof want === 'number' && typeof got === 'number' && want !== got) {
    onIssue(`  Note: return value ${got} not exactly as expected: ${want}`)
    return approxEqual(got, want, 1e-9)
  }
  if (
    typeof want === 'string' &&
    typeof got === 'string' &&
    /^\w*Error\b/.test(want) &&
    got.startsWith(want)
  ) {
    return true // we obtained the expected error (type and maybe message)
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
