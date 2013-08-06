var math = require('../../math.js'),
    Node = require('./Node.js').Node,
    SymbolNode = require('./SymbolNode.js').SymbolNode;

/**
 * @constructor UpdateNode
 * Update a symbol value, like a(2,3) = 4.5
 *
 * @param {String} name                 Symbol name
 * @param {Node[] | undefined} params   One or more parameters
 * @param {Scope[]}  paramScopes        A scope for every parameter, where the
 *                                      index variable 'end' can be defined.
 * @param {Node} expr                   The expression defining the symbol
 * @param {Scope} scope                 Scope to store the result
 */
function UpdateNode(name, params, paramScopes, expr, scope) {
  this.name = name;
  this.params = params;
  this.paramScopes = paramScopes;
  this.expr = expr;
  this.scope = scope;

  // check whether any of the params expressions uses the context symbol 'end'
  this.hasContextParams = false;
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

UpdateNode.prototype = new Node();

/**
 * Evaluate the assignment
 * @return {*} result
 */
UpdateNode.prototype.eval = function() {
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
  if (this.hasContextParams) {
    var paramScopes = this.paramScopes,
        size;
    if (prevResult.size) {
      size = prevResult.size(); // matrix
    }
    else if (prevResult.length !== undefined) {
      size = [prevResult.length];  // string
    }
    else {
      size = [];  // scalar
    }

    if (paramScopes && size) {
      for (var i = 0, len = this.params.length; i < len; i++) {
        var paramScope = paramScopes[i];
        if (paramScope) {
          paramScope.set('end', size[i] - 1);
        }
      }
    }
  }

  // change part of a matrix, for example "a=[]", "a(2,3)=4.5"
  var paramResults = [];
  this.params.forEach(function (param) {
    paramResults.push(param.eval());
  });

  var exprResult = this.expr.eval();

  // replace subset
  result = math.subset(prevResult, paramResults, exprResult);

  this.scope.set(this.name, result);

  return result;
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
UpdateNode.prototype.find = function (filter) {
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
  if (this.params && this.params.length) {
    str += '(' + this.params.join(', ') + ')';
  }
  str += ' = ';
  str += this.expr.toString();

  return str;
};

exports.UpdateNode = UpdateNode;
