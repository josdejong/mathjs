import assert from 'assert'
import BigNumber from 'decimal.js'
import { convertNumberToBigNumber } from '../../../../src/utils/bignumber/convertNumberToBigNumber.js'

describe('convertNumberToBigNumber', function () {
  it('should convert numbers to BigNumbers when it is safe to do', function () {
    assert.deepStrictEqual(convertNumberToBigNumber(2.4, BigNumber), new BigNumber('2.4'))
    assert.deepStrictEqual(convertNumberToBigNumber(2, BigNumber), new BigNumber('2'))
    assert.deepStrictEqual(convertNumberToBigNumber(-4, BigNumber), new BigNumber('-4'))
    assert.deepStrictEqual(convertNumberToBigNumber(0.1234567, BigNumber), new BigNumber('0.1234567'))
    assert.deepStrictEqual(convertNumberToBigNumber(0.12345678901234, BigNumber), new BigNumber('0.12345678901234'))
    assert.deepStrictEqual(convertNumberToBigNumber(0.00000000000004, BigNumber), new BigNumber('0.00000000000004'))
    assert.deepStrictEqual(convertNumberToBigNumber(1.2e-24, BigNumber), new BigNumber('1.2e-24'))
  })

  it('should convert numbers with round-off errors to BigNumbers when it is safe to do', function () {
    // a round-off error above the actual value
    assert.deepStrictEqual(convertNumberToBigNumber(0.1 + 0.2, BigNumber).toString(), '0.3') // 0.30000000000000004
    assert.deepStrictEqual(convertNumberToBigNumber(0.1 + 0.24545, BigNumber).toString(), '0.34545') // 0.34545000000000003

    // a round-off error below the actual value
    assert.deepStrictEqual(convertNumberToBigNumber(40 - 38.6, BigNumber).toString(), '1.4') // 1.3999999999999986
    assert.deepStrictEqual(convertNumberToBigNumber(159.119 - 159, BigNumber).toString(), '0.119') // 0.11899999999999977
    assert.deepStrictEqual(convertNumberToBigNumber(159.11934444 - 159, BigNumber).toString(), '0.11934444') // 0.11934443999999189
  })

  it('should throw an error when converting an number to BigNumber when it is NOT safe to do', function () {
    const errorRegex = /Cannot implicitly convert a number with >15 significant digits to BigNumber/

    assert.throws(() => convertNumberToBigNumber(Math.PI, BigNumber), errorRegex)
    assert.throws(() => convertNumberToBigNumber(1 / 3, BigNumber), errorRegex)
    assert.throws(() => convertNumberToBigNumber(1 / 7, BigNumber), errorRegex)
    assert.throws(() => convertNumberToBigNumber(0.1234567890123456, BigNumber), errorRegex)
  })
})
