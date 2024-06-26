// test lup
import assert from 'assert'

import { approxDeepEqual } from '../../../../../tools/approx.js'
import math from '../../../../../src/defaultInstance.js'

describe('lup', function () {
  it('should decompose matrix, n x n, no permutations, array', function () {
    const m = [[2, 1], [1, 4]]

    const r = math.lup(m)
    // L
    assert.deepStrictEqual(r.L.valueOf(), [[1, 0], [0.5, 1]])
    // U
    assert.deepStrictEqual(r.U.valueOf(), [[2, 1], [0, 3.5]])
    // P
    assert.deepStrictEqual(r.p, [0, 1])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, n x n, no permutations, sparse', function () {
    const m = math.matrix([[2, 1], [1, 4]], 'sparse')

    const r = math.lup(m)
    // L
    assert.deepStrictEqual(r.L.valueOf(), [[1, 0], [0.5, 1]])
    // U
    assert.deepStrictEqual(r.U.valueOf(), [[2, 1], [0, 3.5]])
    // P
    assert.deepStrictEqual(r.p, [0, 1])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, n x n, no permutations, dense format', function () {
    const m = math.matrix([[2, 1], [1, 4]], 'dense')

    const r = math.lup(m)
    // L
    assert.deepStrictEqual(r.L.valueOf(), [[1, 0], [0.5, 1]])
    // U
    assert.deepStrictEqual(r.U.valueOf(), [[2, 1], [0, 3.5]])
    // P
    assert.deepStrictEqual(r.p, [0, 1])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, m x n, m < n, no permutations, dense format', function () {
    const m = math.matrix(
      [
        [2, 1, 1],
        [1, 4, 5]
      ]
    )

    const r = math.lup(m)
    // L
    assert.deepStrictEqual(
      r.L,
      math.matrix(
        [
          [1, 0],
          [0.5, 1]
        ]
      ))
    // U
    assert.deepStrictEqual(
      r.U,
      math.matrix(
        [
          [2, 1, 1],
          [0, 3.5, 4.5]
        ]
      ))
    // P
    assert.deepStrictEqual(r.p, [0, 1])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, m x n, m > n, no permutations, dense format', function () {
    const m = math.matrix(
      [
        [8, 2],
        [6, 4],
        [4, 1]
      ]
    )

    const r = math.lup(m)
    // L
    assert.deepStrictEqual(
      r.L,
      math.matrix(
        [
          [1, 0],
          [0.75, 1],
          [0.5, 0]
        ]
      ))
    // U
    assert.deepStrictEqual(
      r.U,
      math.matrix(
        [
          [8, 2],
          [0, 2.5]
        ]
      ))
    // P
    assert.deepStrictEqual(r.p, [0, 1, 2])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, n x n, dense format', function () {
    const m = math.matrix(
      [
        [16, -120, 240, -140],
        [-120, 1200, -2700, 1680],
        [240, -2700, 6480, -4200],
        [-140, 1680, -4200, 2800]
      ]
    )

    const r = math.lup(m)
    // L
    approxDeepEqual(
      r.L.valueOf(),
      [
        [1, 0, 0, 0],
        [-0.5, 1, 0, 0],
        [-0.5833333333333334, -0.7, 1, 0],
        [0.06666666666666667, -0.4, -0.5714285714285776, 1]
      ])
    // U
    approxDeepEqual(
      r.U.valueOf(),
      [
        [240, -2700, 6480, -4200],
        [0, -150, 540, -420],
        [0, 0, -42, 56],
        [0, 0, 0, 4]
      ])
    // P
    assert.deepStrictEqual(r.p, [3, 1, 0, 2])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 3 x 3, zero pivote value, dense format', function () {
    const m = math.matrix(
      [
        [1, 2, 3],
        [2, 4, 6],
        [4, 8, 9]
      ])

    const r = math.lup(m)
    // L
    approxDeepEqual(
      r.L.valueOf(),
      [
        [1, 0, 0],
        [0.5, 1, 0],
        [0.25, 0, 1.0]
      ])
    // U
    approxDeepEqual(
      r.U.valueOf(),
      [
        [4, 8, 9],
        [0, 0, 1.5],
        [0, 0, 0.75]
      ])
    // P
    assert.deepStrictEqual(r.p, [2, 1, 0])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 3 x 2, complex numbers, dense format', function () {
    const m = math.matrix(
      [
        [math.complex(0, 3), 10],
        [math.complex(0, 1), 1],
        [math.complex(0, 1), 1]
      ])

    const r = math.lup(m)
    // L
    approxDeepEqual(
      r.L.valueOf(),
      [
        [1, 0],
        [math.complex(0.3333333, 0), 1],
        [math.complex(0.3333333, 0), 1]
      ])
    // U
    approxDeepEqual(
      r.U.valueOf(),
      [
        [math.complex(0, 3), 10],
        [0, math.complex(-2.3333333333, 0)]
      ])
    // P
    assert.deepStrictEqual(r.p, [0, 1, 2])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, m x n, m < n, no permutations, sparse', function () {
    const m = math.matrix(
      [
        [2, 1, 1],
        [1, 4, 5]
      ],
      'sparse')

    const r = math.lup(m)
    // L
    assert.deepStrictEqual(
      r.L.valueOf(),
      [
        [1, 0],
        [0.5, 1]
      ])
    // U
    assert.deepStrictEqual(
      r.U.valueOf(),
      [
        [2, 1, 1],
        [0, 3.5, 4.5]
      ])
    // P
    assert.deepStrictEqual(r.p, [0, 1])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, m x n, m > n, no permutations, sparse', function () {
    const m = math.matrix(
      [
        [8, 2],
        [6, 4],
        [4, 1]
      ],
      'sparse')

    const r = math.lup(m)
    // L
    assert.deepStrictEqual(
      r.L.valueOf(),
      [
        [1, 0],
        [0.75, 1],
        [0.5, 0]
      ])
    // U
    assert.deepStrictEqual(
      r.U.valueOf(),
      [
        [8, 2],
        [0, 2.5]
      ])
    // P
    assert.deepStrictEqual(r.p, [0, 1, 2])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, n x n, sparse', function () {
    const m = math.matrix(
      [
        [16, -120, 240, -140],
        [-120, 1200, -2700, 1680],
        [240, -2700, 6480, -4200],
        [-140, 1680, -4200, 2800]
      ],
      'sparse')

    const r = math.lup(m)
    // L
    approxDeepEqual(
      r.L.valueOf(),
      [
        [1, 0, 0, 0],
        [-0.5, 1, 0, 0],
        [-0.5833333333333334, -0.7, 1, 0],
        [0.06666666666666667, -0.4, -0.5714285714285776, 1]
      ])
    // U
    approxDeepEqual(
      r.U.valueOf(),
      [
        [240, -2700, 6480, -4200],
        [0, -150, 540, -420],
        [0, 0, -42, 56],
        [0, 0, 0, 4]
      ])
    // P
    assert.deepStrictEqual(r.p, [3, 1, 0, 2])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 3 x 3, zero pivote value, sparse', function () {
    const m = math.matrix(
      [
        [1, 2, 3],
        [2, 4, 6],
        [4, 8, 9]
      ],
      'sparse')

    const r = math.lup(m)
    // L
    approxDeepEqual(
      r.L.valueOf(),
      [
        [1, 0, 0],
        [0.5, 1, 0],
        [0.25, 0, 1.0]
      ])
    // U
    approxDeepEqual(
      r.U.valueOf(),
      [
        [4, 8, 9],
        [0, 0, 1.5],
        [0, 0, 0.75]
      ])
    // P
    assert.deepStrictEqual(r.p, [2, 1, 0])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 3 x 2, complex numbers, sparse', function () {
    const m = math.matrix(
      [
        [math.complex(0, 3), 10],
        [math.complex(0, 1), 1],
        [math.complex(0, 1), 1]
      ], 'sparse')

    const r = math.lup(m)
    // L
    approxDeepEqual(
      r.L.valueOf(),
      [
        [1, 0],
        [math.complex(0.3333333, 0), 1],
        [math.complex(0.3333333, 0), 1]
      ])
    // U
    approxDeepEqual(
      r.U.valueOf(),
      [
        [math.complex(0, 3), 10],
        [0, math.complex(-2.3333333333, 0)]
      ])
    // P
    assert.deepStrictEqual(r.p, [0, 1, 2])
    // verify
    approxDeepEqual(math.multiply(_p(r.p), m).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  /**
   * Creates a Matrix out of a row permutation vector
   */
  function _p (p) {
    // identity matrix
    const identity = math.identity(p.length)
    // array
    const data = []
    // loop rows
    for (let i = 0, l = p.length; i < l; i++) {
      // swap row
      data[p[i]] = identity._data[i]
    }
    return data
  }
})
