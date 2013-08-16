var assert = require('assert');
var math = require('../../../index.js');

describe('eye', function() {

  it('should create an identity matrix of the given size', function() {
    assert.deepEqual(math.eye().valueOf(), [[1]]);
    assert.deepEqual(math.eye([]).valueOf(), [[1]]);
    assert.deepEqual(math.eye(1).valueOf(), [[1]]);
    assert.deepEqual(math.eye(2).valueOf(), [[1,0],[0,1]]);
    assert.deepEqual(math.eye([2]).valueOf(), [[1,0],[0,1]]);
    assert.deepEqual(math.eye(2,3).valueOf(), [[1,0,0],[0,1,0]]);
    assert.deepEqual(math.eye(3,2).valueOf(), [[1,0],[0,1],[0,0]]);
    assert.deepEqual(math.eye([3,2]).valueOf(), [[1,0],[0,1],[0,0]]);
    assert.deepEqual(math.eye(math.matrix([3,2])).valueOf(), [[1,0],[0,1],[0,0]]);
    assert.deepEqual(math.eye(math.matrix([[3],[2]])).valueOf(), [[1,0],[0,1],[0,0]]);
    assert.deepEqual(math.eye(3,3).valueOf(), [[1,0,0],[0,1,0],[0,0,1]]);
  })

  it('should throw an error with an invalid input', function() {
    assert.throws(function () {math.eye(3,3,2);});
    assert.throws(function () {math.eye([3,3,2]);});
  });

});