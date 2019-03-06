import assert from 'assert'
import * as mainNumber from '../src/mainNumber'
import { expectedInstanceStructure, expectedES6Structure } from './snapshot'
import { validateBundle, validateTypeOf } from '../tools/validateBundle'
const { create, allRecipe, add, matrix, isObject, isMatrix, pi, speedOfLight, sqrt, evaluate } = mainNumber

describe('mainNumber', function () {
  it('should export functions', () => {
    assert.strictEqual(add(2, 3), 5)
    assert.strictEqual(sqrt(4), 2)
  })

  // FIXME
  it.skip('should export all functions and constants', function () {
    // snapshot testing
    validateBundle(expectedES6Structure, mainNumber)
  })

  // FIXME
  it.skip('new instance should have all expected functions', function () {
    // snapshot testing
    const newMathInstance = create(allRecipe)

    // don't output all warnings "math.foo.bar is move to math.bar, ..."
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (args.join(' ').indexOf('is moved to') === -1) {
        originalWarn.apply(console, args)
      }
    }

    validateBundle(expectedInstanceStructure, newMathInstance)

    console.warn = originalWarn
  })

  // FIXME
  it.skip('evaluate should contain all functions from mathWithTransform', function () {
    // snapshot testing
    const mathWithTransform = expectedInstanceStructure.expression.mathWithTransform

    Object.keys(mathWithTransform).forEach(key => {
      if (key === 'not') {
        // operator, special case
        assert.strictEqual(evaluate('not true'), false)
      } else {
        try {
          assert.strictEqual(validateTypeOf(evaluate(key)), mathWithTransform[key], `Compare type of "${key}"`)
        } catch (err) {
          console.error(err.toString())
          assert.ok(false, `Missing or wrong type of entry in mathWithTransform: "${key}"`)
        }
      }
    })
  })

  it('evaluate should not contain classes', function () {
    assert.throws(() => { evaluate('Complex') }, /Undefined symbol Complex/)
    assert.throws(() => { evaluate('SymbolNode') }, /Undefined symbol SymbolNode/)
  })

  it('should export constants', () => {
    assert.strictEqual(pi, Math.PI)
  })

  // FIXME
  it.skip('should export physical constants', () => {
    assert.strictEqual(speedOfLight.toString(), '2.99792458e+8 m / s')
  })

  // FIXME
  it.skip('should export type checking functions', () => {
    assert.strictEqual(isObject({}), true)
    assert.strictEqual(isObject(null), false)
    assert.strictEqual(isMatrix([]), false)
    assert.strictEqual(isMatrix(matrix()), true)
  })

  // FIXME
  it.skip('should export evaluate having functions and constants', () => {
    assert.strictEqual(evaluate('sqrt(4)'), 2)
    assert.strictEqual(evaluate('pi'), Math.PI)
    assert.strictEqual(evaluate('A[1]', { A: [1, 2, 3] }), 1) // one-based evaluation

    // TODO: should loop over all functions and constants
    assert.strictEqual(typeof evaluate('help'), 'function')
    assert.strictEqual(typeof evaluate('parse'), 'function')
    assert.strictEqual(typeof evaluate('compile'), 'function')
    assert.strictEqual(typeof evaluate('evaluate'), 'function')
    assert.strictEqual(typeof evaluate('chain'), 'function')
    assert.strictEqual(typeof evaluate('simplify'), 'function')
    assert.strictEqual(typeof evaluate('derivative'), 'function')
    assert.strictEqual(typeof evaluate('rationalize'), 'function')
  })

  // TODO: test export of create and core
  // TODO: test export of errors
  // TODO: test export json reviver
  // TODO: test export of classes
  // TODO: test export of default instance
  // TODO: test snapshot of all exported things
})
