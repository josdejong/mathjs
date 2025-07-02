import assert from 'assert'
import math from '../../../src/defaultInstance.js'
import sinon from 'sinon'

describe('config', function () {
  it('should allow setting config after having overwritten import', function () {
    const math2 = math.create()

    assert.strictEqual(math2.typeOf(math2.pi), 'number')

    math2.import({
      import: () => { throw new Error('Function import is disabled') }
    }, { override: true })

    math2.config({ number: 'BigNumber' })

    assert.strictEqual(math2.typeOf(math2.pi), 'BigNumber')
  })

  // TODO: test function config

  it('should work with config epsilon during deprecation', function () {
    const math2 = math.create()
    // Add a spy to temporarily disable console.warn
    const warnStub = sinon.stub(console, 'warn')

    // Set epsilon to throw a warning and set relTol and absTol
    assert.doesNotThrow(function () { math2.config({ epsilon: 1e-5 }) })

    // Check if epsilon is set as relTol and absTol
    assert.strictEqual(math2.config().relTol, 1e-5)
    assert.strictEqual(math2.config().absTol, 1e-8)

    // Check if console.warn was called
    assert.strictEqual(warnStub.callCount, 1)

    // Restore console.warn
    warnStub.restore()
  })

  it('should work with config legacySubset during deprecation', function () {
    const math2 = math.create()
    // Add a spy to temporarily disable console.warn
    const warnStub = sinon.stub(console, 'warn')

    // Set legacySubset to throw a warning
    assert.doesNotThrow(function () { math2.config({ legacySubset: true }) })

    // Check if legacySubset is set
    assert.strictEqual(math2.config().legacySubset, true)

    // Check if console.warn was called
    assert.strictEqual(warnStub.callCount, 1)

    // Test legacy syntax for getting a subset of a matrix
    const A = math2.matrix([[1, 2, 3], [4, 5, 6]])
    const index = math2.index
    assert.deepStrictEqual(math2.subset(A, index(1, 2)), 6)
    assert.deepStrictEqual(math2.subset(A, index([1], 2)), 6)
    assert.deepStrictEqual(math2.subset(A, index(1, [2])), 6)
    assert.deepStrictEqual(math2.subset(A, index([1], [2])), 6)
    assert.deepStrictEqual(math2.subset(A, index(1, [1, 2])).toArray(), [[5, 6]])
    assert.deepStrictEqual(math2.subset(A, index([0, 1], 1)).toArray(), [[2], [5]])

    // Test without legacy syntax
    math2.config({ legacySubset: false })
    assert.deepStrictEqual(math2.subset(A, index(1, 2)), 6)
    assert.deepStrictEqual(math2.subset(A, index([1], 2)).toArray(), [6])
    assert.deepStrictEqual(math2.subset(A, index(1, [2])).toArray(), [6])
    assert.deepStrictEqual(math2.subset(A, index([1], [2])).toArray(), [[6]])
    assert.deepStrictEqual(math2.subset(A, index(1, [1, 2])).toArray(), [5, 6])
    assert.deepStrictEqual(math2.subset(A, index([1], [1, 2])).toArray(), [[5, 6]])
    assert.deepStrictEqual(math2.subset(A, index([0, 1], 1)).toArray(), [2, 5])
    assert.deepStrictEqual(math2.subset(A, index([0, 1], [1])).toArray(), [[2], [5]])

    // Restore console.warn
    warnStub.restore()
  })
})
