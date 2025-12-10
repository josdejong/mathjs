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

    math2.config({ compute: { numberApproximate: 'BigNumber' } })

    assert.strictEqual(math2.typeOf(math2.pi), 'BigNumber')
  })

  // TODO: test function config

  it('should throw on discontinued option epsilon', function () {
    const math2 = math.create()
    assert.throws(
      () => math2.config({ epsilon: 1e-5 }), /discontinued.*epsilon/)
  })

  it('should work with compatibility subset during deprecation', function () {
    const math2 = math.create()
    // Add a spy to temporarily disable console.warn
    const warnStub = sinon.stub(console, 'warn')

    // Set legacySubset to true and should throw a warning
    assert.doesNotThrow(function () { math2.config({ legacySubset: true }) })

    // Check if legacySubset is set
    assert.strictEqual(math2.config().compatibility.subset, true)

    // Check if console.warn was called
    assert.strictEqual(warnStub.callCount, 1)

    // Ensure that legacy behavior of subset occurs
    assert.deepStrictEqual(math2.subset([1, 2], math.index([1])), 2)

    // Restore console.warn
    warnStub.restore()
  })
})
