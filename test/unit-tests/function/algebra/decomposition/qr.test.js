// test lup
import assert from 'assert'

import { approxEqual, approxDeepEqual } from '../../../../../tools/approx.js'
import math from '../../../../../src/defaultInstance.js'

/**
 * Tests whether `Q` and `R` are the valid QR decomposition of `A`.
 *
 * Given a real matrix `A`, `Q` and `R` should be the solutions to the equation
 * `A = Q*R` where Q is [orthoganal](https://en.wikipedia.org/wiki/Orthogonal_matrix) and
 * R is [upper triangular](https://en.wikipedia.org/wiki/Triangular_matrix).
 *
 * If `A` is a complex matrix then `Q` should be a [unitary](https://en.wikipedia.org/wiki/Unitary_matrix)
 *
 * Syntax:
 *
 *    math.isValidQRDecomposition(A);
 *
 * Example:
 *
 *    const m = [
 *      [1, -1,  4],
 *      [1,  4, -2],
 *      [1,  4,  2],
 *      [1,  -1, 0]
 *    ]
 *    const  result = math.qr(m)
 *    // r = {
 *    //   Q: [
 *    //     [0.5, -0.5,   0.5],
 *    //     [0.5,  0.5,  -0.5],
 *    //     [0.5,  0.5,   0.5],
 *    //     [0.5, -0.5,  -0.5],
 *    //   ],
 *    //   R: [
 *    //     [2, 3,  2],
 *    //     [0, 5, -2],
 *    //     [0, 0,  4],
 *    //     [0, 0,  0]
 *    //   ]
 *    // }
 *
 *    isValidQRDecomposition(m, r.Q, r.R)
 *      // true
 *
 *    r.Q[2][1] = 9
 *
 *    isValidQRDecomposition(m, r.Q, r.R)
 *      // false
 *
 *
 * @param {Matrix | Array} A    A two dimensional matrix or array from which the QR decomposition was formed.
 * @param {Matrix | Array} Q    A two dimensional matrix or array equal to `Q` is an QR decomposition.
 * @param {Matrix | Array} R    A two dimensional matrix or array equal to `R` is an QR decomposition.
 *
 * @return {Boolean} Returns true if `Q` and `R` form a valid QR decomposition of `A`
 */
function assertValidQRDecomposition (A, Q, R) {
  const Asize = math.size(A).valueOf()

  const rows = Asize[0]
  const cols = Asize[1]

  // sizes match
  assert.deepStrictEqual(math.size(Q).valueOf(), [rows, rows])
  assert.deepStrictEqual(math.size(R).valueOf(), [rows, cols])

  // A = Q * R
  approxDeepEqual(math.multiply(Q, R).valueOf(), A.valueOf())

  // Q has unitary (orthonormal for real A) columns
  // use math.equal as approx.deepEqual cannot handle complex vs real number comparision
  assert(math.equal(math.multiply(math.conj(math.transpose(Q)), Q).valueOf(), math.identity([Asize[0], Asize[0]]).valueOf()),
    'Matrix Q is not unitary/orthonormal')

  // R is upper triangular
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < i && j < cols; j++) {
      assert(math.isZero(math.subset(R, math.index(i, j))), 'R is not an upper triangular matrix')
    }
  }

  // All elements on leading diagonal of R are positive
  for (let i = 0; i < Math.min(rows, cols); i++) {
    const diagonalElement = math.subset(R, math.index(i, i))

    assert(!math.isNegative(math.re(diagonalElement)),
      'R has elements on the leading diagonal with a negative real part (R[' + i + '][' + i + '] = ' + diagonalElement + ')')
  }

  const raw = math.qr._denseQRimpl(Array.isArray(A) ? math.matrix(A) : A)

  for (let i = 0; i < raw.R._data.length; ++i) {
    for (let j = 0; j < i && j < (raw.R._data[0] || []).length; ++j) {
      approxEqual(raw.R._data[i][j], 0, 1e-10)
    }
  }
}

describe('qr', function () {
  it('should decompose matrix, n x n, no permutations, array', function () {
    const m = [[15, 42], [20, 81]]

    const r = math.qr(m)
    // L
    approxDeepEqual(r.Q.valueOf(), [[0.6, -0.8], [0.8, 0.6]])
    // U
    approxDeepEqual(r.R.valueOf(), [[25, 90], [0, 15]])
    // verify
    assertValidQRDecomposition(m, r.Q, r.R)

    const m2 = [
      [7.507, 9.868, 5.057],
      [4.482, 2.536, 9.744],
      [6.527, 1.094, 3.321]
    ]

    const r2 = math.qr(m2)

    assertValidQRDecomposition(m2, r2.Q, r2.R)
  })

  it('should throw a helpfull error for sparse matricies', function () {
    const m = math.matrix([[15, 42], [20, 81]], 'sparse')

    assert.throws(math.qr.bind(null, m))
  })

  it('should decompose matrix, n x n, dense format', function () {
    const m = math.matrix([[15, 42], [20, 81]], 'dense')

    const r = math.qr(m)
    // Q
    approxDeepEqual(r.Q.valueOf(), [[0.6, -0.8], [0.8, 0.6]])
    // R
    approxDeepEqual(r.R.valueOf(), [[25, 90], [0, 15]])
    // verify
    assertValidQRDecomposition(m, r.Q, r.R)
  })

  it('should decompose matrix, n x n, with a column of zeros dense format', function () {
    const m = math.matrix([[5, 0, 15], [223, 0, 34.5], [1, 0, 19]], 'dense')

    const r = math.qr(m)
    // Q
    approxDeepEqual(
      r.Q.valueOf(),
      [
        [0.02241566559605479, 0.9997386855840484, -0.004483133119210979],
        [0.9997386855840484, -0.02243532343507404, -0.004383698101188009],
        [0.004483133119210979, 0.004383698101188009, 0.9999803421609812]
      ])

    // R
    approxDeepEqual(
      r.R.valueOf(),
      [
        [223.0582883463423, -0, 34.912399165855504],
        [0, -0, 14.305351889173245],
        [0, 0, 18.781141919779493]
      ])
    // verify
    assertValidQRDecomposition(m, r.Q, r.R)
  })

  it('should decompose matrix, m x n, m < n, dense format', function () {
    const m = math.matrix(
      [
        [15, 42, -11, 9],
        [20, 81, 52, 112]
      ],
      'dense'
    )

    const r = math.qr(m)
    // Q
    approxDeepEqual(
      r.Q,
      math.matrix(
        [
          [0.6, -0.8],
          [0.8, 0.6]
        ]
      ))
    // R
    approxDeepEqual(
      r.R,
      math.matrix(
        [
          [25, 90, 35, 95],
          [0, 15, 40, 60]
        ]
      ))
    // verify
    assertValidQRDecomposition(m, r.Q, r.R)

    const m2 = math.matrix([
      [7.865, 9.293, 0.534, 7.023, 9.526, 6.005, 5.007, 5.581],
      [3.842, 7.807, 8.208, 2.108, 3.947, 1.154, 6.086, 6.21],
      [3.003, 4.084, 5.593, 4.738, 9.48, 0.927, 7.294, 5.225]
    ])

    const r2 = math.qr(m2)

    assertValidQRDecomposition(m2, r2.Q, r2.R)
  })

  it('should decompose matrix, m x n, m > n, dense format', function () {
    const m = math.matrix(
      [
        [8, 4],
        [2, -12],
        [9, -2],
        [1, 94]
      ],
      'dense'
    )

    const r = math.qr(m)
    // Q
    assert.deepStrictEqual(
      r.Q,
      math.matrix(
        [
          [0.6531972647421809, -0.0050729188524001045, -0.7248169493126636, -0.21897029208715485],
          [0.16329931618554522, -0.13865978196560358, -0.14374377465457616, 0.9661493287513265],
          [0.7348469228349535, -0.07440280983520192, 0.6732450861047025, -0.034717084043718795],
          [0.08164965809277261, 0.9875282032672256, 0.026817368868139818, 0.13191743558805435]
        ]
      ))
    // R
    assert.deepStrictEqual(
      r.R,
      math.matrix(
        [
          [12.24744871391589, 6.858571279792898],
          [0, 94.62008243496727],
          [0, 0],
          [0, 0]
        ]
      ))
    // verify
    assertValidQRDecomposition(m, r.Q, r.R)
  })

  it('should decompose matrix, 3 x 3, zero pivote value, dense format', function () {
    const m = math.matrix(
      [
        [1, 2, 3],
        [2, 4, 6],
        [4, 8, 9]
      ])

    const r = math.qr(m)

    // Q
    approxDeepEqual(
      r.Q.valueOf(),
      [[0.21821789023599236, 0.9759000729485332, 1.1102230246251565e-16],
        [0.4364357804719848, -0.09759000729485323, 0.8944271909999157],
        [0.8728715609439696, -0.19518001458970657, -0.447213595499958]
      ])

    // R
    approxDeepEqual(
      r.R.valueOf(),
      [
        [4.582575694955841, 9.165151389911681, 11.129112402035613],
        [0, 1.9860273225978185e-15, 0.5855400437691207],
        [0, 0, 1.3416407864998738]
      ]
    )

    // verify
    assertValidQRDecomposition(m, r.Q, r.R)
  })

  it('should decompose matrix, n x n, dense format', function () {
    const m = math.matrix(
      [
        [math.complex(24, 3), math.complex(10)],
        [math.complex(12, 53), math.complex(1.46, 10.6)],
        [math.complex(0.345345, 234), math.complex(1)]
      ])

    const r = math.qr(m)

    // Q
    assert.deepStrictEqual(
      r.Q,
      math.evaluate(`[
        [0.09940285751055641 + 0.012425357188819552i, 0.6771044400000075 + 0.0032268934486674216i, 0.7225638487314755 + 0.09687792016125076i],
        [0.049701428755278255 + 0.2195146436691456i, 0.07692808877592644 + 0.6944571280351147i, 0.00524374167953522 - 0.6790632951693036i],
        [0.0014303449927909801 + 0.969177860727926i, 0.009498908256891047 - 0.23073860039312136i, -0.03522342137225792 + 0.07823687113774894i]
      ]`))

    // R
    assert.deepStrictEqual(
      r.R,
      math.matrix([
        [math.complex(241.44175128417413, 0), math.complex(3.3948782289740067, -0.8870876675671249)],
        [math.complex(0, 0), math.complex(14.254103875042043, -4.440892098500626e-16)],
        [math.complex(0, 0), math.complex(0, 0)]
      ]))

    // verify
    assertValidQRDecomposition(m, r.Q, r.R)
  })

  it('should decompose matrix, m x n, n > m, complex numbers, dense format', function () {
    const m = math.evaluate(`[
      [-0.3264527816002377 + 2.493709974375747i, 27.144413452851555 - 95.38310595714056i, 24.851291758133694 - 31.358002980198492i, 17.60452153083572 - 58.02180107190187i, 29.062500250928192 - 57.24316264710557i, 5.699170296748263 - 65.11241969628546i, 19.819861372592023 + 25.900390198129045i, 16.557353232092076 - 37.25486567332457i],
      [8.548264534732331 - 47.59913064936665i, 14.40138539657334 - 90.80495969865513i, 29.343082104326758 - 15.039062252958018i, 27.20916452240602 + 25.774841219390325i, 19.38506691927698 - 95.11167912062224i, 29.17634152715012 - 95.07970712229994i, 2.1987345350210092 - 9.041770826482406i, 2.806832236244097 + 2.0385477771778966i], [24.20532702537307 + 12.879358968749457i, 25.839682426729887 - 18.102222530229938i, 29.093489513094948 - 9.581972254775465i, 12.65038940459419 - 55.38946414968438i, -0.7049513892161683 - 23.70085292748422i, 7.910814607291806 + 24.701861346839564i, 2.4219941297871004 + 28.36329723916822i, 16.535587534250833 - 38.86239252709116i],
      [25.78464278752434 - 59.91370905634549i, 29.424608924558413 - 19.120899022196383i, 25.6548685301034 + 6.075863297676378i, 3.693006642780766 - 63.363384338945906i, 15.716418860938354 - 73.40923022486281i, 28.9161836809681 - 58.38357844908446i, 10.13807260697836 - 3.5085542186585883i, 16.925761654754282 - 37.905623267161424i]
    ]`)

    const r = math.qr(m)

    // Q
    assert.deepStrictEqual(
      r.Q,
      math.evaluate(`[
        [-0.0038074725834465403 + 0.029084550335153184i, 0.22686378024210954 - 0.8031909609489004i, -0.1539944364016218 - 0.08044026151398012i, 0.15914274660150135 - 0.4970365797781979i],
        [0.09969981781897692 - 0.5551565039665838i, 0.03656768230049788 - 0.4048572821234369i, 0.03460099750064215 + 0.4176688417721519i, 0.06529314053052465 + 0.5802645116992661i],
        [0.2823107175583003 + 0.1502140858641239i, 0.04201869101132175 - 0.25276582362981437i, 0.7610890159088707 - 0.3999596125636107i, -0.24146613640405268 + 0.18587678263056984i],
        [0.3007305375258921 - 0.6987834610763923i, 0.02974780206453512 + 0.2676367453654318i, 0.23430030839452232 - 0.007054866167671124i, -0.024719751847322398 - 0.5414711325141984i]
      ]`))

    // R
    assert.deepStrictEqual(
      r.R,
      math.matrix([
        [
          math.complex(85.74002161421444, -1.7763568394002505e-15),
          math.complex(75.75511004703746, 4.3347264490288016),
          math.complex(20.511425451943854, 26.86626726613313),
          math.complex(27.288058950461433, -16.62801026736354),
          math.complex(105.22335436327181, -17.027323945468076),
          math.complex(109.21486260617472, 15.233872631050161),
          math.complex(16.361518290342467, 13.316745322711627),
          math.complex(28.409955756511188, -11.605326516313891)
        ],
        [
          math.complex(0, 0),
          math.complex(121.47784233162547, 1.7763568394002505e-15),
          math.complex(44.01977059734889, 24.441930600590624),
          math.complex(38.83986358402923, 10.93198966397847),
          math.complex(78.56760829656308, 7.162388196994509),
          math.complex(72.474482997425, -8.297010771192621),
          math.complex(-20.270457048330027, 21.34082444731987),
          math.complex(33.83280850600839, 2.9469680307519037)
        ],
        [
          math.complex(0, 0),
          math.complex(0, 0),
          math.complex(25.372653909655675, 5.329070518200751e-15),
          math.complex(46.75701662904174, -52.038112884483404),
          math.complex(-25.7821433027293, -35.64391269354021),
          math.complex(-31.014234782164266, 3.4985227007956983),
          math.complex(-15.936684410229294, 18.179762871924087),
          math.complex(33.75717971935531, -25.758933854786893)
        ],
        [
          math.complex(0, 0),
          math.complex(0, 0),
          math.complex(0, 0),
          math.complex(69.24128415239949, 0),
          math.complex(14.27806840079945, 4.055317531798819),
          math.complex(13.583401274164364, -21.002114936285405),
          math.complex(-8.485891575536547, 10.384078077176659),
          math.complex(31.408176714183693, 17.21736552045245)
        ]
      ]))

    // verify
    assertValidQRDecomposition(m, r.Q, r.R)
  })

  it('Prevent regression: #1669', function () {
    const m = math.evaluate(`[
      [0, 1],
      [1, 0]
    ]`)

    const r = math.qr(m)

    // Q
    assert.deepStrictEqual(
      r.Q,
      math.evaluate(`[
        [-0, 1],
        [1, 0]
      ]`))

    // R
    assert.deepStrictEqual(
      r.R,
      math.evaluate(`[
        [1, -0],
        [0, 1]
      ]`)
    )

    assertValidQRDecomposition(m, r.Q, r.R)
  })

  it('Prevent regression for complex matricies: #1669', function () {
    const m = math.evaluate(`[
      [0, 1],
      [i, 0]
    ]`)

    const r = math.qr(m)

    // Q
    approxDeepEqual(
      r.Q,
      math.evaluate(`complex([
        [0, 1],
        [i, 0]
      ])`)
    )

    // R
    assert.deepStrictEqual(
      r.R,
      math.evaluate(`complex([
        [1, -0],
        [0, 1]
      ])`)
    )

    assertValidQRDecomposition(m, r.Q, r.R)
  })
})
