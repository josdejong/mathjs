var assert = require('assert');

/**
 * Test whether two BigNumbers are equal. They are allowed to have a differing
 * configuration.
 *
 * Throws an assertion when not equal
 *
 * @param {BigNumber} a
 * @param {BigNumber} b
 */
exports.equal = function (a, b) {
  assert(a.eq(b), a + ' != ' + b);
};
