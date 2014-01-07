var number= require('../../util/number'),

    Node = require('./Node'),
    RangeNode = require('./RangeNode'),
    SymbolNode = require('./SymbolNode'),

    BigNumber = require('bignumber.js'),
    Index = require('../../type/Index'),
    Range = require('../../type/Range'),

    isNumber = number.isNumber,
    toNumber = number.toNumber;

/**
 * @constructor ParamsNode
 * @extends {Node}
 * invoke a list with parameters on a node
 * @param {Node} object
 * @param {Node[]} params
 */
function ParamsNode (object, params) {
  this.object = object;
  this.params = params;
}

ParamsNode.prototype = new Node();

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
ParamsNode.prototype._compile = function (defs) {
  // TODO: implement support for matrix indexes and ranges
  var params = this.params.map(function (param) {
    return param._compile(defs);
  });

  return this.object._compile(defs) + '(' + params.join(', ') + ')';
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter settings
 * @returns {Node[]} nodes
 */
ParamsNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search object
  if (this.object) {
    nodes = nodes.concat(this.object.find(filter));
  }

  // search in parameters
  var params = this.params;
  if (params) {
    for (var i = 0, len = params.length; i < len; i++) {
      nodes = nodes.concat(params[i].find(filter));
    }
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
ParamsNode.prototype.toString = function() {
  // format the parameters like "(2, 4.2)"
  var str = this.object ? this.object.toString() : '';
  if (this.params) {
    str += '(' + this.params.join(', ') + ')';
  }
  return str;
};

module.exports = ParamsNode;
