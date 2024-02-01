import assert from 'assert'
import * as mainAny from '../../../src/entry/mainAny.js'
import * as factoriesAny from '../../../src/factoriesAny.js'
import { createSnapshotFromFactories, validateBundle, validateTypeOf } from '../../../src/utils/snapshot.js'
const { create, all, add, matrix, isObject, isMatrix, pi, speedOfLight, sqrt, evaluate, chain, reviver, Complex, addDependencies } = mainAny

const {
  expectedInstanceStructure,
  expectedES6Structure
} = createSnapshotFromFactories(factoriesAny)

describe('mainAny', function () {
  it('should export functions', function () {
    assert.strictEqual(add(2, 3), 5)
    assert.strictEqual(sqrt(4), 2)
  })

  it('should export all functions and constants', function () {
    // snapshot testing
    validateBundle(expectedES6Structure, mainAny)
  })

  it('new instance should have all expected functions', function () {
    // snapshot testing
    const newMathInstance = create(all)

    validateBundle(expectedInstanceStructure, newMathInstance)
  })

  it('new instance should import all factory functions via import', function () {
    // snapshot testing
    const newMathInstance = create()

    newMathInstance.import(all)

    validateBundle(expectedInstanceStructure, newMathInstance)
  })

  it('new instance should import some factory functions via import', function () {
    const newMathInstance = create()

    newMathInstance.import({
      addDependencies
    })

    assert.strictEqual(newMathInstance.add(2, 3), 5)
  })

  it('evaluate should contain all functions from mathWithTransform', function () {
    // snapshot testing
    const mathWithTransform = expectedInstanceStructure.expression.mathWithTransform

    Object.keys(mathWithTransform).forEach(key => {
      if (key === 'not') {
        // operator, special case
        assert.strictEqual(evaluate('not true'), false)
      } else if (key === 'apply') {
        // TODO: special case, apply is not yet working in the expression parser due to security constraints
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

  it('should export constants', function () {
    assert.strictEqual(pi, Math.PI)
  })

  it('should export physical constants', function () {
    assert.strictEqual(speedOfLight.toString(), '2.99792458e+8 m / s')
  })

  it('should export type checking functions', function () {
    assert.strictEqual(isObject({}), true)
    assert.strictEqual(isObject(null), false)
    assert.strictEqual(isMatrix([]), false)
    assert.strictEqual(isMatrix(matrix()), true)
  })

  it('should export evaluate having functions and constants', function () {
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

  it('should export chain with all functions', function () {
    assert.strictEqual(chain(2).add(3).done(), 5)
    assert.strictEqual(chain('x + 2 * x').simplify().done().toString(), '3 * x')
  })

  it('should get/set scope variables', function () {
    const math = create(all)
    const evaluate = math.evaluate

    assert.strictEqual(evaluate('b + 2', { b: 3 }), 5)

    const scope = {}
    assert.strictEqual(evaluate('b = 2', scope), 2)
    assert.deepStrictEqual(scope, { b: 2 })
  })

  it('should evaluate assignment and access', function () {
    const math = create(all)
    const evaluate = math.evaluate

    assert.strictEqual(evaluate('A[2]', { A: [10, 20, 30] }), 20)

    const scope = { A: [10, 20, 30] }
    assert.strictEqual(evaluate('A[2] = 200', scope), 200)
    assert.deepStrictEqual(scope, { A: [10, 200, 30] })
  })

  it('should export evaluate having help and embedded docs', function () {
    const h = evaluate('help(simplify)')

    assert(h.toString().indexOf('Name: simplify') >= 0, true)
  })

  it('should export reviver', function () {
    const json = '{"mathjs":"Complex","re":2,"im":4}'
    const c = new Complex(2, 4)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof Complex)
    assert.deepStrictEqual(obj, c)
  })

  // TODO: test export of errors
  // TODO: test export of classes
})
