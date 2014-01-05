var number = require('../../util/number'),
    Node = require('./Node'),
    SymbolNode = require('./SymbolNode'),
    RangeNode = require('./RangeNode'),

    BigNumber = require('bignumber.js'),
    Range = require('../../type/Range'),
    Matrix = require('../../type/Matrix'),

    toNumber = number.toNumber;

/**
 * @constructor IndexNode
 * @extends {Node}
 * An index contains a set of ranges
 * @param {SymbolNode} symbol    The symbol to which the IndexNode is applied
 * @param {RangeNode[]} ranges
 */
function IndexNode (symbol, ranges) {
  this.symbol = symbol;
  this.ranges = ranges;
}

IndexNode.prototype = new Node();

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
 * @param {Object} filter  See Node.find for a description of the filter settings
 * @returns {Node[]} nodes
 */
IndexNode.prototype.find = function (filter) {
  var nodes = [];

  // check itself
  if (this.match(filter)) {
    nodes.push(this);
  }

  // search in parameters
  if (this.start) {
    nodes = nodes.concat(this.start.find(filter));
  }
  if (this.step) {
    nodes = nodes.concat(this.step.find(filter));
  }
  if (this.end) {
    nodes = nodes.concat(this.end.find(filter));
  }

  return nodes;
};

/**
 * Get string representation
 * @return {String} str
 */
IndexNode.prototype.toString = function() {
  // format the range like "start:step:end"
  var str = this.start.toString();
  if (this.step) {
    str += ':' + this.step.toString();
  }
  str += ':' + this.end.toString();

  return str;
};

module.exports = IndexNode;
