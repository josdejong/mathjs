import assert from 'assert'
import * as mainNumber from '../../../src/entry/mainNumber.js'
import { createSnapshotFromFactories, validateBundle, validateTypeOf } from '../../../src/utils/snapshot.js'
import * as factoriesNumber from '../../../src/factoriesNumber.js'
const { create, all, add, isObject, isNumber, pi, sqrt, evaluate, chain, Range, reviver, derivative, simplify, addDependencies } = mainNumber

const {
  expectedInstanceStructure,
  expectedES6Structure
} = createSnapshotFromFactories(factoriesNumber)

describe('mainNumber', function () {
  it('should export functions', function () {
    assert.strictEqual(add(2, 3), 5)
    assert.strictEqual(sqrt(4), 2)
  })

  it('should export all functions and constants', function () {
    // snapshot testing
    validateBundle(expectedES6Structure, mainNumber)
  })

  it('new instance should have all expected functions', function () {
    // snapshot testing
    const newMathInstance = create(all)

    validateBundle(expectedInstanceStructure, newMathInstance)
  })

  it('new instance should import some factory functions via import', function () {
    const newMathInstance = create()

    newMathInstance.import({
      addDependencies
    })

    assert.strictEqual(newMathInstance.add(2, 3), 5)
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
    }, { silent: true })

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

  it('should export type checking functions', function () {
    assert.strictEqual(isObject({}), true)
    assert.strictEqual(isObject(null), false)
    assert.strictEqual(isNumber('23'), false)
  })

  it('should export evaluate having functions and constants', function () {
    assert.strictEqual(evaluate('sqrt(4)'), 2)
    assert.strictEqual(evaluate('pi'), Math.PI)

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
  })

  it('derivative should work', function () {
    assert.strictEqual(derivative('2x', 'x').toString(), '2')
  })

  it('simplify should work', function () {
    assert.strictEqual(simplify('2x + 3x').toString(), '5 * x')
  })

  it('should export evaluate having help and embedded docs', function () {
    const h = evaluate('help(simplify)')

    assert(h.toString().indexOf('Name: simplify') >= 0, true)
  })

  it('should get/set scope variables', function () {
    const math = create(all)
    const evaluate = math.evaluate

    assert.strictEqual(evaluate('b + 2', { b: 3 }), 5)

    const scope = {}
    assert.strictEqual(evaluate('b = 2', scope), 2)
    assert.deepStrictEqual(scope, { b: 2 })
  })

  it('doe not support assignement and access right now', function () {
    // TODO: implement support for subset in number implementation
    assert.throws(function () {
      evaluate('A[2]', { A: [10, 20, 30] })
    }, /No "index" implementation available/)

    assert.throws(function () {
      const scope = { A: [10, 20, 30] }
      evaluate('A[2] = 200', scope)
    }, /No "index" implementation available/)
  })

  it('should export reviver', function () {
    const json = '{"mathjs":"Range","start":2,"end":10}'
    const r = new Range(2, 10)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof Range)
    assert.deepStrictEqual(obj, r)
  })

  // TODO: test export of errors
  // TODO: test export of classes
})
