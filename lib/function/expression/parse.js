module.exports = function (math, settings) {
  var util = require('../../util/index'),

      toNumber = util.number.toNumber,
      isString = util.string.isString,
      isArray = Array.isArray,

      // types
      BigNumber = require('bignumber.js'),
      Complex = require('./../../type/Complex'),
      Matrix = require('./../../type/Matrix'),
      Unit = require('./../../type/Unit'),
      collection = require('../../type/collection'),

      // scope and nodes
      Scope = require('./../../expression/Scope'),
      ArrayNode = require('../../expression/node/ArrayNode'),
      AssignmentNode = require('../../expression/node/AssignmentNode'),
      BlockNode = require('../../expression/node/BlockNode'),
      ConstantNode = require('../../expression/node/ConstantNode'),
      FunctionNode = require('../../expression/node/FunctionNode'),
      OperatorNode = require('../../expression/node/OperatorNode'),
      ParamsNode = require('../../expression/node/ParamsNode'),
      RangeNode = require('../../expression/node/RangeNode'),
      SymbolNode = require('../../expression/node/SymbolNode'),
      UnitNode = require('../../expression/node/UnitNode'),
      UpdateNode = require('../../expression/node/UpdateNode'),
      handlers = require('../../expression/node/handlers');

  /**
   * Parse an expression. Returns a node tree, which can be evaluated by
   * invoking node.eval();
   *
   * Syntax:
   *
   *     math.parse(expr)
   *     math.parse(expr, scope)
   *     math.parse([expr1, expr2, expr3, ...])
   *     math.parse([expr1, expr2, expr3, ...], scope)
   *
   * Example:
   *
   *     var node = math.parse('sqrt(3^2 + 4^2)');
   *     node.eval(); // 5
   *
   *     var scope = {a:3, b:4}
   *     var node = math.parse('a * b', scope); // 12
   *     node.eval(); // 12
   *     scope.a = 5;
   *     node.eval(); // 20
   *
   *     var nodes = math.parse(['a = 3', 'b = 4', 'a * b']);
   *     nodes[2].eval(); // 12
   *
   * @param {String | String[] | Matrix} expr
   * @param {Scope | Object} [scope]
   * @return {Node | Node[]} node
   * @throws {Error}
   */
  math.parse = function parse (expr, scope) {
    if (arguments.length != 1 && arguments.length != 2) {
      throw new math.error.ArgumentsError('parse', arguments.length, 1, 2);
    }

    // instantiate a scope
    var parseScope;
    if (scope) {
      if (scope instanceof Scope) {
        parseScope = scope;
      }
      else {
        parseScope = new Scope(math, scope);
      }
    }
    else {
      parseScope = new Scope(math);
    }

    if (isString(expr)) {
      // parse a single expression
      expression = expr || '';
      return parseStart(parseScope);
    }
    else if (isArray(expr) || expr instanceof Matrix) {
      // parse an array or matrix with expressions
      return collection.deepMap(expr, function (elem) {
        expression = elem || '';
        return parseStart(parseScope);
      });
    }
    else {
      // oops
      throw new TypeError('String or matrix expected');
    }
  };

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
    '\n': true,
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
    '!': true,
    '\'': true,
    '=': true,
    ':': true,

    '==': true,
    '!=': true,
    '<': true,
    '>': true,
    '<=': true,
    '>=': true
  };

    // map with all named delimiters
  var NAMED_DELIMITERS = {
      'mod': true,
      'in': true
  };

  var expression = '';  // current expression
  var index = 0;        // current index in expr
  var c = '';           // current token character in expr
  var token = '';       // current token
  var token_type = TOKENTYPE.NULL; // type of the token

  /**
   * Get the first character from the expression.
   * The character is stored into the char c. If the end of the expression is
   * reached, the function puts an empty string in c.
   * @private
   */
  function first() {
    index = 0;
    c = expression.charAt(0);
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
   * @return {String} cNext
   * @private
   */
  function nextPreview() {
    return expression.charAt(index + 1);
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
    while (c == ' ' || c == '\t') {  // space or tab
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

    // check for delimiters consisting of 2 characters
    var c2 = c + nextPreview();
    if (DELIMITERS[c2]) {
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

      // check for exponential notation like "2.3e-4" or "1.23e50"
      if (c == 'E' || c == 'e') {
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
    if (isAlpha(c)) {
      while (isAlpha(c) || isDigit(c)) {
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
   * Check if a given name is valid
   * if not, an error is thrown
   * @param {String} name
   * @return {boolean} valid
   * @private
   */
    // TODO: check for valid symbol name
  function isValidSymbolName (name) {
    for (var i = 0, iMax = name.length; i < iMax; i++) {
      var c = name.charAt(i);
      //var valid = (isAlpha(c) || (i > 0 && isDigit(c))); // TODO: allow digits in symbol name
      var valid = (isAlpha(c));
      if (!valid) {
        return false;
      }
    }

    return true;
  }

  /**
   * checks if the given char c is a letter (upper or lower case)
   * or underscore
   * @param {String} c   a string with one character
   * @return {Boolean}
   * @private
   */
  function isAlpha (c) {
    return ((c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c == '_');
  }

  /**
   * checks if the given char c is a digit or dot
   * @param {String} c   a string with one character
   * @return {Boolean}
   * @private
   */
  function isDigitDot (c) {
    return ((c >= '0' && c <= '9') ||
        c == '.');
  }

  /**
   * checks if the given char c is a digit
   * @param {String} c   a string with one character
   * @return {Boolean}
   * @private
   */
  function isDigit (c) {
    return ((c >= '0' && c <= '9'));
  }

  /**
   * Start of the parse levels below, in order of precedence
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseStart (scope) {
    // get the first character in expression
    first();

    getToken();

    var node;
    if (token == '') {
      // empty expression
      node = new ConstantNode(undefined);
    }
    else {
      node = parseBlock(scope);
    }

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and token_type DELIMITER
    if (token != '') {
      if (token_type == TOKENTYPE.DELIMITER) {
        // user entered a not existing operator like "//"

        // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
        throw createError('Unknown operator ' + token);
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
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseBlock (scope) {
    var node, block, visible;

    if (token != '\n' && token != ';' && token != '') {
      node = parseAns(scope);
    }

    while (token == '\n' || token == ';') {
      if (!block) {
        // initialize the block
        block = new BlockNode();
        if (node) {
          visible = (token != ';');
          block.add(node, visible);
        }
      }

      getToken();
      if (token != '\n' && token != ';' && token != '') {
        node = parseAns(scope);

        visible = (token != ';');
        block.add(node, visible);
      }
    }

    if (block) {
      return block;
    }

    if (!node) {
      node = parseAns(scope);
    }

    return node;
  }

  /**
   * Parse assignment of ans.
   * Ans is assigned when the expression itself is no variable or function
   * assignment
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseAns (scope) {
    var expression = parseFunctionAssignment(scope);

    // create a variable definition for ans
    var name = 'ans';
    return new AssignmentNode(name, expression, scope);
  }

  /**
   * Parse a function assignment like "function f(a,b) = a*b"
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseFunctionAssignment (scope) {
    // TODO: keyword 'function' must become a reserved keyword
    // TODO: replace the 'function' keyword with an assignment operator '=>'
    if (token_type == TOKENTYPE.SYMBOL && token == 'function') {
      // get function name
      getToken();
      if (token_type != TOKENTYPE.SYMBOL) {
        throw createSyntaxError('Function name expected');
      }
      var name = token;

      // get parenthesis open
      getToken();
      if (token != '(') {
        throw createSyntaxError('Opening parenthesis ( expected');
      }

      // get function variables
      var functionScope = scope.createSubScope();
      var variables = [];
      while (true) {
        getToken();
        if (token_type == TOKENTYPE.SYMBOL) {
          // store variable name
          variables.push(token);

          getToken();
        }

        if (token == ',') {
          // ok, nothing to do, read next variable
        }
        else if (token == ')') {
          // end of variable list encountered. break loop
          break;
        }
        else {
          throw createSyntaxError('Comma , or closing parenthesis ) expected"');
        }
      }

      getToken();
      if (token != '=') {
        throw createSyntaxError('Equal sign = expected');
      }

      // parse the expression, with the correct function scope
      getToken();
      var expression = parseAssignment(functionScope);

      return new FunctionNode(name, variables, expression, functionScope, scope);
    }

    return parseAssignment(scope);
  }

  /**
   * Assignment of a variable, can be a variable like "a=2.3" or a updating an
   * existing variable like "matrix(2,3:5)=[6,7,8]"
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseAssignment (scope) {
    var name, params, paramScopes, expr;

    var node = parseRange(scope);

    if (token == '=') {
      if (node instanceof SymbolNode) {
        // parse the expression, with the correct function scope
        getToken();
        name = node.name;
        params = null;
        expr = parseAssignment(scope);
        return new AssignmentNode(name, expr, scope);
      }
      else if ((node instanceof ParamsNode) && (node.object instanceof SymbolNode)) {
        // parse the expression, with the correct function scope
        getToken();
        name = node.object.name;
        params = node.params;
        paramScopes = node.paramScopes;
        expr = parseAssignment(scope);
        return new UpdateNode(math, name, params, paramScopes, expr, scope);
      }
      else {
        throw createSyntaxError('Symbol expected at the left hand side ' +
            'of assignment operator =');
      }
    }

    return node;
  }

  /**
   * parse range, "start:end", "start:step:end", ":", "start:", ":end", etc
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseRange (scope) {
    var node, params = [];

    if (token == ':') {
      // implicit start=1 (one-based)
      var one = (settings.number === 'bignumber') ? new BigNumber(1) : 1;
      node = new ConstantNode(one);
    }
    else {
      // explicit start
      node = parseBitwiseConditions(scope);
    }

    if (token == ':') {
      params.push(node);

      // parse step and end
      while (token == ':') {
        getToken();
        if (token == ')' || token == ',' || token == '') {
          // implicit end
          params.push(new SymbolNode('end', scope));
        }
        else {
          // explicit end
          params.push(parseBitwiseConditions(scope));
        }
      }

      if (params.length) {
        node = new RangeNode(math, settings, params);
      }
    }

    return node;
  }

  /**
   * conditional operators and bitshift
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseBitwiseConditions (scope) {
    var node = parseComparison(scope);

    /* TODO: implement bitwise conditions
     var operators = {
     '&' : bitwiseand,
     '|' : bitwiseor,
     // todo: bitwise xor?
     '<<': bitshiftleft,
     '>>': bitshiftright
     };
     while (token in operators) {
     var name = token;
     var fn = operators[name];

     getToken();
     var params = [node, parseComparison()];
     node = new OperatorNode(name, fn, params);
     }
     */

    return node;
  }

  /**
   * comparison operators
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseComparison (scope) {
    var node, operators, name, fn, params;

    node = parseConditions(scope);

    operators = {
      '==': math.equal,
      '!=': math.unequal,
      '<': math.smaller,
      '>': math.larger,
      '<=': math.smallereq,
      '>=': math.largereq
    };
    while (token in operators) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node, parseConditions(scope)];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * conditions like and, or, in
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseConditions (scope) {
    var node, operators, name, fn, params;

    node = parseAddSubtract(scope);

    // TODO: precedence of And above Or?
    // TODO: implement a method for unit to number conversion
    operators = {
      'in' : math['in']
      /* TODO: implement conditions
       'and' : 'and',
       '&&' : 'and',
       'or': 'or',
       '||': 'or',
       'xor': 'xor'
       */
    };

    while (token in operators) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node, parseAddSubtract(scope)];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * add or subtract
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseAddSubtract (scope)  {
    var node, operators, name, fn, params;

    node = parseMultiplyDivide(scope);

    operators = {
      '+': math.add,
      '-': math.subtract
    };
    while (token in operators) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node, parseMultiplyDivide(scope)];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * multiply, divide, modulus
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseMultiplyDivide (scope) {
    var node, operators, name, fn, params;

    node = parseUnit(scope);

    operators = {
      '*': math.multiply,
      '.*': math.emultiply,
      '/': math.divide,
      './': math.edivide,
      '%': math.mod,
      'mod': math.mod
    };

    while (token in operators) {
      name = token;
      fn = operators[name];

      getToken();
      params = [node, parseUnit(scope)];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * parse units like in '2i', '2 cm'
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseUnit(scope) {
    var node, symbol;

    node = parseUnary(scope);

    while (token_type == TOKENTYPE.SYMBOL) {
      symbol = token;

      getToken();

      node = new UnitNode(node, symbol);
    }

    return node;
  }

  /**
   * Unary minus
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseUnary (scope) {
    var name, fn, params;

    if (token == '-') {
      name = token;
      fn = math.unary;
      getToken();
      params = [parseUnary(scope)];

      return new OperatorNode(name, fn, params);
    }

    return parsePow(scope);
  }

  /**
   * power
   * Note: power operator is right associative
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parsePow (scope) {
    var node, leftNode, nodes, ops, name, fn, params;

    nodes = [
      parseLeftHandOperators(scope)
    ];
    ops = [];

    // stack all operands of a chained power operator (like '2^3^3')
    while (token == '^' || token == '.^') {
      ops.push(token);
      getToken();
      nodes.push(parseLeftHandOperators(scope));
    }

    // evaluate the operands from right to left (right associative)
    node = nodes.pop();
    while (nodes.length) {
      leftNode = nodes.pop();
      name = ops.pop();
      fn = (name == '^') ? math.pow : math.epow;
      params = [leftNode, node];
      node = new OperatorNode(name, fn, params);
    }

    return node;
  }

  /**
   * Left hand operators: factorial x!, transpose x'
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseLeftHandOperators (scope)  {
    var node, operators, name, fn, params;

    node = parseNodeHandler(scope);

    operators = {
      '!': math.factorial,
      '\'': math.transpose
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
   * A handler must be defined in the namespace math.expression.node.handlers,
   * and must extend math.expression.node.Node, and the handler must contain
   * functions eval(), find(filter), and toString().
   *
   * For example:
   *
   *     math.expression.node.handlers['plot'] = PlotHandler;
   *
   * The constructor of the handler is called as:
   *
   *     node = new PlotHandler(params, paramScopes);
   *
   * The handler will be invoked when evaluating an expression like:
   *
   *     node = math.parse('plot(sin(x), x)');
   *
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseNodeHandler (scope) {
    var params,
        paramScopes,
        paramScope,
        handler;

    if (token_type == TOKENTYPE.SYMBOL && handlers[token]) {
      handler = handlers[token];

      getToken();

      // parse parameters
      if (token == '(') {
        params = [];
        paramScopes = [];

        getToken();

        if (token != ')') {
          paramScope = scope.createSubScope();
          paramScopes.push(paramScope);
          params.push(parseRange(paramScope));

          // parse a list with parameters
          while (token == ',') {
            getToken();

            paramScope = scope.createSubScope();
            paramScopes.push(paramScope);
            params.push(parseRange(paramScope));
          }
        }

        if (token != ')') {
          throw createSyntaxError('Parenthesis ) expected');
        }
        getToken();
      }

      // create a new node handler
      //noinspection JSValidateTypes
      return new handler(params, paramScopes);
    }

    return parseSymbol(scope);
  }

  /**
   * parse symbols: functions, variables, constants, units
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseSymbol (scope) {
    var node, name;

    if (token_type == TOKENTYPE.SYMBOL ||
        (token_type == TOKENTYPE.DELIMITER && token in NAMED_DELIMITERS)) {
      name = token;

      getToken();

      // create a symbol
      node = new SymbolNode(name, scope);

      // parse parameters
      return parseParams(scope, node);
    }

    return parseString(scope);
  }

  /**
   * parse parameters, enclosed in parenthesis
   * @param {Scope} scope
   * @param {Node} node    Node on which to apply the parameters. If there
   *                       are no parameters in the expression, the node
   *                       itself is returned
   * @return {Node} node
   * @private
   */
  function parseParams (scope, node) {
    var bracket,
        params,
        paramScopes,
        paramScope;

    while (token == '(') {
      bracket = token;
      params = [];
      paramScopes = [];

      getToken();

      if (token != ')') {
        paramScope = scope.createSubScope();
        paramScopes.push(paramScope);
        params.push(parseRange(paramScope));

        // parse a list with parameters
        while (token == ',') {
          getToken();

          paramScope = scope.createSubScope();
          paramScopes.push(paramScope);
          params.push(parseRange(paramScope));
        }
      }

      if ((bracket == '(' && token != ')')) {
        throw createSyntaxError('Parenthesis ) expected');
      }
      getToken();

      node = new ParamsNode(math, node, params, paramScopes);
    }

    return node;
  }

  /**
   * parse a string.
   * A string is enclosed by double quotes
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseString (scope) {
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
      node = new ConstantNode(str);

      // parse parameters
      node = parseParams(scope, node);

      return node;
    }

    return parseMatrix(scope);
  }

  /**
   * parse the matrix
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseMatrix (scope) {
    var array, params, rows, cols;

    if (token == '[') {
      // matrix [...]

      // skip newlines
      getToken();
      while (token == '\n') {
        getToken();
      }

      if (token != ']') {
        // this is a non-empty matrix
        var row = parseRow(scope);

        if (token == ';') {
          // 2 dimensional array
          rows = 1;
          params = [row];

          // the rows of the matrix are separated by dot-comma's
          while (token == ';') {
            getToken();

            // skip newlines
            while (token == '\n') {
              getToken();
            }

            params[rows] = parseRow(scope);
            rows++;

            // skip newlines
            while (token == '\n') {
              getToken();
            }
          }

          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          getToken();

          // check if the number of columns matches in all rows
          cols = (params.length > 0) ? params[0].length : 0;
          for (var r = 1; r < rows; r++) {
            if (params[r].length != cols) {
              throw createError('Number of columns must match ' +
                  '(' + params[r].length + ' != ' + cols + ')');
            }
          }

          array = new ArrayNode(settings, params);
        }
        else {
          // 1 dimensional vector
          if (token != ']') {
            throw createSyntaxError('End of matrix ] expected');
          }
          getToken();

          array = row;
        }
      }
      else {
        // this is an empty matrix "[ ]"
        getToken();
        array = new ArrayNode(settings, []);
      }

      // parse parameters
      array = parseParams(scope, array);

      return array;
    }

    return parseNumber(scope);
  }

  /**
   * Parse a single comma-separated row from a matrix, like 'a, b, c'
   * @param {Scope} scope
   * @return {ArrayNode} node
   */
  function parseRow (scope) {
    var params = [parseAssignment(scope)];
    var len = 1;

    while (token == ',') {
      getToken();

      // skip newlines
      while (token == '\n') {
        getToken();
      }

      // parse expression
      params[len] = parseAssignment(scope);
      len++;

      // skip newlines
      while (token == '\n') {
        getToken();
      }
    }

    return new ArrayNode(settings, params);
  }

  /**
   * parse a number
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseNumber (scope) {
    var node, value, number;

    if (token_type == TOKENTYPE.NUMBER) {
      // this is a number
      if (settings.number == 'bignumber') {
        // parse a big number
        number = new BigNumber((token == '.') ? 0 : token);
      }
      else {
        // parse a regular number
        number = (token == '.') ? 0 : Number(token);
      }
      getToken();

      if (token == 'i' || token == 'I') {
        // create a complex number

        // convert bignumber to number as Complex doesn't support BigNumber
        number = (number instanceof BigNumber) ? toNumber(number) : number;

        value = new Complex(0, number);
        getToken();
        node = new ConstantNode(value);
      }
      else {
        // a real number
        node = new ConstantNode(number);
      }

      // parse parameters
      node = parseParams(scope, node);

      return node;
    }

    return parseParentheses(scope);
  }

  /**
   * parentheses
   * @param {Scope} scope
   * @return {Node} node
   * @private
   */
  function parseParentheses (scope) {
    var node;

    // check if it is a parenthesized expression
    if (token == '(') {
      // parentheses (...)
      getToken();
      node = parseAssignment(scope); // start again

      if (token != ')') {
        throw createSyntaxError('Parenthesis ) expected');
      }
      getToken();

      /* TODO: implicit multiplication?
       // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
       // check for implicit multiplication
       if (token_type == TOKENTYPE.SYMBOL) {
       node = multiply(node, parsePow());
       }
       //*/

      // parse parameters
      node = parseParams(scope, node);

      return node;
    }

    return parseEnd(scope);
  }

  /**
   * Evaluated when the expression is not yet ended but expected to end
   * @param {Scope} scope
   * @return {Node} res
   * @private
   */
  function parseEnd (scope) {
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
  function row () {
    // TODO: also register row number during parsing
    return undefined;
  }

  /**
   * Shortcut for getting the current col value (one based)
   * Returns the column (position) where the last token starts
   * @private
   */
  function col () {
    return index - token.length + 1;
  }

  /**
   * Build up an error message
   * @param {String} message
   * @return {String} message with row and column information
   * @private
   */
  function createErrorMessage (message) {
    var r = row();
    var c = col();
    if (r === undefined) {
      if (c === undefined) {
        return message;
      } else {
        return message + ' (char ' + c + ')';
      }
    } else {
      return message + ' (line ' + r + ', char ' + c + ')';
    }
  }

  /**
   * Create an error
   * @param {String} message
   * @return {SyntaxError} instantiated error
   * @private
   */
  function createSyntaxError (message) {
    return new SyntaxError(createErrorMessage(message));
  }

  /**
   * Create an error
   * @param {String} message
   * @return {TypeError} instantiated error
   * @private
   */
  function createTypeError(message) {
    return new TypeError(createErrorMessage(message));
  }

  /**
   * Create an error
   * @param {String} message
   * @return {Error} instantiated error
   * @private
   */
  function createError (message) {
    return new Error(createErrorMessage(message));
  }
};
