import assert from 'assert'
import math from '../../../../src/bundleAny'
const eigs = math.eigs

describe('eigs', function () {
  it('eigenvalue test', function () {
    assert.strictEqual(eigs([1]), 0, eigs)
  })
})
