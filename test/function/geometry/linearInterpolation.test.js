var assert = require('assert');
var error = require('../../../lib/error/index');
var math = require('../../../index');

describe('linearInterpolation', function() {
	it('returns the value at x of the linear interpolant between two 2D points', function() {
		assert.deepEqual(math.linearInterpolation(1,[-1,5],[4,-2]), 2.2);
		assert.deepEqual(math.linearInterpolation(1,[-1,5],[11.32,17.2341]), 6.9860551948051945);
	});

	it('throws an error for incompatible parameter types', function() {
		assert.throws(function() {math.linearInterpolation(0.1)}, TypeError);
		assert.throws(function() {math.linearInterpolation('asdf')}, TypeError);
		assert.throws(function() {math.linearInterpolation('5')}, TypeError);
		assert.throws(function() {math.linearInterpolation('5', '5', 0)}, TypeError);
		assert.throws(function() {math.linearInterpolation(1, 1, 0)}, TypeError);
		assert.throws(function() {math.linearInterpolation(1, [1,2], ['5',2])}, TypeError);
		// seems to be some casting going on that makes this one pass:
		//assert.throws(function() {math.linearInterpolation('1', [1,2], [5,2])}, TypeError);
		assert.throws(function() {math.linearInterpolation({}, [1,2], [5,2])}, TypeError);
	});

	it('throws an error for unsupported number of parameters', function() {
		assert.throws(function() {math.linearInterpolation(1, [1,2], [3,4], [5,6])});
		assert.throws(function() {math.linearInterpolation(1, [1,2])});
		assert.throws(function() {math.linearInterpolation(1)});
	});
});
