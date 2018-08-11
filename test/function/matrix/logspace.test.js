const assert = require('assert')
const math = require('../../../src/main')
const logspace = math.logspace
const matrix = math.matrix
const complex = math.complex

describe('logspace', function () {
  it('should create a logspace if called with 3 numbers', function () {
		assert.deepEqual(logspace(-1,2,4), matrix([0.1, 1, 10, 100]))
		assert.deepEqual(logspace(2,-1,4), matrix([100, 10, 1, 0.1]))
		assert.deepEqual(logspace(1,4,6), matrix([10,39.810717055349734,158.48931924611142,630.957344480193,2511.88643150958,10000]))
		assert.deepEqual(logspace(-3,3,7), matrix([0.001, 0.01, 0.1, 1, 10, 100, 1000]))
  })

  it('should return a empty array in case of n <= 0', function () {
		assert.equal(logspace(1,5,0),matrix([]))
		assert.equal(logspace(-2,-2,-2),matrix([]))
	})
	
	it('should throw an error when n is not an integer', function () {
    assert.throws(function () { logspace(1,5,2.5) }, /is no number of points/)
		assert.throws(function () { logspace(1,5,complex(0,2)) }, /number of points can't be complex/)
  })

  it('should output an array when setting matrix==="array"', function () {
    const math2 = math.create({
      matrix: 'Array'
    })

    assert.deepEqual(math2.logspace(-1,2,4), [0.1, 1, 10, 100])
    assert.deepEqual(math2.logspace(-3,3,7), matrix([0.001, 0.01, 0.1, 1, 10, 100, 1000]))
  })

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { logspace() }, /TypeError: Too few arguments/)
    assert.throws(function () { logspace(1, 2, 3, 5) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX range', function () {
    const expression = math.parse('logspace(-1,4)')
    assert.equal(expression.toTex(), '\\mathrm{logspace}\\left(-1,4\\right)')
  })
})
