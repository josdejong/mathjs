var assert = require('assert');
var math = require('../../index');
var approx = require('../../tools/approx');
var quaternion = math.quaternion;
var complex = math.complex;
var matrix = math.matrix;

function assertQuaternion(Q,r,i,j,k){
  assert.strictEqual(Q.r,r);
  assert.strictEqual(Q.i,i);
  assert.strictEqual(Q.j,j);
  assert.strictEqual(Q.k,k);
};

function approxAssertQuaternion(Q,r,i,j,k) {
  approx.equal(Q.r,r);
  approx.equal(Q.i,i);
  approx.equal(Q.j,j);
  approx.equal(Q.k,k);
}

describe('Quaternion', function () {


  describe('constructor', function(){
    it('Should create a Quaternion from components', function () {
      assertQuaternion(quaternion(1,-2,-4,5),1,-2,-4,5);
      assertQuaternion(quaternion(1,2,3,4),1,2,3,4);
      assertQuaternion(quaternion(-1,-2,-3,-4),-1,-2,-3,-4);
      assertQuaternion(quaternion(-1,-2,-3,-4),-1,-2,-3,-4);
      assertQuaternion(quaternion(-1,2,-3,4),-1,2,-3,4);
      assertQuaternion(quaternion(1,-2,3,-4),1,-2,3,-4);
      assertQuaternion(quaternion(0,0,0,0),0,0,0,0);
      assertQuaternion(quaternion(1,0,0,0),1,0,0,0);
      assertQuaternion(quaternion(0,1,0,0),0,1,0,0);
      assertQuaternion(quaternion(0,0,1,0),0,0,1,0);
      assertQuaternion(quaternion(0,0,0,1),0,0,0,1);
      assertQuaternion(quaternion(-1,0,0,0),-1,0,0,0);
      assertQuaternion(quaternion(0,-1,0,0),0,-1,0,0);
      assertQuaternion(quaternion(0,0,-1,0),0,0,-1,0);
      assertQuaternion(quaternion(0,0,0,-1),0,0,0,-1);
    });

    it('Should create a Quaternion value 0 when given no peramiters', function() {
      assertQuaternion(quaternion(),0,0,0,0);
    });

    it('Should create a Quaternion when passed an object', function () {
      assertQuaternion(quaternion({r: 1, i: 3, j:-2, k:-8}), 1,3,-2,-8);
      assertQuaternion(quaternion({r:1,i:2,j:3,k:4}),1,2,3,4);
      assertQuaternion(quaternion({r:-1,i:-2,j:-3,k:-4}),-1,-2,-3,-4);
      assertQuaternion(quaternion({r:1,i:-2,j:3,k:-4}),1,-2,3,-4);
      assertQuaternion(quaternion({r:-1,i:2,j:-3,k:4}),-1,2,-3,4);
      assertQuaternion(quaternion({r:0,i:0,j:0,k:0}),0,0,0,0);
      assertQuaternion(quaternion({r:1,i:0,j:0,k:0}),1,0,0,0);
      assertQuaternion(quaternion({r:0,i:1,j:0,k:0}),0,1,0,0);
      assertQuaternion(quaternion({r:0,i:0,j:1,k:0}),0,0,1,0);
      assertQuaternion(quaternion({r:0,i:0,j:0,k:1}),0,0,0,1);
      assertQuaternion(quaternion({r:-1,i:0,j:0,k:0}),-1,0,0,0);
      assertQuaternion(quaternion({r:0,i:-1,j:0,k:0}),0,-1,0,0);
      assertQuaternion(quaternion({r:0,i:0,j:-1,k:0}),0,0,-1,0);
      assertQuaternion(quaternion({r:0,i:0,j:0,k:-1}),0,0,0,-1);
    });

    describe('from complex', function() {
      it('Should create a Quaternion with j and k = 0 when passed cartesian form of complex',
      function(){
        assertQuaternion(quaternion({re:1, im:2}),1,2,0,0);
        assertQuaternion(quaternion({re:-1, im:2}),-1,2,0,0);
        assertQuaternion(quaternion({re:1, im:-2}),1,-2,0,0);
        assertQuaternion(quaternion({re:-1, im:-2}),-1,-2,0,0);
        assertQuaternion(quaternion({re:0, im:0}),0,0,0,0);
        assertQuaternion(quaternion({re:1, im:0}),1,0,0,0);
        assertQuaternion(quaternion({re:0, im:1}),0,1,0,0);
        assertQuaternion(quaternion({re:-1, im:0}),-1,0,0,0);
        assertQuaternion(quaternion({re:0, im:-1}),0,-1,0,0);

        assertQuaternion(quaternion(math.complex(1, 2)),1,2,0,0);
        assertQuaternion(quaternion(math.complex(-1, 2)),-1,2,0,0);
        assertQuaternion(quaternion(math.complex(1, -2)),1,-2,0,0);
        assertQuaternion(quaternion(math.complex(-1, -2)),-1,-2,0,0);
        assertQuaternion(quaternion(math.complex(0, 0)),0,0,0,0);
        assertQuaternion(quaternion(math.complex(1, 0)),1,0,0,0);
        assertQuaternion(quaternion(math.complex(0, 1)),0,1,0,0);
        assertQuaternion(quaternion(math.complex(-1, 0)),-1,0,0,0);
        assertQuaternion(quaternion(math.complex(0, -1)),0,-1,0,0);
      });

      it('Should create a Quaternion with j and k = 0 when passed mod arg form of complex', function() {

        approxAssertQuaternion(quaternion({phi:math.PI/2, r:1}), 0,1,0,0);
        approxAssertQuaternion(quaternion({phi:math.PI/2, r:5.5}), 0,5.5,0,0);
        approxAssertQuaternion(quaternion({phi:math.PI/2, r:2}), 0,2,0,0);
        approxAssertQuaternion(quaternion({phi:math.PI/2, r:10}), 0,10,0,0);

        approxAssertQuaternion(quaternion({phi:-math.PI/2, r:1}), 0,-1,0,0);
        approxAssertQuaternion(quaternion({phi:-math.PI/2, r:5.5}), 0,-5.5,0,0);
        approxAssertQuaternion(quaternion({phi:-math.PI/2, r:2}), 0,-2,0,0);
        approxAssertQuaternion(quaternion({phi:-math.PI/2, r:10}), 0,-10,0,0);

        approxAssertQuaternion(quaternion({phi:math.PI, r:1}), -1,0,0,0);
        approxAssertQuaternion(quaternion({phi:math.PI, r:2}), -2,0,0,0);
        approxAssertQuaternion(quaternion({phi:math.PI, r:5.5}), -5.5,0,0,0);
        approxAssertQuaternion(quaternion({phi:math.PI, r:22.1}), -22.1,0,0,0);
        approxAssertQuaternion(quaternion({phi:0, r:1}), 1,0,0,0);
        approxAssertQuaternion(quaternion({phi:0, r:2}), 2,0,0,0);
        approxAssertQuaternion(quaternion({phi:0, r:5.5}), 5.5,0,0,0);
        approxAssertQuaternion(quaternion({phi:0, r:22.2}), 22.2,0,0,0);

        assert.deepEqual(quaternion({phi:1, r:0}), quaternion(0,0,0,0));
        assert.deepEqual(quaternion({phi:23, r:0}), quaternion(0,0,0,0));
        assert.deepEqual(quaternion({phi:-32, r:0}), quaternion(0,0,0,0));
        assert.deepEqual(quaternion({phi:-1, r:0}), quaternion(0,0,0,0));
      });

      it('Should create a Quaternion from a pair of complex numbers', function () {

        assertQuaternion(quaternion(complex(1,2),complex(3,4)), 1,2,3,4);
        assertQuaternion(quaternion(complex(-1,2),complex(3,4)), -1,2,3,4);
        assertQuaternion(quaternion(complex(1,-2),complex(3,4)), 1,-2,3,4);
        assertQuaternion(quaternion(complex(1,2),complex(-3,4)), 1,2,-3,4);
        assertQuaternion(quaternion(complex(1,2),complex(3,-4)), 1,2,3,-4);

        assertQuaternion(quaternion(complex(0,0),complex(0,0)), 0,0,0,0);
        assertQuaternion(quaternion(complex(1,0),complex(0,0)), 1,0,0,0);
        assertQuaternion(quaternion(complex(0,1),complex(0,0)), 0,1,0,0);
        assertQuaternion(quaternion(complex(0,0),complex(1,0)), 0,0,1,0);
        assertQuaternion(quaternion(complex(0,0),complex(0,1)), 0,0,0,1);

        assertQuaternion(quaternion(complex(-1,0),complex(0,0)), -1,0,0,0);
        assertQuaternion(quaternion(complex(0,-1),complex(0,0)), 0,-1,0,0);
        assertQuaternion(quaternion(complex(0,0),complex(-1,0)), 0,0,-1,0);
        assertQuaternion(quaternion(complex(0,0),complex(0,-1)), 0,0,0,-1);
      });
    });

    it('Should create a Quaternion number from a string', function() {
      assertQuaternion(quaternion('4'),4,0,0,0);
      assertQuaternion(quaternion('3i'),0,3,0,0);
      assertQuaternion(quaternion('2j'),0,0,2,0);
      assertQuaternion(quaternion('-4k'),0,0,0,-4);
      assertQuaternion(quaternion('4+3i+2j+k'),4,3,2,1);
      assertQuaternion(quaternion('     -4      -2i    +37j  -4k '),-4,-2,37,-4);
      assertQuaternion(quaternion('4 + 2 + 2i -3i -4j -3j+5k-5.5k'),6,-1,-7,-0.5);
      assertQuaternion(quaternion('2.i -.4'),-0.4,2,0,0);

      assertQuaternion(quaternion('1'),1,0,0,0);
      assertQuaternion(quaternion('1i'),0,1,0,0);
      assertQuaternion(quaternion('1j'),0,0,1,0);
      assertQuaternion(quaternion('1k'),0,0,0,1);

      assertQuaternion(quaternion('i'),0,1,0,0);
      assertQuaternion(quaternion('j'),0,0,1,0);
      assertQuaternion(quaternion('k'),0,0,0,1);
      assertQuaternion(quaternion('-1'),-1,0,0,0);
      assertQuaternion(quaternion('-i'),0,-1,0,0);
      assertQuaternion(quaternion('-j'),0,0,-1,0);
      assertQuaternion(quaternion('-k'),0,0,0,-1);

      assertQuaternion(quaternion('1-1'),0,0,0,0);
      assertQuaternion(quaternion('i-i'),0,0,0,0);
      assertQuaternion(quaternion('j-j'),0,0,0,0);
      assertQuaternion(quaternion('k-k'),0,0,0,0);
    });

    describe('From matrix', function () {
      it('Should create a Quaternion from a 4x4 real matrix', function ()  {
        assertQuaternion(quaternion([[1,-2,-3,-4],[2,1,-4,3],[3,4,1,-2],[4,-3,2,1]]), 1,2,3,4);
        assertQuaternion(quaternion([[-1,-2,-3,-4],[2,-1,-4,3],[3,4,-1,-2],[4,-3,2,-1]])  , -1,2,3,4);
        assertQuaternion(quaternion([[1,2,-3,-4],[-2,1,-4,3],[3,4,1,2],[4,-3,-2,1]]), 1,-2,3,4);
        assertQuaternion(quaternion([[1,-2,3,-4],[2,1,-4,-3],[-3,4,1,-2],[4,3,2,1]]), 1,2,-3,4);
        assertQuaternion(quaternion([[1,-2,-3,4],[2,1,4,3],[3,-4,1,-2],[-4,-3,2,1]]), 1,2,3,-4);

        assertQuaternion(quaternion([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]]), 1,0,0,0);
        assertQuaternion(quaternion([[0,-1,0,0],[1,0,0,0],[0,0,0,-1],[0,0,1,0]]), 0,1,0,0);
        assertQuaternion(quaternion([[0,0,-1,0],[0,0,0,1],[1,0,0,0],[0,-1,0,0]]), 0,0,1,0);
        assertQuaternion(quaternion([[0,0,0,-1],[0,0,-1,0],[0,1,0,0],[1,0,0,0]]), 0,0,0,1);

        assertQuaternion(quaternion([[-1,0,0,0],[0,-1,0,0],[0,0,-1,0],[0,0,0,-1]]), -1,0,0,0);
        assertQuaternion(quaternion([[0,1,0,0],[-1,0,0,0],[0,0,0,1],[0,0,-1,0]]), 0,-1,0,0);
        assertQuaternion(quaternion([[0,0,1,0],[0,0,0,-1],[-1,0,0,0],[0,1,0,0]]), 0,0,-1,0);
        assertQuaternion(quaternion([[0,0,0,1],[0,0,1,0],[0,-1,0,0],[-1,0,0,0]]), 0,0,0,-1);

        assertQuaternion(quaternion(matrix([[1,-2,-3,-4],[2,1,-4,3],[3,4,1,-2],[4,-3,2,1]])), 1,2,3,4);
        assertQuaternion(quaternion(matrix([[-1,-2,-3,-4],[2,-1,-4,3],[3,4,-1,-2],[4,-3,2,-1]]))  , -1,2,3,4);
        assertQuaternion(quaternion(matrix([[1,2,-3,-4],[-2,1,-4,3],[3,4,1,2],[4,-3,-2,1]])), 1,-2,3,4);
        assertQuaternion(quaternion(matrix([[1,-2,3,-4],[2,1,-4,-3],[-3,4,1,-2],[4,3,2,1]])), 1,2,-3,4);
        assertQuaternion(quaternion(matrix([[1,-2,-3,4],[2,1,4,3],[3,-4,1,-2],[-4,-3,2,1]])), 1,2,3,-4);

        assertQuaternion(quaternion(matrix([[1,0,0,0],[0,1,0,0],[0,0,1,0],[0,0,0,1]])), 1,0,0,0);
        assertQuaternion(quaternion(matrix([[0,-1,0,0],[1,0,0,0],[0,0,0,-1],[0,0,1,0]])), 0,1,0,0);
        assertQuaternion(quaternion(matrix([[0,0,-1,0],[0,0,0,1],[1,0,0,0],[0,-1,0,0]])), 0,0,1,0);
        assertQuaternion(quaternion(matrix([[0,0,0,-1],[0,0,-1,0],[0,1,0,0],[1,0,0,0]])), 0,0,0,1);

        assertQuaternion(quaternion(matrix([[-1,0,0,0],[0,-1,0,0],[0,0,-1,0],[0,0,0,-1]])), -1,0,0,0);
        assertQuaternion(quaternion(matrix([[0,1,0,0],[-1,0,0,0],[0,0,0,1],[0,0,-1,0]])), 0,-1,0,0);
        assertQuaternion(quaternion(matrix([[0,0,1,0],[0,0,0,-1],[-1,0,0,0],[0,1,0,0]])), 0,0,-1,0);
        assertQuaternion(quaternion(matrix([[0,0,0,1],[0,0,1,0],[0,-1,0,0],[-1,0,0,0]])), 0,0,0,-1);
      });

      it('should create Quaternion from a 2x2 complex matrix', function () {
        assertQuaternion(quaternion([[complex(1,2),complex(3,4)],[complex(-3,4),complex(1,-2)]]), 1,2,3,4);
        assertQuaternion(quaternion([[complex(-1,2),complex(3,4)],[complex(-3,4),complex(-1,-2)]]), -1,2,3,4);
        assertQuaternion(quaternion([[complex(1,-2),complex(3,4)],[complex(-3,4),complex(1,2)]]), 1,-2,3,4);
        assertQuaternion(quaternion([[complex(1,2),complex(-3,4)],[complex(3,4),complex(1,-2)]]), 1,2,-3,4);
        assertQuaternion(quaternion([[complex(1,2),complex(3,-4)],[complex(-3,-4),complex(1,-2)]]), 1,2,3,-4);

        assertQuaternion(quaternion([[complex(0,0),complex(0,0)],[complex(0,0),complex(0,0)]]), 0,0,0,0);
        assertQuaternion(quaternion([[complex(1,0),complex(0,0)],[complex(0,0),complex(1,0)]]), 1,0,0,0);
        assertQuaternion(quaternion([[complex(0,1),complex(0,0)],[complex(0,0),complex(0,-1)]]), 0,1,0,0);
        assertQuaternion(quaternion([[complex(0,0),complex(1,0)],[complex(-1,0),complex(0,0)]]), 0,0,1,0);
        assertQuaternion(quaternion([[complex(0,0),complex(0,1)],[complex(0,1),complex(0,0)]]), 0,0,0,1);

        assertQuaternion(quaternion([[complex(-1,0),complex(0,0)],[complex(0,0),complex(-1,0)]]), -1,0,0,0);
        assertQuaternion(quaternion([[complex(0,-1),complex(0,0)],[complex(0,0),complex(0,1)]]), 0,-1,0,0);
        assertQuaternion(quaternion([[complex(0,0),complex(-1,0)],[complex(1,0),complex(0,0)]]), 0,0,-1,0);
        assertQuaternion(quaternion([[complex(0,0),complex(0,-1)],[complex(0,-1),complex(0,0)]]), 0,0,0,-1);

        assertQuaternion(quaternion(matrix([[complex(1,2),complex(3,4)],[complex(-3,4),complex(1,-2)]])), 1,2,3,4);
        assertQuaternion(quaternion(matrix([[complex(-1,2),complex(3,4)],[complex(-3,4),complex(-1,-2)]])), -1,2,3,4);
        assertQuaternion(quaternion(matrix([[complex(1,-2),complex(3,4)],[complex(-3,4),complex(1,2)]])), 1,-2,3,4);
        assertQuaternion(quaternion(matrix([[complex(1,2),complex(-3,4)],[complex(3,4),complex(1,-2)]])), 1,2,-3,4);
        assertQuaternion(quaternion(matrix([[complex(1,2),complex(3,-4)],[complex(-3,-4),complex(1,-2)]])), 1,2,3,-4);

        assertQuaternion(quaternion(matrix([[complex(0,0),complex(0,0)],[complex(0,0),complex(0,0)]])), 0,0,0,0);
        assertQuaternion(quaternion(matrix([[complex(1,0),complex(0,0)],[complex(0,0),complex(1,0)]])), 1,0,0,0);
        assertQuaternion(quaternion(matrix([[complex(0,1),complex(0,0)],[complex(0,0),complex(0,-1)]])), 0,1,0,0);
        assertQuaternion(quaternion(matrix([[complex(0,0),complex(1,0)],[complex(-1,0),complex(0,0)]])), 0,0,1,0);
        assertQuaternion(quaternion(matrix([[complex(0,0),complex(0,1)],[complex(0,1),complex(0,0)]])), 0,0,0,1);

        assertQuaternion(quaternion(matrix([[complex(-1,0),complex(0,0)],[complex(0,0),complex(-1,0)]])), -1,0,0,0);
        assertQuaternion(quaternion(matrix([[complex(0,-1),complex(0,0)],[complex(0,0),complex(0,1)]])), 0,-1,0,0);
        assertQuaternion(quaternion(matrix([[complex(0,0),complex(-1,0)],[complex(1,0),complex(0,0)]])), 0,0,-1,0);
        assertQuaternion(quaternion(matrix([[complex(0,0),complex(0,-1)],[complex(0,-1),complex(0,0)]])), 0,0,0,-1);

      });
    });

    it('should create a quaternion from a modulus, argument and unit vector', function () {
      approxAssertQuaternion(quaternion({mod:1, arg: 0, unit:{i:1,j:1,k:1}}), 1,0,0,0);
      approxAssertQuaternion(quaternion({mod:5, arg: 0, unit:{i:1,j:1,k:1}}), 5,0,0,0);
      approxAssertQuaternion(quaternion({mod:1, arg: Math.PI, unit:{i:1,j:1,k:1}}), -1,0,0,0);
      approxAssertQuaternion(quaternion({mod:5, arg: Math.PI, unit:{i:1,j:1,k:1}}), -5,0,0,0);

      approxAssertQuaternion(quaternion({mod:1, arg: 0, unit:{i:4,j:0,k:0}}), 1,0,0,0);
      approxAssertQuaternion(quaternion({mod:5, arg: 0, unit:{i:4,j:0,k:0}}), 5,0,0,0);
      approxAssertQuaternion(quaternion({mod:1, arg: Math.PI, unit:{i:4,j:0,k:0}}), -1,0,0,0);
      approxAssertQuaternion(quaternion({mod:5, arg: Math.PI, unit:{i:4,j:0,k:0}}), -5,0,0,0);

      approxAssertQuaternion(quaternion({mod:1, arg: 0, unit:{i:0,j:4,k:0}}), 1,0,0,0);
      approxAssertQuaternion(quaternion({mod:5, arg: 0, unit:{i:0,j:4,k:0}}), 5,0,0,0);
      approxAssertQuaternion(quaternion({mod:1, arg: Math.PI, unit:{i:0,j:4,k:0}}), -1,0,0,0);
      approxAssertQuaternion(quaternion({mod:5, arg: Math.PI, unit:{i:0,j:4,k:0}}), -5,0,0,0);

      approxAssertQuaternion(quaternion({mod:1, arg: 0, unit:{i:0,j:0,k:4}}), 1,0,0,0);
      approxAssertQuaternion(quaternion({mod:5, arg: 0, unit:{i:0,j:0,k:4}}), 5,0,0,0);
      approxAssertQuaternion(quaternion({mod:1, arg: Math.PI, unit:{i:0,j:0,k:4}}), -1,0,0,0);
      approxAssertQuaternion(quaternion({mod:5, arg: Math.PI, unit:{i:0,j:0,k:4}}), -5,0,0,0);

      approxAssertQuaternion(quaternion({mod:1, arg:Math.PI/2, unit:{i:1,j:0,k:0}}), 0,1,0,0);
      approxAssertQuaternion(quaternion({mod:1, arg:-Math.PI/2, unit:{i:1,j:0,k:0}}), 0,-1,0,0);

      approxAssertQuaternion(quaternion({mod:1, arg:Math.PI/2, unit:{i:0,j:1,k:0}}), 0,0,1,0);
      approxAssertQuaternion(quaternion({mod:1, arg:-Math.PI/2, unit:{i:0,j:1,k:0}}), 0,0,-1,0);

      approxAssertQuaternion(quaternion({mod:1, arg:Math.PI/2, unit:{i:0,j:0,k:1}}), 0,0,0,1);
      approxAssertQuaternion(quaternion({mod:1, arg:-Math.PI/2, unit:{i:0,j:0,k:1}}), 0,0,0,-1);

      approxAssertQuaternion(quaternion({mod:4, arg:Math.PI/4, unit:{i:1,j:1,k:2}}), 2.8284271247461903,1.1547005383792517,1.1547005383792517,2.3094010767585034);
      approxAssertQuaternion(quaternion({mod:4, arg:Math.PI/4, unit:{i:1,j:2,k:1}}), 2.8284271247461903,1.1547005383792517,2.3094010767585034,1.1547005383792517);
      approxAssertQuaternion(quaternion({mod:4, arg:Math.PI/4, unit:{i:2,j:1,k:1}}), 2.8284271247461903,2.3094010767585034,1.1547005383792517,1.1547005383792517);

      approxAssertQuaternion(quaternion({mod:4, arg:-Math.PI/4, unit:{i:1,j:1,k:2}}), 2.8284271247461903,-1.1547005383792517,-1.1547005383792517,-2.3094010767585034);
      approxAssertQuaternion(quaternion({mod:4, arg:-Math.PI/4, unit:{i:1,j:2,k:1}}), 2.8284271247461903,-1.1547005383792517,-2.3094010767585034,-1.1547005383792517);
      approxAssertQuaternion(quaternion({mod:4, arg:-Math.PI/4, unit:{i:2,j:1,k:1}}), 2.8284271247461903,-2.3094010767585034,-1.1547005383792517,-1.1547005383792517);

      approxAssertQuaternion(quaternion({mod:3, arg:2*Math.PI/3, unit:{i:2,j:5,k:1}}), -1.4999999999999982,0.9486832980505138,2.3717082451262845,0.4743416490252569);
      approxAssertQuaternion(quaternion({mod:3, arg:2*Math.PI/5, unit:{i:0,j:6,k:7}}), 0.9270509831248424,0,1.8568181294219148,2.1662878176589007);
    });
  });

  describe('properties', function () {
    it('zero should be pure and scalar', function(){
      assert.equal(quaternion().isScalar,true);
      assert.equal(quaternion().isPure,true);
      assert.equal(quaternion(0,0,0,0).isPure, true);
      assert.equal(quaternion(0,0,0,0).isScalar, true);
    });

    it('real numbers should be scalar and not pure', function() {
      assert.equal(quaternion({r:123}).isScalar, true);
      assert.equal(quaternion({r:-123}).isScalar, true);
      assert.equal(quaternion({r:123.023}).isScalar, true);
      assert.equal(quaternion({r:Math.PI}).isScalar, true);
      assert.equal(quaternion({r:123}).isPure, false);
      assert.equal(quaternion({r:-123}).isPure, false);
      assert.equal(quaternion({r:123.023}).isPure, false);
      assert.equal(quaternion({r:Math.PI}).isPure, false);
    });

    it('number with zero real component should be pure and not scalar', function() {
      assert.equal(quaternion({i:123}).isPure, true);
      assert.equal(quaternion({i:-123}).isPure, true);
      assert.equal(quaternion({j:123}).isPure, true);
      assert.equal(quaternion({j:-123}).isPure, true);
      assert.equal(quaternion({k:123}).isPure, true);
      assert.equal(quaternion({k:-123}).isPure, true);
      assert.equal(quaternion(0,1,2,3).isPure, true);

      assert.equal(quaternion({i:1}).isPure, true);
      assert.equal(quaternion({i:-1}).isPure, true);
      assert.equal(quaternion({j:1}).isPure, true);
      assert.equal(quaternion({j:-1}).isPure, true);
      assert.equal(quaternion({k:1}).isPure, true);
      assert.equal(quaternion({k:-1}).isPure, true);

      assert.equal(quaternion(0,1,1,1).isPure, true);
      assert.equal(quaternion(0,1,0,1).isPure, true);
      assert.equal(quaternion(0,1,1,0).isPure, true);
      assert.equal(quaternion(0,1,0,0).isPure, true);
      assert.equal(quaternion(0,0,1,0).isPure, true);
      assert.equal(quaternion(0,0,0,1).isPure, true);
      assert.equal(quaternion(0,-1,-1,-1).isPure, true);
      assert.equal(quaternion(0,-1,0,-1).isPure, true);
      assert.equal(quaternion(0,-1,-1,0).isPure, true);
      assert.equal(quaternion(0,-1,0,0).isPure, true);
      assert.equal(quaternion(0,0,-1,0).isPure, true);
      assert.equal(quaternion(0,0,0,-1).isPure, true);

      assert.equal(quaternion(0,1,1,1).isScalar, false);
      assert.equal(quaternion(0,1,0,1).isScalar, false);
      assert.equal(quaternion(0,1,1,0).isScalar, false);
      assert.equal(quaternion(0,1,0,0).isScalar, false);
      assert.equal(quaternion(0,0,1,0).isScalar, false);
      assert.equal(quaternion(0,0,0,1).isScalar, false);
      assert.equal(quaternion(0,-1,-1,-1).isScalar, false);
      assert.equal(quaternion(0,-1,0,-1).isScalar, false);
      assert.equal(quaternion(0,-1,-1,0).isScalar, false);
      assert.equal(quaternion(0,-1,0,0).isScalar, false);
      assert.equal(quaternion(0,0,-1,0).isScalar, false);
      assert.equal(quaternion(0,0,0,-1).isScalar, false);
    });

    it('should be quaternion', function () {
      assert.equal(quaternion().isQuaternion,true);
      assert.equal(quaternion(1,2,0,0).isQuaternion,true);
      assert.equal(quaternion(1,2,3,4).isQuaternion,true);
      assert.equal(quaternion().type,'Quaternion');
      assert.equal(quaternion(1,2,0,0).type,'Quaternion');
      assert.equal(quaternion(1,2,3,4).type,'Quaternion');

      assert.equal(quaternion(1,1,1,1).isQuaternion, true);
      assert.equal(quaternion(0,1,1,1).isQuaternion, true);
      assert.equal(quaternion(1,0,1,1).isQuaternion, true);
      assert.equal(quaternion(1,1,0,1).isQuaternion, true);
      assert.equal(quaternion(1,1,1,0).isQuaternion, true);
      assert.equal(quaternion(-1,-1,-1,-1).isQuaternion, true);
      assert.equal(quaternion(0,-1,-1,-1).isQuaternion, true);
      assert.equal(quaternion(-1,0,-1,-1).isQuaternion, true);
      assert.equal(quaternion(-1,-1,0,-1).isQuaternion, true);
      assert.equal(quaternion(-1,-1,-1,0).isQuaternion, true);

      assert.equal(quaternion(0,0,0,0).isQuaternion, true);
      assert.equal(quaternion(1,0,0,0).isQuaternion, true);
      assert.equal(quaternion(0,1,0,0).isQuaternion, true);
      assert.equal(quaternion(0,0,1,0).isQuaternion, true);
      assert.equal(quaternion(0,0,0,1).isQuaternion, true);

      assert.equal(quaternion(1,1,1,1).type, 'Quaternion');
      assert.equal(quaternion(0,1,1,1).type, 'Quaternion');
      assert.equal(quaternion(1,0,1,1).type, 'Quaternion');
      assert.equal(quaternion(1,1,0,1).type, 'Quaternion');
      assert.equal(quaternion(1,1,1,0).type, 'Quaternion');
      assert.equal(quaternion(-1,-1,-1,-1).type, 'Quaternion');
      assert.equal(quaternion(0,-1,-1,-1).type, 'Quaternion');
      assert.equal(quaternion(-1,0,-1,-1).type, 'Quaternion');
      assert.equal(quaternion(-1,-1,0,-1).type, 'Quaternion');
      assert.equal(quaternion(-1,-1,-1,0).type, 'Quaternion');

      assert.equal(quaternion(0,0,0,0).type, 'Quaternion');
      assert.equal(quaternion(1,0,0,0).type, 'Quaternion');
      assert.equal(quaternion(0,1,0,0).type, 'Quaternion');
      assert.equal(quaternion(0,0,1,0).type, 'Quaternion');
      assert.equal(quaternion(0,0,0,1).type, 'Quaternion');
    });

    it('quaternions with 0k an 0j should have canConvertToComplex true', function() {

      assert.equal(quaternion().canConvertToComplex, true);
      assert.equal(quaternion(1,0,0,0).canConvertToComplex, true);
      assert.equal(quaternion(0,1,0,0).canConvertToComplex, true);
      assert.equal(quaternion(0,0,1,0).canConvertToComplex, false);
      assert.equal(quaternion(0,0,0,1).canConvertToComplex, false);

      assert.equal(quaternion(-1,0,0,0).canConvertToComplex, true);
      assert.equal(quaternion(0,-1,0,0).canConvertToComplex, true);
      assert.equal(quaternion(0,0,-1,0).canConvertToComplex, false);
      assert.equal(quaternion(0,0,0,-1).canConvertToComplex, false);

      assert.equal(quaternion(1,2,3,4).canConvertToComplex, false);
      assert.equal(quaternion(1,2,0,0).canConvertToComplex, true);
      assert.equal(quaternion(-1,-2,-3,-4).canConvertToComplex, false);
      assert.equal(quaternion(-1,-2,0,0).canConvertToComplex, true);
    });
  });
});