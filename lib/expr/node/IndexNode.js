var number= require('../../util/number.js'),

    Node = require('./Node.js'),
    RangeNode = require('./RangeNode.js'),
    SymbolNode = require('./SymbolNode.js'),

    Index = require('../../type/Index.js'),
    Range = require('../../type/Range.js'),

    isNumber = number.isNumber;

/**
 * @constructor IndexNode
 * get a subset of a matrix
 * @param {Object} math             The math namespace containing all functions
 * @param {Node} object
 * @param {Node[]} params
 * @param {Scope[]} paramScopes     A scope for every parameter, where the
 *                                  index variable 'end' can be defined.
 */
function IndexNode (math, object, params, paramScopes) {
  this.math = math;

  this.object = object;
  this.params = params;
  this.paramScopes = paramScopes;

  // check whether any of the params expressions uses the context symbol 'end'
  this.hasContextParams = false;
  if (params) {
    var filter = {
      type: SymbolNode,
      properties: {
        name: 'end'
      }
    };

    for (var i = 0, len = params.length; i < len; i++) {
      if (params[i].find(filter).length > 0) {
        this.hasContextParams = true;
        break;
      }
    }
  }
}

IndexNode.prototype = new Node();

/**
 * Evaluate the parameters
 * @return {*} result
 */
IndexNode.prototype.eval = function() {
  var i, len, params, results;

  // evaluate the object
  var object = this.object;
  if (object == undefined) {
    throw new Error ('Node undefined');
  }
  var obj = object.eval();

  // evaluate the values of context parameter 'end' when needed
  if (this.hasContextParams) {
    var paramScopes = this.paramScopes,
        size = this.math.size(obj).valueOf();

    if (paramScopes && size) {
      for (i = 0, len = this.params.length; i < len; i++) {
        var paramScope = paramScopes[i];
        if (paramScope) {
          paramScope.set('end', size[i]);
        }
      }
    }
  }

  // evaluate the parameters
  params = this.params;
  results = [];
  for (i = 0, len = this.params.length; i < len; i++) {
    var param = params[i];
    if (param instanceof RangeNode) {
      results[i] = param.toRange();
    }
    else {
      results[i] = param.eval();
    }

    if (!(results[i] instanceof Range) && !isNumber(results[i])) {
      throw new TypeError('Number or Range expected');
    }
  }
  // get a subset of the object
  var index = Index.create(results);
  return this.math.subset(obj, index);
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
IndexNode.prototype.find = function (filter) {
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
IndexNode.prototype.toString = function() {
  // format the parameters like "[1, 0:5]"
  var str = this.object ? this.object.toString() : '';
  if (this.params) {
    str += '[' + this.params.join(', ') + ']';
  }
  return str;
};

module.exports = IndexNode;
