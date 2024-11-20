import assert from 'assert'
import {
  canDefineProperty,
  clone,
  deepStrictEqual,
  deepExtend,
  extend,
  get,
  isLegacyFactory,
  lazy,
  pick,
  set,
  traverse,
  deepFlatten, hasOwnProperty
} from '../../../src/utils/object.js'

describe('object', function () {
  describe('clone', function () {
    it('should clone undefined', function () {
      assert.strictEqual(clone(undefined), undefined)
    })

    it('should clone null', function () {
      assert.strictEqual(clone(null), null)
    })

    it('should clone booleans', function () {
      assert.strictEqual(clone(true), true)
      assert.strictEqual(clone(false), false)
    })

    it('should clone numbers', function () {
      assert.strictEqual(clone(2.3), 2.3)
    })

    it('should clone bigint', function () {
      assert.strictEqual(clone(4n), 4n)
    })

    it('should clone strings', function () {
      assert.strictEqual(clone('hello'), 'hello')
    })

    it('should (deep) clone objects', function () {
      const obj = { a: { b: 'c', d: new Date(2014, 0, 1) } }
      const c = clone(obj)

      assert.deepStrictEqual(obj, c)

      // check whether the clone remains unchanged when changing the original object
      obj.a.b = 'cc'

      assert.strictEqual(c.a.b, 'c')

      obj.a.d.setMonth(2)
      assert.strictEqual(c.a.d.valueOf(), new Date(2014, 0, 1).valueOf())
    })

    it('should clone dates', function () {
      const d1 = new Date(2014, 1, 1)
      const d2 = clone(d1)
      assert.strictEqual(d1.valueOf(), d2.valueOf())
      d1.setMonth(2)
      assert.notStrictEqual(d1, d2)
    })

    it('should (deep) clone arrays', function () {
      const d = new Date(2014, 0, 1)
      const arr = [1, 2, d, { a: 3 }]
      const c = clone(arr)

      assert.deepStrictEqual(arr, c)
      assert.notStrictEqual(arr, c)
      assert.notStrictEqual(arr[2], c[2])
      assert.notStrictEqual(arr[3], c[3])

      // check whether the clone remains unchanged when changing the original object
      arr[2] = null
      arr[3].a = 1
      d.setMonth(2)
      assert.strictEqual(c[2].valueOf(), new Date(2014, 0, 1).valueOf())
      assert.strictEqual(c[3].a, 3)
    })

    it('should throw an error in case of an unsupported type', function () {
      assert.throws(function () { clone(/a regexp/) }, /Cannot clone: unknown type of value/)
    })
  })

  describe('extend', function () {
    it('should extend an object with all properties of an other object', function () {
      const e = {}
      const o1 = { a: 2, b: 3 }
      const o2 = { a: 4, b: null, c: undefined, d: 5, e }
      const o3 = extend(o1, o2)

      assert.strictEqual(o1, o3)
      assert.strictEqual(o1.e, o3.e)
      assert.deepStrictEqual(o3, { a: 4, b: null, c: undefined, d: 5, e })
      assert.deepStrictEqual(o2, { a: 4, b: null, c: undefined, d: 5, e }) // should be unchanged
    })

    it('should ignore inherited properties when extending an object', function () {
      Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native
      const o1 = { a: 2, b: 3 }
      const o2 = extend({}, o1)

      assert.strictEqual(o2.foo, 'bar')
      assert.strictEqual(hasOwnProperty(o2, 'foo'), false)

      delete Object.prototype.foo
    })
  })

  describe('deepExtend', function () {
    it('should deep extend an object with all properties of an other object', function () {
      const e = { f: { g: 3 } }
      const o1 = { a: 2, b: 3 }
      const o2 = { a: 4, b: null, c: undefined, d: 5, e }
      const o3 = deepExtend(o1, o2)

      assert.strictEqual(o1, o3)
      assert.notStrictEqual(o3.e, o2.e)
      assert.deepStrictEqual(o3, { a: 4, b: null, c: undefined, d: 5, e: { f: { g: 3 } } })
      assert.deepStrictEqual(o2, { a: 4, b: null, c: undefined, d: 5, e: { f: { g: 3 } } }) // should be unchanged

      e.f.g = 4
      assert.deepStrictEqual(o3, { a: 4, b: null, c: undefined, d: 5, e: { f: { g: 3 } } }) // should be unchanged
      assert.deepStrictEqual(o2, { a: 4, b: null, c: undefined, d: 5, e: { f: { g: 4 } } }) // should be changed
    })

    it('should throw an error when deep extending an array (is not yet supported)', function () {
      assert.throws(function () { deepExtend({}, []) }, /Arrays are not supported by deepExtend/)
      assert.throws(function () { deepExtend({}, { a: [] }) }, /Arrays are not supported by deepExtend/)
      assert.throws(function () { deepExtend({}, { a: { b: [] } }) }, /Arrays are not supported by deepExtend/)
    })

    it('should ignore inherited properties when deep extending an object', function () {
      Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native
      const o1 = { a: 2, b: 3 }
      const o2 = deepExtend({}, o1)

      assert.strictEqual(o2.foo, 'bar')
      assert.strictEqual(hasOwnProperty(o2, 'foo'), false)

      delete Object.prototype.foo
    })

    it('should not pollute Object.__proto__', function () {
      const obj = {}
      assert.strictEqual(obj.polluted, undefined)

      deepExtend(obj, JSON.parse('{"__proto__": {"polluted":"yes"}}'))
      assert.strictEqual(obj.polluted, undefined)
    })

    it('should not pollute Object.constructor (1)', function () {
      const obj = {}
      const originalConstructor = obj.constructor
      assert.strictEqual(obj.polluted, undefined)

      deepExtend(obj, JSON.parse('{"constructor": {"prototype": {"polluted": "yes"}}}'))
      assert.strictEqual(obj.constructor, originalConstructor)
      assert.strictEqual(obj.polluted, undefined)
    })

    it('should not pollute Object.constructor (2)', function () {
      const obj = {}
      const originalConstructor = obj.constructor

      const polluted = function polluted () {}
      deepExtend(obj, { constructor: polluted })
      assert.strictEqual(obj.constructor, originalConstructor)
    })
  })

  describe('deepEqual', function () {
    it('should deep compare two objects', function () {
      assert.strictEqual(deepStrictEqual({}, {}), true)

      assert.strictEqual(deepStrictEqual({ a: 2, b: 3 }, { a: 2, b: 3 }), true)
      assert.strictEqual(deepStrictEqual({ a: 2, b: 3 }, { a: 2, b: 4 }), false)
      assert.strictEqual(deepStrictEqual({ a: 2, b: 3 }, { a: 2 }), false)
      assert.strictEqual(deepStrictEqual({ a: 2 }, { a: 2, b: 3 }), false)
      assert.strictEqual(deepStrictEqual({ a: 2, b: 3 }, { a: 2, b: {} }), false)
      assert.strictEqual(deepStrictEqual({ a: 2, b: {} }, { a: 2, b: {} }), true)

      assert.strictEqual(deepStrictEqual({ a: 2, b: { c: 4 } }, { a: 2, b: { c: 4 } }), true)
      assert.strictEqual(deepStrictEqual({ a: 2, b: { c: 4 } }, { a: 2, b: { c: 5 } }), false)
      assert.strictEqual(deepStrictEqual({ a: 2, b: { c: 4 } }, { a: 2, b: {} }), false)
      assert.strictEqual(deepStrictEqual({ a: 2, b: {} }, { a: 2, b: { c: 4 } }), false)

      assert.strictEqual(deepStrictEqual(undefined, undefined), true)
      assert.strictEqual(deepStrictEqual({ a: undefined }, { }), false)
      assert.strictEqual(deepStrictEqual({ }, { a: undefined }), false)
      assert.strictEqual(deepStrictEqual({ a: undefined }, { a: undefined }), true)
    })

    it('should deep compare values and functions strictly', function () {
      assert.strictEqual(deepStrictEqual({ a: 2 }, { a: '2' }), false)
      assert.strictEqual(deepStrictEqual(2, '2'), false)

      const fn1 = (a, b) => a + b
      const fn2 = (a, b) => a + b
      assert.strictEqual(deepStrictEqual({ add: fn1 }, { add: fn1 }), true)
      assert.strictEqual(deepStrictEqual({ add: fn1 }, { add: fn2 }), false)
      assert.strictEqual(deepStrictEqual({ b: { add: fn1 } }, { b: { add: fn1 } }), true)
      assert.strictEqual(deepStrictEqual({ b: { add: fn1 } }, { b: { add: fn2 } }), false)
    })

    it('should deep compare two arrays', function () {
      assert.strictEqual(deepStrictEqual([], []), true)
      assert.strictEqual(deepStrictEqual([1, 2], [1, 2]), true)
      assert.strictEqual(deepStrictEqual([1, 2], [1, 2, 3]), false)
      assert.strictEqual(deepStrictEqual([1, 0, 3], [1, 2, 3]), false)

      assert.strictEqual(deepStrictEqual([1, 2, [3, 4]], [1, 2, [3, 4]]), true)
      assert.strictEqual(deepStrictEqual([1, 2, [3]], [1, 2, [3, 4]]), false)
      assert.strictEqual(deepStrictEqual([1, 2, [3, 4]], [1, 2, [3]]), false)
      assert.strictEqual(deepStrictEqual([1, 2, null], [1, 2, [3]]), false)
      assert.strictEqual(deepStrictEqual([1, 2, [3]], [1, 2, null]), false)
      assert.strictEqual(deepStrictEqual([1, 2, 3], [1, 2, [3]]), false)
      assert.strictEqual(deepStrictEqual([1, 2, [3]], [1, 2, 3]), false)
    })

    it('should deep compare mixed objects an arrays', function () {
      assert.strictEqual(deepStrictEqual({}, []), false)
      assert.strictEqual(deepStrictEqual({ a: {} }, { a: [] }), false)

      assert.strictEqual(deepStrictEqual({ a: [1, 2, 3] }, { a: [1, 2, 3] }), true)
      assert.strictEqual(deepStrictEqual({ a: [1, 2, {}] }, { a: [1, 2, {}] }), true)
      assert.strictEqual(deepStrictEqual({ a: [1, 2, { b: 4 }] }, { a: [1, 2, { b: 4 }] }), true)
      assert.strictEqual(deepStrictEqual({ a: [1, 2, { b: 4 }] }, { a: [1, 2, { b: 5 }] }), false)
      assert.strictEqual(deepStrictEqual({ a: [1, 2, { b: 4 }] }, { a: [1, 2, {}] }), false)

      assert.strictEqual(deepStrictEqual([1, 2, {}], [1, 2, {}]), true)
      assert.strictEqual(deepStrictEqual([1, 2, { a: 3 }], [1, 2, { a: 3 }]), true)
      assert.strictEqual(deepStrictEqual([1, 2, { a: 3 }], [1, 2, { a: 4 }]), false)
      assert.strictEqual(deepStrictEqual([1, 2, { a: 3 }], [1, 2, 3]), false)
      assert.strictEqual(deepStrictEqual([1, 2, 3], [1, 2, { a: 3 }]), false)
      assert.strictEqual(deepStrictEqual([1, 2, { a: [3, 4] }], [1, 2, { a: [3, 4] }]), true)
      assert.strictEqual(deepStrictEqual([1, 2, { a: [3, 4] }], [1, 2, { a: [3, 4, 5] }]), false)
    })

    it('should not ignore inherited properties during comparison', function () {
      Object.prototype.foo = 'bar' // eslint-disable-line no-extend-native

      assert.strictEqual(deepStrictEqual({}, {}), true)
      assert.strictEqual(deepStrictEqual({ foo: 'bar' }, {}), true)

      delete Object.prototype.foo
    })
  })

  describe('canDefineProperty', function () {
    it('should test whether defineProperty is available', function () {
      assert.strictEqual(canDefineProperty(), true)
    })
  })

  describe('lazy', function () {
    it('should get a lazy property', function () {
      const obj = {}
      let count = 0
      lazy(obj, 'x', function () {
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
      lazy(obj, 'x', function () {
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
      const b = { a }
      const c = { b }

      assert.strictEqual(traverse(c), c)
      assert.strictEqual(traverse(c, ''), c)
      assert.strictEqual(traverse(c, 'b'), b)
      assert.strictEqual(traverse(c, 'b.a'), a)
      assert.strictEqual(traverse(c, ['b', 'a']), a)
    })

    it('should append missing piece of a path', function () {
      const a = {}
      const b = { a }
      const c = { b }

      assert.strictEqual(traverse(c), c)
      assert.strictEqual(traverse(c, ''), c)
      assert.strictEqual(traverse(c, 'b'), b)
      assert.strictEqual(traverse(c, 'b.a'), a)
      assert.strictEqual(traverse(c, 'b.d'), b.d)
      assert.strictEqual(traverse(c, 'b.e.f'), b.e.f)
    })
  })

  describe('isFactory', function () {
    it('should test whether an object is a factory', function () {
      assert.strictEqual(isLegacyFactory({}), false)
      assert.strictEqual(isLegacyFactory({ foo: true }), false)
      assert.strictEqual(isLegacyFactory({ name: 'foo' }), false)
      assert.strictEqual(isLegacyFactory({ name: 'foo', factory: 'bar' }), false)
      assert.strictEqual(isLegacyFactory({ name: 2, factory: function () {} }), true)
      assert.strictEqual(isLegacyFactory({ factory: function () {} }), true)

      assert.strictEqual(isLegacyFactory({ name: 'foo', factory: function () {} }), true)
      assert.strictEqual(isLegacyFactory({ name: 'foo', factory: function () {}, foo: 'bar' }), true)
    })
  })

  describe('get', function () {
    it('should get nested properties from an object', function () {
      const object = {
        a: 2,
        b: {
          c: 3,
          e: null
        }
      }

      assert.strictEqual(get(object, ''), undefined)
      assert.strictEqual(get(object, []), object)
      assert.strictEqual(get(object, 'a'), 2)
      assert.strictEqual(get(object, 'b.c'), 3)
      assert.strictEqual(get(object, ['b', 'c']), 3)
      assert.strictEqual(get(object, 'b.e'), null)
      assert.strictEqual(get(object, 'a.foo'), undefined)
    })
  })

  describe('set', function () {
    it('should set a nested property in an object', function () {
      assert.deepStrictEqual(set({}, [], 2), {})
      assert.deepStrictEqual(set({}, 'a', 2), { a: 2 })
      assert.deepStrictEqual(set({ a: 2 }, 'b.c', 3), { a: 2, b: { c: 3 } })
      assert.deepStrictEqual(set({ a: 2 }, ['b', 'c'], 3), { a: 2, b: { c: 3 } })
    })
  })

  describe('pick', function () {
    it('should pick the selected properties', function () {
      const object = { a: 1, b: 2, c: 3 }
      assert.deepStrictEqual(pick(object, ['a', 'c', 'd']), { a: 1, c: 3 })
    })

    it('should pick nested properties', function () {
      const object = {
        a: 1,
        b: {
          c: 2,
          d: 3
        }
      }

      assert.deepStrictEqual(pick(object, ['a']), { a: 1 })
      assert.deepStrictEqual(pick(object, ['a', 'b.c']), { a: 1, b: { c: 2 } })
      assert.deepStrictEqual(pick(object, ['a', ['b', 'c']]), { a: 1, b: { c: 2 } })
      assert.deepStrictEqual(pick(object, ['a', 'b.c', 'foo', 'b.foo']), { a: 1, b: { c: 2 } })
    })

    it('should pick and transform nested properties', function () {
      const object = {
        a: 1,
        b: {
          c: 2,
          d: 3
        }
      }

      function transform (value, key) {
        return `[${key}:${value}]`
      }

      assert.deepStrictEqual(pick(object, ['a', 'b.c'], transform), {
        a: '[a:1]',
        b: {
          c: '[b.c:2]'
        }
      })
    })
  })

  describe('deepFlatten', function () {
    it('should flatten nested object properties', function () {
      assert.deepStrictEqual(deepFlatten({
        obj: { a: 2, b: 3 },
        c: 4,
        foo: { bar: { d: 5 } }
      }), { a: 2, b: 3, c: 4, d: 5 })
    })

    it('should merge duplicate values when flatting nested object properties', function () {
      assert.deepStrictEqual(deepFlatten({
        obj: { a: 2 },
        foo: { bar: { a: 3 } }
      }), { a: 3 })
    })
  })
})
