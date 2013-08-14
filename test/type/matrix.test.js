// test data type Matrix

var assert = require('assert');
var math = require('../../lib/index.js');

var m = math.matrix();
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [0]);
assert.deepEqual(m.toScalar(), null);
assert.throws(function () { m.get([-1]); });

m = math.matrix([[23]]);
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [1,1]);
assert.deepEqual(m.toScalar(), 23);
assert.deepEqual(m.get([0,0]), 23);

m = math.matrix([[1,2,3],[4,5,6]]);
assert.equal(m.isScalar(), false);
assert.equal(m.isVector(), false);
assert.deepEqual(m.size(), [2,3]);
assert.equal(m.get([1,2]), 6);
assert.equal(m.get([0,1]), 2);
assert.throws(function () { m.get([1,2,3]); });
assert.throws(function () { m.get([3,0]); });
assert.throws(function () { m.get([1]); });

m = math.matrix([1,2,3]);
assert.equal(m.isScalar(), false);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [3]);
assert.deepEqual(m.toVector(), [1,2,3]);

m = math.matrix([[1],[2],[3]]);
assert.equal(m.isScalar(), false);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [3,1]);
assert.deepEqual(m.toVector(), [1,2,3]);

m = math.matrix([[[1],[2],[3]]]);
assert.equal(m.isScalar(), false);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [1,3,1]);
assert.deepEqual(m.toVector(), [1,2,3]);

m = math.matrix([[[3]]]);
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [1,1,1]);
assert.deepEqual(m.toVector(), [3]);

m = math.matrix([[]]);
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [1,0]);
assert.deepEqual(m.toVector(), []);

m = math.matrix();
assert.equal(m.isScalar(), true);
assert.equal(m.isVector(), true);
assert.deepEqual(m.size(), [0]);
assert.deepEqual(m.toVector(), []);

// test resizing
m = math.matrix([[1,2,3],[4,5,6]]);
assert.deepEqual(m.size(), [2,3]);
m.resize([2,4]);
assert.deepEqual(m.size(), [2,4]);
assert.deepEqual(m.valueOf(), [[1,2,3,0],[4,5,6,0]]);
m.resize([1,2]);
assert.deepEqual(m.size(), [1,2]);
assert.deepEqual(m.valueOf(), [[1,2]]);
m.resize([1,2,2], 8);
assert.deepEqual(m.size(), [1,2,2]);
assert.deepEqual(m.valueOf(), [[[1,8],[2,8]]]);
m.resize([2,3], 9);
assert.deepEqual(m.size(), [2,3]);
assert.deepEqual(m.valueOf(), [[1, 2, 9], [9, 9, 9]]);
m = math.matrix();
assert.deepEqual(m.size(), [0]);
m.resize([3,3,3], 6);
assert.deepEqual(m.size(), [3,3,3]);
assert.deepEqual(m.valueOf(), [
  [[6,6,6],[6,6,6],[6,6,6]],
  [[6,6,6],[6,6,6],[6,6,6]],
  [[6,6,6],[6,6,6],[6,6,6]]
]);
m.set([2,2,1], 3);
assert.deepEqual(m.valueOf(), [
  [[6,6,6],[6,6,6],[6,6,6]],
  [[6,6,6],[6,6,6],[6,6,6]],
  [[6,6,6],[6,6,6],[6,3,6]]
]);
m.resize([2,2]);
assert.deepEqual(m.size(), [2,2]);
assert.deepEqual(m.valueOf(), [[6,6],[6,6]]);
m.set([1,0], 3);
assert.deepEqual(m.valueOf(), [[6,6],[3,6]]);
m.resize([0]);
assert.deepEqual(m.size(), [0]);
assert.deepEqual(m.valueOf(), []);

m = math.matrix();
m.set([1,2], 5);
assert.deepEqual(m.size(), [2,3]);
assert.deepEqual(m.valueOf(), [[0,0,0],[0,0,5]]);

// get 1-dimensional
m = math.matrix(math.range(0,10));
assert.deepEqual(m.size(), [10]);
assert.deepEqual(m.get([[2,5,3,4]]).valueOf(), [2,5,3,4]);

// get 2-dimensional
m = math.matrix([[1,2,3],[4,5,6],[7,8,9]]);
assert.deepEqual(m.size(), [3,3]);
assert.deepEqual(m.get([1,1]), 5);
assert.deepEqual(m.get([[0,1],[0,1]]).valueOf(), [[1,2],[4,5]]);
assert.deepEqual(m.get([[1], math.range(1,3)]).valueOf(), [[5,6]]);
assert.deepEqual(m.get([0, math.range(1,3)]).valueOf(), [[2,3]]);
assert.deepEqual(m.get([math.range(1,3), [1]]).valueOf(), [[5],[8]]);
assert.deepEqual(m.get([math.range(1,3), 2]).valueOf(), [[6],[9]]);

// get n-dimensional
m = math.matrix([[[1,2],[3,4]], [[5,6],[7,8]]]);
assert.deepEqual(m.size(), [2,2,2]);
assert.deepEqual(m.get([[0,1],[0,1],[0,1]]).valueOf(), m.valueOf());
assert.deepEqual(m.get([0,0,0]), 1);
assert.deepEqual(m.get([[1],[1],[1]]).valueOf(), [[[8]]]);
assert.deepEqual(m.get([[1],[1],[0,1]]).valueOf(), [[[7,8]]]);
assert.deepEqual(m.get([[1],[0,1],[1]]).valueOf(), [[[6],[8]]]);

// set 1-dimensional
m = math.matrix(math.range(0,7));
m.set([[2,3]], [20,30]);
assert.deepEqual(m.size(), [7]);
assert.deepEqual(m.valueOf(), [0,1,20,30,4,5,6]);
m.set([4], 40);
assert.deepEqual(m.size(), [7]);
assert.deepEqual(m.valueOf(), [0,1,20,30,40,5,6]);

// set 2-dimensional
m = math.matrix();
m.resize([3,3]);
assert.deepEqual(m.size(), [3,3]);
assert.deepEqual(m.valueOf(), [[0,0,0],[0,0,0],[0,0,0]]);
m.set([[1,2], [1,2]], [[1,2],[3,4]]);
assert.deepEqual(m.size(), [3,3]);
assert.deepEqual(m.valueOf(), [[0,0,0],[0,1,2],[0,3,4]]);

// set 2-dimensional with resize
m = math.matrix([[123]]);
assert.deepEqual(m.size(), [1,1]);
m.set([[1,2], [1,2]], [[1,2],[3,4]]);
assert.deepEqual(m.size(), [3,3]);
assert.deepEqual(m.valueOf(), [[123,0,0],[0,1,2],[0,3,4]]);

// set resize dimensions
m = math.matrix([123]);
assert.deepEqual(m.size(), [1]);
m.set([[1,2], [1,2]], [[1,2],[3,4]]);
assert.deepEqual(m.size(), [3,3]);
assert.deepEqual(m.valueOf(), [[123,0,0],[0,1,2],[0,3,4]]);
m.set([math.range(0,2), math.range(0,2)], [[55,55],[55,55]]);
assert.deepEqual(m.size(), [3,3]);
assert.deepEqual(m.valueOf(), [[55,55,0],[55,55,2],[0,3,4]]);

m = math.matrix();
assert.deepEqual(m.size(), [0]);
m.set([[1,2], [1,2], [1,2]], [[[1,2],[3,4]],[[5,6],[7,8]]]);
assert.deepEqual(m.size(), [3,3,3]);
assert.deepEqual(m.valueOf(), [
  [
    [0,0,0],
    [0,0,0],
    [0,0,0]
  ],
  [
    [0,0,0],
    [0,1,2],
    [0,3,4]
  ],
  [
    [0,0,0],
    [0,5,6],
    [0,7,8]
  ]
]);


// test matrix.map
m = math.matrix([[1,2,3], [4,5,6]]);
m2 = m.map(function (value) {
  return value * 2;
});
assert.deepEqual(m2.size(), [2,3]);
assert.deepEqual(m2.valueOf(), [[2,4,6],[8,10,12]]);

// test matrix.indexOf
var output = [];
m.forEach(function (value, index, obj) {
  output.push(math.clone([value, index, obj === m]));
});
assert.deepEqual(output, [
  [1, [0, 0], true ],
  [2, [0, 1], true ],
  [3, [0, 2], true ],
  [4, [1, 0], true ],
  [5, [1, 1], true ],
  [6, [1, 2], true ]
]);
assert.deepEqual(m.map(function (value, index, obj) {
  return math.clone([value, index, obj === m]);
}).valueOf(), [
  [
    [1, [0, 0], true ],
    [2, [0, 1], true ],
    [3, [0, 2], true ]
  ],
  [
    [4, [1, 0], true ],
    [5, [1, 1], true ],
    [6, [1, 2], true ]
  ]
]);

// test clone
m4 = m.clone();
assert.deepEqual(m4.size(), [2,3]);
assert.deepEqual(m4.valueOf(), [[1,2,3], [4,5,6]]);

// TODO: extensively test Matrix
