var Node = require('./Node.js');

/**
 * @constructor OperatorNode
 * An operator with two arguments, like 2+3
 * @param {String} name     Function name, for example '+'
 * @param {function} fn     Function, for example math.add
 * @param {Node[]} params   Parameters
 */
function OperatorNode (name, fn, params) {
  this.name = name;
  this.fn = fn;
  this.params = params;
}

OperatorNode.prototype = new Node();

/**
 * Evaluate the parameters
 * @return {*} result
 */
OperatorNode.prototype.eval = function() {
  return this.fn.apply(this, this.params.map(function (param) {
    return param.eval();
  }));
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
OperatorNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
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
OperatorNode.prototype.toString = function() {
  var params = this.params;

  switch (params.length) {
    case 1:
      if (this.name == '-') {
        // special case: unary minus
        return '-' + params[0].toString();
      }
      else {
        // for example '5!'
        return params[0].toString() + this.name;
      }

    case 2: // for example '2+3'
      var lhs = params[0].toString();
      if (params[0] instanceof OperatorNode) {
        lhs = '(' + lhs + ')';
      }
      var rhs = params[1].toString();
      if (params[1] instanceof OperatorNode) {
        rhs = '(' + rhs + ')';
      }
      return lhs + ' ' + this.name + ' ' + rhs;

    default: // this should occur. format as a function call
      return this.name + '(' + this.params.join(', ') + ')';
  }
};

module.exports = OperatorNode;
