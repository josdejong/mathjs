/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const gammaln = math.gammaln

describe('gammaln', function () {
  it('should calculate the gammaln of 0', function () {
    assert.strictEqual(gammaln(0), Infinity)
  })

  it('should calculate the gammaln of a negative integer', function () {
    assert.strictEqual(gammaln(-1), NaN)
    assert.strictEqual(gammaln(-2), NaN)
    assert.strictEqual(gammaln(-100000), NaN)
    assert.ok(isNaN(gammaln(-NaN)))
  })

  it('should calculate the gammaln of a positive number', function () {
    approx.equal(gammaln(0.000000001), 20.723265836369195492082857, 1e-10)
    approx.equal(gammaln(0.000001), 13.815509980749431669207827, 1e-10)
    approx.equal(gammaln(0.25), 1.2880225246980774573706104, 1e-10)
    approx.equal(gammaln(0.8), 0.1520596783998375887782926, 1e-10)
    approx.equal(gammaln(1), 0, 1e-10)
    approx.equal(gammaln(1.5), -0.12078223763524522234551845, 1e-10)
    approx.equal(gammaln(2), 0, 1e-10)
    approx.equal(gammaln(2.5), 0.28468287047291915963249467, 1e-10)
    approx.equal(gammaln(12.5), 18.734347511936445701634125, 1e-10)
    approx.equal(gammaln(125.5), 479.45782236390339913576384, 1e-10)
    approx.equal(gammaln(5555.5555), 42344.127792509816147711716, 1e-10)
    approx.equal(gammaln(5000000.5), 72124743.270930397264882949, 1e-10)
    approx.equal(gammaln(99999999999999.5), 3123619130191632.6403724193, 1e-10)
    approx.equal(gammaln(1e+92), 2.1083782855545220292965521E+94, 1e-10)
  })

  it('should calculate the gammaln of an irrational number', function () {
    approx.equal(gammaln(Math.SQRT2), -0.12038230351896920333038516, 1e-10)
    approx.equal(gammaln(Math.PI), 0.82769459232343710152957856, 1e-10)
    approx.equal(gammaln(Math.E), 0.44946174182006766700250782, 1e-10)
  })

  it('should calculate the gammaln of a boolean', function () {
    assert.strictEqual(gammaln(true), 0)
    assert.strictEqual(gammaln(false), Infinity)
  })

  it('should calculate the gammaln of each element in a matrix', function () {
    approx.deepEqual(
      gammaln(math.matrix([0, 1, 2, 3, 4, 5])),
      math.matrix([Infinity, 0, 0, 0.69314718055994530941723212, 1.7917594692280550008124774, 3.1780538303479456196469416])
    )
  })

  it('should calculate the gammaln of each element in an array', function () {
    approx.deepEqual(
      gammaln([0, 1, 2, 3, 4, 5]),
      [Infinity, 0, 0, 0.69314718055994530941723212, 1.7917594692280550008124774, 3.1780538303479456196469416]
    )
  })

  it('should throw en error if called with invalid number of arguments', function () {
    assert.throws(function () { gammaln() })
    assert.throws(function () { gammaln(1, 3) })
  })

  it('should throw en error if called with invalid type of argument', function () {
    assert.throws(function () { gammaln(new Date()) })
    assert.throws(function () { gammaln('a string') })
  })

  it('should LaTeX gammaln', function () {
    const expression = math.parse('gammaln(2.5)')
    assert.strictEqual(expression.toTex(), '\\Gammaln\\left(2.5\\right)')
  })
})
