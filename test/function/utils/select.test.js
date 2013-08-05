// test select (chaining of operations)
var assert = require('assert'),
    approx = require('../../../tools/approx.js'),
    math = require('../../../src/index.js');

assert.ok(math.select(45) instanceof math.type.Selector);
assert.equal(math.select(3).add(4).subtract(2).done(), 5);
assert.deepEqual(math.select(math.matrix([[1,2],[3,4]]))
    .set([0,0], 8)
    .multiply(3).done(), math.matrix([[24, 6], [9, 12]]));
assert.deepEqual(math.select([[1,2],[3,4]])
    .set([0,0], 8)
    .multiply(3).done(), [[24, 6], [9, 12]]);
assert.deepEqual(math.select().i.multiply(2).add(3).done(), math.complex(3, 2));
assert.deepEqual(math.select().pi.divide(4).sin().pow(2).format().done(), 0.5);

// test with some special inputs
assert.equal(math.select(0).add(3).done(), 3);
assert.equal(math.select(null).add('').done(), 'null');
approx.equal(math.select().pi.done(), Math.PI);
assert.throws(function () {math.select().add(2).done()}, TypeError);
assert.throws(function () {math.select(undefined).add(2).done()}, TypeError);
