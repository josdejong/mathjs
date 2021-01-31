import assert from 'assert'
import math from '../../../../../src/defaultInstance.js'
import { lastDimToZeroBase } from '../../../../../src/expression/transform/utils/lastDimToZeroBase.js'

describe('lastDimToZeroBase', function () {
  it('should not alter args with length !== 2', function () {
    let args = []
    assert.deepStrictEqual(lastDimToZeroBase(args), args)

    args = [[1, 2]]
    assert.deepStrictEqual(lastDimToZeroBase(args), args)

    args = [1, 2, 3]
    assert.deepStrictEqual(lastDimToZeroBase(args), args)
  })

  it('should only alter args, if first argument is a collection', function () {
    let args = [1, 2]
    assert.deepStrictEqual(lastDimToZeroBase(args), args)

    args = [[1, 2], 2]
    assert.notDeepStrictEqual(lastDimToZeroBase(args), args)

    args = [math.matrix([1, 2]), 2]
    assert.notDeepStrictEqual(lastDimToZeroBase(args), args)
  })

  it('should not alter args, if second argument is not number or big number', function () {
    const args = [[1, 2], false]
    assert.deepStrictEqual(lastDimToZeroBase(args), args)
  })

  it('should work for numbers', function () {
    const args = [[1, 2], 1]
    const expected = [[1, 2], 0]
    assert.deepStrictEqual(lastDimToZeroBase(args), expected)
  })

  it('should work for big numbers', function () {
    const args = [[1, 2], math.bignumber(1)]
    const expected = [[1, 2], math.bignumber(0)]
    assert.deepStrictEqual(lastDimToZeroBase(args), expected)
  })

  it('should not mutate input', function () {
    const args = [[3, 2], 1]
    const initialArgs = args.slice()
    lastDimToZeroBase(args)
    assert.deepStrictEqual(args, initialArgs)
  })
})
