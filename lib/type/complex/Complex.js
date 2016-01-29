var Complex = require('complex.js');

/**
 * Attach type information
 */
Complex.prototype.type = 'Complex';
Complex.prototype.isComplex = true;


/**
 * Get a JSON representation of the complex number
 * @returns {Object} Returns a JSON object structured as:
 *                   `{"mathjs": "Complex", "re": 2, "im": 3}`
 */
Complex.prototype.toJSON = function () {
  return {
    mathjs: 'Complex',
    re: this.re,
    im: this.im
  };
};

/*
 * Return the value of the complex number in polar notation
 * The angle phi will be set in the interval of [-pi, pi].
 * @return {{r: number, phi: number}} Returns and object with properties r and phi.
 */
Complex.prototype.toPolar = function () {
  return {
    r: this.abs(),
    phi: this.arg()
  };
};

/**
 * Create a Complex number from a JSON object
 * @param {Object} json  A JSON Object structured as
 *                       {"mathjs": "Complex", "re": 2, "im": 3}
 *                       All properties are optional, default values
 *                       for `re` and `im` are 0.
 * @return {Complex} Returns a new Complex number
 */
Complex.fromJSON = function (json) {
  return new Complex(json);
};

function factory (type, config, load, typed) {
  return Complex;
}

exports.name = 'Complex';
exports.path = 'type';
exports.factory = factory;
