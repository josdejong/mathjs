import assert from 'assert'
import { addDependencies, divideDependencies, piDependencies } from '../../src/entry/dependenciesAny.generated.js'
import { create } from '../../src/core/create.js'

describe('dependencies', function () {
  it('should create functions from a collection of dependencies', function () {
    const { add, divide, pi } = create({
      addDependencies,
      divideDependencies,
      piDependencies
    })

    assert.strictEqual(add(2, 3), 5)
    assert.strictEqual(divide(6, 3), 2)
    assert.strictEqual(pi, Math.PI)
  })

  it('should create functions with config', function () {
    const config = { number: 'BigNumber' }
    const { pi } = create({
      piDependencies
    }, config)

    assert.strictEqual(pi.isBigNumber, true)
    assert.strictEqual(pi.toString(), '3.141592653589793238462643383279502884197169399375105820974944592')
  })
})
