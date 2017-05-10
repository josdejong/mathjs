var assert = require('assert');
var math = require('../../../index');
var k = math.k;
describe('k', function () {

	describe('Quaternion', function () {
		it('should find the k component of a quaternion', function () {
			assert.equal(k(math.quaternion()),0);
      assert.equal(k(math.quaternion(1,2,3,4)),4);
      assert.equal(k(math.quaternion(-1,-2,-3,-4)),-4);

      assert.equal(k(math.quaternion(1.0,0,0)),0);
      assert.equal(k(math.quaternion(0,1,0,0)),0);
      assert.equal(k(math.quaternion(0,0,1,0)),0);
      assert.equal(k(math.quaternion(0,0,0,1)),1);

      assert.equal(k(math.quaternion(-1,0,0,0)),0);
      assert.equal(k(math.quaternion(0,-1,0,0)),0);
      assert.equal(k(math.quaternion(0,0,-1,0)),0);
      assert.equal(k(math.quaternion(0,0,0,-1)),-1);
		});

    it('should find the k component for each element of a matrix', function () {
      assert.deepEqual(k([math.quaternion(1,2,4,3), math.quaternion(4,-3,-2,-1)]), [3,-1]);
    });

	});

  describe('other types', function () {
    it('should find k component of Complex number', function () {
      assert.equal(k(new math.complex(1,2)),0);
    });

    it('should find k component of number', function () {
      assert.equal(k(4),0);
    });

    it('should find k component of big number', function () {
      assert.deepEqual(k(math.bignumber(3)),math.bignumber(0));
    });

    it('should fine the k component of booleans', function () {
      assert.equal(k(true), 0);
      assert.equal(k(false), 0);
    })

    it('should find k component of null', function () {
      assert.equal(k(null), 0);
    });

    it('should throw exception when passed unsuported argument type', function () {
      assert.throws(function () {k(new Date())}, /TypeError: Unexpected type of argument/);
      assert.throws(function () {k(math.unit('5cm'))}, /TypeError: Unexpected type of argument/);
    });

    it('should throw exception whe passed wrong number of arguments', function () {
      assert.throws(function () {k(1,2)}, /TypeError: Too many arguments/);
      assert.throws(function () {k()}, /TypeError: Too few arguments/);
    });
  });
})