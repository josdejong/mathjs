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

    // test sylvester
    assert.ok(math2.norm(math2.subtract(math2.sylvester([
      [-5.3, -1.4, -0.2, 0.7],
      [-0.4, -1.0, -0.1, -1.2],
      [0.3, 0.7, -2.5, 0.7],
      [3.6, -0.1, 1.4, -2.4]
    ], [
      [1.1, -0.3, -0.9, 0.8, -2.5],
      [-0.6, 2.6, 0.2, 0.4, 1.3],
      [0.4, -0.5, -0.2, 0.2, -0.1],
      [-0.4, -1.9, -0.2, 0.5, 1.4],
      [0.4, -1.0, -0.1, -0.8, -1.3]
    ], [
      [1.4, 1.1, -1.9, 0.1, 1.2],
      [-1.7, 0.1, -0.4, 2.1, 0.5],
      [1.9, 2.3, -0.8, -0.7, 1.0],
      [-1.1, 2.8, -0.8, -0.3, 0.9]
    ]), [
      [-0.19393862606643053, -0.17101629636521865, 2.709348263225366, -0.0963000767188319, 0.5244718194343121],
      [0.38421326955977486, -0.21159588555260944, -6.544262021555474, -0.15113424769761136, -2.312533293658291],
      [-2.2708235174374747, 4.498279916441834, 1.4553799673144823, -0.9300926971755248, 2.5508111398452353],
      [-1.0935231387905004, 4.113817086842746, 5.747671819196675, -0.9408309030864932, 2.967655969930743]
    ]), 'fro') < 1e-3)

    const a = [
      [0, 2, 0, 0, 0],
      [0, 1, 0, 2, 4],
      [0, 0, 0, 0, 0],
      [8, 4, 0, 3, 0],
      [0, 0, 0, 6, 0]
    ]
    // test column
    assert.deepStrictEqual(
      math2.column(a, 4).valueOf(), [[0], [4], [0], [0], [0]]
    )

    // test row
    assert.deepStrictEqual(
      math2.row(a, 3).valueOf(), [[8, 4, 0, 3, 0]]
    )

    math2.config({ legacySubset: false })
    // Test without legacy syntax
    assert.deepStrictEqual(math2.subset(A, index(1, 2)), 6)
    assert.deepStrictEqual(math2.subset(A, index([1], 2)).toArray(), [6])
    assert.deepStrictEqual(math2.subset(A, index(1, [2])).toArray(), [6])
    assert.deepStrictEqual(math2.subset(A, index([1], [2])).toArray(), [[6]])
    assert.deepStrictEqual(math2.subset(A, index(1, [1, 2])).toArray(), [5, 6])
    assert.deepStrictEqual(math2.subset(A, index([1], [1, 2])).toArray(), [[5, 6]])
    assert.deepStrictEqual(math2.subset(A, index([0, 1], 1)).toArray(), [2, 5])
    assert.deepStrictEqual(math2.subset(A, index([0, 1], [1])).toArray(), [[2], [5]])

    // test with conifgLegacy removed
    assert.ok(math2.norm(math2.subtract(math2.sylvester([
      [-5.3, -1.4, -0.2, 0.7],
      [-0.4, -1.0, -0.1, -1.2],
      [0.3, 0.7, -2.5, 0.7],
      [3.6, -0.1, 1.4, -2.4]
    ], [
      [1.1, -0.3, -0.9, 0.8, -2.5],
      [-0.6, 2.6, 0.2, 0.4, 1.3],
      [0.4, -0.5, -0.2, 0.2, -0.1],
      [-0.4, -1.9, -0.2, 0.5, 1.4],
      [0.4, -1.0, -0.1, -0.8, -1.3]
    ], [
      [1.4, 1.1, -1.9, 0.1, 1.2],
      [-1.7, 0.1, -0.4, 2.1, 0.5],
      [1.9, 2.3, -0.8, -0.7, 1.0],
      [-1.1, 2.8, -0.8, -0.3, 0.9]
    ]), [
      [-0.19393862606643053, -0.17101629636521865, 2.709348263225366, -0.0963000767188319, 0.5244718194343121],
      [0.38421326955977486, -0.21159588555260944, -6.544262021555474, -0.15113424769761136, -2.312533293658291],
      [-2.2708235174374747, 4.498279916441834, 1.4553799673144823, -0.9300926971755248, 2.5508111398452353],
      [-1.0935231387905004, 4.113817086842746, 5.747671819196675, -0.9408309030864932, 2.967655969930743]
    ]), 'fro') < 1e-3)

    // test column with conifgLegacy removed
    assert.deepStrictEqual(
      math2.column(a, 4).valueOf(), [[0], [4], [0], [0], [0]]
    )

    // test row with conifgLegacy removed
    assert.deepStrictEqual(
      math2.row(a, 3).valueOf(), [[8, 4, 0, 3, 0]]
    )

    // Restore console.warn
    warnStub.restore()
  })
})
