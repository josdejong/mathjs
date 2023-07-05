import approx from '../../../../tools/approx.js'
import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const freqz = math.freqz

describe('freqz', function () {
  it('should return the frequency response of a zero-pole-gain model', function () {
    approx.deepEqual(freqz([math.complex(1, 0), math.complex(-1, -5)], [math.complex(1, 0), math.complex(5, 0), math.complex(6, 0)], 5), {
      h: [math.complex(0, -0.4166666666666667),
        math.complex(0.08934733914100848, -0.3891571989056336),
        math.complex(0.19350242447606233, -0.43679084380970035),
        math.complex(0.5068505396172553, -0.5776505671214675),
        math.complex(1.5607298559987381, -0.26338443553329166)
      ],
      w: [0, 0.62831853, 1.25663706, 1.88495559, 2.51327412]
    })
    approx.deepEqual(freqz([math.complex(1, 0), math.complex(-3, 0), math.complex(2, 0)], [math.complex(1, 0), math.complex(3, 0), math.complex(2, 0)], 5), {
      h: [math.complex(0, 0),
        math.complex(-0.09275445814522237, -0.11835248219923325),
        math.complex(-0.4432171093183538, -0.3495195356882487),
        math.complex(-1.3911165095967133, -1.0970298445163509),
        math.complex(-4.102237436136192, -5.234357386651877)
      ],
      w: [0, 0.62831853, 1.25663706, 1.88495559, 2.51327412]
    })
  })

  it('should error with negative number of points', function () {
    assert.throws(function () { freqz([1, 2], [1, 2, 3], -1) }, /w must be a positive number/)
  }) 
})
