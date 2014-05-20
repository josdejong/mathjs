var Node = require('./Node'),
    string = require('../../util/string'),
    isString = string.isString;

/**
 * @constructor ConstantNode
 * @extends {Node}
 * @param {String} valueType  The type of value. Choose from 'number', 'string',
 *                            'complex', 'boolean', 'undefined', 'null'
 * @param {String} value      An uninterpreted string containing the value
 */
function ConstantNode(valueType, value) {
  if (!(this instanceof ConstantNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  if (!isString(valueType)) throw new TypeError('String expected for parameter "type"');
  if (!isString(value))     throw new TypeError('String expected for parameter "value"');

  this.valueType = valueType;
  this.value = value;
}

ConstantNode.prototype = new Node();

ConstantNode.prototype.type = 'ConstantNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
ConstantNode.prototype._compile = function (defs) {
  switch (this.valueType) {
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
      throw new TypeError('Unsupported type of constant "' + this.valueType + '"');
  }
};

/**
 * Get string representation
 * @return {String} str
 */
ConstantNode.prototype.toString = function() {
  switch (this.valueType) {
    case 'string':
      return '"' + this.value + '"';

    case 'complex':
      return this.value + 'i';

    default:
      return this.value;
  }
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
ConstantNode.prototype.toTex = function() {
  var value = this.value,
      index;
  switch (this.valueType) {
    case 'string':
      return '\\text{' + value + '}';

    case 'complex':
      return value + 'i';

    case 'number':
      index = value.toLowerCase().indexOf('e');
      if (index !== -1) {
        return value.substring(0, index) + ' \\cdot 10^{' +
            value.substring(index + 1) + '}';
      }
      return value;

    default:
      return value;
  }
};

module.exports = ConstantNode;
