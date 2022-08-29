import assert from 'assert'
import { isMap, ObjectWrappingMap, toObject, createMap, assign } from '../../../src/utils/map.js'

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
    assert.deepStrictEqual(map.keys(), ['a', 'b', 'c', 'd', 'e', 'f', 'g'])

    for (const key of map.keys()) {
      assert.ok(map.has(key))
    }

    assert.ok(!map.has('not-in-this-map'))

    // We can get the same object out using toObject
    const innerObject = toObject(map)
    assert.strictEqual(innerObject, obj)
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
