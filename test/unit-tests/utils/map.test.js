import assert from 'assert'
import { isMap, ObjectWrappingMap, toObject, createMap } from '../../../src/utils/map.js'

describe('maps', function () {
  it('should provide isMap, a function to tell maps from non-maps', () => {
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
  })

  it('should wrap an object in a map-like object', () => {
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

  it('should create a map from objects, maps, or undefined', () => {
    const emptyMap = createMap()
    assert.ok(isMap(emptyMap))

    const actualMap = createMap(new Map())
    assert.ok(isMap(actualMap))

    const wrappedMap = createMap({ a: 1 })
    assert.ok(isMap(wrappedMap))

    assert.throws(() => createMap('how is a string map like'))
  })

  it('should let us transform a map into an object', () => {
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
})
