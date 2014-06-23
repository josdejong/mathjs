var Node = require('./Node'),
    BigNumber = require('decimal.js'),
    Complex = require('../../type/Complex'),
    type = require('../../util/types').type,
    isString = require('../../util/string').isString;

/**
 * @constructor ConstantNode
 * @extends {Node}
 * @param {String | Number | Boolean | null | undefined} value
 *                            When valueType is provided, value must contain
 *                            an uninterpreted string representing the value.
 *                            When valueType is undefined, value can be a
 *                            number, string, boolean, null, or undefined, and
 *                            the type will be determined automatically.
 * @param {String} [valueType]  The type of value. Choose from 'number', 'string',
 *                              'complex', 'boolean', 'undefined', 'null'
 */
function ConstantNode(value, valueType) {
  if (!(this instanceof ConstantNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  if (valueType) {
    if (!isString(valueType)) {
      throw new TypeError('String expected for parameter "valueType"');
    }
    if (!isString(value)){
      throw new TypeError('String expected for parameter "value"');
    }

    this.value = value;
    this.valueType = valueType;
  }
  else {
    // stringify the value and determine the type
    valueType = type(value);
    if (['number', 'string', 'boolean', 'undefined', 'null'].indexOf(valueType) !== -1) {
      this.value = value + '';
      this.valueType = valueType;
    }
    else {
      throw new TypeError('Unsupported type of value');
    }
  }
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
        // TODO: is this redundant?
        return this.value.replace(/^(0*)[0-9]/, function (match, zeros) {
          return match.substring(zeros.length);
        });
      }

    case 'string':
      return '"' + this.value + '"';

    case 'complex':
        // TODO: make this redundant, replace with an implicit multiplication.
      return 'math.complex(0, ' + this.value + ')';

    case 'boolean':
      return this.value;

    case 'undefined':
      return this.value;

    case 'null':
      return this.value;

    default:
        // TODO: move this error to the constructor?
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
