var assert = require('assert');
var math = require('../../index');
var quaternion = math.quaternion;

function assertQuaternion(Q,r,i,j,k){
  assert.strictEqual(Q.r,r);
  assert.strictEqual(Q.i,i);
  assert.strictEqual(Q.j,j);
  assert.strictEqual(Q.k,k);
};

describe('Quaternion', function () {
  

  describe('constructor', function(){
    it('Should create a Quaternion from components', function () {
      var Q = new quaternion(1,-2,-4,5);
      assertQuaternion(Q,1,-2,-4,5);
    });

    it('Should create a Quaternion value 0 when given no peramiters', function(){
      var Q = new quaternion();
      assertQuaternion(Q,0,0,0,0);
    });

    it('Should create a Quaternion when passed an object',function (){
      var Q = new quaternion({r: 1, i: 3, j:-2, k:-8});
      assertQuaternion(Q, 1,3,-2,-8);
    });

    describe('from complex', function(){
      it('Should create a Quaternion with j and k = 0 when passed cartesian form of complex', 
      function(){
        var Q = new quaternion({re:3, im:-2});
        assertQuaternion(Q,3,-2,0,0);
      });

      it('Should create a Quaternion with j and k = 0 when passed mod arg form of complex', 
        function(){
          var Q = new quaternion({phi:math.PI/2,r:2})
          // todo use approx here
        }
      );
    });

    describe('From string', function(){
      it('should create a Quaternion number', function(){
        assertQuaternion(new quaternion('4'),4,0,0,0);
        assertQuaternion(new quaternion('3i'),0,3,0,0);
        assertQuaternion(new quaternion('2j'),0,0,2,0);
        assertQuaternion(new quaternion('-4k'),0,0,0,-4);
        assertQuaternion(new quaternion('4+3i+2j+k'),4,3,2,1);
        assertQuaternion(new quaternion('     -4      -2i    +37j  -4k '),-4,-2,37,-4);
        assertQuaternion(new quaternion('4 + 2 + 2i -3i -4j -3j+5k-5.5k'),6,-1,-7,-0.5);
        assertQuaternion(new quaternion('2.i -.4'),-0.4,2,0,0);
      });
    })
    

  })
})