const assert = require('assert')
const math = require('../../../src/main')
const linspace = math.linspace
const matrix = math.matrix
const complex = math.complex

describe('linspace', function () {
  it('should create a linspace if called with 3 numbers', function () {
		assert.deepEqual(linspace(1,5,5), matrix([1, 2, 3, 4, 5]))
		assert.deepEqual(linspace(-5,-4,5), matrix([-5, -4.75, -4.5, -4.25, -4]))
		assert.deepEqual(linspace(2,-4,5), matrix([2, 0.5, -1, -2.5, -4]))
		assert.deepEqual(linspace(-2,-2,5), matrix([-2, -2, -2, -2, -2]))
  })

  it('should return a empty array in case of n <= 0', function () {
		assert.equal(linspace(1,5,0),matrix([]))
		assert.equal(linspace(-2,-2,-2),matrix([]))
	})
	
	it('should throw an error when n is not an integer', function () {
    assert.throws(function () { linspace(1,5,2.5) }, /is no number of points/)
		assert.throws(function () { linspace(1,5,complex(0,2)) }, /number of points can't be complex/)
  })

  it('should output an array when setting matrix==="array"', function () {
    const math2 = math.create({
      matrix: 'Array'
    })

    assert.deepEqual(math2.linspace(1,5,5), [1, 2, 3, 4, 5])
    assert.deepEqual(math2.linspace(-5,-4,5), [-5, -4.75, -4.5, -4.25, -4])
  })
	
	it('should create a linspace if called with complex number',function() {
		assert.deepEqual(linspace(complex(3,0),complex(0,3),4), matrix([complex(3,0), complex(2,1), complex(1,2), complex(0,3)]))
		assert.deepEqual(linspace(complex(-3,3),complex(-2,0),3), matrix([complex(-3,3), complex(-2.5,1.5), complex(-2,0)]))
	})

  it('should throw an error if called with an invalid number of arguments', function () {
    assert.throws(function () { linspace() }, /TypeError: Too few arguments/)
    assert.throws(function () { linspace(1, 2, 3, 5) }, /TypeError: Too many arguments/)
  })

  it('should LaTeX range', function () {
    const expression = math.parse('linspace(1,10)')
    assert.equal(expression.toTex(), '\\mathrm{linspace}\\left(1,10\\right)')
  })
})
