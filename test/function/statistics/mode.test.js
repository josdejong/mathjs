var assert = require('assert'),
    math = require('../../../index'),
    mode = math.mode;

describe('mode', function() {
  it('should return the mode accurately for all types of valid input', function() {
    assert.deepEqual(mode(2, 1, 4, 3, 1), [1]);
    assert.deepEqual(mode([1, 2.7, 3.2, 4, 2.7]), [2.7]);
    assert.deepEqual(mode('a', 'b', 'c', 'b'), ["b"]);
    assert.deepEqual(mode([13, 24, 35, 46]), [13, 24, 35, 46]);
  });
  
  it('should throw an error if the input doesn\'t contain 1D vector or all non-array values', function(){
    assert.throws(function() {mode(1, ['3v'], [1, 2, 3, 7], 3, [8])}, /SyntaxError/);
    assert.throws(function() {mode([1], 3, [3])}, /SyntaxError/);
    assert.throws(function() {mode([13, 24],[35, 46])}, /SyntaxError/);
  });
  
  it('should throw an error if no parameters are assigned', function(){
    assert.throws(function() {mode()}, /SyntaxError/);
  });
  // TODO: array of array gives error - mode([1][3])
});
