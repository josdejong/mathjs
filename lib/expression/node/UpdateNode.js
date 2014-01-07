var number= require('../../util/number'),

    Node = require('./Node'),
    RangeNode = require('./RangeNode'),
    IndexNode = require('./IndexNode'),
    SymbolNode = require('./SymbolNode'),

    BigNumber = require('bignumber.js'),
    Index = require('../../type/Index'),
    Range = require('../../type/Range'),

    isNumber = number.isNumber,
    toNumber = number.toNumber;

/**
 * @constructor UpdateNode
 * @extends {Node}
 * Update a symbol value, like a(2,3) = 4.5
 *
 * @param {IndexNode} index             IndexNode containing symbol and ranges
 * @param {Node} expr                   The expression defining the symbol
 */
function UpdateNode(index, expr) {
  if (!(index instanceof IndexNode)) {
    throw new TypeError('index mus be an IndexNode');
  }

  this.index = index;
  this.expr = expr;
}

UpdateNode.prototype = new Node();

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
UpdateNode.prototype._compile = function (defs) {
  return 'scope["' + this.index.objectName() + '\"] = ' +
      this.index.compileSubset(defs,  this.expr._compile(defs));
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter settings
 * @returns {Node[]} nodes
 */
UpdateNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in parameters
  var ranges = this.ranges;
  if (ranges) {
    for (var i = 0, len = ranges.length; i < len; i++) {
      nodes = nodes.concat(ranges[i].find(filter));
    }
  }

  // search in expression
  if (this.expr) {
    nodes = nodes.concat(this.expr.find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String}
 */
UpdateNode.prototype.toString = function() {
  return this.index.toString() + ' = ' + this.expr.toString();
};

module.exports = UpdateNode;
