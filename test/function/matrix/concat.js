// test concat
var assert = require('assert');
var math = require('../../../math.js');

assert.deepEqual(math.concat([1,2,3], [4]), [1,2,3,4]);
assert.deepEqual(math.concat([[1],[2],[3]], [[4]], 0), [[1],[2],[3],[4]]);
assert.deepEqual(math.concat([[1]], [[2]], 1), [[1,2]]);
assert.deepEqual(math.concat([[1]], [[2]], 0), [[1],[2]]);
var a = [[1,2],[3,4]];
var b = [[5,6],[7,8]];
var c = [[9,10],[11,12]];
var ab = math.concat(a, b);
assert.deepEqual(math.size(ab), [2,4]);
assert.deepEqual(math.concat(math.matrix(a), math.matrix(b)), math.matrix([
    [1,2,5,6],
    [3,4,7,8]
]));
var ab1 = math.concat(a, b, 0);
assert.deepEqual(math.size(ab1), [4,2]);
assert.deepEqual(ab1, [
    [1,2],
    [3,4],
    [5,6],
    [7,8]
]);
var abc = math.concat(a, b, c);
assert.deepEqual(math.size(abc), [2,6]);
assert.deepEqual(abc, [
    [1,2,5,6,9,10],
    [3,4,7,8,11,12]
]);
var abc1 = math.concat(a, b, c, 0);
assert.deepEqual(math.size(abc1), [6,2]);
assert.deepEqual(abc1, [
    [1,2],
    [3,4],
    [5,6],
    [7,8],
    [9,10],
    [11,12]
]);
var d = [
    [ [1,2],  [3,4] ],
    [ [5,6],  [7,8] ]
];
var e = [
    [ [9,10], [11,12] ],
    [ [13,14], [15,16] ]
];
assert.deepEqual(math.size(d), [2,2,2]);
assert.deepEqual(math.size(e), [2,2,2]);
var de = math.concat(d,e);
assert.deepEqual(math.size(de), [2,2,4]);
assert.deepEqual(de, [
        [ [1,2,9,10],  [3,4,11,12] ],
        [ [5,6,13,14],  [7,8,15,16] ]
]);
var de1 = math.concat(d,e,0);
assert.deepEqual(math.size(de1), [4,2,2]);
assert.deepEqual(de1, [
    [ [1,2],  [3,4] ],
    [ [5,6],  [7,8] ],
    [ [9,10], [11,12] ],
    [ [13,14], [15,16] ]
]);
var de2 = math.concat(d,e,1);
assert.deepEqual(math.size(de2), [2,4,2]);
assert.deepEqual(de2, [
    [ [1,2],  [3,4], [9,10], [11,12] ],
    [ [5,6],  [7,8], [13,14], [15,16] ]
]);
