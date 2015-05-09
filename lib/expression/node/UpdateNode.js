'use strict';

function factory (type, config, load, typed) {
  var Node = load(require('./Node'));
  var IndexNode = load(require('./IndexNode'));

  /**
   * @constructor UpdateNode
   * @extends {Node}
   * Update a matrix subset, like A[2,3] = 4.5
   *
   * @param {IndexNode} index             IndexNode containing symbol and ranges
   * @param {Node} expr                   The expression defining the symbol
   */
  function UpdateNode(index, expr) {
    if (!(this instanceof UpdateNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    if (!(index && index.isIndexNode)) {
      throw new TypeError('Expected IndexNode for parameter "index"');
    }
    if (!(expr && expr.isNode)) {
      throw new TypeError('Expected Node for parameter "expr"');
    }

    this.index = index;
    this.expr = expr;
  }

  UpdateNode.prototype = new Node();

  UpdateNode.prototype.type = 'UpdateNode';

  UpdateNode.prototype.isUpdateNode = true;

  /**
   * Compile the node to javascript code
   * @param {Object} defs     Object which can be used to define functions
   *                          or constants globally available for the compiled
   *                          expression
   * @return {String} js
   * @private
   */
  UpdateNode.prototype._compile = function (defs) {
    var lhs = (this.index.objectName() in defs.args)
        ? this.name + ' = ' // this is a FunctionAssignment argument
        : 'scope["' + this.index.objectName() + '\"]';

    var rhs = this.index.compileSubset(defs, this.expr._compile(defs));

    return lhs + ' = ' + rhs;
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  UpdateNode.prototype.forEach = function (callback) {
    callback(this.index, 'index', this);
    callback(this.expr, 'expr', this);
  };

  /**
   * Create a new UpdateNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {UpdateNode} Returns a transformed copy of the node
   */
  UpdateNode.prototype.map = function (callback) {
    return new UpdateNode(
        this._ifNode(callback(this.index, 'index', this)),
        this._ifNode(callback(this.expr, 'expr', this))
    );
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {UpdateNode}
   */
  UpdateNode.prototype.clone = function () {
    return new UpdateNode(this.index, this.expr);
  };

  /**
   * Get string representation
   * @return {String}
   */
  UpdateNode.prototype._toString = function () {
    var expr = this.expr.toString();
    if (config.parenthesis === 'all') {
      expr = '(' + expr + ')';
    }
    return this.index.toString() + ' = ' + expr;
  };

  /**
   * Get LaTeX representation
   * @param {Object} localConfig
   * @param {Object|function} callback(s)
   * @return {String}
   */
  UpdateNode.prototype._toTex = function (localConfig, callbacks) {
    var expr = this.expr.toTex(localConfig, callbacks);
    if (localConfig.parenthesis === 'all') {
      expr = '\\left(' + expr + '\\right)';
    }
    return this.index.toTex(localConfig, callbacks) + ':=' + expr;
  };

  return UpdateNode;
}

exports.name = 'UpdateNode';
exports.path = 'expression.node';
exports.factory = factory;
