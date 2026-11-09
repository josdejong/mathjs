import assert from 'assert'
import { addDependencies, divideDependencies, kldivergenceDependencies, piDependencies } from '../../src/entry/dependenciesAny.generated.js'
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

  it('should create KL divergence with its complete generated dependencies', function () {
    const { kldivergence } = create({ kldivergenceDependencies })
    assert.strictEqual(kldivergence([1, 0], [1, 0]), 0)
    assert.strictEqual(kldivergence([1, 0], [0.5, 0.5]), Math.log(2))
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
