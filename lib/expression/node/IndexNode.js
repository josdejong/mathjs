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
   * Describes a subset of a matrix or an object property.
   * Cannot be used on its own, needs to be used within an AccessorNode or
   * AssignmentNode.
   *
   * @param {Node[]} ranges
   */
  function IndexNode(ranges) {
    if (!(this instanceof IndexNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (!isArray(ranges)
        || !ranges.every(function (range) {return range && range.isNode;})) {
      throw new TypeError('Array containing Nodes expected for parameter "ranges"');
    }

    this.ranges = ranges;

    // TODO: deprecated since v3, remove some day
    var deprecated = function () {
      throw new Error('Property `IndexNode.object` is deprecated, use `IndexNode.fn` instead');
    };
    Object.defineProperty(this, 'object', { get: deprecated, set: deprecated });
  }

  IndexNode.prototype = new Node();

  IndexNode.prototype.type = 'IndexNode';

  IndexNode.prototype.isIndexNode = true;

  /**
   * Compile all range nodes
   *
   * When some of the ranges has `end` defined, the IndexNode requires
   * a variable `size` to be defined in the current closure, and must contain
   * the size of the matrix that's being handled. To check whether the `size`
   * variable is needed, call IndexNode.needsSize().
   *
   * @param {Object} defs           Object which can be used to define functions
   *                                or constants globally available for the
   *                                compiled expression
   * @param {Object} args           Object with local function arguments, the key is
   *                                the name of the argument, and the value is `true`.
   *                                The object may not be mutated, but must be
   *                                extended instead.
   * @return {string} code
   */
  IndexNode.prototype._compile = function (defs, args) {
    // args can be mutated by IndexNode, when ranges use `end`
    var childArgs = Object.create(args);

    // helper function to create a Range from start, step and end
    defs.range = function (start, end, step) {
      return new Range(
          (start && start.isBigNumber === true) ? start.toNumber() : start,
          (end   && end.isBigNumber === true)   ? end.toNumber()   : end,
          (step  && step.isBigNumber === true)  ? step.toNumber()  : step
      );
    };

    // TODO: implement support for bignumber (currently bignumbers are silently
    //       reduced to numbers when changing the value to zero-based)

    // TODO: Optimization: when the range values are ConstantNodes,
    //       we can beforehand resolve the zero-based value

    // optimization for a simple object property
    var ranges = this.ranges.map(function (range, i) {
      if (range && range.isRangeNode) {
        if (range.needsEnd()) {
          childArgs.end = true;

          // resolve end and create range
          return '(function () {' +
              'var end = size[' + i + ']; ' +
              'return range(' +
              range.start._compile(defs, childArgs) + ', ' +
              range.end._compile(defs, childArgs) + ', ' +
              (range.step ? range.step._compile(defs, childArgs) : '1') +
              '); ' +
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
      if (range.isSymbolNode && range.name === 'end') {
        childArgs.end = true;

        // resolve the parameter 'end'
        return '(function () {' +
            'var end = size[' + i + ']; ' +
            'return ' + range._compile(defs, childArgs) + '; ' +
            '})()'
      }
      else { // ConstantNode
        return range._compile(defs, childArgs);
      }
    });

    return 'math.index(' + ranges.join(', ') + ')';
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  IndexNode.prototype.forEach = function (callback) {
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
    var ranges = [];
    for (var i = 0; i < this.ranges.length; i++) {
      ranges[i] = this._ifNode(callback(this.ranges[i], 'ranges[' + i + ']', this));
    }

    return new IndexNode(ranges);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {IndexNode}
   */
  IndexNode.prototype.clone = function () {
    return new IndexNode(this.ranges.slice(0));
  };

  /**
   * Test whether this IndexNode contains a single property name
   * @return {boolean}
   */
  IndexNode.prototype.isObjectProperty = function () {
    return this.ranges.length === 1 &&
        this.ranges[0].isConstantNode &&
        this.ranges[0].valueType === 'string';
  };

  /**
   * Returns the property name if IndexNode contains a property.
   * If not, returns null.
   * @return {string | null}
   */
  IndexNode.prototype.getObjectProperty = function () {
    return this.isObjectProperty() ? this.ranges[0].value : null;
  };

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype._toString = function (options) {
    // format the parameters like "[1, 0:5]"
    return '[' + this.ranges.join(', ') + ']';
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  IndexNode.prototype._toTex = function (options) {
    var ranges = this.ranges.map(function (range) {
      return range.toTex(options);
    });

    return '_{' + ranges.join(',') + '}';
  };

  /**
   * Test whether this IndexNode needs the object size, size of the Matrix
   * @return {boolean}
   */
  IndexNode.prototype.needsSize = function () {
    return this.ranges.some(function (range) {
      return (range.isRangeNode && range.needsEnd()) ||
          (range.isSymbolNode && range.name === 'end');
    });
  };

  return IndexNode;
}

exports.name = 'IndexNode';
exports.path = 'expression.node';
exports.factory = factory;
