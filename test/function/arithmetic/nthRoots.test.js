// test nthRoots
const assert = require('assert')
const math = require('../../../src/main')
const complex = math.complex
const nthRoots = math.nthRoots

describe('nthRoots', function () {
  it('should return an array of Complex roots', function () {
    const roots = nthRoots(complex('-1'), 6)
    const roots1 = [
      complex({ r: 1, phi: Math.PI / 6 }),
      complex(0, 1),
      complex({ r: 1, phi: (5 * Math.PI) / 6 }),
      complex({ r: 1, phi: (7 * Math.PI) / 6 }),
      complex(0, -1),
      complex({ r: 1, phi: (11 * Math.PI) / 6 })
    ]

    roots.forEach(function (value, index, array) {
      assert.deepEqual(value, roots1[index])
    })
  })

  it('should return the correct answer for Complex values', function () {
    const roots = nthRoots(complex(3, 4), 2)
    const roots1 = [
      { re: 2, im: 1 },
      { re: -2.0000000000000004, im: -0.9999999999999999 }
    ]
    roots.forEach(function (value, index, array) {
      assert.deepEqual(value, roots1[index])
    })
  })

  const twos = [
    complex(2, 0),
    complex(0, 2),
    complex(-2, 0),
    complex(0, -2)
  ]
  it('should return pure roots without artifacts', function () {
    const roots = nthRoots(complex('16'), 4)

    roots.forEach(function (value, index, array) {
      assert.deepEqual(value, twos[index])
    })
  })

  it('should return roots for numeric arguments', function () {
    const roots = nthRoots(16, 4)

    roots.forEach(function (value, index, array) {
      assert.deepEqual(value, twos[index])
    })
  })

  it('should return roots for string arguments', function () {
    const roots = nthRoots('16', 4)

    roots.forEach(function (value, index, array) {
      assert.deepEqual(value, twos[index])
    })
  })

  it('should return zero exactly once', function () {
    const roots2 = nthRoots(0)
    const roots4 = nthRoots(0, 4)
    const roots8 = nthRoots(0, 8)
    assert.deepEqual(roots2, [complex(0)])
    assert.deepEqual(roots4, [complex(0)])
    assert.deepEqual(roots8, [complex(0)])
  })
})
