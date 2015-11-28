'use strict';

var latex = require('../../utils/latex');

function factory (type, config, load, typed, math) {
  var Node = load(require('./Node'));
  var SymbolNode = load(require('./SymbolNode'));

  /**
   * @constructor FunctionNode
   * @extends {Node}
   * invoke a list with arguments on a node
   * @param {string} name
   * @param {Node[]} args
   */
  function FunctionNode(name, args) {
    if (!(this instanceof FunctionNode)) {
      throw new SyntaxError('Constructor must be called with the new operator');
    }

    // validate input
    if (typeof name !== 'string') throw new TypeError('string expected for parameter "name"');
    if (!Array.isArray(args)
        || !args.every(function (arg) {return arg && arg.isNode;})) {
      throw new TypeError('Array containing Nodes expected for parameter "args"');
    }

    this.name = name;
    this.args = args || [];
  }

  FunctionNode.prototype = new Node();

  FunctionNode.prototype.type = 'FunctionNode';

  FunctionNode.prototype.isFunctionNode = true;

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
  FunctionNode.prototype._compile = function (defs, args) {
    var fn = defs.math[this.name];
    var isRaw = (typeof fn === 'function') && (fn.rawArgs == true);

    // compile the parameters
    var jsArgs = this.args.map(function (arg) {
      return arg._compile(defs, args);
    });

    if (isRaw) {
      // pass unevaluated parameters (nodes) to the function
      var paramsName;
      var i = 0;
      do {
        paramsName = 'p' + i;
        i++;
      }
      while (paramsName in defs);
      defs[paramsName] = this.args;

      return '("' + this.name + '" in scope ? ' +
          'scope["' + this.name + '"](' + jsArgs.join(', ') + ') : ' +
          'math["' + this.name + '"]' + '(' + paramsName + ', math, scope))';
    }
    else {
      // "regular" evaluation
      var symbol = new SymbolNode(this.name);
      return symbol._compile(defs, args) + '(' + jsArgs.join(', ') + ')';
    }
  };

  /**
   * Execute a callback for each of the child nodes of this node
   * @param {function(child: Node, path: string, parent: Node)} callback
   */
  FunctionNode.prototype.forEach = function (callback) {
    for (var i = 0; i < this.args.length; i++) {
      callback(this.args[i], 'args[' + i + ']', this);
    }
  };

  /**
   * Create a new FunctionNode having it's childs be the results of calling
   * the provided callback function for each of the childs of the original node.
   * @param {function(child: Node, path: string, parent: Node): Node} callback
   * @returns {FunctionNode} Returns a transformed copy of the node
   */
  FunctionNode.prototype.map = function (callback) {
    var args = [];
    for (var i = 0; i < this.args.length; i++) {
      args[i] = this._ifNode(callback(this.args[i], 'args[' + i + ']', this));
    }
    return new FunctionNode(this.name, args);
  };

  /**
   * Create a clone of this node, a shallow copy
   * @return {FunctionNode}
   */
  FunctionNode.prototype.clone = function () {
    return new FunctionNode(this.name, this.args.slice(0));
  };

  //backup Node's toString function
  //@private
  var nodeToString = FunctionNode.prototype.toString;

  /**
   * Get string representation. (wrapper function)
   * This overrides parts of Node's toString function.
   * If callback is an object containing callbacks, it
   * calls the correct callback for the current node,
   * otherwise it falls back to calling Node's toString
   * function.
   *
   * @param {Object} options
   * @return {string} str
   * @override
   */
  FunctionNode.prototype.toString = function (options) {
    var customString;
    if (options && (typeof options.handler === 'object') && options.handler.hasOwnProperty(this.name)) {
      //callback is a map of callback functions
      customString = options.handler[this.name](this, options);
    }

    if (typeof customString !== 'undefined') {
      return customString;
    }

    //fall back to Node's toString
    return nodeToString.call(this, options);
  }

  /**
   * Get string representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionNode.prototype._toString = function (options) {
    // format the parameters like "add(2, 4.2)"
    return this.name + '(' + this.args.join(', ') + ')';
  };

  /*
   * Expand a LaTeX template
   *
   * @param {string} template
   * @param {Node} node
   * @param {Object} options
   * @private
   **/
  function expandTemplate(template, node, options) {
    var latex = '';

    // Match everything of the form ${identifier} or ${identifier[2]} or $$
    // while submatching identifier and 2 (in the second case)
    var regex = new RegExp('\\$(?:\\{([a-z_][a-z_0-9]*)(?:\\[([0-9]+)\\])?\\}|\\$)', 'ig');

    var inputPos = 0;   //position in the input string
    var match;
    while ((match = regex.exec(template)) !== null) {   //go through all matches
      // add everything in front of the match to the LaTeX string
      latex += template.substring(inputPos, match.index);
      inputPos = match.index;

      if (match[0] === '$$') { // escaped dollar sign
        latex += '$';
        inputPos++;
      }
      else { // template parameter
        inputPos += match[0].length;
        var property = node[match[1]];
        if (!property) {
          throw new ReferenceError('Template: Property ' + match[1] + ' does not exist.');
        }
        if (match[2] === undefined) { //no square brackets
          switch (typeof property) {
            case 'string':
              latex += property;
              break;
            case 'object':
              if (property.isNode) {
                latex += property.toTex(options);
              }
              else if (Array.isArray(property)) {
                //make array of Nodes into comma separated list
                latex += property.map(function (arg, index) {
                  if (arg && arg.isNode) {
                    return arg.toTex(options);
                  }
                  throw new TypeError('Template: ' + match[1] + '[' + index + '] is not a Node.');
                }).join(',');
              }
              else {
                throw new TypeError('Template: ' + match[1] + ' has to be a Node, String or array of Nodes');
              }
              break;
            default:
              throw new TypeError('Template: ' + match[1] + ' has to be a Node, String or array of Nodes');
          }
        }
        else { //with square brackets
          if (property[match[2]] && property[match[2]].isNode) {
            latex += property[match[2]].toTex(options);
          }
          else {
            throw new TypeError('Template: ' + match[1] + '[' + match[2] + '] is not a Node.');
          }
        }
      }
    }
    latex += template.slice(inputPos);  //append rest of the template

    return latex;
  }

  //backup Node's toTex function
  //@private
  var nodeToTex = FunctionNode.prototype.toTex;

  /**
   * Get LaTeX representation. (wrapper function)
   * This overrides parts of Node's toTex function.
   * If callback is an object containing callbacks, it
   * calls the correct callback for the current node,
   * otherwise it falls back to calling Node's toTex
   * function.
   *
   * @param {Object} options
   * @return {string}
   */
  FunctionNode.prototype.toTex = function (options) {
    var customTex;
    if (options && (typeof options.handler === 'object') && options.handler.hasOwnProperty(this.name)) {
      //callback is a map of callback functions
      customTex = options.handler[this.name](this, options);
    }

    if (typeof customTex !== 'undefined') {
      return customTex;
    }

    //fall back to Node's toTex
    return nodeToTex.call(this, options);
  };

  /**
   * Get LaTeX representation
   * @param {Object} options
   * @return {string} str
   */
  FunctionNode.prototype._toTex = function (options) {
    var parenthesis = (options && options.parenthesis) ? options.parenthesis : 'keep';


    var args = this.args.map(function (arg) { //get LaTeX of the arguments
      return arg.toTex(options);
    });

    var latexConverter;

    if (math[this.name] && ((typeof math[this.name].toTex === 'function') || (typeof math[this.name].toTex === 'object') || (typeof math[this.name].toTex === 'string'))) {
      //.toTex is a callback function
      latexConverter = math[this.name].toTex;
    }

    var customToTex;
    switch (typeof latexConverter) {
      case 'function': //a callback function
        customToTex = latexConverter(this, options);
        break;
      case 'string': //a template string
        customToTex = expandTemplate(latexConverter, this, options);
        break;
      case 'object': //an object with different "converters" for different numbers of arguments
        switch (typeof latexConverter[args.length]) {
          case 'function':
            customToTex = latexConverter[args.length](this, options);
            break;
          case 'string':
            customToTex = expandTemplate(latexConverter[args.length], this, options);
            break;
        }
    }

    if (typeof customToTex !== 'undefined') {
      return customToTex;
    }

    return expandTemplate(latex.defaultTemplate, this, options);
  };

  /**
   * Get identifier.
   * @return {string}
   */
  FunctionNode.prototype.getIdentifier = function () {
    return this.type + ':' + this.name;
  };

  return FunctionNode;
}

exports.name = 'FunctionNode';
exports.path = 'expression.node';
exports.math = true; // request access to the math namespace as 5th argument of the factory function
exports.factory = factory;
