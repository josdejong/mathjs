/**
 * Math2 test
 */

var assert = require('assert');
// var nodeunit = require('nodeunit'); // TODO: use nodeunit
var math2 = require('../math2.js');


assert.equal(typeof math2, 'object');


var complex1 = new math2.type.Complex(3, -4);
assert.equal(complex1.toString(), '3 - 4i');

/**
 * Test sqrt
 */
assert.equal(math2.sqrt(25), 5);
assert.equal(math2.sqrt(complex1).toString(), '2 - i');
assert.equal(math2.sqrt(-4).toString(), '2i');
