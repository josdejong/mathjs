import assert from 'assert'
import { sortFactories, factory, isFactory } from '../../src/utils/factory'

describe('factory', function () {
  it('should test whether something is a factory', () => {
    assert.strictEqual(isFactory(), false)
    assert.strictEqual(isFactory({}), false)

    const factory1 = () => {}
    factory1.fn = 'fn1'
    factory1.dependencies = ['fn2']
    assert.strictEqual(isFactory(factory1), true)

    const factory2 = () => {}
    factory2.fn = 'fn2'
    factory2.dependencies = 'foo'
    assert.strictEqual(isFactory(factory2), false)

    const factory3 = factory('fn3', ['fn2'], () => {})
    assert.strictEqual(isFactory(factory3), true)
  })

  it('should only pass the dependencies, not the whole scope', (done) => {
    const f = factory('fn1', ['a', 'c'], (scope) => {
      assert.deepStrictEqual(scope, { a: 1, c: 3 })

      done()
    })

    f({ a: 1, b: 2, c: 3 })
  })

  it('should order functions by their dependencies (1)', () => {
    const fn1factory = factory('fn1', [], () => {})
    const fn2factory = factory('fn2', ['fn1'], () => {})
    const fn3factory = factory('fn3', ['fn2'], () => {})
    const fn4 = function () {}
    const fn5 = function () {}

    assert.deepStrictEqual(sortFactories([ fn3factory, fn2factory, fn1factory, fn4, fn5 ])
      .map(f => f.fn || f.name), ['fn4', 'fn5', 'fn1', 'fn2', 'fn3'])

    assert.deepStrictEqual(sortFactories([ fn1factory, fn2factory, fn3factory, fn4, fn5 ])
      .map(f => f.fn || f.name), ['fn4', 'fn5', 'fn1', 'fn2', 'fn3'])

    assert.deepStrictEqual(sortFactories([ fn4, fn5, fn1factory, fn2factory, fn3factory ])
      .map(f => f.fn || f.name), ['fn4', 'fn5', 'fn1', 'fn2', 'fn3'])

    assert.deepStrictEqual(sortFactories([ fn5, fn4, fn1factory, fn2factory, fn3factory ])
      .map(f => f.fn || f.name), ['fn5', 'fn4', 'fn1', 'fn2', 'fn3'])
  })

  it('should order functions by their dependencies (2)', () => {
    const fn1 = factory('fn1', [], () => {})
    const fn2 = factory('fn2', ['fn4'], () => {})
    const fn3 = factory('fn3', [], () => {})
    const fn4 = factory('fn4', ['fn3'], () => {})

    assert.deepStrictEqual(sortFactories([ fn1, fn2, fn3, fn4 ])
      .map(f => f.fn || f.name), ['fn1', 'fn3', 'fn4', 'fn2'])
  })

  // TODO: throw an error in case of circular dependencies
  it.skip('should not go crazy with circular dependencies', () => {
    const fn1factory = factory('fn1', ['fn2'], () => {})
    const fn2factory = factory('fn2', ['fn1'], () => {})

    assert.deepStrictEqual(sortFactories([ fn1factory, fn2factory ])
      .map(f => f.fn), ['fn1', 'fn2'])

    assert.deepStrictEqual(sortFactories([ fn2factory, fn1factory ])
      .map(f => f.fn), ['fn2', 'fn1'])
  })
})
