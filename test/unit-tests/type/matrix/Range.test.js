// test data type Range

import assert from 'assert'

import math from '../../../../src/defaultInstance.js'
const Range = math.Range

describe('range', function () {
  describe('create', function () {
    it('should create a range', function () {
      const r = new Range(2, 6)
      assert.deepStrictEqual(r.toArray(), [2, 3, 4, 5])
      assert.deepStrictEqual(r.size(), [4])
    })

    it('should create a range with custom step', function () {
      const r = new Range(10, 4, -1)
      assert.deepStrictEqual(r.toArray(), [10, 9, 8, 7, 6, 5])
      assert.deepStrictEqual(r.size(), [6])
    })

    it('should create a range with floating points', function () {
      const r = new Range(1, 5.5, 1.5)
      assert.deepStrictEqual(r.toArray(), [1, 2.5, 4])
      assert.deepStrictEqual(r.size(), [3])
    })

    it('should create an empty range', function () {
      const r = new Range()
      assert.deepStrictEqual(r.toArray(), [])
    })

    it('should create a range with only one value', function () {
      const r = new Range(0, 1)
      assert.deepStrictEqual(r.toArray(), [0])
      assert.deepStrictEqual(r.size(), [1])
    })

    it('should create an empty range because of wrong step size', function () {
      const r = new Range(0, 10, -1)
      assert.deepStrictEqual(r.toArray(), [])
      assert.deepStrictEqual(r.size(), [0])
    })

    it('should create ranges from attributes', function () {
      const frac = math.fraction
      assert.deepStrictEqual(new Range({}).toArray(), [])

      assert.deepStrictEqual(new Range({ start: 3 }).toArray(), [])
      assert.deepStrictEqual(new Range({ end: 3 }).toArray(), [0, 1, 2])
      assert.deepStrictEqual(new Range({ step: 3 }).toArray(), [])
      assert.deepStrictEqual(new Range({ last: 3 }).toArray(), [0, 1, 2, 3])
      assert.deepStrictEqual(new Range({ length: 3 }).toArray(), [0, 1, 2])

      assert.deepStrictEqual(
        new Range({ start: 3, end: 7 }).toArray(), [3, 4, 5, 6])
      assert.deepStrictEqual(
        new Range({ start: 3, step: 3 }).toArray(), [])
      assert.deepStrictEqual(
        new Range({ start: 3, last: 7 }).toArray(), [3, 4, 5, 6, 7])
      assert.deepStrictEqual(
        new Range({ start: 3, length: 3 }).toArray(), [3, 4, 5])
      assert.deepStrictEqual(
        new Range({ end: 7, step: 3 }).toArray(), [0, 3, 6])
      assert.deepStrictEqual(
        new Range({ end: 7, last: 6 }).toArray(), [0, 1, 2, 3, 4, 5, 6])
      assert.deepStrictEqual( // last takes precedence:
        new Range({ end: 7, last: 3 }).toArray(), [0, 1, 2, 3])
      assert.deepStrictEqual(
        new Range({ end: 7, length: 3 }).toArray(), [4, 5, 6])
      assert.deepStrictEqual(
        new Range({ step: 3, last: 7 }).toArray(), [0, 3, 6])
      assert.deepStrictEqual(
        new Range({ step: 3, length: 3 }).toArray(), [0, 3, 6])
      assert.deepStrictEqual(
        new Range({ length: 3, last: 7 }).toArray(), [5, 6, 7])

      assert.deepStrictEqual(
        new Range({ step: 3, last: 7, length: 3 }).toArray(), [1, 4, 7])
      assert.deepStrictEqual(
        new Range({ end: 3, last: 7, length: 3 }).toArray(), [5, 6, 7])
      assert.deepStrictEqual(
        new Range({ step: 3, end: 12, length: 3 }).toArray(), [3, 6, 9])
      assert.deepStrictEqual(
        new Range({ step: 3, end: 3, last: 10 }).toArray(), [0, 3, 6, 9])
      assert.deepStrictEqual(
        new Range({ start: 7, last: 3, length: 3 }).toArray(), [7, 5, 3])
      assert.deepStrictEqual(
        new Range({ step: 7, start: 6, length: 3 }).toArray(), [6, 13, 20])
      assert.deepStrictEqual(
        new Range({ step: 7, start: 3, last: 12 }).toArray(), [3, 10])
      assert.deepStrictEqual(
        new Range({ start: frac(3), end: frac(7), length: 3 }).toArray(),
        [frac(3), frac(13, 3), frac(17, 3)])
      assert.deepStrictEqual(
        new Range({ start: 3, end: 3, last: 4 }).toArray(), [3, 4])
      assert.deepStrictEqual(
        new Range({ start: 3, step: 2, end: 7 }).toArray(), [3, 5])

      assert.deepStrictEqual(
        new Range({ end: -3, step: -1, last: 3, length: 4 }).toArray(),
        [6, 5, 4, 3])
      assert.deepStrictEqual( // last overridden when start, step, length given
        new Range({ start: 5, step: -1, last: 3, length: 4 }).toArray(),
        [5, 4, 3, 2])
      assert.deepStrictEqual(
        new Range({ start: 5, end: 3, last: 3.5, length: 4 }).toArray(),
        [5, 4.5, 4, 3.5])
      assert.deepStrictEqual( // end overridden similarly
        new Range({ start: 5, end: 3, step: 2, length: 3 }).toArray(),
        [5, 7, 9])
      assert.deepStrictEqual(
        new Range({ start: 5, end: 3, step: 3, last: 10 }).toArray(),
        [5, 8])

      assert.deepStrictEqual(
        new Range({ start: 2, end: 20, step: -0.25, last: 10, length: 3 })
          .toArray(),
        [2, 1.75, 1.5])
    })

    it('can make 2D ranges', function () {
      const rng2d = new Range({ start: [1, 3], step: [1, -1], length: 3 })
      assert.deepStrictEqual(rng2d.toArray(), [[1, 3], [2, 2], [3, 1]])
      assert.strictEqual(rng2d.toString(), '[1, 3]:[1, -1]:[4, 0]')
      assert.deepStrictEqual(
        new Range({ start: [1, 3, 5], last: [0, 0, 0], length: 3 }).toArray(),
        [[1, 3, 5], [0.5, 1.5, 2.5], [0, 0, 0]])
      const numberGrid = new Range(new Range(1, 11), new Range(101, 111), 10)
      assert.strictEqual(numberGrid.get([4, 5]), 46)
      assert.deepStrictEqual(numberGrid.last, new Range(91, 101))
      assert.strictEqual(numberGrid.toString(), '(1:11):10:(101:111)')
    })

    it('should throw an error when created without new keyword', function () {
      assert.throws(function () { Range(0, 10) }, /Constructor must be called with the new operator/)
    })

    it('should throw an error for wrong type of arguments', function () {
      assert.throws(function () { console.log(new Range('str', 10, 1)) }, /Cannot convert/)
      assert.throws(function () { console.log(new Range(0, 'str', 1)) }, /Cannot convert/)
      assert.throws(function () { console.log(new Range(0, 10, 'str')) }, /Cannot convert/)
    })

    it('should deal carefully with step size zero', function () {
      let empty = new Range(0, 0, 0)
      assert.strictEqual(empty.length, 0)
      empty = new Range(10, 10, 0)
      assert.strictEqual(empty.length, 0)
      assert.throws(function () {
        console.log(new Range(0, 10, math.bignumber(0)))
      }, /No scalar/)
      assert.throws(function () {
        console.log(new Range(0, 10, math.bigint(0)))
      }, /No scalar/)
    })
  })

  describe('parse', function () {
    it('should create a range from a string [deprecated]', function () {
      Range.parseMethodMustWarn = false // suppress deprecation warning

      let r = Range.parse('10:-1:4')
      assert.deepStrictEqual(r.toArray(), [10, 9, 8, 7, 6, 5])
      assert.deepStrictEqual(r.size(), [6])

      r = Range.parse('2 : 6')
      assert.deepStrictEqual(r.toArray(), [2, 3, 4, 5])
      assert.deepStrictEqual(r.size(), [4])
    })

    it('should return null when parsing an invalid string [deprecated]', function () {
      assert.strictEqual(Range.parse('a:4'), null)
      assert.strictEqual(Range.parse('3'), null)
      assert.strictEqual(Range.parse(''), null)
      assert.strictEqual(Range.parse(2), null)
    })
  })

  describe('size', function () {
    it('should calculate the size of a range', function () {
      assert.deepStrictEqual(new Range(0, 0).size(), [0])
      assert.deepStrictEqual(new Range(0, 0, -1).size(), [0])
      assert.deepStrictEqual(new Range(0, 4).size(), [4])
      assert.deepStrictEqual(new Range(2, 4).size(), [2])
      assert.deepStrictEqual(new Range(0, 8, 2).size(), [4])
      assert.deepStrictEqual(new Range(0, 8.1, 2).size(), [5])
      assert.deepStrictEqual(new Range(0, 7.9, 2).size(), [4])
      assert.deepStrictEqual(new Range(0, 7, 2).size(), [4])

      assert.deepStrictEqual(new Range(3, -1, -1).size(), [4])
      assert.deepStrictEqual(new Range(3, -1.1, -1).size(), [5])
      assert.deepStrictEqual(new Range(3, -0.9, -1).size(), [4])
      assert.deepStrictEqual(new Range(3, -1, -2).size(), [2])
      assert.deepStrictEqual(new Range(3, -0.9, -2).size(), [2])
      assert.deepStrictEqual(new Range(3, -1.1, -2).size(), [3])
      assert.deepStrictEqual(new Range(3, 0.1, -2).size(), [2])
    })
  })

  describe('min', function () {
    it('should calculate the minimum value of a range', function () {
      assert.strictEqual(new Range(0, 0).min(), undefined)
      assert.strictEqual(new Range(0, 0, -1).min(), undefined)

      assert.strictEqual(new Range(0, 4).min(), 0)
      assert.strictEqual(new Range(2, 4).min(), 2)
      assert.strictEqual(new Range(0, 8, 2).min(), 0)
      assert.strictEqual(new Range(0, 8.1, 2).min(), 0)
      assert.strictEqual(new Range(0, 7.9, 2).min(), 0)
      assert.strictEqual(new Range(0, 7, 2).min(), 0)

      assert.strictEqual(new Range(3, -1, -1).min(), 0)
      assert.strictEqual(new Range(3, -1.1, -1).min(), -1)
      assert.strictEqual(new Range(3, -0.9, -1).min(), 0)
      assert.strictEqual(new Range(3, -1, -2).min(), 1)
      assert.strictEqual(new Range(3, -0.9, -2).min(), 1)
      assert.strictEqual(new Range(3, -1.1, -2).min(), -1)
      assert.strictEqual(new Range(3, 0.1, -2).min(), 1)
    })
  })

  describe('max', function () {
    it('should calculate the maximum value of a range', function () {
      assert.strictEqual(new Range(0, 0).max(), undefined)
      assert.strictEqual(new Range(0, 0, -1).max(), undefined)

      assert.strictEqual(new Range(2, 4).max(), 3)
      assert.strictEqual(new Range(0, 8, 2).max(), 6)
      assert.strictEqual(new Range(0, 8.1, 2).max(), 8)
      assert.strictEqual(new Range(0, 7.9, 2).max(), 6)
      assert.strictEqual(new Range(0, 7, 2).max(), 6)

      assert.strictEqual(new Range(3, -1, -1).max(), 3)
      assert.strictEqual(new Range(3, -1.1, -1).max(), 3)
      assert.strictEqual(new Range(3, -0.9, -1).max(), 3)
      assert.strictEqual(new Range(3, -1, -2).max(), 3)
      assert.strictEqual(new Range(3, -0.9, -2).max(), 3)
      assert.strictEqual(new Range(3, -1.1, -2).max(), 3)
      assert.strictEqual(new Range(3, 0.1, -2).max(), 3)
    })
  })

  describe('toString', function () {
    it('should stringify a range to format from:by:to', function () {
      assert.strictEqual(new math.Range(0, 10).toString(), '0:10')
      assert.strictEqual(new math.Range(0, 10, 2).toString(), '0:2:10')
    })

    it(
      'should stringify a range to format start:step:end with given precision',
      function () {
        assert.strictEqual(
          new math.Range(1 / 3, 4 / 3, 2 / 3).format(3), '0.333:0.667:1.67')
        assert.strictEqual(
          new math.Range(1 / 3, 4 / 3, 2 / 3).format(4), '0.3333:0.6667:1.667')
        assert.strictEqual(
          new math.Range(1 / 3, 4 / 3, 2 / 3).format(14),
          '0.33333333333333:0.66666666666667:1.6666666666667'
        )
      })
  })

  describe('immutable', function () {
    it('should not allow property changes', function () {
      const r1 = new Range(0, 10, 2)
      assert.throws(() => { r1.start = 2 }, TypeError)
      assert.throws(() => { r1.length = 3 }, TypeError)
    })
  })

  describe('clone', function () {
    it('should clone a Range', function () {
      const r1 = new Range(0, 10, 2)
      const r2 = r1.clone()

      assert.deepStrictEqual(r1, r2)
      assert.notStrictEqual(r1, r2)
    })
  })

  describe('type', function () {
    it('should have a property isRange', function () {
      const a = new math.Range(0, 10)
      assert.strictEqual(a.isRange, true)
    })

    it('should have a property type', function () {
      const a = new math.Range(0, 10)
      assert.strictEqual(a.type, 'Range')
    })
  })

  describe('map', function () {
    it('should perform a transformation on all values in the range', function () {
      const r = new Range(2, 6)
      assert.deepStrictEqual(r.map(function (value, index, range) {
        assert.strictEqual(range, r)
        return 'range[' + index[0] + ']=' + value
      }), math.matrix([
        'range[0]=2',
        'range[1]=3',
        'range[2]=4',
        'range[3]=5'
      ]))
    })
  })

  describe('forEach', function () {
    it('should perform a given callback on all values in the range', function () {
      const r = new Range(2, 6)
      const log = []
      r.forEach(function (value, index, range) {
        assert.strictEqual(range, r)
        log.push('range[' + index[0] + ']=' + value)
      })

      assert.deepStrictEqual(log, [
        'range[0]=2',
        'range[1]=3',
        'range[2]=4',
        'range[3]=5'
      ])
    })
  })

  describe('format', function () {
    it('should format a range as string', function () {
      assert.strictEqual(new Range(0, 4).format(), '0:4')
      assert.strictEqual(new Range(0, 4, 2).format(), '0:2:4')

      assert.strictEqual(
        new Range(0.01, 0.09, 0.02).format(2), '0.01:0.02:0.09')

      assert.strictEqual(new Range(0.01, 0.09, 0.02).format({
        notation: 'exponential',
        precision: 1
      }), '1e-2:2e-2:9e-2')
    })
  })

  describe('toArray', function () {
    it('should expand a Range into an Array', function () {
      assert.deepStrictEqual(new Range(0, 4).toArray(), [0, 1, 2, 3])
      assert.deepStrictEqual(new Range(4, 0, -1).toArray(), [4, 3, 2, 1])
    })
  })

  describe('valueOf', function () {
    it('valueOf should return the Range expanded as Array', function () {
      assert.deepStrictEqual(new Range(0, 4).valueOf(), [0, 1, 2, 3])
      assert.deepStrictEqual(new Range(4, 0, -1).valueOf(), [4, 3, 2, 1])
    })
  })

  it('toJSON', function () {
    assert.deepStrictEqual(
      new Range(2, 4).toJSON(),
      { mathjs: 'Range', start: 2, step: 1, length: 2 })
    assert.deepStrictEqual(
      new Range(0, 10, 2).toJSON(),
      { mathjs: 'Range', start: 0, step: 2, length: 5 })
  })

  it('fromJSON', function () {
    const r1 = Range.fromJSON({ start: 2, end: 4 })
    assert.ok(r1 instanceof Range)
    assert.strictEqual(r1.start, 2)
    assert.strictEqual(r1.end, 4)
    assert.strictEqual(r1.step, 1)

    const r2 = Range.fromJSON({ start: 0, end: 10, step: 2 })
    assert.ok(r2 instanceof Range)
    assert.strictEqual(r2.start, 0)
    assert.strictEqual(r2.end, 10)
    assert.strictEqual(r2.step, 2)
  })
})
