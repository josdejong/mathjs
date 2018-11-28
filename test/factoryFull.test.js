import assert from 'assert'
import { createSqrtFull } from '../src/factoryFull'

describe('factory', function () {
  it('should create sqrt from a partial factory', () => {
    const config = {
      precision: 64,
      epsilon: 1e-12,
      predictable: false
    }

    const sqrt = createSqrtFull({ config })
    assert.strictEqual(sqrt(4), 2)
    assert.strictEqual(sqrt(-4).toString(), '2i')
  })
})
