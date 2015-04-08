// test abs
var assert = require('assert'),
    approx = require('../../../../tools/approx'),
    math = require('../../../../index');

describe('lusolve', function () {
  
  it('should solve linear system 4 x 4', function () {
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
});