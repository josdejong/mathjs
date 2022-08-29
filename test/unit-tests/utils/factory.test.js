import assert from 'assert'
import { sortFactories, factory, isFactory } from '../../../src/utils/factory.js'

describe('factory', function () {
  it('should test whether something is a factory', function () {
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

  it('should only pass the dependencies, not the whole scope', function (done) {
    const f = factory('fn1', ['a', 'c'], (scope) => {
      assert.deepStrictEqual(scope, { a: 1, c: 3 })

      done()
    })

    f({ a: 1, b: 2, c: 3 })
  })

  // FIXME: this unit test doesn't work on IE either remove sortFactories if redundant, or use it and get the test working
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should order functions by their dependencies (1)', function () {
    function fn1 () { return 1 }
    const fn2factory = factory('fn2', ['fn1'], () => {})
    const fn3factory = factory('fn3', ['fn2'], () => {})
    function fn4 () { return 4 }
    function fn5 () { return 5 }

    assert.deepStrictEqual(sortFactories([fn3factory, fn2factory, fn1, fn4, fn5])
      .map(f => f.fn || f.name), ['fn1', 'fn2', 'fn3', 'fn4', 'fn5'])

    assert.deepStrictEqual(sortFactories([fn1, fn2factory, fn3factory, fn4, fn5])
      .map(f => f.fn || f.name), ['fn1', 'fn2', 'fn3', 'fn4', 'fn5'])

    assert.deepStrictEqual(sortFactories([fn4, fn5, fn1, fn2factory, fn3factory])
      .map(f => f.fn || f.name), ['fn1', 'fn2', 'fn3', 'fn4', 'fn5'])

    assert.deepStrictEqual(sortFactories([fn5, fn4, fn1, fn2factory, fn3factory])
      .map(f => f.fn || f.name), ['fn1', 'fn2', 'fn3', 'fn5', 'fn4'])
  })

  it('should order functions by their dependencies (2)', function () {
    const fn1 = factory('fn1', [], () => {})
    const fn2 = factory('fn2', ['fn4'], () => {})
    const fn3 = factory('fn3', [], () => {})
    const fn4 = factory('fn4', ['fn3'], () => {})

    assert.deepStrictEqual(sortFactories([fn1, fn2, fn3, fn4])
      .map(f => f.fn || f.name), ['fn1', 'fn3', 'fn4', 'fn2'])
  })

  // TODO: throw an error in case of circular dependencies
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('should not go crazy with circular dependencies', function () {
    const fn1factory = factory('fn1', ['fn2'], () => {})
    const fn2factory = factory('fn2', ['fn1'], () => {})

    assert.deepStrictEqual(sortFactories([fn1factory, fn2factory])
      .map(f => f.fn), ['fn1', 'fn2'])

    assert.deepStrictEqual(sortFactories([fn2factory, fn1factory])
      .map(f => f.fn), ['fn2', 'fn1'])
  })

  it('should allow optional dependencies', function () {
    const createFn1 = factory('fn1', ['a', '?b'], ({ a, b }) => {
      return () => ({ a, b })
    })

    const ab = createFn1({ a: 2, b: 3 })
    assert.deepStrictEqual(ab(), { a: 2, b: 3 })
    const a = createFn1({ a: 2 })
    assert.deepStrictEqual(a(), { a: 2, b: undefined })
  })

  it('should attach meta information to a factory function', function () {
    const createFn1 = factory('fn1', [], () => {})
    assert.strictEqual(createFn1.meta, undefined)

    const createClass1 = factory('Class1', [], () => {}, {
      isClass: true
    })
    assert.deepStrictEqual(createClass1.meta, { isClass: true })
  })

  // TODO: test whether a factory function is created only once for the same dependencies
})
