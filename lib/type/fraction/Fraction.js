var Fraction = require('fraction.js');

/**
 * Attach type information
 */
Fraction.prototype.type = 'Fraction';
Fraction.prototype.isFraction = true;

// TODO: implement toJSON and fromJSON for Fraction


function factory (type, config, load, typed) {
  return Fraction;
}

exports.name = 'Fraction';
exports.path = 'type';
exports.factory = factory;
