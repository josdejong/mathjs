var number= require('../../util/number.js'),

    Node = require('./Node.js'),
    RangeNode = require('./RangeNode.js'),
    SymbolNode = require('./SymbolNode.js'),

    BigNumber = require('bignumber.js'),
    Index = require('../../type/Index.js'),
    Range = require('../../type/Range.js'),

    isNumber = number.isNumber,
    toNumber = number.toNumber;

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

    results[i] = result;
  }

  // get a subset of the object
  var index = Index.create(results);
  return this.math.subset(obj, index);
};

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
IndexNode.prototype._compile = function (defs) {
  // check whether any of the ranges expressions uses the context symbol 'end'
  var filter = {
    type: SymbolNode,
    properties: {
      name: 'end'
    }
  };
  var rangesUseEnd = this.ranges.map(function (range) {
    return range.find(filter).length > 0;
  });

  // TODO: implement support for bignumber (currently bignumbers are silently
  //       reduced to numbers when changing the value to zero-based)

  // TODO: Optimization: when the range values are ConstantNodes,
  //       we can beforehand resolve the zero-based value

  var ranges = this.ranges.map(function(range, i) {
    var useEnd = rangesUseEnd[i];
    if (range instanceof RangeNode) {
      if (useEnd) {
        // resolve end and create range (change from one based to zero based)
        return '(function (scope) {' +
            '  scope = Object.create(scope); ' +
            '  scope["end"] = size[' + i + '];' +
            '  var step = ' + (range.step ? range.step._compile(defs) : '1') + ';' +
            '  return [' +
            '    ' + range.start._compile(defs) + ' - 1, ' +
            '    ' + range.end._compile(defs) + ' - (step > 0 ? 0 : 2), ' +
            '    step' +
            '  ];' +
            '})(scope)';
      }
      else {
        // create range (change from one based to zero based)
        return '(function () {' +
            '  var step = ' + (range.step ? range.step._compile(defs) : '1') + ';' +
            '  return [' +
            '    ' + range.start._compile(defs) + ' - 1, ' +
            '    ' + range.end._compile(defs) + ' - (step > 0 ? 0 : 2), ' +
            '    step' +
            '  ];' +
            '})()';
      }
    }
    else {
      if (useEnd) {
        // resolve the parameter 'end', adjust the index value to zero-based
        return '(function (scope) {' +
            '  scope = Object.create(scope); ' +
            '  scope["end"] = size[' + i + '];' +
            '  return ' + range._compile(defs) + ' - 1;' +
            '})(scope)'
      }
      else {
        // just evaluate the expression, and change from one-based to zero-based
        return range._compile(defs) + ' - 1';
      }
    }
  });

  // if some
  var someUseEnd = ranges.some(function (useEnd) {
    return useEnd;
  });
  if (someUseEnd) {
    return '(function () {' +
        '  var size = math.size(' + this.symbol._compile(defs) + ').valueOf();' +
        '  return math.index(' + ranges.join(', ') + ');' +
        '})()';
  }
  else {
    return 'math.index(' + ranges.join(', ') + ')';
  }
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