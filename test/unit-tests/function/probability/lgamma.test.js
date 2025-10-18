/* eslint-disable no-loss-of-precision */

import assert from 'assert'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const lgamma = math.lgamma

// https://www.scratchcode.io/how-to-detect-ie-browser-in-javascript/
function isInternetExplorer () {
  return typeof document !== 'undefined'
    ? !!document.documentMode
    : false
}

// IE does have less precision for unclear reason, therefore this hack
const EPSILON = isInternetExplorer() ? 1e-6 : 1e-11
// TODO: lgamma for some cases of complex numbers is not quite as precise as
// lgamma for reals
const CEPSILON = 5e-8

describe('lgamma', function () {
  it('should calculate the lgamma of 0 and negative numbers', function () {
    assert.strictEqual(lgamma(0), Infinity)

    assert.ok(isNaN(lgamma(-0.0005)))
    assert.ok(isNaN(lgamma(-0.5)))
    assert.ok(isNaN(lgamma(-1)))
    assert.ok(isNaN(lgamma(-1.5)))
    assert.ok(isNaN(lgamma(-2)))
    assert.ok(isNaN(lgamma(-2.5)))
    assert.ok(isNaN(lgamma(-100000)))
    assert.ok(isNaN(lgamma(-123456.123456)))
  })

  it('should calculate the lgamma of a positive numbers', function () {
    // computation reference: https://www.wolframalpha.com/input?i=LogGamma%5Bx%5D

    approxEqual(lgamma(/**/ 0.000000001), /*  */ 20.7232658363691954921, EPSILON)
    approxEqual(lgamma(/*   */ 0.000001), /*  */ 13.8155099807494316692, EPSILON)
    approxEqual(lgamma(/*       */ 0.25), /*  */ 1.28802252469807745737, EPSILON)
    approxEqual(lgamma(/*        */ 0.8), /*  */ 0.15205967839983758878, EPSILON)
    approxEqual(lgamma(/*          */ 1), /*                       */ 0, EPSILON)
    approxEqual(lgamma(/*        */ 1.5), /* */ -0.12078223763524522235, EPSILON)
    approxEqual(lgamma(/*          */ 2), /*                       */ 0, EPSILON)
    approxEqual(lgamma(/*        */ 2.5), /*  */ 0.28468287047291915963, EPSILON)
    approxEqual(lgamma(/*       */ 12.5), /*  */ 18.7343475119364457016, EPSILON)
    approxEqual(lgamma(/*      */ 125.5), /*  */ 479.457822363903399136, EPSILON)
    approxEqual(lgamma(/*  */ 5555.5555), /*  */ 42344.1277925098161477, EPSILON)
    approxEqual(lgamma(/*  */ 5000000.5), /*  */ 72124743.2709303972649, EPSILON)
    approxEqual(lgamma(99999999999999.5), /*  */ 3123619130191632.64037, EPSILON)
    approxEqual(lgamma(/*       */ 1e92), /**/ 2.1083782855545220293e94, EPSILON)
  })

  it('should calculate the lgamma of an irrational number', function () {
    approxEqual(lgamma(Math.SQRT2), -0.12038230351896920333, EPSILON)
    approxEqual(lgamma(Math.PI), 0.82769459232343710153, EPSILON)
    approxEqual(lgamma(Math.E), 0.449461741820067667, EPSILON)
  })

  it('should calculate the lgamma of a complex number', function () {
    approxDeepEqual(lgamma(math.complex(0, 0)), math.complex(Infinity), EPSILON)
    approxDeepEqual(
      lgamma(math.complex(0.000000001, 0.000000001)),
      math.complex(20.3766922460892228366, -0.78539816397466397287),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(0.000001, 0.000001)),
      math.complex(13.4689363904686365487, -0.78539874061146827788),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(0.25, 0.25)),
      math.complex(0.90447450949333888977, -0.83887024394321281804),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-0.25, 0.25)),
      math.complex(1.16657203736087492865, -2.61462703865115551016),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(0.8, -0.8)),
      math.complex(-0.41924081113642074879, 0.51623080213929827944),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-0.8, 0.8)),
      math.complex(-0.3775761850502096333, -3.80865021027588766567),
      EPSILON
    )

    approxDeepEqual(
      lgamma(math.complex(1, 1)),
      math.complex(-0.65092319930185633889, -0.30164032046753319789),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(1, -1)),
      math.complex(-0.65092319930185633889, 0.30164032046753319789),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-1, 1)),
      math.complex(-0.99749678958182899359, -4.22863113745477474597),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-1, -1)),
      math.complex(-0.99749678958182899359, 4.22863113745477474597),
      EPSILON
    )

    approxDeepEqual(
      lgamma(math.complex(1.5, 1.5)),
      math.complex(-0.97915093918136435887, 0.38589477126715472436),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(1.5, -1.5)),
      math.complex(-0.97915093918136435887, -0.38589477126715472436),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-1.5, 1.5)),
      math.complex(-2.64748036944365646074, -5.11189237251498344295),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-1.5, -1.5)),
      math.complex(-2.64748036944365646074, 5.11189237251498344295),
      EPSILON
    )

    approxDeepEqual(
      lgamma(math.complex(2, -2)),
      math.complex(-1.07135983021387915393, -1.2367950341038788144),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-2.5, -2.5)),
      math.complex(-6.27685085148648571668, 6.42804393793984167867),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-12.5, 12.5)),
      math.complex(-53.3767553324096369866, -7.23008341760111500158),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(125.5, 125.5)),
      math.complex(424.211719638964718426, 622.623796700622589246),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(5555.5555, -5555.5555)),
      math.complex(39906.0402274967320859, -48635.8593112306908421),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-5000000.5, -5000000.5)),
      math.complex(-8.56385987850343162145e7, -6.20766433819965678363e7),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(99999999999999.5, 99999999999999.5)),
      math.complex(3.07973667287988512101e15, 3.23681630555938897728e15),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-9.87654321e50, 1.23456789e70)),
      math.complex(-1.93925470679092599791e70, 1.98014414903993314695e72),
      EPSILON
    )

    approxDeepEqual(
      lgamma(math.complex(0.000123, 123456789)),
      math.complex(-1.93925479073563285659e8, 2.17671624683482738475e9),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-0.000123, 123456789)),
      math.complex(-1.93925479078146610494e8, 2.17671624683444096885e9),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(123456789, -0.000123)),
      math.complex(2.17671623922326999167e9, -0.00229166241674051621),
      EPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(-123456789, -0.000123)),
      math.complex(-2.17671625601718110732e9, 3.87850942926689860771e8),
      CEPSILON
    )
    approxDeepEqual(
      lgamma(math.complex(123456789.123, 0.123456789)),
      math.complex(2.17671624151493240841e9, 2.30017303624303234065),
      EPSILON
    )
  })

  it('should calculate the lgamma of some special arguments', function () {
    approxEqual(lgamma(true), 0, EPSILON)
    assert.strictEqual(lgamma(false), Infinity)

    assert.ok(isNaN(lgamma(NaN)))
    assert.ok(isNaN(lgamma(-NaN)))

    assert.ok(!Number.isFinite(lgamma(Infinity)))
    assert.ok(!Number.isFinite(lgamma(-Infinity)))
  })

  it('should throw an error if called with a big number', function () {
    assert.throws(() => lgamma(math.bignumber(0)))
  })

  it('should throw an error if called with invalid number of arguments', function () {
    assert.throws(() => lgamma())
    assert.throws(() => lgamma(1, 3))
  })

  it('should throw an error if called with invalid type of argument', function () {
    assert.throws(() => lgamma(new Date()))
    assert.throws(() => lgamma('a string'))
  })

  it('should LaTeX lgamma', function () {
    const expression = math.parse('lgamma(2.5)')
    assert.strictEqual(expression.toTex(), '\\ln\\Gamma\\left(2.5\\right)')
  })
})
