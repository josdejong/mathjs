/* eslint-disable no-loss-of-precision */

// computation ref: https://keisan.casio.com/exec/system/1180573442

import assert from 'assert'
import approx from '../../../../tools/approx.js'
import math from '../../../../src/defaultInstance.js'
const lgamma = math.lgamma

describe('lgamma', () => {
  it('should calculate the lgamma of 0', () => {
    assert.strictEqual(lgamma(0), Infinity)
  })

  it('should calculate the lgamma of a negative integer', () => {
    assert.ok(isNaN(lgamma(-1)))
    assert.ok(isNaN(lgamma(-2)))
    assert.ok(isNaN(lgamma(-100000)))
    assert.ok(isNaN(lgamma(-NaN)))
  })

  it('should calculate the lgamma of a positive number', () => {
    approx.equal(lgamma(/**/ 0.000000001), /*   */ 20.723265836369195492082857, 1e-10)
    approx.equal(lgamma(/*   */ 0.000001), /*   */ 13.815509980749431669207827, 1e-10)
    approx.equal(lgamma(/*       */ 0.25), /*   */ 1.2880225246980774573706104, 1e-10)
    approx.equal(lgamma(/*        */ 0.8), /*   */ 0.1520596783998375887782926, 1e-10)
    approx.equal(lgamma(/*          */ 1), /*                             */ 0, 1e-10)
    approx.equal(lgamma(/*        */ 1.5), /* */ -0.12078223763524522234551845, 1e-10)
    approx.equal(lgamma(/*          */ 2), /*                             */ 0, 1e-10)
    approx.equal(lgamma(/*        */ 2.5), /*  */ 0.28468287047291915963249467, 1e-10)
    approx.equal(lgamma(/*       */ 12.5), /*   */ 18.734347511936445701634125, 1e-10)
    approx.equal(lgamma(/*      */ 125.5), /*   */ 479.45782236390339913576384, 1e-10)
    approx.equal(lgamma(/*  */ 5555.5555), /*   */ 42344.127792509816147711716, 1e-10)
    approx.equal(lgamma(/*  */ 5000000.5), /*   */ 72124743.270930397264882949, 1e-10)
    approx.equal(lgamma(99999999999999.5), /*   */ 3123619130191632.6403724193, 1e-10)
    approx.equal(lgamma(/*       */ 1e92), /**/ 2.1083782855545220292965521e94, 1e-10)
  })

  it('should calculate the lgamma of an irrational number', () => {
    approx.equal(lgamma(Math.SQRT2), -0.12038230351896920333038516, 1e-10)
    approx.equal(lgamma(Math.PI), 0.82769459232343710152957856, 1e-10)
    approx.equal(lgamma(Math.E), 0.44946174182006766700250782, 1e-10)
  })

  it('should calculate the lgamma of a complex number', function () {
    approx.deepEqual(lgamma(math.complex(0, 0)), math.complex(Infinity))
    approx.deepEqual(
      lgamma(math.complex(0.000000001, 0.000000001)),
      math.complex(20.37669224608922283655, -0.7853981639746639728723)
    )
    approx.deepEqual(
      lgamma(math.complex(0.000001, 0.000001)),
      math.complex(13.46893639046863654867, -0.785398740611468277883)
    )
    approx.deepEqual(lgamma(math.complex(0.25, 0.25)), math.complex(0.9044745094933388897705, -0.83887024394321281804))
    approx.deepEqual(lgamma(math.complex(-0.25, 0.25)), math.complex(1.166572037360874928654, -2.614627038651155510161))
    approx.deepEqual(lgamma(math.complex(0.8, -0.8)), math.complex(-0.4192408111364207487877, 0.516230802139298279437))
    approx.deepEqual(lgamma(math.complex(-0.8, 0.8)), math.complex(-0.3775761850502096333074, -3.808650210275887665669))

    approx.deepEqual(lgamma(math.complex(1, 1)), math.complex(-0.6509231993018563388852, -0.301640320467533197888))
    approx.deepEqual(lgamma(math.complex(1, -1)), math.complex(-0.6509231993018563388852, 0.301640320467533197888))
    approx.deepEqual(lgamma(math.complex(-1, 1)), math.complex(-0.9974967895818289935938, -4.228631137454774745966))
    approx.deepEqual(lgamma(math.complex(-1, -1)), math.complex(-0.9974967895818289935938, 4.228631137454774745966))

    approx.deepEqual(lgamma(math.complex(1.5, 1.5)), math.complex(-0.979150939181364358873, 0.3858947712671547243602))
    approx.deepEqual(lgamma(math.complex(1.5, -1.5)), math.complex(-0.979150939181364358873, -0.3858947712671547243602))
    approx.deepEqual(lgamma(math.complex(-1.5, 1.5)), math.complex(-2.647480369443656460743, -5.11189237251498344295))
    approx.deepEqual(lgamma(math.complex(-1.5, -1.5)), math.complex(-2.647480369443656460743, 5.11189237251498344295))

    approx.deepEqual(lgamma(math.complex(2, -2)), math.complex(-1.07135983021387915393, -1.236795034103878814401))
    approx.deepEqual(lgamma(math.complex(-2.5, -2.5)), math.complex(-6.276850851486485716676, 6.428043937939841678668))
    approx.deepEqual(lgamma(math.complex(-12.5, 12.5)), math.complex(-53.37675533240963698656, -13.5132687247807014785))
    approx.deepEqual(lgamma(math.complex(125.5, 125.5)), math.complex(424.2117196389647184265, 622.6237967006225892456))
    approx.deepEqual(
      lgamma(math.complex(5555.5555, -5555.5555)),
      math.complex(39906.0402274967320859, -48635.85931123069084207)
    )
    approx.deepEqual(
      lgamma(math.complex(-5000000.5, -5000000.5)),
      math.complex(-85638598.7850343162145, -62076637.09881126065676)
    )
    approx.deepEqual(
      lgamma(math.complex(99999999999999.5, 99999999999999.5)),
      math.complex(3079736672879885.121007, 3236816305559388.977277)
    )

    approx.deepEqual(
      lgamma(math.complex(123456789.123, 0.123456789)),
      math.complex(2176716241.514932408408, 2.300173036243032340655)
    )
  })

  it('should calculate the lgamma of a boolean', () => {
    approx.equal(lgamma(true), 0, 1e-10)
    assert.strictEqual(lgamma(false), Infinity)
  })

  it('should calculate the lgamma of each element in a matrix', () => {
    approx.deepEqual(
      lgamma(math.matrix([0, 1, 2, 3, 4, 5])),
      math.matrix([
        Infinity,
        0,
        0,
        0.69314718055994530941723212,
        1.7917594692280550008124774,
        3.1780538303479456196469416
      ])
    )
  })

  it('should calculate the lgamma of each element in an array', () => {
    approx.deepEqual(lgamma([0, 1, 2, 3, 4, 5]), [
      Infinity,
      0,
      0,
      0.69314718055994530941723212,
      1.7917594692280550008124774,
      3.1780538303479456196469416
    ])
  })

  it('should throw en error if called with invalid number of arguments', () => {
    assert.throws(() => lgamma())
    assert.throws(() => lgamma(1, 3))
  })

  it('should throw en error if called with invalid type of argument', () => {
    assert.throws(() => lgamma(new Date()))
    assert.throws(() => lgamma('a string'))
  })

  it('should LaTeX lgamma', () => {
    const expression = math.parse('lgamma(2.5)')
    assert.strictEqual(expression.toTex(), '\\ln\\Gamma\\left(2.5\\right)')
  })
})
