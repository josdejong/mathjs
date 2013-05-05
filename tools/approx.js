var assert = require('assert'),
    math = require('../math');

var epsilon = 0.0001; // TODO: compare difference

/**
 * Test whether two numbers are equal when rounded to 5 decimals
 * @param {Number} a
 * @param {Number} b
 */
exports.equal = function equal(a, b) {
    assert.equal(math.round(a, 5), math.round(b, 5));
};

/**
 * Test whether all numbers in two objects objects are equal when rounded
 * to 5 decimals
 * @param {*} a
 * @param {*} b
 */
exports.deepEqual = function equal(a, b) {
    assert.deepEqual(math.round(a, 5), math.round(b, 5));
};
