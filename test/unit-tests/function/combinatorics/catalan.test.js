import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
const catalan = math.catalan

describe('catalan', function () {
  it('should calculate the nth catalan number', function () {
    assert.strictEqual(catalan(3), 5)
    assert.strictEqual(catalan(0), 1)
    assert.strictEqual(catalan(8), 1430)
  })

  it('should calculate exact catalan numbers whenever the result fits a double', function () {
    // exact value from the recurrence C(0)=1, C(i+1) = C(i) * 2 * (2i+1) / (i+2)
    assert.strictEqual(catalan(26), 18367353072152)
    // C(30) is the largest exactly representable Catalan number; the old
    // implementation inherited rounding from the inexact intermediate
    // combinations(60, 30)
    assert.strictEqual(catalan(30), 3814986502092304)
  })

  it('should stay close to the true value beyond the exact number range', function () {
    // C(31) no longer fits in a double exactly; the number path continues the
    // recurrence in plain number arithmetic and is approximately correct.
    // The expected values are given as strings so the exact integers stay
    // visible; Number() rounds them to the nearest double like the result.
    assert.ok(Math.abs(catalan(31) - Number('14544636039226909')) <= 2)
    assert.ok(Math.abs(catalan(32) - Number('55534064877048198')) <= 16)

    // Accuracy check in the 200-300 digit range: the number path is compared
    // against the exact bigint value of the same recurrence. The measured
    // relative error stays within a few ulps there (see the review
    // discussion); 1e-14 leaves an order of magnitude of headroom.
    const exactCatalan = function (n) {
      let c = 1n
      for (let i = 0n; i < BigInt(n); i++) {
        c = c * 2n * (2n * i + 1n) / (i + 2n)
      }
      return c
    }
    // C(332) has 196, C(400) 237, C(450) 267 and C(500) 297 digits
    for (const n of [332, 400, 450, 500]) {
      const exact = exactCatalan(n)
      const relativeError = Math.abs(catalan(n) / Number(exact) - 1)
      assert.ok(relativeError < 1e-14,
        'relative error ' + relativeError.toExponential(3) + ' at n=' + n)
    }
  })

  it('should calculate the nth catalan number with BigNumbers', function () {
    assert.deepStrictEqual(catalan(math.bignumber(7)), math.bignumber(429))
    assert.deepStrictEqual(catalan(math.bignumber(13)), math.bignumber(742900))
    assert.deepStrictEqual(catalan(math.bignumber(31)), math.bignumber('14544636039226909'))
  })

  it('should calculate the nth catalan number with bigints', function () {
    assert.strictEqual(catalan(0n), 1n)
    assert.strictEqual(catalan(8n), 1430n)
    assert.strictEqual(catalan(30n), 3814986502092304n)
    assert.strictEqual(catalan(31n), 14544636039226909n)
    assert.strictEqual(catalan(33n), 212336130412243110n)
  })

  it('should match published Catalan numbers in the 100-200 digit range', function () {
    // Independent check of the exact bigint path against an external
    // authority: OEIS A000108, https://oeis.org/A000108 (b-file
    // https://oeis.org/A000108/b000108.txt). C(200) has 117, C(250) 147
    // and C(300) 177 digits.
    const oeisA000108 = {
      200: '512201493211017079467541693136328292324432464582475861864920694407578768023144072628540276213813397768975366156750120',
      250: '465116795969233796497747947259667807407291160080922096111953326525143875193659257831340309862635877995262413955019878805418475969029457769094808256',
      300: '448863594671741755862042783981742625904431712455792292112842929523169934910317996551330498997589600726489482164006103817421596314821101633539230654646302151568026806610883615856'
    }
    for (const n of [200, 250, 300]) {
      assert.strictEqual(catalan(BigInt(n)).toString(), oeisA000108[n])
    }
  })

  it('should not work with non-integer and negative input', function () {
    assert.throws(function () { catalan(0.5) }, TypeError)
    assert.throws(function () { catalan(-1) }, TypeError)
    assert.throws(function () { catalan(math.bignumber(-3)) }, TypeError)
    assert.throws(function () { catalan(math.bignumber(3.5)) }, TypeError)
  })

  it('should throw an error in case of non-integer input', function () {
    assert.throws(function () { catalan(5.2) }, /Non-negative integer value expected/)
  })

  it('should throw an error in case of negative input', function () {
    assert.throws(function () { catalan(-2) }, /Non-negative integer value expected/)
  })

  it('should throw an error in case of wrong number or type of arguments', function () {
    assert.throws(function () { catalan(5, 3, 2) })
    assert.throws(function () { catalan(true, 'hello world') })
  })

  it('should LaTeX catalan', function () {
    const expression = math.parse('catalan(3)')
    assert.strictEqual(expression.toTex(), '\\mathrm{C}_{3}')
  })
})
