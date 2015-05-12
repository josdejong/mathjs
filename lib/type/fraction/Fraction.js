var Fraction = require('fraction.js');

/**
 * Attach type information
 */
Fraction.prototype.type = 'Fraction';
Fraction.prototype.isFraction = true;

/**
 * Get the primitive value of a Fraction, a number
 * @return {number} Returns a number
 */
// TODO: remove this when Fraction.js supports this itself.
Fraction.prototype.valueOf = function () {
  return this.toNumber();
};

// TODO: implement toJSON and fromJSON for Fraction


function factory (type, config, load, typed) {
  return Fraction;
}

exports.name = 'Fraction';
exports.path = 'type';
exports.factory = factory;
