'use strict';

var Node = require('./Node.js');
var RangeNode = require('./RangeNode');
var SymbolNode = require('./SymbolNode');

var BigNumber = require('decimal.js');
var Range = require('../../type/Range');

var isNode = Node.isNode;
var isArray = Array.isArray;

/**
 * @constructor IndexNode
 * @extends Node
 *
 * get a subset of a matrix
 *
 * @param {Node} object
 * @param {Node[]} ranges
 */
function IndexNode (object, ranges) {
  if (!(this instanceof IndexNode)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // validate input
  if (!(object instanceof Node)) throw new TypeError('Node expected for parameter "object"');
  if (!isArray(ranges) || !ranges.every(isNode)) {
    throw new TypeError('Array containing Nodes expected for parameter "ranges"');
  }

  this.object = object;
  this.ranges = ranges;
}

IndexNode.prototype = new Node();

IndexNode.prototype.type = 'IndexNode';

/**
 * Compile the node to javascript code
 * @param {Object} defs     Object which can be used to define functions
 *                          or constants globally available for the compiled
 *                          expression
 * @return {String} js
 * @private
 */
IndexNode.prototype._compile = function (defs) {
  return this.compileSubset(defs);
};

/**
 * Compile the node to javascript code
 * @param {Object} defs           Object which can be used to define functions
 *                                or constants globally available for the
 *                                compiled expression
 * @param {String} [replacement]  If provided, the function returns
 *                                  "math.subset(obj, math.index(...), replacement)"
 *                                Else, the function returns
 *                                  "math.subset(obj, math.index(...))"
 * @return {String} js
 * @returns {string}
 */
IndexNode.prototype.compileSubset = function(defs, replacement) {
  // check whether any of the ranges expressions uses the context symbol 'end'
  function test(node) {
    return (node instanceof SymbolNode) && (node.name == 'end');
  }

  var someUseEnd = false;
  var rangesUseEnd = this.ranges.map(function (range) {
    var useEnd = range.filter(test).length > 0;
    someUseEnd = useEnd ? useEnd : someUseEnd;
    return useEnd;
  });

  // create a Range from start, step and end
  defs.range = function (start, end, step) {
    return new Range(
            start instanceof BigNumber ? start.toNumber() : start,
            end instanceof BigNumber ? end.toNumber() : end,
            step instanceof BigNumber ? step.toNumber() : step
    );
  };

  // TODO: implement support for bignumber (currently bignumbers are silently
  //       reduced to numbers when changing the value to zero-based)

  // TODO: Optimization: when the range values are ConstantNodes,
  //       we can beforehand resolve the zero-based value

  var ranges = this.ranges.map(function(range, i) {
    var useEnd = rangesUseEnd[i];
    if (range instanceof RangeNode) {
      if (useEnd) {
        // resolve end and create range
        return '(function (scope) {' +
            '  scope = Object.create(scope); ' +
            '  scope["end"] = size[' + i + '];' +
            '  return range(' +
            '    ' + range.start._compile(defs) + ', ' +
            '    ' + range.end._compile(defs) + ', ' +
            '    ' + (range.step ? range.step._compile(defs) : '1') +
            '  );' +
            '})(scope)';
      }
      else {
        // create range
        return 'range(' +
            range.start._compile(defs) + ', ' +
            range.end._compile(defs) + ', ' +
            (range.step ? range.step._compile(defs) : '1') +
            ')';
      }
    }
    else {
      if (useEnd) {
        // resolve the parameter 'end'
        return '(function (scope) {' +
            '  scope = Object.create(scope); ' +
            '  scope["end"] = size[' + i + '];' +
            '  return ' + range._compile(defs) + ';' +
            '})(scope)'
      }
      else {
        // just evaluate the expression
        return range._compile(defs);
      }
    }
  });

  // if some parameters use the 'end' parameter, we need to calculate the size
  if (someUseEnd) {
    return '(function () {' +
        '  var obj = ' + this.object._compile(defs) + ';' +
        '  var size = math.size(obj).valueOf();' +
        '  return math.subset(' +
        '    obj, ' +
        '    math.index(' + ranges.join(', ') + ')' +
        '    ' + (replacement ? (', ' + replacement) : '') +
        '  );' +
        '})()';
  }
  else {
    return 'math.subset(' +
        this.object._compile(defs) + ',' +
        'math.index(' + ranges.join(', ') + ')' +
        (replacement ? (', ' + replacement) : '') +
        ')';
  }
};

/**
 * Execute a callback for each of the child nodes of this node
 * @param {function(child: Node, path: string, parent: Node)} callback
 */
IndexNode.prototype.forEach = function (callback) {
  // object
  callback(this.object, 'object', this);

  // ranges
  for (var i = 0; i < this.ranges.length; i++) {
    callback(this.ranges[i], 'ranges[' + i + ']', this);
  }
};

/**
 * Create a new IndexNode having it's childs be the results of calling
 * the provided callback function for each of the childs of the original node.
 * @param {function(child: Node, path: string, parent: Node): Node} callback
 * @returns {IndexNode} Returns a transformed copy of the node
 */
IndexNode.prototype.map = function (callback) {
  var object = this._ifNode(callback(this.object, 'object', this));

  var ranges = [];
  for (var i = 0; i < this.ranges.length; i++) {
    ranges[i] = this._ifNode(callback(this.ranges[i], 'ranges[' + i + ']', this));
  }

  return new IndexNode(object, ranges);
};

/**
 * Get the name of the object linked to this IndexNode
 * @return {string} name
 */
IndexNode.prototype.objectName = function() {
  return this.object.name;
};

/**
 * Create a clone of this node, a shallow copy
 * @return {IndexNode}
 */
IndexNode.prototype.clone = function() {
  return new IndexNode(this.object, this.ranges.slice(0));
};

/**
 * Get string representation
 * @return {String} str
 */
IndexNode.prototype.toString = function() {
  // format the parameters like "[1, 0:5]"
  return this.object.toString() + '[' + this.ranges.join(', ') + ']';
};

/**
 * Get LaTeX representation
 * @return {String} str
 */
IndexNode.prototype.toTex = function() {
  return this.object.toTex() + '[' + this.ranges.join(', ') + ']';
};

module.exports = IndexNode;