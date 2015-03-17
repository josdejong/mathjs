'use strict';

var Node = require('./Node');
var BigNumber = require('../../type/BigNumber');
var type = require('../../util/types').type;
var isString = require('../../util/string').isString;

/**
 * A ConstantNode holds a constant value like a number or string. A ConstantNode
 * stores a stringified version of the value and uses this to compile to
 * JavaScript.
 *
 * In case of a stringified number as input, this may be compiled to a BigNumber
 * when the math instance is configured for BigNumbers.
 *
 * Usage:
 *
 *     // stringified values with type
 *     new ConstantNode('2.3', 'number');
 *     new ConstantNode('true', 'boolean');
 *     new ConstantNode('hello', 'string');
 *
 *     // non-stringified values, type will be automatically detected
 *     new ConstantNode(2.3);
 *     new ConstantNode('hello');
 *
 * @param {String | Number | Boolean | null | undefined} value
 *                            When valueType is provided, value must contain
 *                            an uninterpreted string representing the value.
 *                            When valueType is undefined, value can be a
 *                            number, string, boolean, null, or undefined, and
 *                            the type will be determined automatically.
 * @param {String} [valueType]  The type of value. Choose from 'number', 'string',
 *                              'boolean', 'undefined', 'null'
 * @constructor ConstantNode
 * @extends {Node}
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
    this.value = value + '';
    this.valueType = type(value);
  }

  if (!SUPPORTED_TYPES[this.valueType]) {
    throw new TypeError('Unsupported type of value "' + this.valueType + '"');
  }
}

var SUPPORTED_TYPES = {
  'number': true,
  'string': true,
  'boolean': true,
  'undefined': true,
  'null': true
};

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
        // remove leading zeros like '003.2' which are not allowed by JavaScript
        return this.value.replace(/^(0*)[0-9]/, function (match, zeros) {
          return match.substring(zeros.length);
        });
      }

    case 'string':
      return '"' + this.value + '"';

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
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
ConstantNode.prototype.forEach = function (callback) {
  // nothing to do, we don't have childs
};


/**
 * Create a new ConstantNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node) : Node} callback
 * @returns {ConstantNode} Returns a clone of the node
 */
ConstantNode.prototype.map = function (callback) {
  return this.clone();
};

/**
 * Create a clone of this node, a shallow copy
 * @return {ConstantNode}
 */
ConstantNode.prototype.clone = function() {
  return new ConstantNode(this.value, this.valueType);
};

/**
 * Get string representation
 * @return {String} str
 */
ConstantNode.prototype.toString = function() {
  switch (this.valueType) {
    case 'string':
      return '"' + this.value + '"';

    default:
      return this.value;
  }
};

/**
 * Get LaTeX representation
 * @param {Object|function} callback(s)
 * @return {String} str
 */
ConstantNode.prototype._toTex = function(callbacks) {
  var value = this.value,
      index;
  switch (this.valueType) {
    case 'string':
      return '\\text{' + value + '}';

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
