// test object utils
const assert = require('assert')
const object = require('../../src/utils/object')

describe('object', function () {
  describe('clone', function () {
    it('should clone undefined', function () {
      assert.strictEqual(object.clone(undefined), undefined)
    })

    it('should clone null', function () {
      assert.strictEqual(object.clone(null), null)
    })

    it('should clone booleans', function () {
      assert.strictEqual(object.clone(true), true)
      assert.strictEqual(object.clone(false), false)
    })

    it('should clone numbers', function () {
      assert.strictEqual(object.clone(2.3), 2.3)
    })

    it('should clone strings', function () {
      assert.strictEqual(object.clone('hello'), 'hello')
    })

    it('should (deep) clone objects', function () {
      const obj = { a: { b: 'c', d: new Date(2014, 0, 1) } }
      const clone = object.clone(obj)

      assert.deepStrictEqual(obj, clone)

      // check whether the clone remains unchanged when changing the original object
      obj.a.b = 'cc'

      assert.strictEqual(clone.a.b, 'c')

      obj.a.d.setMonth(2)
      assert.strictEqual(clone.a.d.valueOf(), new Date(2014, 0, 1).valueOf())
    })

    it('should clone dates', function () {
      const d1 = new Date(2014, 1, 1)
      const d2 = object.clone(d1)
      assert.strictEqual(d1.valueOf(), d2.valueOf())
      d1.setMonth(2)
      assert.notStrictEqual(d1, d2)
    })

    it('should (deep) clone arrays', function () {
      const d = new Date(2014, 0, 1)
      const arr = [1, 2, d, { a: 3 }]
      const clone = object.clone(arr)

      assert.deepStrictEqual(arr, clone)
      assert.notStrictEqual(arr, clone)
      assert.notStrictEqual(arr[2], clone[2])
      assert.notStrictEqual(arr[3], clone[3])

      // check whether the clone remains unchanged when changing the original object
      arr[2] = null
      arr[3].a = 1
      d.setMonth(2)
      assert.strictEqual(clone[2].valueOf(), new Date(2014, 0, 1).valueOf())
      assert.strictEqual(clone[3].a, 3)
    })

    it('should throw an error in case of an unsupported type', function () {
      assert.throws(function () { object.clone(/a regexp/) }, /Cannot clone/)
    })
  })

  describe('extend', function () {
    it('should extend an object with all properties of an other object', function () {
      const e = {}
      const o1 = { a: 2, b: 3 }
      const o2 = { a: 4, b: null, c: undefined, d: 5, e: e }
      const o3 = object.extend(o1, o2)

      assert.strictEqual(o1, o3)
      assert.strictEqual(o1.e, o3.e)
      assert.deepStrictEqual(o3, { a: 4, b: null, c: undefined, d: 5, e: e })
      assert.deepStrictEqual(o2, { a: 4, b: null, c: undefined, d: 5, e: e }) // should be unchanged
    })

    it('should ignore inherited properties when extending an object', function () {
      Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native
      const o1 = { a: 2, b: 3 }
      const o2 = object.extend({}, o1)

      assert.strictEqual(o2['foo'], 'bar')
      assert.strictEqual(o2.hasOwnProperty('foo'), false)

      delete Object.prototype.foo
    })
  })

  describe('deepExtend', function () {
    it('should deep extend an object with all properties of an other object', function () {
      const e = { f: { g: 3 } }
      const o1 = { a: 2, b: 3 }
      const o2 = { a: 4, b: null, c: undefined, d: 5, e: e }
      const o3 = object.deepExtend(o1, o2)

      assert.strictEqual(o1, o3)
      assert.notStrictEqual(o3.e, o2.e)
      assert.deepStrictEqual(o3, { a: 4, b: null, c: undefined, d: 5, e: { f: { g: 3 } } })
      assert.deepStrictEqual(o2, { a: 4, b: null, c: undefined, d: 5, e: { f: { g: 3 } } }) // should be unchanged

      e.f.g = 4
      assert.deepStrictEqual(o3, { a: 4, b: null, c: undefined, d: 5, e: { f: { g: 3 } } }) // should be unchanged
      assert.deepStrictEqual(o2, { a: 4, b: null, c: undefined, d: 5, e: { f: { g: 4 } } }) // should be changed
    })

    it('should throw an error when deep extending an array (is not yet supported)', function () {
      assert.throws(function () { object.deepExtend({}, []) }, /Arrays are not supported by deepExtend/)
      assert.throws(function () { object.deepExtend({}, { a: [] }) }, /Arrays are not supported by deepExtend/)
      assert.throws(function () { object.deepExtend({}, { a: { b: [] } }) }, /Arrays are not supported by deepExtend/)
    })

    it('should ignore inherited properties when deep extending an object', function () {
      Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native
      const o1 = { a: 2, b: 3 }
      const o2 = object.deepExtend({}, o1)

      assert.strictEqual(o2['foo'], 'bar')
      assert.strictEqual(o2.hasOwnProperty('foo'), false)

      delete Object.prototype.foo
    })
  })

  describe('deepEqual', function () {
    it('should deep compare two objects', function () {
      assert.strictEqual(object.deepEqual({}, {}), true)

      assert.strictEqual(object.deepEqual({ a: 2, b: 3 }, { a: 2, b: 3 }), true)
      assert.strictEqual(object.deepEqual({ a: 2, b: 3 }, { a: 2, b: 4 }), false)
      assert.strictEqual(object.deepEqual({ a: 2, b: 3 }, { a: 2 }), false)
      assert.strictEqual(object.deepEqual({ a: 2 }, { a: 2, b: 3 }), false)
      assert.strictEqual(object.deepEqual({ a: 2, b: 3 }, { a: 2, b: {} }), false)
      assert.strictEqual(object.deepEqual({ a: 2, b: {} }, { a: 2, b: {} }), true)

      assert.strictEqual(object.deepEqual({ a: 2, b: { c: 4 } }, { a: 2, b: { c: 4 } }), true)
      assert.strictEqual(object.deepEqual({ a: 2, b: { c: 4 } }, { a: 2, b: { c: 5 } }), false)
      assert.strictEqual(object.deepEqual({ a: 2, b: { c: 4 } }, { a: 2, b: {} }), false)
      assert.strictEqual(object.deepEqual({ a: 2, b: {} }, { a: 2, b: { c: 4 } }), false)
    })

    it('should deep compare two arrays', function () {
      assert.strictEqual(object.deepEqual([], []), true)
      assert.strictEqual(object.deepEqual([1, 2], [1, 2]), true)
      assert.strictEqual(object.deepEqual([1, 2], [1, 2, 3]), false)
      assert.strictEqual(object.deepEqual([1, 0, 3], [1, 2, 3]), false)

      assert.strictEqual(object.deepEqual([1, 2, [3, 4]], [1, 2, [3, 4]]), true)
      assert.strictEqual(object.deepEqual([1, 2, [3]], [1, 2, [3, 4]]), false)
      assert.strictEqual(object.deepEqual([1, 2, [3, 4]], [1, 2, [3]]), false)
      assert.strictEqual(object.deepEqual([1, 2, null], [1, 2, [3]]), false)
      assert.strictEqual(object.deepEqual([1, 2, [3]], [1, 2, null]), false)
      assert.strictEqual(object.deepEqual([1, 2, 3], [1, 2, [3]]), false)
      assert.strictEqual(object.deepEqual([1, 2, [3]], [1, 2, 3]), false)
    })

    it('should deep compare mixed objects an arrays', function () {
      assert.strictEqual(object.deepEqual({}, []), false)
      assert.strictEqual(object.deepEqual({ a: {} }, { a: [] }), false)

      assert.strictEqual(object.deepEqual({ a: [1, 2, 3] }, { a: [1, 2, 3] }), true)
      assert.strictEqual(object.deepEqual({ a: [1, 2, {}] }, { a: [1, 2, {}] }), true)
      assert.strictEqual(object.deepEqual({ a: [1, 2, { b: 4 }] }, { a: [1, 2, { b: 4 }] }), true)
      assert.strictEqual(object.deepEqual({ a: [1, 2, { b: 4 }] }, { a: [1, 2, { b: 5 }] }), false)
      assert.strictEqual(object.deepEqual({ a: [1, 2, { b: 4 }] }, { a: [1, 2, {}] }), false)

      assert.strictEqual(object.deepEqual([1, 2, {}], [1, 2, {}]), true)
      assert.strictEqual(object.deepEqual([1, 2, { a: 3 }], [1, 2, { a: 3 }]), true)
      assert.strictEqual(object.deepEqual([1, 2, { a: 3 }], [1, 2, { a: 4 }]), false)
      assert.strictEqual(object.deepEqual([1, 2, { a: 3 }], [1, 2, 3]), false)
      assert.strictEqual(object.deepEqual([1, 2, 3], [1, 2, { a: 3 }]), false)
      assert.strictEqual(object.deepEqual([1, 2, { a: [3, 4] }], [1, 2, { a: [3, 4] }]), true)
      assert.strictEqual(object.deepEqual([1, 2, { a: [3, 4] }], [1, 2, { a: [3, 4, 5] }]), false)
    })

    it('should not ignore inherited properties during comparison', function () {
      Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native

      assert.strictEqual(object.deepEqual({}, {}), true)
      assert.strictEqual(object.deepEqual({ foo: 'bar' }, {}), true)

      delete Object.prototype.foo
    })
  })

  describe('canDefineProperty', function () {
    it('should test whether defineProperty is available', function () {
      assert.strictEqual(object.canDefineProperty(), true)
    })
  })

  describe('lazy', function () {
    it('should get a lazy property', function () {
      const obj = {}
      let count = 0
      object.lazy(obj, 'x', function () {
        count++
        return 2
      })

      const x = obj.x
      assert.strictEqual(x, 2)
      assert.strictEqual(count, 1)

      const x2 = obj.x
      assert.strictEqual(x2, 2)
      assert.strictEqual(count, 1)
    })

    it('should set a lazy property', function () {
      const obj = {}
      object.lazy(obj, 'x', function () {
        return 2
      })

      obj.x = 3
      const x = obj.x
      assert.strictEqual(x, 3)
    })
  })

  describe('traverse', function () {
    it('should traverse an existing path into an object', function () {
      const a = {}
      const b = { a: a }
      const c = { b: b }

      assert.strictEqual(object.traverse(c), c)
      assert.strictEqual(object.traverse(c, ''), c)
      assert.strictEqual(object.traverse(c, 'b'), b)
      assert.strictEqual(object.traverse(c, 'b.a'), a)
    })

    it('should append missing piece of a path', function () {
      const a = {}
      const b = { a: a }
      const c = { b: b }

      assert.strictEqual(object.traverse(c), c)
      assert.strictEqual(object.traverse(c, ''), c)
      assert.strictEqual(object.traverse(c, 'b'), b)
      assert.strictEqual(object.traverse(c, 'b.a'), a)
      assert.strictEqual(object.traverse(c, 'b.d'), b.d)
      assert.strictEqual(object.traverse(c, 'b.e.f'), b.e.f)
    })
  })

  describe('isFactory', function () {
    it('should test whether an object is a factory', function () {
      assert.strictEqual(object.isFactory({}), false)
      assert.strictEqual(object.isFactory({ foo: true }), false)
      assert.strictEqual(object.isFactory({ name: 'foo' }), false)
      assert.strictEqual(object.isFactory({ name: 'foo', factory: 'bar' }), false)
      assert.strictEqual(object.isFactory({ name: 2, factory: function () {} }), true)
      assert.strictEqual(object.isFactory({ factory: function () {} }), true)

      assert.strictEqual(object.isFactory({ name: 'foo', factory: function () {} }), true)
      assert.strictEqual(object.isFactory({ name: 'foo', factory: function () {}, foo: 'bar' }), true)
    })
  })
})
