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
 * @param {Object} math                 The math namespace containing all functions
 * @param {String} name                 Symbol name
 * @param {Node[] | undefined} ranges   One or more ranges
 * @param {Scope[]}  paramScopes        A scope for every parameter, where the
 *                                      index variable 'end' can be defined.
 * @param {Node} expr                   The expression defining the symbol
 * @param {Scope} scope                 Scope to store the result
 */
function UpdateNode(math, name, ranges, paramScopes, expr, scope) {
  this.math = math;
  // TODO: second parameter should be a symbol instead of the symbols name

  // TODO: remove paramScopes, scope, etc
  this.name = name;
  this.ranges = ranges;
  this.paramScopes = paramScopes;
  this.expr = expr;
  this.scope = scope;

  // TODO: remove checking for contextParams here
  // check whether any of the ranges expressions uses the context symbol 'end'
  this.hasContextParams = false;
  var filter = {
    type: SymbolNode,
    properties: {
      name: 'end'
    }
  };

  for (var i = 0, len = ranges.length; i < len; i++) {
    if (ranges[i].find(filter).length > 0) {
      this.hasContextParams = true;
      break;
    }
  }
}

UpdateNode.prototype = new Node();

/**
 * Evaluate the assignment
 * @return {*} result
 */
// TODO: cleanup
UpdateNode.prototype._eval = function() {
  if (this.expr === undefined) {
    throw new Error('Undefined symbol ' + this.name);
  }

  var result;

  // test if definition is currently undefined
  var prevResult = this.scope.get(this.name);
  if (prevResult == undefined) {
    throw new Error('Undefined symbol ' + this.name);
  }

  // evaluate the values of context parameter 'end' when needed
  if (this.hasContextParams && typeof prevResult !== 'function') {
    var paramScopes = this.paramScopes,
        size = this.math.size(prevResult).valueOf();

    if (paramScopes && size) {
      for (var i = 0, len = this.ranges.length; i < len; i++) {
        var paramScope = paramScopes[i];
        if (paramScope) {
          paramScope.set('end', size[i]);
        }
      }
    }
  }

  // change part of a matrix, for example "a=[]", "a(2,3)=4.5"
  var paramResults = [];
  this.ranges.forEach(function (param) {
    var result;

    if (param instanceof RangeNode) {
      result = param.toRange();
    }
    else {
      result = param.eval();
    }

    // convert big number to number
    if (result instanceof BigNumber) result = toNumber(result);

    // TODO: implement support for BigNumber

    // change from one-based to zero-based range
    if (result instanceof Range) {
      result.start --;
      result.end --;
    }
    else if (isNumber(result)) {
      // number
      result--;
    }
    else {
      throw new TypeError('Number or Range expected');
    }

    paramResults.push(result);
  });

  // evaluate the expression
  var exprResult = this.expr.eval();

  // replace subset
  var index = Index.create(paramResults);
  result = this.math.subset(prevResult, index, exprResult);

  this.scope.set(this.name, result);

  return result;
};

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
UpdateNode.prototype._compile = function (defs) {
  // TODO: symbol and index must be created during parsing
  var symbol = new SymbolNode(this.name);
  var index = new IndexNode(defs.math, symbol, this.ranges);

  return 'scope["' + this.name + '\"] = ' +
      index.compileSubset(defs,  this.expr._compile(defs));
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
  var str = '';

  str += this.name;
  if (this.ranges && this.ranges.length) {
    str += '[' + this.ranges.join(', ') + ']';
  }
  str += ' = ';
  str += this.expr.toString();

  return str;
};

module.exports = UpdateNode;
