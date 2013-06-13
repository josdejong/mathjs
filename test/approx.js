// test approx itself...
var assert = require('assert'),
    approx = require('../tools/approx.js');

// positive values
approx.equal(1/3, 0.33333333);
approx.equal(2, 2.000001);
approx.equal(2, 1.999999);
assert.throws(function () {approx.equal(2, 2.001)}, assert.AssertionError);
assert.throws(function () {approx.equal(2, 1.999)}, assert.AssertionError);

// negative values
approx.equal(-2, -2.000001);
approx.equal(-2, -1.999999);
assert.throws(function () {approx.equal(-2, -2.001)}, assert.AssertionError);
assert.throws(function () {approx.equal(-2, -1.999)}, assert.AssertionError);

// very large values
approx.equal(2e100, 2.000001e100);
approx.equal(2e100, 1.999999e100);
assert.throws(function () {approx.equal(2e100, 2.001e100)}, assert.AssertionError);
assert.throws(function () {approx.equal(2e100, 1.999e100)}, assert.AssertionError);

// very small values
approx.equal(2e-100, 2.000001e-100);
approx.equal(2e-100, 1.999999e-100);
assert.throws(function () {approx.equal(2e-100, 2.001e-100)}, assert.AssertionError);
assert.throws(function () {approx.equal(2e-100, 1.999e-100)}, assert.AssertionError);

// NaN values
var a = NaN;
var b = NaN;
approx.equal(a, b);
assert.throws(function () {approx.equal(NaN, 3)}, assert.AssertionError);
assert.throws(function () {approx.equal(NaN, 'nonumber')}, assert.AssertionError);

// zero as one of the two values
approx.equal(0, 1e-15);
assert.throws(function () {approx.equal(0, 0.001)}, assert.AssertionError);

// test approx.deepEqual
approx.deepEqual({
    a: [1, 2, 3],
    b: [{c:4, d:5}]
}, {
    a: [1.000001, 1.99999999, 3.000005],
    b: [{c:3.999999981, d:5.0000023}]
});
assert.throws(function () {approx.deepEqual({
    a: [1, 2, 3],
    b: [{c:4, d:5}]
}, {
    a: [1.000001, 1.99999999, 3.000005],
    b: [{c:3.1, d:5.0000023}]
})}, assert.AssertionError);
assert.throws(function () {approx.deepEqual({
    a: [1, 2, 3],
    b: [{c:4, d:5}]
}, {
    a: [1.001, 1.99999999, 3.000005],
    b: [{c:3, d:5.0000023}]
})}, assert.AssertionError);


