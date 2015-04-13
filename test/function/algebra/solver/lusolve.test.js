// test lusolve
var assert = require('assert'),
    approx = require('../../../../tools/approx'),
    math = require('../../../../index');

describe('lusolve', function () {
  
  it('should solve linear system 4 x 4, arrays', function () {
    var m = 
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ];
    var b = [-1, -1, -1, -1];
    
    var x = math.lusolve(m, b);
    
    approx.deepEqual(x, [-1, -0.5, -1/3, -0.25]);
  });
  
  it('should solve linear system 4 x 4, array and column array', function () {
    var m = 
        [
          [1, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 3, 0],
          [0, 0, 0, 4]
        ];
    var b = [
      [-1],
      [-1], 
      [-1],
      [-1]
    ];
    var x = math.lusolve(m, b);

    approx.deepEqual(x, [[-1], [-0.5], [-1/3], [-0.25]]);
  });
  
  it('should solve linear system 4 x 4, matrices', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ]);
    var b = math.matrix([-1, -1, -1, -1]);

    var x = math.lusolve(m, b);

    assert(x instanceof math.type.Matrix);
    approx.deepEqual(x, math.matrix([[-1], [-0.5], [-1/3], [-0.25]]));
  });
  
  it('should solve linear system 4 x 4, crs matrices', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'crs');
    var b = math.matrix([[-1], [-1], [-1], [-1]], 'crs');

    var x = math.lusolve(m, b);

    assert(x instanceof math.type.Matrix);
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25], 'crs'));
  });
  
  it('should solve linear system 4 x 4, ccs matrices', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'ccs');
    var b = math.matrix([[-1], [-1], [-1], [-1]], 'ccs');

    var x = math.lusolve(m, b);

    assert(x instanceof math.type.Matrix);
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25], 'ccs'));
  });
  
  it('should solve linear system 4 x 4, matrix and column matrix', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ]);
    var b = math.matrix([
      [-1],
      [-1], 
      [-1],
      [-1]
    ]);

    var x = math.lusolve(m, b);

    assert(x instanceof math.type.Matrix);
    approx.deepEqual(x, math.matrix([[-1], [-0.5], [-1/3], [-0.25]]));
  });
  
  it('should solve linear system 4 x 4, crs matrix and column matrix', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'crs');
    var b = math.matrix([
      [-1],
      [-1], 
      [-1],
      [-1]
    ], 'crs');

    var x = math.lusolve(m, b);

    assert(x instanceof math.type.Matrix);
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25], 'crs'));
  });
  
  it('should solve linear system 4 x 4, ccs matrix and column matrix', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'ccs');
    var b = math.matrix([
      [-1],
      [-1], 
      [-1],
      [-1]
    ], 'ccs');

    var x = math.lusolve(m, b);

    assert(x instanceof math.type.Matrix);
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25], 'ccs'));
  });
  
  it('should solve linear system 4 x 4, LUP decomposition (array)', function () {
    var m = 
        [
          [1, 0, 0, 0],
          [0, 2, 0, 0],
          [0, 0, 3, 0],
          [0, 0, 0, 4]
        ];    
    var lup = math.lup(m);
    
    var x = math.lusolve(lup, [-1, -1, -1, -1]);
    approx.deepEqual(x, math.matrix([[-1], [-0.5], [-1/3], [-0.25]]));
    
    var y = math.lusolve(lup, [1, 2, 1, -1]);
    approx.deepEqual(y, math.matrix([[1], [1], [1/3], [-0.25]]));
  });
  
  it('should solve linear system 4 x 4, LUP decomposition (matrix)', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ]);    
    var lup = math.lup(m);

    var x = math.lusolve(lup, [-1, -1, -1, -1]);
    approx.deepEqual(x, math.matrix([[-1], [-0.5], [-1/3], [-0.25]]));

    var y = math.lusolve(lup, [1, 2, 1, -1]);
    approx.deepEqual(y, math.matrix([[1], [1], [1/3], [-0.25]]));
  });
  
  it('should solve linear system 4 x 4, LUP decomposition (crs matrix)', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'crs');    
    var lup = math.lup(m);

    var x = math.lusolve(lup, [-1, -1, -1, -1]);
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25], 'crs'));

    var y = math.lusolve(lup, [1, 2, 1, -1]);
    approx.deepEqual(y, math.matrix([1, 1, 1/3, -0.25], 'crs'));
  });
  
  it('should solve linear system 4 x 4, LUP decomposition (ccs matrix)', function () {
    var m = math.matrix(
      [
        [1, 0, 0, 0],
        [0, 2, 0, 0],
        [0, 0, 3, 0],
        [0, 0, 0, 4]
      ], 'ccs');    
    var lup = math.lup(m);

    var x = math.lusolve(lup, [-1, -1, -1, -1]);
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25], 'ccs'));

    var y = math.lusolve(lup, [1, 2, 1, -1]);
    approx.deepEqual(y, math.matrix([1, 1, 1/3, -0.25], 'ccs'));
  });
  
  it('should solve linear system 3 x 3, no permutations, arrays', function () {
    var m = 
        [
          [2, 1, 1],
          [1, 2, -1],
          [1, 2, 1]
        ];
    var b = [-2, 4, 2];

    var x = math.lusolve(m, b);

    approx.deepEqual(x, [[-5/3], [7/3], [-1]]);
  });
  
  it('should solve linear system 3 x 3, no permutations, matrix', function () {
    var m = math.matrix(
      [
        [2, 1, 1],
        [1, 2, -1],
        [1, 2, 1]
      ]);
    var b = [-2, 4, 2];

    var x = math.lusolve(m, b);

    approx.deepEqual(x, math.matrix([[-5/3], [7/3], [-1]]));
  });
  
  it('should solve linear system 3 x 3, no permutations, crs matrix', function () {
    var m = math.matrix(
      [
        [2, 1, 1],
        [1, 2, -1],
        [1, 2, 1]
      ], 'crs');
    var b = [-2, 4, 2];

    var x = math.lusolve(m, b);

    approx.deepEqual(x, math.matrix([[-5/3], [7/3], [-1]], 'crs'));
  });
  
  it('should solve linear system 3 x 3, no permutations, ccs matrix', function () {
    var m = math.matrix(
      [
        [2, 1, 1],
        [1, 2, -1],
        [1, 2, 1]
      ], 'ccs');
    var b = [-2, 4, 2];

    var x = math.lusolve(m, b);

    approx.deepEqual(x, math.matrix([[-5/3], [7/3], [-1]], 'ccs'));
  });
  
  it('should solve linear system 3 x 3, permutations, arrays', function () {
    var m = 
        [
          [1, 2, -1],
          [2, 1, 1],
          [1, 2, 1]
        ];
    var b = [4, -2, 2];

    var x = math.lusolve(m, b);

    approx.deepEqual(x, [[-5/3], [7/3], [-1]]);
  });

  it('should solve linear system 3 x 3, permutations, matrix', function () {
    var m = math.matrix(
      [
        [1, 2, -1],
        [2, 1, 1],
        [1, 2, 1]
      ]);
    var b = [4, -2, 2];

    var x = math.lusolve(m, b);

    approx.deepEqual(x, math.matrix([[-5/3], [7/3], [-1]]));
  });

  it('should solve linear system 3 x 3, permutations, crs matrix', function () {
    var m = math.matrix(
      [
        [1, 2, -1],
        [2, 1, 1],
        [1, 2, 1]
      ], 'crs');
    var b = [4, -2, 2];

    var x = math.lusolve(m, b);

    approx.deepEqual(x, math.matrix([[-5/3], [7/3], [-1]], 'crs'));
  });

  it('should solve linear system 3 x 3, permutations, ccs matrix', function () {
    var m = math.matrix(
      [
        [1, 2, -1],
        [2, 1, 1],
        [1, 2, 1]
      ], 'ccs');
    var b = [4, -2, 2];

    var x = math.lusolve(m, b);

    approx.deepEqual(x, math.matrix([[-5/3], [7/3], [-1]], 'ccs'));
  });
  
  it('should throw exception when matrix is singular', function () {
    assert.throws(function () { math.lusolve([[1, 1], [0, 0]], [1, 1]); }, /Error: Linear system cannot be solved since matrix is singular/);
    assert.throws(function () { math.lusolve(math.matrix([[1, 1], [0, 0]], 'dense'), [1, 1]); }, /Error: Linear system cannot be solved since matrix is singular/);
    assert.throws(function () { math.lusolve(math.matrix([[1, 1], [0, 0]], 'crs'), [1, 1]); }, /Error: Linear system cannot be solved since matrix is singular/);
    assert.throws(function () { math.lusolve(math.matrix([[1, 1], [0, 0]], 'ccs'), [1, 1]); }, /Error: Linear system cannot be solved since matrix is singular/);
  });
});