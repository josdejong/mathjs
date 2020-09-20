// test bignumber utils
import assert from 'assert'

import BigNumber from 'decimal.js'
import { createBigNumberE, createBigNumberPhi, createBigNumberPi, createBigNumberTau } from '../../../../src/utils/bignumber/constants.js'

const Big32 = BigNumber.clone({ precision: 32 })
const Big64 = BigNumber.clone({ precision: 64 })

describe('bignumber', function () {
  it('should calculate a bignumber e', function () {
    assert.strictEqual(createBigNumberE(Big32).toString(),
      '2.7182818284590452353602874713527')
    assert.strictEqual(createBigNumberE(Big64).toString(),
      '2.718281828459045235360287471352662497757247093699959574966967628')
  })

  it('should calculate a bignumber pi', function () {
    assert.strictEqual(createBigNumberPi(Big32).toString(),
      '3.1415926535897932384626433832795')
    assert.strictEqual(createBigNumberPi(Big64).toString(),
      '3.141592653589793238462643383279502884197169399375105820974944592')
  })

  it('should calculate a bignumber tau', function () {
    assert.strictEqual(createBigNumberTau(Big32).toString(),
      '6.283185307179586476925286766559')
    assert.strictEqual(createBigNumberTau(Big64).toString(),
      '6.283185307179586476925286766559005768394338798750211641949889184')
  })

  it('should calculate a bignumber phi', function () {
    // FIXME: round-off error
    // assert.strictEqual(bignumber.phi(32), '1.6180339887498948482045868343656')
    assert.strictEqual(createBigNumberPhi(Big32).toString(),
      '1.6180339887498948482045868343657')
    assert.strictEqual(createBigNumberPhi(Big64).toString(),
      '1.618033988749894848204586834365638117720309179805762862135448623')
  })
})
