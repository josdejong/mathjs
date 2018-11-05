import assert from 'assert'
import { compareFactories, isFactory } from '../../src/utils/factory'

describe('factory', function () {
  it('should test whether something is a factory', () => {
    assert.strictEqual(isFactory(), false)
    assert.strictEqual(isFactory({}), false)
    assert.strictEqual(isFactory({
      name: 'fn',
      dependencies: [],
      create: () => {}
    }), true)
    assert.strictEqual(isFactory({
      name: 'fn',
      dependencies: 'foo',
      create: () => {}
    }), false)
  })

  it('should order functions by their dependencies', () => {
    const fn1factory = { name: 'fn1', dependencies: [], create () {} }
    const fn2factory = { name: 'fn2', dependencies: ['fn1'], create () {} }
    const fn3 = function () {}

    assert.deepStrictEqual([ fn2factory, fn1factory, fn3 ]
      .sort(compareFactories)
      .map(f => f.name), ['fn3', 'fn1', 'fn2'])

    assert.deepStrictEqual([ fn1factory, fn2factory, fn3 ]
      .sort(compareFactories)
      .map(f => f.name), ['fn3', 'fn1', 'fn2'])

    assert.deepStrictEqual([ fn3, fn1factory, fn2factory ]
      .sort(compareFactories)
      .map(f => f.name), ['fn3', 'fn1', 'fn2'])
  })

  it('should not go crazy with circular dependencies', () => {
    const fn1factory = { name: 'fn1', dependencies: ['fn2'], create () {} }
    const fn2factory = { name: 'fn2', dependencies: ['fn1'], create () {} }

    assert.deepStrictEqual([ fn1factory, fn2factory ]
      .sort(compareFactories)
      .map(f => f.name), ['fn1', 'fn2'])

    assert.deepStrictEqual([ fn2factory, fn1factory ]
      .sort(compareFactories)
      .map(f => f.name), ['fn2', 'fn1'])
  })

  // TODO: test circular dependency
})
