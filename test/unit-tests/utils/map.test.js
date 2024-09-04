import assert from 'assert'
import { isMap } from '../../../src/utils/is.js'
import { assign, createMap, ObjectWrappingMap, PartitionedMap, toObject } from '../../../src/utils/map.js'

describe('maps', function () {
  it('should provide isMap, a function to tell maps from non-maps', function () {
    assert.ok(isMap(new Map()))
    assert.ok(!isMap([]))
    assert.ok(!isMap({}))

    const duckMap = {
      has: () => 0,
      keys: () => 0,
      get: () => 0,
      set: () => 0
    }

    assert.ok(isMap(duckMap))

    const duckNotMap = {
      has: () => 0,
      keys: () => 0,
      set: () => 0
    }
    assert.ok(!isMap(duckNotMap))

    const notMaps = [null, undefined, true, false, 'string', 42, /regular-expression/, new Date(), {}, []]
    for (const thing of notMaps) {
      assert.ok(!isMap(thing))
    }
  })

  describe('ObjectWrappingMap', function () {
    it('should wrap an object in a map-like object', function () {
      const obj = {
        a: 1,
        b: 2,
        c: 3
      }
      const map = new ObjectWrappingMap(obj)

      // isMap thinks it's a map.
      assert.ok(isMap(map))

      // get
      for (const key of ['a', 'b', 'c']) {
        assert.strictEqual(map.get(key), obj[key])
      }

      // get with a key not there gives an undefined.
      for (const key of ['e', 'f']) {
        assert.strictEqual(map.get(key), undefined)
      }

      // We can behind the scenes add to the wrapped object.
      Object.assign(obj, {
        d: 4,
        e: 5
      })

      // set()
      map.set('f', 6)
      map.set('g', 7)

      // we set the properties in obj, too.
      assert.strictEqual(obj.f, 6)
      assert.strictEqual(obj.g, 7)

      for (const key of ['d', 'e', 'f', 'g']) {
        assert.strictEqual(map.get(key), obj[key])
      }

      // keys()
      assert.deepStrictEqual([...map.keys()], ['a', 'b', 'c', 'd', 'e', 'f', 'g'])

      for (const key of map.keys()) {
        assert.ok(map.has(key))
      }

      // size(
      assert.strictEqual(map.size, 7)

      // delete
      map.delete('g')
      assert.deepStrictEqual([...map.keys()], ['a', 'b', 'c', 'd', 'e', 'f'])

      assert.ok(!map.has('not-in-this-map'))

      // forEach
      const log = []
      map.forEach((value, key) => (log.push([key, value])))
      assert.deepStrictEqual(log, [
        ['a', 1],
        ['b', 2],
        ['c', 3],
        ['d', 4],
        ['e', 5],
        ['f', 6]
      ])

      // entries
      const it = map.entries()
      assert.deepStrictEqual(it.next(), { done: false, value: ['a', 1] })
      assert.deepStrictEqual(it.next(), { done: false, value: ['b', 2] })
      assert.deepStrictEqual(it.next(), { done: false, value: ['c', 3] })
      assert.deepStrictEqual(it.next(), { done: false, value: ['d', 4] })
      assert.deepStrictEqual(it.next(), { done: false, value: ['e', 5] })
      assert.deepStrictEqual(it.next(), { done: false, value: ['f', 6] })
      assert.deepStrictEqual(it.next(), { done: true, value: undefined })

      // We can get the same object out using toObject
      const innerObject = toObject(map)
      assert.strictEqual(innerObject, obj)

      // Create a new Map
      const copy = new Map(map)
      assert.deepStrictEqual([...copy.keys()], [...map.keys()])

      // clear
      map.clear()
      assert.deepStrictEqual([...map.keys()], [])
      assert.deepStrictEqual(Object.keys(obj), [])
    })

    it('should not allow getting unsafe properties', function () {
      const map = new ObjectWrappingMap({})

      assert.throws(() => map.get('__proto__'), /Error: No access to property "__proto__"/)
    })

    it('should not allow setting unsafe properties', function () {
      const map = new ObjectWrappingMap({})

      assert.throws(() => map.set('__proto__', 42), /Error: No access to property "__proto__"/)
    })

    it('should not allow testing has unsafe properties', function () {
      const map = new ObjectWrappingMap({})

      assert.strictEqual(map.has('__proto__'), false)
    })

    it('should not allow deleting unsafe properties', function () {
      const obj = {
        toString: 42
      }
      const map = new ObjectWrappingMap(obj)

      map.delete('toString')
      assert.strictEqual(obj.toString, 42)
    })
  })

  describe('PartitionedMap', function () {
    function createPartitionedMap (bKeys) {
      const a = new Map()
      const b = new Map()
      const p = new PartitionedMap(a, b, new Set(bKeys))
      return { a, b, p }
    }

    it('get, set', function () {
      const { a, b, p } = createPartitionedMap(['b'])
      p
        .set('a', 2)
        .set('b', 3)

      assert.strictEqual(p.get('a'), 2)
      assert.strictEqual(p.get('b'), 3)
      assert.strictEqual(p.get('c'), undefined)

      assert.strictEqual(a.get('a'), 2)
      assert.strictEqual(a.get('b'), undefined)

      assert.strictEqual(b.get('a'), undefined)
      assert.strictEqual(b.get('b'), 3)
    })

    it('has', function () {
      const { a, b, p } = createPartitionedMap(['b'])
      p
        .set('a', 2)
        .set('b', 3)

      assert.strictEqual(p.has('a'), true)
      assert.strictEqual(p.has('b'), true)
      assert.strictEqual(p.has('c'), false)

      assert.strictEqual(a.has('a'), true)
      assert.strictEqual(a.has('b'), false)

      assert.strictEqual(b.has('a'), false)
      assert.strictEqual(b.has('b'), true)

      assert.deepStrictEqual([...p.keys()], ['a', 'b'])
      assert.deepStrictEqual([...a.keys()], ['a'])
      assert.deepStrictEqual([...b.keys()], ['b'])
    })

    it('keys', function () {
      const { a, b, p } = createPartitionedMap(['b'])
      p.set('a', 2)
      p.set('b', 3)

      assert.deepStrictEqual([...p.keys()], ['a', 'b'])
      assert.deepStrictEqual([...a.keys()], ['a'])
      assert.deepStrictEqual([...b.keys()], ['b'])
    })

    it('forEach', function () {
      const { a, b, p } = createPartitionedMap(['b'])
      p.set('a', 2)
      p.set('b', 3)
      p.set('c', 4)

      const pLog = []
      p.forEach((value, key) => (pLog.push([key, value])))
      assert.deepStrictEqual(pLog, [
        ['a', 2],
        ['c', 4],
        ['b', 3]
      ])

      const aLog = []
      a.forEach((value, key) => (aLog.push([key, value])))
      assert.deepStrictEqual(aLog, [
        ['a', 2],
        ['c', 4]
      ])

      const bLog = []
      b.forEach((value, key) => (bLog.push([key, value])))
      assert.deepStrictEqual(bLog, [
        ['b', 3]
      ])
    })

    it('entries', function () {
      const { p } = createPartitionedMap(['b'])
      p.set('a', 2)
      p.set('b', 3)
      p.set('c', 4)

      const it = p.entries()

      assert.deepStrictEqual(it.next(), { done: false, value: ['a', 2] })
      assert.deepStrictEqual(it.next(), { done: false, value: ['c', 4] })
      assert.deepStrictEqual(it.next(), { done: false, value: ['b', 3] })
      assert.deepStrictEqual(it.next(), { done: true, value: undefined })
    })

    it('copy', function () {
      const { p } = createPartitionedMap(['b'])
      p
        .set('a', 2)
        .set('b', 3)

      const copy = new Map(p)
      assert.deepStrictEqual([...copy.keys()], [...p.keys()])
    })

    it('size', function () {
      const { p } = createPartitionedMap(['b'])
      p.set('a', 2)
      p.set('b', 3)
      assert.strictEqual(p.size, 2)

      p.set('c', 4)
      assert.strictEqual(p.size, 3)

      p.delete('c')
      assert.strictEqual(p.size, 2)
    })

    it('delete', function () {
      const { a, b, p } = createPartitionedMap(['b'])
      p
        .set('a', 2)
        .set('b', 3)

      p.delete('a')

      assert.deepStrictEqual([...p.keys()], ['b'])
      assert.deepStrictEqual([...a.keys()], [])
      assert.deepStrictEqual([...b.keys()], ['b'])
    })

    it('clear', function () {
      const { a, b, p } = createPartitionedMap(['b'])
      a.set('a', 2)
      b.set('b', 3)

      p.clear()

      assert.deepStrictEqual([...p.keys()], [])
      assert.deepStrictEqual([...a.keys()], [])
      assert.deepStrictEqual([...b.keys()], [])
    })
  })

  it('should create a map from objects, maps, or undefined', function () {
    const emptyMap = createMap()
    assert.ok(isMap(emptyMap))

    const actualMap = createMap(new Map())
    assert.ok(isMap(actualMap))

    const wrappedMap = createMap({ a: 1 })
    assert.ok(isMap(wrappedMap))

    for (const notMap of ['string', new Date(), []]) {
      assert.throws(() => createMap(notMap))
    }
  })

  it('should let us transform a map into an object', function () {
    const actualMap = new Map()
      .set('a', 1)
      .set('b', 2)

    const obj = {
      a: 1,
      b: 2
    }

    assert.deepStrictEqual(toObject(actualMap), obj)
    assert.notStrictEqual(toObject(actualMap), obj)

    // The wrapped map gives back the backing object.
    const wrappedMap = createMap(obj)
    assert.deepStrictEqual(toObject(wrappedMap), obj)
    assert.strictEqual(toObject(wrappedMap), obj)
  })

  it('should provide an assign function like Object.assign', function () {
    const target = new Map()
      .set('a', 1)
      .set('b', 2)

    assign(target, null, undefined, 'string', new Date())

    assert.deepStrictEqual(
      target,
      new Map()
        .set('a', 1)
        .set('b', 2)
    )

    const src1 = new Map()
      .set('c', 3)
      .set('d', 4)

    const src2 = { e: 5, f: 6 }

    const sameTarget = assign(target, src1, src2)

    // it returns back the first argument…
    assert.strictEqual(target, sameTarget)

    // …copying the contents of the others into it.
    assert.deepStrictEqual(
      target,
      new Map()
        .set('a', 1)
        .set('b', 2)
        .set('c', 3)
        .set('d', 4)
        .set('e', 5)
        .set('f', 6)
    )
  })
})
