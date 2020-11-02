import assert from 'assert'
import {
  modMultiplicativeInverseNumber
} from '../../../../src/plain/number/arithmetic'

describe('arithmetic', function () {
  describe('modMultiplicativeInverseNumber', function () {
    it('should throw an error if divisor non-positive integer', function () {
      assert.throws(function () { modMultiplicativeInverseNumber(1, -1) })
      assert.throws(function () { modMultiplicativeInverseNumber(1, 0) })
    })
    it('should return NaN if the inverse does not exist', function () {
      assert.strictEqual(modMultiplicativeInverseNumber(2, 102), NaN)
      assert.strictEqual(modMultiplicativeInverseNumber(2, 6), NaN)
    })
    it('should return the inverse if exists', function () {
      assert.strictEqual(modMultiplicativeInverseNumber(3, 7), 5)
      assert.strictEqual(modMultiplicativeInverseNumber(10, 103), 31)
    })
  })
})
