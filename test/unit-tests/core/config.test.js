import assert from 'assert'
import math from '../../../src/defaultInstance.js'

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
})
