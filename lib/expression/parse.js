'use strict';

var ArgumentsError = require('../error/ArgumentsError');
var deepMap = require('../utils/collection/deepMap');

function factory (type, config, load, typed) {
  var ArrayNode               = load(require('./node/ArrayNode'));
  var AssignmentNode          = load(require('./node/AssignmentNode'));
  var BlockNode               = load(require('./node/BlockNode'));
  var ConditionalNode         = load(require('./node/ConditionalNode'));
  var ConstantNode            = load(require('./node/ConstantNode'));
  var FunctionAssignmentNode  = load(require('./node/FunctionAssignmentNode'));
  var IndexNode               = load(require('./node/IndexNode'));
  var OperatorNode            = load(require('./node/OperatorNode'));
  var ParenthesisNode         = load(require('./node/ParenthesisNode'));
  var FunctionNode            = load(require('./node/FunctionNode'));
  var RangeNode               = load(require('./node/RangeNode'));
  var SymbolNode              = load(require('./node/SymbolNode'));
  var UpdateNode              = load(require('./node/UpdateNode'));


  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.eval();
   *
   * Syntax:
   *
   *     parse(expr)
   *     parse(expr, options)
   *     parse([expr1, expr2, expr3, ...])
   *     parse([expr1, expr2, expr3, ...], options)
   *
   * Example:
   *
   *     var node = parse('sqrt(3^2 + 4^2)');
   *     node.compile(math).eval(); // 5
   *
   *     var scope = {a:3, b:4}
   *     var node = parse('a * b'); // 12
   *     var code = node.compile(math);
   *     code.eval(scope); // 12
   *     scope.a = 5;
   *     code.eval(scope); // 20
   *
   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].compile(math).eval(); // 12
   *
   * @param {string | string[] | Matrix} expr
   * @param {{nodes: Object<string, Node>}} [options]  Available options:
   *                                                   - `nodes` a set of custom nodes
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  function parse (expr, options) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new ArgumentsError('parse', arguments.length, 1, 2);
    }

    // pass extra nodes
    extra_nodes = (options && options.nodes) ? options.nodes : {};

    if (typeof expr === 'string') {
      // parse a single expression
      expression = expr;
      return parseStart();
    }
    else if (Array.isArray(expr) || expr instanceof type.Matrix) {
      // parse an array or matrix with expressions
      return deepMap(expr, function (elem) {
        if (typeof elem !== 'string') throw new TypeError('String expected');

        expression = elem;
        return parseStart();
      });
    }
    else {
      // oops
      throw new TypeError('String or matrix expected');
    }
  }

  // token types enumeration
  var TOKENTYPE = {
    NULL : 0,
    DELIMITER : 1,
    NUMBER : 2,
    SYMBOL : 3,
    UNKNOWN : 4
  };

  // map with all delimiters
  var DELIMITERS = {
    ',': true,
    '(': true,
    ')': true,
    '[': true,
    ']': true,
    '\"': true,
    ';': true,

    '+': true,
    '-': true,
    '*': true,
    '.*': true,
    '/': true,
    './': true,
    '%': true,
    '^': true,
    '.^': true,
    '~': true,
    '!': true,
    '&': true,
    '|': true,
    '^|': true,
    '\'': true,
    '=': true,
    ':': true,
    '?': true,

    '==': true,
    '!=': true,
    '<': true,
    '>': true,
    '<=': true,
    '>=': true,

    '<<': true,
    '>>': true,
    '>>>': true
  };

  // map with all named delimiters
  var NAMED_DELIMITERS = {
    'mod': true,
    'to': true,
    'in': true,
    'and': true,
    'xor': true,
    'or': true,
    'not': true
  };

  var extra_nodes = {};             // current extra nodes
  var expression = '';              // current expression
  var index = 0;                    // current index in expr
  var c = '';                       // current token character in expr
  var token = '';                   // current token
  var token_type = TOKENTYPE.NULL;  // type of the token
  var nesting_level = 0;            // level of nesting inside parameters, used to ignore newline characters
  var conditional_level = null;     // when a conditional is being parsed, the level of the conditional is stored here

  /**
   * Get the first character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function first() {
    index = 0;
    c = expression.charAt(0);
    nesting_level = 0;
    conditional_level = null;
  }

  /**
   * Get the next character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function next() {
    index++;
    c = expression.charAt(index);
  }

  /**
   * Preview the next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextPreview() {
    return expression.charAt(index + 1);
  }

  /**
   * Preview the second next character from the expression.
   * @return {string} cNext
   * @private
   */
  function nextNextPreview() {
    return expression.charAt(index + 2);
  }

  /**
   * Get next token in the current string expr.
   * The token and token type are available as token and token_type
   * @private
   */
  function getToken() {
    token_type = TOKENTYPE.NULL;
    token = '';

    // skip over whitespaces
    // space, tab, and newline when inside parameters
    while (c == ' ' || c == '\t' || (c == '\n' && nesting_level)) {
      // TODO: also take '\r' carriage return as newline? Or does that give problems on mac?
      next();
    }

    // skip comment
    if (c == '#') {
      while (c != '\n' && c != '') {
        next();
      }
    }

    // check for end of expression
    if (c == '') {
      // token is still empty
      token_type = TOKENTYPE.DELIMITER;
      return;
    }

    // check for new line character
    if (c == '\n' && !nesting_level) {
      token_type = TOKENTYPE.DELIMITER;
      token = c;
      next();
      return;
    }

    // check for delimiters consisting of 3 characters
    var c2 = c + nextPreview();
    var c3 = c2 + nextNextPreview();
    if (c3.length == 3 && DELIMITERS[c3]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c3;
      next();
      next();
      next();
      return;
    }

    // check for delimiters consisting of 2 characters
    if (c2.length == 2 && DELIMITERS[c2]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c2;
      next();
      next();
      return;
    }

    // check for delimiters consisting of 1 character
    if (DELIMITERS[c]) {
      token_type = TOKENTYPE.DELIMITER;
      token = c;
      next();
      return;
    }

    // check for a number
    if (isDigitDot(c)) {
      token_type = TOKENTYPE.NUMBER;

      // get number, can have a single dot
      if (c == '.') {
        token += c;
        next();

        if (!isDigit(c)) {
          // this is no legal number, it is just a dot
          token_type = TOKENTYPE.UNKNOWN;
        }
      }
      else {
        while (isDigit(c)) {
          token += c;
          next();
        }
        if (c == '.') {
          token += c;
          next();
        }
      }
      while (isDigit(c)) {
        token += c;
        next();
      }

      // check for exponential notation like "2.3e-4", "1.23e50" or "2e+4"
      c2 = nextPreview();
      if ((c == 'E' || c == 'e') && (isDigit(c2) || c2 == '-' || c2 == '+')) {
        token += c;
        next();

        if (c == '+' || c == '-') {
          token += c;
          next();
        }

        // Scientific notation MUST be followed by an exponent
        if (!isDigit(c)) {
          // this is no legal number, exponent is missing.
          token_type = TOKENTYPE.UNKNOWN;
        }

        while (isDigit(c)) {
          token += c;
          next();
        }
      }

      return;
    }

    // check for variables, functions, named operators
    if (currentIsAlpha()) {
      while (currentIsAlpha() || isDigit(c)) {
        token += c;
        next();
      }

      if (NAMED_DELIMITERS[token]) {
        token_type = TOKENTYPE.DELIMITER;
      }
      else {
        token_type = TOKENTYPE.SYMBOL;
      }

      return;
    }

    // something unknown is found, wrong characters -> a syntax error
    token_type = TOKENTYPE.UNKNOWN;
    while (c != '') {
      token += c;
      next();
    }
    throw createSyntaxError('Syntax error in part "' + token + '"');
  }

  /**
   * Get next token and skip newline tokens
   */
  function getTokenSkipNewline () {
    do {
      getToken();
    }
    while (token == '\n');
  }

  /**
   * Open parameters.
   * New line characters will be ignored until closeParams() is called
   */
  function openParams() {
    nesting_level++;
  }

  /**
   * Close parameters.
   * New line characters will no longer be ignored
   */
  function closeParams() {
    nesting_level--;
  }

  /**
   * Checks whether the current character `c` is a valid alpha character:
   *
   * - A latin letter (upper or lower case) Ascii: a-z, A-Z
   * - A underscore                         Ascii: _
   * - A latin letter with accents          Unicode: \u00C0 - \u02AF
   * - A greek letter                       Unicode: \u0370 - \u03FF
   * - A mathematical alphanumeric symbol   Unicode: \u{1D400} - \u{1D7FF} excluding invalid code points
   *
   * @return {boolean}
   * @private
   */
  function currentIsAlpha () {
    // http://unicode-table.com/en/
    // http://www.wikiwand.com/en/Mathematical_operators_and_symbols_in_Unicode
    //
    // Note: In ES6 will be unicode aware:
    //   http://stackoverflow.com/questions/280712/javascript-unicode-regexes
    //   https://mathiasbynens.be/notes/es6-unicode-regex
    var cPrev = expression.charAt(index - 1);
    var cNext = expression.charAt(index + 1);

    var isValidLatinOrGreek = function (p) {
      return /^[a-zA-Z_\u00C0-\u02AF\u0370-\u03FF]$/.test(p);
    };

    var isValidMathSymbol = function (high, low) {
      return /^[\uD835]$/.test(high) &&
          /^[\uDC00-\uDFFF]$/.test(low) &&
          /^[^\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDFCC\uDFCD]$/.test(low);
    };

    return isValidLatinOrGreek(c)
        || isValidMathSymbol(c, cNext)
        || isValidMathSymbol(cPrev, c);
  }

  /**
   * checks if the given char c is a digit or dot
   * @param {string} c   a string with one character
   * @return {boolean}
   * @private
   */
  function isDigitDot (c) {
    return ((c >= '0' && c <= '9') || c == '.');
  }

  /**
   * checks if the given char c is a digit
   * @param {string} c   a string with one character
   * @return {boolean}
   * @private
   */
  function isDigit (c) {
    return (c >= '0' && c <= '9');
  }

  /**
   * Start of the parse levels below, in order of precedence
   * @return {Node} node
   * @private
   */
  function parseStart () {
    // get the first character in expression
    first();

    getToken();

    var node = parseBlock();

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and token_type DELIMITER
    if (token != '') {
      if (token_type == TOKENTYPE.DELIMITER) {
        // user entered a not existing operator like "//"

        // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
        throw createError('Unexpected operator ' + token);
      }
      else {
        throw createSyntaxError('Unexpected part "' + token + '"');
      }
    }

    return node;
  }

  /**
   * Parse a block with expressions. Expressions can be separated by a newline
   * character '\n', or by a semicolon ';'. In case of a semicolon, no output
   * of the preceding line is returned.
   * @return {Node} node
   * @private
   */
  function parseBlock () {
    var node;
    var blocks = [];
    var visible;

    if (token == '') {
      // empty expression
      return new ConstantNode('undefined', 'undefined');
    }

    if (token != '\n' && token != ';') {
      node = parseFunctionAssignment();
    }

    // TODO: simplify this loop
    while (token == '\n' || token == ';') {
      if (blocks.length == 0 && node) {
        visible = (token != ';');
        blocks.push({
          node: node,
          visible: visible
        });
      }

      getToken();
      if (token != '\n' && token != ';' && token != '') {
        node = parseFunctionAssignment();

        visible = (token != ';');
        blocks.push({
          node: node,
          visible: visible
        });
      }
    }

    if (blocks.length > 0) {
      return new BlockNode(blocks);
    }
    else {
      return node;
    }
  }

  /**
   * Parse a function assignment like "function f(a,b) = a*b"
   * @return {Node} node
   * @private
   */
  function parseFunctionAssignment () {
    // TODO: function assignment using keyword 'function' is deprecated since version 0.18.0, cleanup some day
    if (token_type == TOKENTYPE.SYMBOL && token == 'function') {
      throw createSyntaxError('Deprecated keyword "function". ' +
          'Functions can now be assigned without it, like "f(x) = x^2".');
    }

    return parseAssignment();
  }

  /**
   * Assignment of a variable, can be a variable like "a=2.3" or a updating an
   * existing variable like "matrix(2,3:5)=[6,7,8]"
   * @return {Node} node
   * @private
   */
  function parseAssignment () {
    var name, args, expr, valid;

    var node = parseConditional();

    if (token == '=') {
      if (node && node.isSymbolNode) {
        // parse a variable assignment like 'a = 2/3'
        name = node.name;
        getTokenSkipNewline();
        expr = parseAssignment();
        return new AssignmentNode(name, expr);
      }
      else if (node && node.isIndexNode) {
        // parse a matrix subset assignment like 'A[1,2] = 4'
        getTokenSkipNewline();
        expr = parseAssignment();
        return new UpdateNode(node, expr);
      }
      else if (node && node.isFunctionNode) {
        // parse function assignment like 'f(x) = x^2'
        valid = true;
        args = [];

        name = node.name;
        node.args.forEach(function (arg, index) {
          if (arg && arg.isSymbolNode) {
            args[index] = arg.name;
          }
          else {
            valid = false;
          }
        });

        if (valid) {
          getTokenSkipNewline();
          expr = parseAssignment();
          return new FunctionAssignmentNode(name, args, expr);
        }
      }

      throw createSyntaxError('Invalid left hand side of assignment operator =');
    }

    return node;
  }

  /**
   * conditional operation
   *
   *     condition ? truePart : falsePart
   *
   * Note: conditional operator is right-associative
   *
   * @return {Node} node
   * @private
   */
  function parseConditional () {
    var node = parseLogicalOr();

    while (token == '?') {
      // set a conditional level, the range operator will be ignored as long
      // as conditional_level == nesting_level.
      var prev = conditional_level;
      conditional_level = nesting_level;
      getTokenSkipNewline();

      var condition = node;
      var trueExpr = parseLogicalOr();

      if (token != ':') throw createSyntaxError('False part of conditional expression expected');

      conditional_level = null;
      getTokenSkipNewline();

      var falseExpr = parseConditional(); // Note: check for conditional operator again, right associativity

      node = new ConditionalNode(condition, trueExpr, falseExpr);

      // restore the previous conditional level
      conditional_level = prev;
    }

    return node;
  }

  /**
   * logical or, 'x or y'
   * @return {Node} node
   * @private
   */
  function parseLogicalOr() {
    var node = parseLogicalXor();

    while (token == 'or') {
      getTokenSkipNewline();
      node = new OperatorNode('or', 'or', [node, parseLogicalXor()]);
    }

    return node;
  }

  /**
   * logical exclusive or, 'x xor y'
   * @return {Node} node
   * @private
   */
  function parseLogicalXor() {
    var node = parseLogicalAnd();

    while (token == 'xor') {
      getTokenSkipNewline();
      node = new OperatorNode('xor', 'xor', [node, parseLogicalAnd()]);
    }

    return node;
  }

  /**
   * logical and, 'x and y'
   * @return {Node} node
   * @private
   */
  function parseLogicalAnd() {
    var node = parseBitwiseOr();

    while (token == 'and') {
      getTokenSkipNewline();
      node = new OperatorNode('and', 'and', [node, parseBitwiseOr()]);
    }

    return node;
  }

  /**
   * bitwise or, 'x | y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseOr() {
    var node = parseBitwiseXor();

    while (token == '|') {
      getTokenSkipNewline();
      node = new OperatorNode('|', 'bitOr', [node, parseBitwiseXor()]);
    }

    return node;
  }

  /**
   * bitwise exclusive or (xor), 'x ^| y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseXor() {
    var node = parseBitwiseAnd();

    while (token == '^|') {
      getTokenSkipNewline();
      node = new OperatorNode('^|', 'bitXor', [node, parseBitwiseAnd()]);
    }

    return node;
  }

  /**
   * bitwise and, 'x & y'
   * @return {Node} node
   * @private
   */
  function parseBitwiseAnd () {
    var node = parseRelational();

    while (token == '&') {
      getTokenSkipNewline();
      node = new OperatorNode('&', 'bitAnd', [node, parseRelational()]);
    }

    return node;
  }

  /**
   * relational operators
   * @return {Node} node
   * @private
   */
  function parseRelational () {
    var node, operators, name, fn, params;

    node = parseShift();

    operators = {
      '==': 'equal',
      '!=': 'unequal',
      '<': 'smaller',
      '>': 'larger',
      '<=': 'smallerEq',
      '>=': 'largerEq'
    };
    while (token in operators) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseShift()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Bitwise left shift, bitwise right arithmetic shift, bitwise right logical shift
   * @return {Node} node
   * @private
   */
  function parseShift () {
    var node, operators, name, fn, params;

    node = parseConversion();

    operators = {
      '<<' : 'leftShift',
      '>>' : 'rightArithShift',
      '>>>' : 'rightLogShift'
    };

    while (token in operators) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseConversion()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * conversion operators 'to' and 'in'
   * @return {Node} node
   * @private
   */
  function parseConversion () {
    var node, operators, name, fn, params;

    node = parseRange();

    operators = {
      'to' : 'to',
      'in' : 'to'   // alias of 'to'
    };

    while (token in operators) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseRange()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
   * @return {Node} node
   * @private
   */
  function parseRange () {
    var node, params = [];

    if (token == ':') {
      // implicit start=1 (one-based)
      node = new ConstantNode('1', 'number');
    }
    else {
      // explicit start
      node = parseAddSubtract();
    }

    if (token == ':' && (conditional_level !== nesting_level)) {
      // we ignore the range operator when a conditional operator is being processed on the same level
      params.push(node);

      // parse step and end
      while (token == ':' && params.length < 3) {
        getTokenSkipNewline();

        if (token == ')' || token == ']' || token == ',' || token == '') {
          // implicit end
          params.push(new SymbolNode('end'));
        }
        else {
          // explicit end
          params.push(parseAddSubtract());
        }
      }

      if (params.length == 3) {
        // params = [start, step, end]
        node = new RangeNode(params[0], params[2], params[1]); // start, end, step
      }
      else { // length == 2
        // params = [start, end]
        node = new RangeNode(params[0], params[1]); // start, end
      }
    }

    return node;
  }

  /**
   * add or subtract
   * @return {Node} node
   * @private
   */
  function parseAddSubtract ()  {
    var node, operators, name, fn, params;

    node = parseMultiplyDivide();

    operators = {
      '+': 'add',
      '-': 'subtract'
    };
    while (token in operators) {
      name = token;
      fn = operators[name];

      getTokenSkipNewline();
      params = [node, parseMultiplyDivide()];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * multiply, divide, modulus
   * @return {Node} node
   * @private
   */
  function parseMultiplyDivide () {
    var node, last, operators, name, fn;

    node = parseUnary();
    last = node;

    operators = {
      '*': 'multiply',
      '.*': 'dotMultiply',
      '/': 'divide',
      './': 'dotDivide',
      '%': 'mod',
      'mod': 'mod'
    };

    while (true) {
      if (token in operators) {
        // explicit operators
        name = token;
        fn = operators[name];

        getTokenSkipNewline();

        last = parseUnary();
        node = new OperatorNode(name, fn, [node, last]);
      }
      else if ((token_type == TOKENTYPE.SYMBOL) ||
          (token == 'in' && (node && node.isConstantNode)) ||
          (token_type == TOKENTYPE.NUMBER && !last.isConstantNode) ||
          (token == '(' || token == '[')) {
        // parse implicit multiplication
        //
        // symbol:      implicit multiplication like '2a', '(2+3)a', 'a b'
        // number:      implicit multiplication like '(2+3)2'
        //              Note: we don't allow implicit multiplication between numbers,
        //              like '2 3'. I'm not sure whether that is a good idea.
        // parenthesis: implicit multiplication like '2(3+4)', '(3+4)(1+2)', '2[1,2,3]'
        last = parseUnary();
        node = new OperatorNode('*', 'multiply', [node, last]);
      }
      else {
        break;
      }
    }

    return node;
  }

  /**
   * Unary plus and minus, and logical and bitwise not
   * @return {Node} node
   * @private
   */
  function parseUnary () {
    var name, params;
    var fn = {
      '-': 'unaryMinus',
      '+': 'unaryPlus',
      '~': 'bitNot',
      'not': 'not'
    }[token];

    if (fn) {
      name = token;

      getTokenSkipNewline();
      params = [parseUnary()];

      return new OperatorNode(name, fn, params);
    }

    return parsePow();
  }

  /**
   * power
   * Note: power operator is right associative
   * @return {Node} node
   * @private
   */
  function parsePow () {
    var node, name, fn, params;

    node = parseLeftHandOperators();

    if (token == '^' || token == '.^') {
      name = token;
      fn = (name == '^') ? 'pow' : 'dotPow';

      getTokenSkipNewline();
      params = [node, parseUnary()]; // Go back to unary, we can have '2^-3'
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Left hand operators: factorial x!, transpose x'
   * @return {Node} node
   * @private
   */
  function parseLeftHandOperators ()  {
    var node, operators, name, fn, params;

    node = parseCustomNodes();

    operators = {
      '!': 'factorial',
      '\'': 'transpose'
    };

    while (token in operators) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node];

      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Parse a custom node handler. A node handler can be used to process
   * nodes in a custom way, for example for handling a plot.
   *
   * A handler must be passed as second argument of the parse function.
   * - must extend math.expression.node.Node
   * - must contain a function _compile(defs: Object) : string
   * - must contain a function find(filter: Object) : Node[]
   * - must contain a function toString() : string
   * - the constructor is called with a single argument containing all parameters
   *
   * For example:
   *
   *     nodes = {
   *       'plot': PlotHandler
   *     };
   *
   * The constructor of the handler is called as:
   *
   *     node = new PlotHandler(params);
   *
   * The handler will be invoked when evaluating an expression like:
   *
   *     node = math.parse('plot(sin(x), x)', nodes);
   *
   * @return {Node} node
   * @private
   */
  function parseCustomNodes () {
    var params = [], handler;

    if (token_type == TOKENTYPE.SYMBOL && extra_nodes[token]) {
      handler = extra_nodes[token];

      getToken();

      // parse parameters
      if (token == '(') {
        params = [];

        openParams();
        getToken();

        if (token != ')') {
          params.push(parseConditional());

          // parse a list with parameters
          while (token == ',') {
            getToken();
            params.push(parseConditional());
          }
        }

        if (token != ')') {
          throw createSyntaxError('Parenthesis ) expected');
        }
        closeParams();
        getToken();
      }

      // create a new node handler
      //noinspection JSValidateTypes
      return new handler(params);
    }

    return parseSymbol();
  }

  /**
   * parse symbols: functions, variables, constants, units
   * @return {Node} node
   * @private
   */
  function parseSymbol () {
    var node, name;

    if (token_type == TOKENTYPE.SYMBOL ||
        (token_type == TOKENTYPE.DELIMITER && token in NAMED_DELIMITERS)) {
      name = token;

      getToken();

      // parse function parameters and matrix index
      node = parseFunctions(name);
      node = parseIndex(node);
      return node;
    }

    return parseString();
  }

  /**
   * parse a function call like fn(a, b, c)
   * @param {string} name    Function name
   * @return {FunctionNode | SymbolNode} node
   * @private
   */
  function parseFunctions (name) {
    var params;

    if (token == '(') {
      params = [];

      openParams();
      getToken();

      if (token != ')') {
        params.push(parseConditional());

        // parse a list with parameters
        while (token == ',') {
          getToken();
          params.push(parseConditional());
        }
      }

      if (token != ')') {
        throw createSyntaxError('Parenthesis ) expected');
      }
      closeParams();
      getToken();

      return new FunctionNode(name, params);
    }

    return new SymbolNode(name);
  }

  /**
   * parse index parameters, enclosed in square brackets [...], for example A[2,3]
   * @param {Node} node    Node on which to apply the parameters. If there
   *                       are no parameters in the expression, the node
   *                       itself is returned
   * @return {Node} node
   * @private
   */
  function parseIndex (node) {
    var params;

    while (token == '[') {
      params = [];

      openParams();
      getToken();

      if (token != ']') {
        params.push(parseConditional());

        // parse a list with parameters
        while (token == ',') {
          getToken();
          params.push(parseConditional());
        }
      }

      if (token != ']') {
        throw createSyntaxError('Parenthesis ] expected');
      }
      closeParams();
      getToken();

      node = new IndexNode(node, params);
    }

    return node;
  }

  /**
   * parse a string.
   * A string is enclosed by double quotes
   * @return {Node} node
   * @private
   */
  function parseString () {
    var node, str, tPrev;

    if (token == '"') {
      // string "..."
      str = '';
      tPrev = '';
      while (c != '' && (c != '\"' || tPrev == '\\')) { // also handle escape character
        str += c;
        tPrev = c;
        next();
      }

      getToken();
      if (token != '"') {
        throw createSyntaxError('End of string " expected');
      }
      getToken();

      // create constant
      node = new ConstantNode(str, 'string');

      // parse index parameters
      node = parseIndex(node);

      return node;
    }

    return parseMatrix();
  }

  /**
   * parse the matrix
   * @return {Node} node
   * @private
   */
  function parseMatrix () {
    var array, params, rows, cols;

    if (token == '[') {
      // matrix [...]
      openParams();
      getToken();

      if (token != ']') {
        // this is a non-empty matrix
        var row = parseRow();

        if (token == ';') {
          // 2 dimensional array
          rows = 1;
          params = [row];

          // the rows of the matrix are separated by dot-comma's
          while (token == ';') {
            getToken();

            params[rows] = parseRow();
            rows++;
          }

          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          closeParams();
          getToken();

          // check if the number of columns matches in all rows
          cols = params[0].nodes.length;
          for (var r = 1; r < rows; r++) {
            if (params[r].nodes.length != cols) {
              throw createError('Column dimensions mismatch ' +
                  '(' + params[r].nodes.length + ' != ' + cols + ')');
            }
          }

          array = new ArrayNode(params);
        }
        else {
          // 1 dimensional vector
          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          closeParams();
          getToken();

          array = row;
        }
      }
      else {
        // this is an empty matrix "[ ]"
        closeParams();
        getToken();
        array = new ArrayNode([]);
      }

      return array;
    }

    return parseNumber();
  }

  /**
   * Parse a single comma-separated row from a matrix, like 'a, b, c'
   * @return {ArrayNode} node
   */
  function parseRow () {
    var params = [parseAssignment()];
    var len = 1;

    while (token == ',') {
      getToken();

      // parse expression
      params[len] = parseAssignment();
      len++;
    }

    return new ArrayNode(params);
  }

  /**
   * parse a number
   * @return {Node} node
   * @private
   */
  function parseNumber () {
    var number;

    if (token_type == TOKENTYPE.NUMBER) {
      // this is a number
      number = token;
      getToken();

      return new ConstantNode(number, 'number');
    }

    return parseParentheses();
  }

  /**
   * parentheses
   * @return {Node} node
   * @private
   */
  function parseParentheses () {
    var node;

    // check if it is a parenthesized expression
    if (token == '(') {
      // parentheses (...)
      openParams();
      getToken();

      node = parseAssignment(); // start again

      if (token != ')') {
        throw createSyntaxError('Parenthesis ) expected');
      }
      closeParams();
      getToken();

      return new ParenthesisNode(node);
    }

    return parseEnd();
  }

  /**
   * Evaluated when the expression is not yet ended but expected to end
   * @return {Node} res
   * @private
   */
  function parseEnd () {
    if (token == '') {
      // syntax error or unexpected end of expression
      throw createSyntaxError('Unexpected end of expression');
    } else {
      throw createSyntaxError('Value expected');
    }
  }

  /**
   * Shortcut for getting the current row value (one based)
   * Returns the line of the currently handled expression
   * @private
   */
  /* TODO: implement keeping track on the row number
  function row () {
    return null;
  }
  */

  /**
   * Shortcut for getting the current col value (one based)
   * Returns the column (position) where the last token starts
   * @private
   */
  function col () {
    return index - token.length + 1;
  }

  /**
   * Create an error
   * @param {string} message
   * @return {SyntaxError} instantiated error
   * @private
   */
  function createSyntaxError (message) {
    var c = col();
    var error = new SyntaxError(message + ' (char ' + c + ')');
    error['char'] = c;

    return error;
  }

  /**
   * Create an error
   * @param {string} message
   * @return {Error} instantiated error
   * @private
   */
  function createError (message) {
    var c = col();
    var error = new Error(message + ' (char ' + c + ')');
    error['char'] = c;

    return error;
  }

  return parse;
};

exports.name = 'parse';
exports.path = 'expression';
exports.factory = factory;
