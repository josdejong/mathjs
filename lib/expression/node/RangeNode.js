'use strict';

var operators = require('../operators');

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));

  /**
   * @constructor RangeNode
   * @extends {Node}
   * create a range
   * @param {Node} start  included lower-bound
   * @param {Node} end    included lower-bound
   * @param {Node} [step] optional step
   */
  function RangeNode(start, end, step) {
    if (!(this instanceof RangeNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate inputs
    if (!(start && start.isNode)) throw new TypeError('Node expected');
    if (!(end && end.isNode)) throw new TypeError('Node expected');
    if (step && !(step && step.isNode)) throw new TypeError('Node expected');
    if (arguments.length > 3) throw new Error('Too many arguments');

    this.start = start;         // included lower-bound
    this.end = end;           // included upper-bound
    this.step = step || null;  // optional step
  }

  RangeNode.prototype = new Node();

  RangeNode.prototype.type = 'RangeNode';

  RangeNode.prototype.isRangeNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @return {string} js
   * @private
   */
  RangeNode.prototype._compile = function (defs) {
    return 'math.range(' +
        this.start._compile(defs) + ', ' +
        this.end._compile(defs) +
        (this.step ? (', ' + this.step._compile(defs)) : '') +
        ')';
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  RangeNode.prototype.forEach = function (callback) {
    callback(this.start, 'start', this);
    callback(this.end, 'end', this);
    if (this.step) {
      callback(this.step, 'step', this);
    }
  };

  /**
   * Create a new RangeNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {RangeNode} Returns a transformed copy of the node
   */
  RangeNode.prototype.map = function (callback) {
    return new RangeNode(
        this._ifNode(callback(this.start, 'start', this)),
        this._ifNode(callback(this.end, 'end', this)),
        this.step && this._ifNode(callback(this.step, 'step', this))
    );
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {RangeNode}
   */
  RangeNode.prototype.clone = function () {
    return new RangeNode(this.start, this.end, this.step && this.step);
  };

  /**
   * Calculate the necessary parentheses
   * @param {Node} node
   * @param {string} parenthesis
   * @return {Object} parentheses
   * @private
   */
  function calculateNecessaryParentheses(node, parenthesis) {
    var precedence = operators.getPrecedence(node, parenthesis);
    var parens = {};

    var startPrecedence = operators.getPrecedence(node.start, parenthesis);
    parens.start = ((startPrecedence !== null) && (startPrecedence <= precedence))
      || (parenthesis === 'all');

    if (node.step) {
      var stepPrecedence = operators.getPrecedence(node.step, parenthesis);
      parens.step = ((stepPrecedence !== null) && (stepPrecedence <= precedence))
        || (parenthesis === 'all');
    }

    var endPrecedence = operators.getPrecedence(node.end, parenthesis);
    parens.end = ((endPrecedence !== null) && (endPrecedence <= precedence))
      || (parenthesis === 'all');

    return parens;
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  RangeNode.prototype._toString = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var parens = calculateNecessaryParentheses(this, parenthesis);

    //format string as start:step:stop
    var str;

    var start = this.start.toString(options);
    if (parens.start) {
      start = '(' + start + ')';
    }
    str = start;

    if (this.step) {
      var step = this.step.toString(options);
      if (parens.step) {
        step = '(' + step + ')';
      }
      str += ':' + step;
    }

    var end = this.end.toString(options);
    if (parens.end) {
      end = '(' + end + ')';
    }
    str += ':' + end;

    return str;
  };

  /**
   * Get LaTeX representation
   * @params {Object} options
   * @return {string} str
   */
  RangeNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';
    var parens = calculateNecessaryParentheses(this, parenthesis);

    var str = this.start.toTex(options);
    if (parens.start) {
      str = '\\left(' + str + '\\right)';
    }

    if (this.step) {
      var step = this.step.toTex(options);
      if (parens.step) {
        step = '\\left(' + step + '\\right)';
      }
      str += ':' + step;
    }

    var end = this.end.toTex(options);
    if (parens.end) {
      end = '\\left(' + end + '\\right)';
    }
    str += ':' + end;

    return str;
  };

  return RangeNode;
}

exports.name = 'RangeNode';
exports.path = 'expression.node';
exports.factory = factory;
