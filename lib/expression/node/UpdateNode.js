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
   * @param {Object} args     Object with local function arguments, the key is
   *                          the name of the argument, and the value is `true`.
   *                          The object may not be mutated, but must be
   *                          extended instead.
   * @return {string} js
   * @private
   */
  UpdateNode.prototype._compile = function (defs, args) {
    var replacement = this.expr._compile(defs, args);
    var compiledIndex = this.index.compileIndex(defs, args);
    var symbol = this.index.filter(function (node) {
      return node.isSymbolNode;
    })[0];
    var indexNodes = this.filter(function (node) {
      return node.isIndexNode;
    });

    if (indexNodes.length > 1 || compiledIndex.sizeNeeded) {
      // TODO: refactor this code, it's too complicated
      var childArgs = args;
      var code = indexNodes.reduce(function (code, node) {
        childArgs = Object.create(childArgs); // childArgs can be mutated by compileRanges
        var compiledIndex = node.compileIndex(defs, childArgs);
        var index = compiledIndex.code;
        var inner = code ? '(' + code + ')(math.subset(obj, index))' : replacement;

        return 'function (obj) {\n' +
            (compiledIndex.sizeNeeded ? 'var size = math.size(obj).valueOf();\n' : '') +
            'var index = ' + index + ';\n' +
            'return math.subset(obj, index, ' + inner + ');\n' +
            '}';
      }, null);

      return 'scope["' + symbol.name + '"] = (' + code + ')(' + symbol._compile(defs, args) + ')';
    }
    else {
      // simple, single subset replacement. No need for closures and nesting stuff.
      var object = this.index.object._compile(defs, args);
      var index = compiledIndex.code;

      return 'scope["' + symbol.name + '"] = ' +
          'math.subset(' + object + ', ' + index + ', ' + replacement + ')';
    }
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
   * @param {Object} options
   * @return {string}
   */
  UpdateNode.prototype._toString = function (options) {
    var expr = this.expr.toString(options);
    if (options && options.parenthesis === 'all') {
      expr = '(' + expr + ')';
    }
    return this.index.toString(options) + ' = ' + expr;
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string}
   */
  UpdateNode.prototype._toTex = function (options) {
    var expr = this.expr.toTex(options);
    if (options && options.parenthesis === 'all') {
      expr = '\\left(' + expr + '\\right)';
    }
    return this.index.toTex(options) + ':=' + expr;
  };

  return UpdateNode;
}

exports.name = 'UpdateNode';
exports.path = 'expression.node';
exports.factory = factory;
