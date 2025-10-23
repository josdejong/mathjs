// test data type Index
import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Index = math.Index
const Range = math.Range
const ImmutableDenseMatrix = math.ImmutableDenseMatrix

describe('Index', function () {
  it('should create an Index', function () {
    assert.deepStrictEqual(new Index(0, 2)._dimensions, [0, 2])

    assert.deepStrictEqual(new Index(new Range(0, 10))._dimensions, [new Range(0, 10, 1)])
    assert.deepStrictEqual(new Index(new Range(0, 10, 2))._dimensions, [new Range(0, 10, 2)])
    assert.deepStrictEqual(new Index(new Range(0, 10), new Range(4, 6))._dimensions, [
      new Range(0, 10, 1),
      new Range(4, 6, 1)
    ])
    assert.deepStrictEqual(new Index(new ImmutableDenseMatrix([0, 10]))._dimensions, [new ImmutableDenseMatrix([0, 10])])
    assert.deepStrictEqual(new Index([0, 10])._dimensions, [new ImmutableDenseMatrix([0, 10])])
    assert.deepStrictEqual(new Index(10)._dimensions, [10])
  })

  it('should create an Index from bigints', function () {
    assert.deepStrictEqual(new Index(0n, 2n)._dimensions, [0, 2])

    assert.deepStrictEqual(new Index(new Range(0n, 10n))._dimensions, [new Range(0, 10, 1)])
    assert.deepStrictEqual(new Index(new Range(0n, 10n, 2))._dimensions, [new Range(0, 10, 2)])
    assert.deepStrictEqual(new Index(new Range(0n, 10n), new Range(4, 6))._dimensions, [
      new Range(0, 10, 1),
      new Range(4, 6, 1)
    ])
  })

  it('should create an Index from a Range', function () {
    assert.deepStrictEqual(new Index(new Range(0, 10))._dimensions, [new Range(0, 10, 1)])
  })

  it('should create an Index from a Matrix', function () {
    assert.deepStrictEqual(new Index(math.matrix([0, 10]))._dimensions, [new ImmutableDenseMatrix([0, 10])])
  })

  it('should create an Index from an Array', function () {
    assert.deepStrictEqual(new Index([0, 10])._dimensions, [new ImmutableDenseMatrix([0, 10])])
  })

  it('should create an Index from a string', function () {
    assert.deepStrictEqual(new Index('property')._dimensions, ['property'])
  })

  it('should create an Index from a ImmutableDenseMatrix', function () {
    assert.deepStrictEqual(new Index(new ImmutableDenseMatrix([0, 10]))._dimensions, [new ImmutableDenseMatrix([0, 10])])
  })

  it('should create an Index from an array with ranges', function () {
    const index = Index.create([new Range(0, 10), new Range(4)])
    assert(index instanceof Index)
    assert.deepStrictEqual(index._dimensions, [new Range(0, 10), new Range(4)])
  })

  it('should create an Index from an array with sets', function () {
    const index = Index.create([new ImmutableDenseMatrix([0, 10]), new ImmutableDenseMatrix([4])])
    assert(index instanceof Index)
    assert.deepStrictEqual(index._dimensions, [new ImmutableDenseMatrix([0, 10]), new ImmutableDenseMatrix([4])])
  })

  it('should calculate the size of an Index', function () {
    assert.deepStrictEqual(new Index(new Range(0, 10)).size(), [10])
    assert.deepStrictEqual(new Index(new Range(0, 10, 2)).size(), [5])
    assert.deepStrictEqual(new Index(new Range(4, 0, -1)).size(), [4])
    assert.deepStrictEqual(new Index(new Range(0, 10), new Range(4, 6)).size(), [10, 2])
    assert.deepStrictEqual(new Index(new Range(0, 10), new Range(4, 6), new Range(3, -1, -1)).size(), [10, 2, 4])
    assert.deepStrictEqual(new Index(new Range(0, 0)).size(), [0])
    assert.deepStrictEqual(new Index(new Range(0, -1)).size(), [0])
    assert.deepStrictEqual(new Index([1, 2, 3]).size(), [3])
    assert.deepStrictEqual(new Index(math.matrix([1, 2, 3])).size(), [3])
    assert.deepStrictEqual(new Index(new ImmutableDenseMatrix([1, 2, 3])).size(), [3])
    assert.deepStrictEqual(new Index('property').size(), [1])
    assert.deepStrictEqual(new Index().size(), [])
  })

  it('should calculate the minimum values of an Index', function () {
    assert.deepStrictEqual(new Index(new Range(2, 10)).min(), [2])
    assert.deepStrictEqual(new Index(new Range(4, 0, -1)).min(), [1])
    assert.deepStrictEqual(new Index(new Range(0, 10), new Range(4, 6)).min(), [0, 4])
    assert.deepStrictEqual(new Index(new Range(0, 10), new Range(4, 6), new Range(3, -1, -1)).min(), [0, 4, 0])
    assert.deepStrictEqual(new Index(2).min(), [2])
    assert.deepStrictEqual(new Index(new Range(0, 10), new ImmutableDenseMatrix([4, 6]), new Range(3, -1, -1)).min(), [0, 4, 0])
    assert.deepStrictEqual(new Index().min(), [])
    assert.deepStrictEqual(new Index('property').min(), ['property'])
  })

  it('should calculate the maximum values of an Index', function () {
    assert.deepStrictEqual(new Index(new Range(2, 10)).max(), [9])
    assert.deepStrictEqual(new Index(new Range(4, 0, -1)).max(), [4])
    assert.deepStrictEqual(new Index(new Range(0, 10), new Range(4, 6)).max(), [9, 5])
    assert.deepStrictEqual(new Index(new Range(0, 10), new Range(4, 6), new Range(3, -1, -1)).max(), [9, 5, 3])
    assert.deepStrictEqual(new Index(2).max(), [2])
    assert.deepStrictEqual(new Index(new Range(0, 10), new ImmutableDenseMatrix([4, 6]), new Range(3, -1, -1)).max(), [9, 6, 3])
    assert.deepStrictEqual(new Index('property').max(), ['property'])
    assert.deepStrictEqual(new Index().max(), [])
  })

  it('should test whether an Index contains a scalar', function () {
    assert.strictEqual(new Index(2, 5, 2).isScalar(), true)
    assert.strictEqual(new Index(2).isScalar(), true)
    assert.strictEqual(new Index([0, 1, 2], 2).isScalar(), false)
    assert.strictEqual(new Index([3], [2]).isScalar(), false)
    assert.strictEqual(new Index([0, 1, 2], [2]).isScalar(), false)
    assert.strictEqual(new Index(new Range(2, 10)).isScalar(), false)
    assert.strictEqual(new Index(new ImmutableDenseMatrix([2, 10])).isScalar(), false)
    assert.strictEqual(new Index(new ImmutableDenseMatrix([2])).isScalar(), false)
    assert.strictEqual(new Index(2, new Range(0, 4), 2).isScalar(), false)
    assert.strictEqual(new Index(2, new ImmutableDenseMatrix([0, 4]), 2).isScalar(), false)
    assert.strictEqual(new Index(new Range(0, 2), new Range(0, 4)).isScalar(), false)
    assert.strictEqual(new Index(new ImmutableDenseMatrix([0, 2]), new ImmutableDenseMatrix([0, 4])).isScalar(), false)
    assert.deepStrictEqual(new Index('property').isScalar(), true)
    assert.strictEqual(new Index().isScalar(), true)
  })

  it('should clone an Index', function () {
    const index1 = new Index([2], new Range(0, 4), new ImmutableDenseMatrix([0, 2]))
    const index2 = index1.clone()

    assert.deepStrictEqual(index1, index2)
    assert.notStrictEqual(index1, index2)
    assert.notStrictEqual(index1._dimensions[0], index2._dimensions[0])
    assert.notStrictEqual(index1._dimensions[1], index2._dimensions[1])
    assert.notStrictEqual(index1._dimensions[2], index2._dimensions[2])
  })

  it('should stringify an index', function () {
    assert.strictEqual(new Index().toString(), '[]')
    assert.strictEqual(new Index(2, 3).toString(), '[2, 3]')
    assert.strictEqual(new Index(2, 3, 1).toString(), '[2, 3, 1]')
    assert.strictEqual(new Index(2, new Range(0, 3)).toString(), '[2, 0:3]')
    assert.strictEqual(new Index(new Range(0, 6, 2)).toString(), '[0:2:6]')
    assert.strictEqual(new Index(new ImmutableDenseMatrix([0, 6, 2])).toString(), '[[0, 6, 2]]')
    assert.deepStrictEqual(new Index('property').toString(), '["property"]')
  })

  it('toJSON', function () {
    assert.deepStrictEqual(new Index(new Range(0, 10), 2, new ImmutableDenseMatrix([1, 2, 3])).toJSON(),
      {
        mathjs: 'Index',
        dimensions: [
          new Range(0, 10, 1),
          2,
          new ImmutableDenseMatrix([1, 2, 3])
        ]
      })
  })

  it('fromJSON', function () {
    const json = {
      dimensions: [
        new Range(0, 10, 1),
        2,
        new ImmutableDenseMatrix([1, 2, 3])
      ]
    }
    const i1 = new Index(new Range(0, 10), 2, new ImmutableDenseMatrix([1, 2, 3]))

    const i2 = Index.fromJSON(json)
    assert.ok(i2 instanceof Index)
    assert.deepStrictEqual(i2, i1)
  })

  it('should get the range for a given dimension', function () {
    const index = new Index(2, new Range(0, 8, 2), new Range(3, -1, -1), new ImmutableDenseMatrix([1, 2, 3]))

    assert(Number.isInteger(index.dimension(0)))
    assert.deepStrictEqual(index.dimension(0), 2)

    assert(index.dimension(1) instanceof Range)
    assert.deepStrictEqual(index.dimension(1), new Range(0, 8, 2))

    assert(index.dimension(2) instanceof Range)
    assert.deepStrictEqual(index.dimension(2), new Range(3, -1, -1))

    assert(index.dimension(3) instanceof ImmutableDenseMatrix)
    assert.deepStrictEqual(index.dimension(3), new ImmutableDenseMatrix([1, 2, 3]))

    assert.strictEqual(index.dimension(4), null)
  })

  it('should iterate over all ranges', function () {
    const index = new Index(2, new Range(0, 8, 2), new Range(3, -1, -1), [1, 2, 3])

    const log = []
    index.forEach(function (d, i, obj) {
      log.push({
        dimension: d,
        index: i
      })
      assert.strictEqual(obj, index)
    })

    assert.deepStrictEqual(log, [
      { dimension: 2, index: 0 },
      { dimension: new Range(0, 8, 2), index: 1 },
      { dimension: new Range(3, -1, -1), index: 2 },
      { dimension: new ImmutableDenseMatrix([1, 2, 3]), index: 3 }
    ])
  })

  it('should have a property isIndex', function () {
    const a = new math.Index([2, 5])
    assert.strictEqual(a.isIndex, true)
  })

  it('should have a property type', function () {
    const a = new math.Index([2, 5])
    assert.strictEqual(a.type, 'Index')
  })

  it('should test whether index contains an object property', function () {
    assert.strictEqual(new math.Index(2, 3).isObjectProperty(), false)
    assert.strictEqual(new math.Index([2, 5]).isObjectProperty(), false)
    assert.strictEqual(new math.Index('foo', 'bar').isObjectProperty(), false)
    assert.strictEqual(new math.Index('foo').isObjectProperty(), true)
  })

  it('should expand an index into an array', function () {
    assert.deepStrictEqual(new Index(new Range(2, 5)).toArray(), [
      [2, 3, 4]
    ])

    assert.deepStrictEqual(new Index(new Range(2, 5), new Range(0, 8, 2), 2, new ImmutableDenseMatrix([1, 2])).toArray(), [
      [2, 3, 4],
      [0, 2, 4, 6],
      2,
      [1, 2]
    ])

    assert.deepStrictEqual(new Index(2, new Range(0, 8, 2), new Range(3, -1, -1), [1, 2]).toArray(), [
      2,
      [0, 2, 4, 6],
      [3, 2, 1, 0],
      [1, 2]
    ])

    assert.deepStrictEqual(new Index('property').toArray(), ['property'])
  })

  it('valueOf should return the expanded array', function () {
    assert.deepStrictEqual(new Index(2, new Range(0, 8, 2), new Range(3, -1, -1), [1, 2], new ImmutableDenseMatrix([3, 4])).valueOf(), [
      2,
      [0, 2, 4, 6],
      [3, 2, 1, 0],
      [1, 2],
      [3, 4]
    ])
  })

  it('should complain when new operator is missing', function () {
    assert.throws(function () { Index([2, 5]) }, /Constructor must be called with the new operator/)
  })

  it('should throw an error on non-integer ranges', function () {
    assert.throws(function () { console.log(new Index([0, 4.5])) })
    assert.throws(function () { console.log(new Index([0.1, 4])) })
    assert.throws(function () { console.log(new Index([4, 2, 0.1])) })
  })

  it('should throw an error on unsupported type of arguments', function () {
    assert.throws(function () { console.log(new Index({})) }, TypeError)
    assert.throws(function () { console.log(new Index(new Date())) }, TypeError)
  })
})
