import { approxDeepEqual } from '../../../../tools/approx.js'
import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const freqz = math.freqz

describe('freqz', function () {
  it('should return the frequency response of a zero-pole-gain model given number as w parameter', function () {
    approxDeepEqual(
      freqz([math.complex(1, 0), math.complex(-1, -5)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)], 5), {
        h: [math.complex(0, -0.4166666666666667),
          math.complex(0.08934733914100848, -0.3891571989056336),
          math.complex(0.19350242447606233, -0.43679084380970035),
          math.complex(0.5068505396172553, -0.5776505671214675),
          math.complex(1.5607298559987381, -0.26338443553329166)
        ],
        w: [0, 0.62831853, 1.25663706, 1.88495559, 2.51327412]
      })
    approxDeepEqual(freqz([math.complex(1, 0), math.complex(-3, 0), math.complex(2, 0)], [math.complex(1, 0), math.complex(3, 0), math.complex(2, 0)], 5), {
      h: [math.complex(0, 0),
        math.complex(-0.09275445814522237, -0.11835248219923325),
        math.complex(-0.4432171093183538, -0.3495195356882487),
        math.complex(-1.3911165095967133, -1.0970298445163509),
        math.complex(-4.102237436136192, -5.234357386651877)
      ],
      w: [0, 0.62831853, 1.25663706, 1.88495559, 2.51327412]
    })
  })

  it('should return the frequency response of a zero-pole-gain model when not given w parameter', function () {
    const { h, w } = freqz([math.complex(1, 0), math.complex(-1, -5)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)])
    approxDeepEqual(h.length, 512)
    approxDeepEqual(w.length, 512)
  })

  it('should return the frequency response of a zero-pole-gain model given b and a as matrix and not given w parameter', function () {
    const b = math.matrix([math.complex(1, 0), math.complex(-1, -5)])
    const a = math.matrix([math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)])
    const { h, w } = freqz(b, a)
    approxDeepEqual(h._size, [512])
    approxDeepEqual(w._size, [512])
  })

  it('should return the frequency response of a zero-pole-gain model given array as w parameter', function () {
    approxDeepEqual(
      freqz([math.complex(1, 0), math.complex(-1, -5)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)], [0, 1, 2]), {
        h: [math.complex(0, -0.4166666666666667),
          math.complex(0.1419346, -0.4055241),
          math.complex(0.62506469, -0.59840473)
        ],
        w: [0, 1, 2]
      })
  })

  it('should return the frequency response of a zero-pole-gain model given matrix as b,a and w parameter', function () {
    approxDeepEqual(
      freqz(math.matrix([math.complex(1, 0), math.complex(-1, -5)]), math.matrix([math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]), math.matrix([0, 1, 2])), {
        h: math.matrix([math.complex(0, -0.4166666666666667),
          math.complex(0.1419346, -0.4055241),
          math.complex(0.62506469, -0.59840473)
        ]),
        w: math.matrix([0, 1, 2])
      })
  })

  it('should return the frequency response of a zero-pole-gain model given matrix as b,a and number as w parameter', function () {
    approxDeepEqual(
      freqz(math.matrix([math.complex(1, 0), math.complex(-1, -5)]), math.matrix([math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)]), 5), {
        h: math.matrix([math.complex(0, -0.4166666666666667),
          math.complex(0.08934733914100848, -0.3891571989056336),
          math.complex(0.19350242447606233, -0.43679084380970035),
          math.complex(0.5068505396172553, -0.5776505671214675),
          math.complex(1.5607298559987381, -0.26338443553329166)
        ]),
        w: math.matrix([0, 0.62831853, 1.25663706, 1.88495559, 2.51327412])
      })
  })

  it('should error with negative number of points', function () {
    assert.throws(function () { freqz([1, 2], [1, 2, 3], -1) }, /w must be a positive number/)
  })

  it('should error with negative number of points when given matrix as b,a and w parameter', function () {
    assert.throws(function () { freqz(math.matrix([1, 2]), math.matrix([1, 2, 3]), -1) }, /w must be a positive number/)
  })
})
