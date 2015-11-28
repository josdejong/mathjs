'use strict';

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));
  var RangeNode = load(require('./RangeNode'));
  var SymbolNode = load(require('./SymbolNode'));

  var Range = load(require('../../type/matrix/Range'));

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
  function IndexNode(object, ranges) {
    if (!(this instanceof IndexNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (!(object && object.isNode)) throw new TypeError('Node expected for parameter "object"');
    if (!isArray(ranges)
        || !ranges.every(function (range) {return range && range.isNode;})) {
      throw new TypeError('Array containing Nodes expected for parameter "ranges"');
    }

    this.object = object;
    this.ranges = ranges;
  }

  IndexNode.prototype = new Node();

  IndexNode.prototype.type = 'IndexNode';

  IndexNode.prototype.isIndexNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  IndexNode.prototype._compile = function (defs, args) {
    return this.compileSubset(defs, args);
  };

  /**
   * Compile the node to javascript code
   * @param {Object} defs           Object which can be used to define functions
   *                                or constants globally available for the
   *                                compiled expression
   * @param {Object} args           Object with local function arguments, the key is
   *                                the name of the argument, and the value is `true`.
   *                                The object may not be mutated, but must be
   *                                extended instead.
   * @param {string} [replacement]  If provided, the function returns
   *                                  "math.subset(obj, math.index(...), replacement)"
   *                                Else, the function returns
   *                                  "math.subset(obj, math.index(...))"
   * @return {string} js
   * @returns {string}
   */
  IndexNode.prototype.compileSubset = function (defs, args, replacement) {
    // check whether any of the ranges expressions uses the context symbol 'end'
    function test(node) {
      return (node && node.isSymbolNode) && (node.name == 'end');
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
          (start && start.isBigNumber === true) ? start.toNumber() : start,
          (end   && end.isBigNumber === true)   ? end.toNumber()   : end,
          (step  && step.isBigNumber === true)  ? step.toNumber()  : step
      );
    };

    var childArgs = Object.create(args);

    // TODO: implement support for bignumber (currently bignumbers are silently
    //       reduced to numbers when changing the value to zero-based)

    // TODO: Optimization: when the range values are ConstantNodes,
    //       we can beforehand resolve the zero-based value

    var ranges = this.ranges.map(function (range, i) {
      var useEnd = rangesUseEnd[i];
      if (range && range.isRangeNode) {
        if (useEnd) {
          childArgs.end = true;

          // resolve end and create range
          return '(function () {' +
              '  var end = size[' + i + '];' +
              '  return range(' +
              '    ' + range.start._compile(defs, childArgs) + ', ' +
              '    ' + range.end._compile(defs, childArgs) + ', ' +
              '    ' + (range.step ? range.step._compile(defs, childArgs) : '1') +
              '  );' +
              '})()';
        }
        else {
          // create range
          return 'range(' +
              range.start._compile(defs, childArgs) + ', ' +
              range.end._compile(defs, childArgs) + ', ' +
              (range.step ? range.step._compile(defs, childArgs) : '1') +
              ')';
        }
      }
      else {
        if (useEnd) {
          childArgs.end = true;

          // resolve the parameter 'end'
          return '(function () {' +
              '  var end = size[' + i + '];' +
              '  return ' + range._compile(defs, childArgs) + ';' +
              '})()'
        }
        else {
          // just evaluate the expression
          return range._compile(defs, childArgs);
        }
      }
    });

    // if some parameters use the 'end' parameter, we need to calculate the size
    if (someUseEnd) {
      return '(function () {' +
          '  var obj = ' + this.object._compile(defs, childArgs) + ';' +
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
          this.object._compile(defs, childArgs) + ',' +
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
  IndexNode.prototype.objectName = function () {
    return this.object.name;
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {IndexNode}
   */
  IndexNode.prototype.clone = function () {
    return new IndexNode(this.object, this.ranges.slice(0));
  };

  /**
   * Is parenthesis needed?
   * @private
   */
  function needParenthesis(node) {
    switch (node.object.type) {
      case 'ArrayNode':
      case 'ConstantNode': //TODO don't know if this one makes sense
      case 'SymbolNode':
      case 'ParenthesisNode':
        //those nodes don't need parentheses within an index node
        return false;
      default:
        return true;
    }
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype._toString = function (options) {
    var object = this.object.toString(options);
    if (needParenthesis(this)) {
      object = '(' + object + '(';
    }
    // format the parameters like "[1, 0:5]"
    return object + '[' + this.ranges.join(', ') + ']';
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype._toTex = function (options) {
    var object = this.object.toTex(options);
    if (needParenthesis(this)) {
      object = '\\left(' + object + '\\right)';
    }

    var ranges = this.ranges.map(function (range) {
      return range.toTex(options);
    });

    return object + '_{' + ranges.join(',') + '}';
  };

  return IndexNode;
}

exports.name = 'IndexNode';
exports.path = 'expression.node';
exports.factory = factory;
