// test index construction
import assert from 'assert'

import math from '../../../../../src/defaultInstance.js'
const Range = math.Range

describe('index', function () {
  it('should create an index', function () {
    const index = math.index(new Range(2, 6))
    assert.ok(index instanceof math.Index)
    assert.deepStrictEqual(index._dimensions.length, 1)
    assert.deepStrictEqual(index._dimensions[0], new Range(2, 6, 1))

    const index2 = math.index(new Range(0, 4), new Range(5, 2, -1))
    assert.ok(index2 instanceof math.Index)
    assert.deepStrictEqual(index2._dimensions.length, 2)
    assert.deepStrictEqual(index2._dimensions[0], new Range(0, 4, 1))
    assert.deepStrictEqual(index2._dimensions[1], new Range(5, 2, -1))
  })

  it('should create an index from bignumbers (downgrades to numbers)', function () {
    const index = math.index(new Range(math.bignumber(2), math.bignumber(6)), math.bignumber(3))
    assert.ok(index instanceof math.Index)
    assert.deepStrictEqual(index._dimensions, [new Range(2, 6, 1), 3])
  })

  it('should create an index from bigints (downgrades to numbers)', function () {
    const index = math.index(new Range(2n, 6n), 3n)
    assert.ok(index instanceof math.Index)
    assert.deepStrictEqual(index._dimensions, [new Range(2, 6, 1), 3])
  })

  it('should LaTeX index', function () {
    const expr1 = math.parse('index(1)')
    const expr2 = math.parse('index(1,2)')
    const expr3 = math.parse('index(1,2,3)')

    assert.strictEqual(expr1.toTex(), '\\mathrm{index}\\left(1\\right)')
    assert.strictEqual(expr2.toTex(), '\\mathrm{index}\\left(1,2\\right)')
    assert.strictEqual(expr3.toTex(), '\\mathrm{index}\\left(1,2,3\\right)')
  })
})
