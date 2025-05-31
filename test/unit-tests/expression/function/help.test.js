import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { embeddedDocs } from '../../../../src/expression/embeddedDocs/embeddedDocs.js'

let mathDocs = math.create(math.all)
const originalConfig = mathDocs.config()
// Add names to the skipDocs array if they are not meant to have embedded docs
const skipDocs = new Set(['import', 'addScalar', 'divideScalar', 'equalScalar', 'multiplyScalar',
  'subtractScalar', 'apply', 'replacer', 'reviver'])

// Add names to skipExamples if their examples in the embedded docs contain acceptable errors
const skipExamples = new Set([])

const testDocs = new Set([
  ...Object.keys(embeddedDocs),
  ...Object.keys(math.expression.mathWithTransform)
].filter(name => { return !skipDocs.has(name) }))

const testExamples = new Set([...testDocs].filter(name => {
  return !skipExamples.has(name)
}))

function runExamplesInDocs (name) {
  mathDocs.config(originalConfig)
  // every function should have doc.examples
  const examples = mathDocs.evaluate(`help("${name}")`).doc.examples
  try {
    // validate if the examples run without errors
    mathDocs.evaluate(examples)
    return
  } catch {
  }
  // if they still have errors try with a new math instance
  mathDocs = math.create(math.all)
  mathDocs.evaluate(examples)
}

function hasValidSeeAlso (name) {
  let seeAlso = []
  try {
    seeAlso = mathDocs.evaluate(`help("${name}")`).doc.seealso
  } catch (err) {
    return
  }
  if (seeAlso && seeAlso.length > 0) {
    seeAlso.forEach(see => {
      if (testDocs.has(see)) {
        if (see === name) {
          throw new Error(`See also name "${see}" should not be the same as "${name}" in docs for "${name}".`)
        }
      } else {
        throw new Error(`See also with name "${see}" is not a valid documentation name used in docs for "${name}".`)
      }
    })
  }
}

describe('help', function () {
  it('should find documentation for a function by its name', function () {
    const help = math.help('sin')
    assert.ok(help instanceof math.Help)
    assert.deepStrictEqual(help.doc, embeddedDocs.sin)
  })

  it('should find documentation for a function by the function itself', function () {
    const help = math.help(math.sin)
    assert.ok(help instanceof math.Help)
    assert.deepStrictEqual(help.doc, embeddedDocs.sin)
  })

  it('should throw an error on wrong number of arguments', function () {
    assert.throws(function () { math.help() }, /TypeError: Too few arguments/)
    assert.throws(function () { math.help('sin', 2) }, /TypeError: Too many arguments/)
  })

  it('should find help from a function name', function () {
    const help = math.help('sin')
    assert(help instanceof math.Help)
    assert.strictEqual(help.doc.name, 'sin')
  })

  it('should not alter the mathjs instance when stringifying help', function () {
    const config = math.config()
    const str = math.help(math.config).toString()
    assert(str.includes('number: "Fraction"'))
    assert.deepStrictEqual(math.config(), config)
  })

  it('should find help from a function', function () {
    const help = math.help(math.sin)
    assert(help instanceof math.Help)
    assert.strictEqual(help.doc.name, 'sin')
  })

  it('should find help from a constant name', function () {
    const help = math.help('pi')
    assert(help instanceof math.Help)
    assert.strictEqual(help.doc.name, 'pi')
  })

  it('should find help from a constant', function () {
    const help = math.help(math.pi)
    assert(help instanceof math.Help)
    assert.strictEqual(help.doc.name, 'pi')
  })

  it('should not allow accessing unsafe properties ', function () {
    assert.throws(function () { math.help('constructor') }, /No access/)
  })

  it('should throw an error when no help is found', function () {
    // assert.throws(function () {math.help(undefined)}, /No documentation found/);
    assert.throws(function () { math.help(new Date()) }, /No documentation found/)
    assert.throws(function () { math.help('nonExistingFunction') }, /No documentation found/)
    assert.throws(function () { math.help('addScalar') }, /No documentation found/)
  })

  it('should LaTeX help', function () {
    const expression = math.parse('help(parse)')
    assert.strictEqual(expression.toTex(), '\\mathrm{help}\\left( parse\\right)')
  })

  for (const name of testDocs) {
    it(`should find documentation for ${name}`, function () {
      assert.doesNotThrow(() => mathDocs.help(name).doc)
    })
  }

  for (const name of testDocs) {
    it(`should find examples for ${name}`, function () {
      assert.doesNotThrow(() => mathDocs.help(name).doc.examples)
    })
  }
  for (const name of testExamples) {
    it(`should run examples for ${name} without errors`, function () {
      assert.doesNotThrow(() => runExamplesInDocs(name))
    })
  }
  for (const name of testDocs) {
    it(`should have all valid See Also for ${name} that are not ${name}`, function () {
      assert.doesNotThrow(() => hasValidSeeAlso(name))
    })
  }
})
