import assert from 'assert'
import { memoize, memoizeCompare } from '../../../src/utils/function.js'
import { deepStrictEqual } from '../../../src/utils/object.js'

describe('util.function', function () {
  describe('memoize', function () {
    it('should memoize a function with one argument', function () {
      const f = function (x) { return x * x }

      const m = memoize(f)

      assert.strictEqual(m(2), 4)
      assert.strictEqual(m(3), 9)
    })

    it('should memoize a function with two arguments', function () {
      const f = function (x, y) { return x * y }

      const m = memoize(f)

      assert.strictEqual(m(2, 3), 6)

      // hash should differ
      assert.strictEqual(m(1, 23), 23)
      assert.strictEqual(m(12, 3), 36)
    })

    it('should memoize a function with objects as arguments', function () {
      const f = function (obj) { return obj.x * obj.y }

      const m = memoize(f)

      assert.strictEqual(m({ x: 2, y: 3 }), 6)
      assert.deepStrictEqual([...m.cache.values.keys()], ['[{"x":2,"y":3}]'])
      assert.strictEqual(m.cache.values.get('[{"x":2,"y":3}]'), 6)
    })

    it('should memoize a function with a custom hashIt function', function () {
      const f = function (obj) { return obj.id }
      const hashIt = function (args) {
        return 'id:' + args[0].id
      }

      const m = memoize(f, { hasher: hashIt })

      assert.strictEqual(m({ id: 2 }), 2)
      assert.deepStrictEqual([...m.cache.values.keys()], ['id:2'])
      assert.strictEqual(m.cache.values.get('id:2'), 2)
    })

    it('should really return the cached result', function () {
      let a = 2
      const f = function (x) { return a } // trick: no pure function

      const m = memoize(f)

      assert.strictEqual(m(4), 2)
      a = 3
      assert.strictEqual(m(4), 2)
    })
  })

  it('should limit the number of values stored', function () {
    let a = 1
    const f = function (x) { a++; return a } // trick: no pure function

    const m = memoize(f, { limit: 2 })

    assert.strictEqual(m(1), 2)
    assert.strictEqual(m(2), 3)
    // this should evict m(1)
    assert.strictEqual(m(3), 4)

    assert.strictEqual(m(1), 5)
  })

  describe('memoizeCompare', function () {
    it('should memoize using comparison', function () {
      let execCount = 0

      function multiply (obj) {
        execCount++
        return obj.x * obj.y
      }

      const m = memoizeCompare(multiply, deepStrictEqual)

      assert.strictEqual(m({ x: 2, y: 3 }), 6)
      assert.strictEqual(execCount, 1)
      assert.strictEqual(m({ x: 2, y: 3 }), 6)
      assert.strictEqual(execCount, 1)

      assert.strictEqual(m({ x: 2, y: 3, z: 4 }), 6)
      assert.strictEqual(execCount, 2)

      const fn1 = (a, b) => a + b
      const fn2 = (a, b) => a + b
      assert.strictEqual(m({ x: 2, y: 3, add: fn1 }), 6)
      assert.strictEqual(execCount, 3)
      assert.strictEqual(m({ x: 2, y: 3, add: fn1 }), 6)
      assert.strictEqual(execCount, 3)
      assert.strictEqual(m({ x: 2, y: 3, add: fn2 }), 6)
      assert.strictEqual(execCount, 4)

      assert.strictEqual(m({ x: 2, y: 3, z: undefined }), 6)
      assert.strictEqual(execCount, 5)
      assert.strictEqual(m({ x: 2, y: 3, z: undefined }), 6)
      assert.strictEqual(execCount, 5)
    })
  })
})
