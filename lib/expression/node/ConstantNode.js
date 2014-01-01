var Node = require('./Node'),
    Complex = require('../../type/Complex'),
    BigNumber = require('bignumber.js'),
    string = require('../../util/string'),
    isString = string.isString;

/**
 * @constructor ConstantNode
 * @param {String} type   Choose from 'number', 'string', 'complex', 'boolean',
 *                        'undefined', 'null'
 * @param {String} value  Value is an uninterpreted string containing the value
 * @extends {Node}
 */
function ConstantNode(type, value, math) {
  if (!isString(type)) {
    throw new TypeError('Constant type must be a string')
  }

  if (!isString(value)) {
    throw new TypeError('Constant value must be a string')
  }

  this.type = type;
  this.value = value;
  this.math = math;
}

ConstantNode.prototype = new Node();

/**
 * Evaluate the constant
 * @return {*} value
 */
ConstantNode.prototype.eval = function () {
  switch (this.type) {
    case 'number':
      if (this.math.config().number === 'bignumber') {
        return new BigNumber(this.value);
      }
      else {
        return Number(this.value);
      }

    case 'string':
      return this.value;

    case 'complex':
      return new Complex(0, Number(this.value));

    case 'boolean':
      return this.value == 'true';

    case 'undefined':
      return undefined;

    case 'null':
      return null;

    default:
      throw new TypeError('Unsupported type of constant "' + this.type + '"');
  }
};

/**
 * Compile the node to javascript code
 * @param {Object} math     math.js instance
 * @return {String} js
 * @private
 */
ConstantNode.prototype._compile = function (math) {
  switch (this.type) {
    case 'number':
      if (math.config().number === 'bignumber') {
        return 'math.bignumber("' + this.value + '")';
      }
      else {
        return this.value;
      }

    case 'string':
      return '"' + this.value + '"';

    case 'complex':
      return 'math.complex(0, ' + this.value + ')';

    case 'boolean':
      return this.value;

    case 'undefined':
      return this.value;

    case 'null':
      return this.value;

    default:
      throw new TypeError('Unsupported type of constant "' + this.type + '"');
  }
};

/**
 * Get string representation
 * @return {String} str
 */
ConstantNode.prototype.toString = function() {
  switch (this.type) {
    case 'string':
      return '"' + this.value + '"';

    case 'complex':
      return this.value + 'i';

    default:
      return this.value;
  }
};

module.exports = ConstantNode;
