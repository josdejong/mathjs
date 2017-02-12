var assert = require('assert');
var math = require('../../../index');
var j = math.j;
describe('j', function () {

	describe('Quaternion', function () {
		it('should find the j component of a quaternion', function () {
			assert.equal(j(math.quaternion()),0);
      assert.equal(j(math.quaternion(1,2,3,4)),3);
      assert.equal(j(math.quaternion(-1,-2,-3,-4)),-3);

      assert.equal(j(math.quaternion(1.0,0,0)),0);
      assert.equal(j(math.quaternion(0,1,0,0)),0);
      assert.equal(j(math.quaternion(0,0,1,0)),1);
      assert.equal(j(math.quaternion(0,0,0,1)),0);

      assert.equal(j(math.quaternion(-1,0,0,0)),0);
      assert.equal(j(math.quaternion(0,-1,0,0)),0);
      assert.equal(j(math.quaternion(0,0,-1,0)),-1);
      assert.equal(j(math.quaternion(0,0,0,-1)),0);
		});

    it('should find the j component for each element of a matrix', function () {
      assert.deepEqual(j([math.quaternion(1,2,4,3), math.quaternion(4,-3,-2,-1)]), [4,-2]);
    });

	});

  describe('other types', function () {
    it('should find j component of Complex number', function () {
      assert.equal(j(new math.complex(1,2)),0);
    });

    it('should find j component of number', function () {
      assert.equal(j(4),0);
    });

    it('should find j component of big number', function () {
      assert.deepEqual(j(math.bignumber(3)),math.bignumber(0));
    });

    it('should fine the j component of booleans', function () {
      assert.equal(j(true), 0);
      assert.equal(j(false), 0);
    })

    it('should find j component of null', function () {
      assert.equal(j(null), 0);
    });

    it('should throw exception when passed unsuported argument type', function () {
      assert.throws(function () {j(new Date())}, /TypeError: Unexpected type of argument/);
      assert.throws(function () {j(math.unit('5cm'))}, /TypeError: Unexpected type of argument/);
    });

    it('should throw exception whe passed wrong number of arguments', function () {
      assert.throws(function () {j(1,2)}, /TypeError: Too many arguments/);
      assert.throws(function () {j()}, /TypeError: Too few arguments/);
    });
  });
})