var Node = require('./Node'),
    Complex = require('../../type/Complex'),
    BigNumber = require('bignumber.js'),
    string = require('../../util/string'),
    isString = string.isString;

/**
 * @constructor ConstantNode
 * @extends {Node}
 * @param {String} type   Choose from 'number', 'string', 'complex', 'boolean',
 *                        'undefined', 'null'
 * @param {String} value  Value is an uninterpreted string containing the value
 */
function ConstantNode(type, value) {
  if (!isString(type)) {
    throw new TypeError('Constant type must be a string')
  }

  if (!isString(value)) {
    throw new TypeError('Constant value must be a string')
  }

  this.type = type;
  this.value = value;
}

ConstantNode.prototype = new Node();

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
ConstantNode.prototype._compile = function (defs) {
  switch (this.type) {
    case 'number':
      if (defs.math.config().number === 'bignumber') {
        return 'math.bignumber("' + this.value + '")';
      }
      else {
        // remove leading zeros like '003.2'
        return this.value.replace(/^(0*)[0-9]/, function (match, zeros) {
          return match.substring(zeros.length);
        });
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
