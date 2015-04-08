// test abs
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

    approx.deepEqual(x, [-1, -0.5, -1/3, -0.25]);
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
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25]));
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
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25]));
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
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25]));
    
    var x = math.lusolve(lup, [1, 2, 1, -1]);
    approx.deepEqual(x, math.matrix([1, 1, 1/3, -0.25]));
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
    approx.deepEqual(x, math.matrix([-1, -0.5, -1/3, -0.25]));

    var x = math.lusolve(lup, [1, 2, 1, -1]);
    approx.deepEqual(x, math.matrix([1, 1, 1/3, -0.25]));
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

    var x = math.lusolve(lup, [1, 2, 1, -1]);
    approx.deepEqual(x, math.matrix([1, 1, 1/3, -0.25], 'crs'));
  });
});