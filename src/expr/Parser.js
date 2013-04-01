(function () {
    /**
     * @constructor math.expr.Parser
     * Parser parses math expressions and evaluates them or returns a node tree.
     *
     * Methods:
     *    var result = parser.eval(expr);    // evaluate an expression
     *    var value = parser.get(name);      // retrieve a variable from the parser
     *    parser.set(name, value);           // set a variable in the parser
     *
     *    // it is possible to parse an expression into a node tree:
     *    var node = parser.parse(expr);     // parse an expression into a node tree
     *    var result = node.eval();          // evaluate a parsed node
     *
     * Example usage:
     *    var parser = new math.expr.Parser();
     *    // Note: there is a convenience method which can be used instead:
     *    // var parser = new math.parser();
     *
     *    // evaluate expressions
     *    var a = parser.eval('sqrt(3^2 + 4^2)'); // 5
     *    var b = parser.eval('sqrt(-4)');        // 2i
     *    var c = parser.eval('2 inch in cm');    // 5.08 cm
     *    var d = parser.eval('cos(45 deg)');     // 0.7071067811865476
     *
     *    // define variables and functions
     *    parser.eval('x = 7 / 2');               // 3.5
     *    parser.eval('x + 3');                   // 6.5
     *    parser.eval('function f(x, y) = x^y');  // f(x, y)
     *    parser.eval('f(2, 3)');                 // 8
     *
     *    // get and set variables and functions
     *    var x = parser.get('x');                // 7
     *    var f = parser.get('f');                // function
     *    var g = f(3, 2);                        // 9
     *    parser.set('h', 500);
     *    var i = parser.eval('h / 2');           // 250
     *    parser.set('hello', function (name) {
     *        return 'hello, ' + name + '!';
     *    });
     *    parser.eval('hello("user")');           // "hello, user!"
     *
     *    // clear defined functions and variables
     *    parser.clear();
     */
    math.expr.Parser = function Parser() {
        if (this.constructor != Parser) {
            throw new SyntaxError(
                'Parser constructor must be called with the new operator');
        }

        this.scope = new math.expr.Scope();
    };

    /**
     * Parse an expression end return the parsed function node.
     * The node can be evaluated via node.eval()
     * @param {String} expression
     * @param {Scope} [scope]
     * @return {Node} node
     * @throws {Error}
     */
    math.expr.Parser.prototype.parse = function (expression, scope) {
        expr = expression || '';

        if (!scope) {
            this._newScope();
            scope = this.scope;
        }

        return parse_start(scope);
    };

    /**
     * Parse and evaluate the given expression
     * @param {String} expression   A string containing an expression, for example "2+3"
     * @return {*} result           The result, or undefined when the expression was
     *                              empty
     * @throws {Error}
     */
    math.expr.Parser.prototype.eval = function (expression) {
        var node = this.parse(expression);
        return node.eval();
    };

    /**
     * Get a variable (a function or variable) by name from the parsers scope.
     * Returns undefined when not found
     * @param {String} name
     * @return {* | undefined} value
     */
    math.expr.Parser.prototype.get = function (name) {
        this._newScope();
        var symbol = this.scope.findDef(name);
        if (symbol) {
            return symbol.value;
        }
        return undefined;
    };

    /**
     * Set a symbol (a function or variable) by name from the parsers scope.
     * @param {String} name
     * @param {* | undefined} value
     */
    math.expr.Parser.prototype.set = function (name, value) {
        this.scope.createDef(name, value);
    };

    /**
     * Create a new scope having the current scope as parent scope, to make current
     * scope immutable
     * @private
     */
    math.expr.Parser.prototype._newScope = function () {
        this.scope = new math.expr.Scope(this.scope);

        // TODO: smartly cleanup scopes which are not relevant anymore

    };

    /**
     * Clear the scope with variables and functions
     */
    math.expr.Parser.prototype.clear = function () {
        this.scope.clear();
    };

    // token types enumeration
    var TOKENTYPE = {
        NULL : 0,
        DELIMITER : 1,
        NUMBER : 2,
        SYMBOL : 3,
        UNKNOWN : 4
    };

    var expr = '';        // current expression
    var index = 0;        // current index in expr
    var c = '';           // current token character in expr
    var token = '';       // current token
    var token_type = TOKENTYPE.NULL; // type of the token
    // TODO: do not use this.token, but a local variable var token for better speed? -> getToken() must return token.

    /**
     * Get the next character from the expression.
     * The character is stored into the char t.
     * If the end of the expression is reached, the function puts an empty
     * string in t.
     * @private
     */
    function getChar() {
        index++;
        c = expr.charAt(index);
    }

    /**
     * Get the first character from the expression.
     * The character is stored into the char t.
     * If the end of the expression is reached, the function puts an empty
     * string in t.
     * @private
     */
    function getFirstChar() {
        index = 0;
        c = expr.charAt(0);
    }

    /**
     * Get next token in the current string expr.
     * Uses the Parser data expr, e, token, t, token_type and err
     * The token and token type are available at token_type and token
     * @private
     */
    function getToken() {
        token_type = TOKENTYPE.NULL;
        token = '';

        // skip over whitespaces
        while (c == ' ' || c == '\t') {  // space or tab
            getChar();
        }

        // skip comment
        if (c == '#') {
            while (c != '\n' && c != '') {
                getChar();
            }
        }

        // check for end of expression
        if (c == '') {
            // token is still empty
            token_type = TOKENTYPE.DELIMITER;
            return;
        }

        // check for minus, comma, parentheses, quotes, newline, semicolon
        if (c == '-' || c == ',' ||
            c == '(' || c == ')' ||
            c == '[' || c == ']' ||
            c == '\"' || c == '\n' ||
            c == ';' || c == ':') {
            token_type = TOKENTYPE.DELIMITER;
            token += c;
            getChar();
            return;
        }

        // check for operators (delimiters)
        if (isDelimiter(c)) {
            token_type = TOKENTYPE.DELIMITER;
            while (isDelimiter(c)) {
                token += c;
                getChar();
            }
            return;
        }

        // check for a number
        if (isDigitDot(c)) {
            token_type = TOKENTYPE.NUMBER;
            while (isDigitDot(c)) {
                token += c;
                getChar();
            }

            // check for scientific notation like "2.3e-4" or "1.23e50"
            if (c == 'E' || c == 'e') {
                token += c;
                getChar();

                if (c == '+' || c == '-') {
                    token += c;
                    getChar();
                }

                // Scientific notation MUST be followed by an exponent
                if (!isDigit(c)) {
                    // this is no legal number, exponent is missing.
                    token_type = TOKENTYPE.UNKNOWN;
                }

                while (isDigit(c)) {
                    token += c;
                    getChar();
                }
            }
            return;
        }

        // check for variables or functions
        if (isAlpha(c)) {
            token_type = TOKENTYPE.SYMBOL;

            while (isAlpha(c) || isDigit(c))
            {
                token += c;
                getChar();
            }
            return;
        }

        // something unknown is found, wrong characters -> a syntax error
        token_type = TOKENTYPE.UNKNOWN;
        while (c != '') {
            token += c;
            getChar();
        }
        throw createSyntaxError('Syntax error in part "' + token + '"');
    }

    /**
     * checks if the given char c is a delimiter
     * minus is not checked in this method (can be unary minus)
     * @param {String} c   a string with one character
     * @return {Boolean}
     * @private
     */
    function isDelimiter (c) {
        return c == '&' ||
            c == '|' ||
            c == '<' ||
            c == '>' ||
            c == '=' ||
            c == '+' ||
            c == '/' ||
            c == '*' ||
            c == '%' ||
            c == '^' ||
            c == ',' ||
            c == ';' ||
            c == '\n' ||
            c == '!';
    }

    /**
     * Check if a given name is valid
     * if not, an error is thrown
     * @param {String} name
     * @return {boolean} valid
     * @private
     */
    function isValidSymbolName (name) {
        for (var i = 0, iMax = name.length; i < iMax; i++) {
            var c = name.charAt(i);
            //var valid = (isAlpha(c) || (i > 0 && isDigit(c))); // TODO
            var valid = (isAlpha(c));
            if (!valid) {
                return false;
            }
        }

        return true;
    };

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
    function parse_start (scope) {
        // get the first character in expression
        getFirstChar();

        getToken();

        var node;
        if (token == '') {
            // empty expression
            node = new Constant(undefined);
        }
        else {
            node = parse_block(scope);
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
     * Parse assignment of ans.
     * Ans is assigned when the expression itself is no variable or function
     * assignment
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_ans (scope) {
        var expression = parse_function_assignment(scope);

        // TODO: not so nice having to specify some special types here...
        if (!(expression instanceof Assignment)
        // !(expression instanceof FunctionAssignment) &&  // TODO
        // !(expression instanceof plot)                   // TODO
            ) {
            // create a variable definition for ans
            var name = 'ans';
            var params = undefined;
            var link = scope.createDef(name);
            return new Assignment(name, params, expression, link);
        }

        return expression;
    }

    /**
     * Parse a block with expressions. Expressions can be separated by a newline
     * character '\n', or by a semicolon ';'. In case of a semicolon, no output
     * of the preceding line is returned.
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_block (scope) {
        var node, block, visible;

        if (token != '\n' && token != ';' && token != '') {
            node = parse_ans(scope);
        }

        while (token == '\n' || token == ';') {
            if (!block) {
                // initialize the block
                block = new Block();
                if (node) {
                    visible = (token != ';');
                    block.add(node, visible);
                }
            }

            getToken();
            if (token != '\n' && token != ';' && token != '') {
                node = parse_ans(scope);

                visible = (token != ';');
                block.add(node, visible);
            }
        }

        if (block) {
            return block;
        }

        if (!node) {
            node = parse_ans(scope);
        }

        return node;
    }

    /**
     * Parse a function assignment like "function f(a,b) = a*b"
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_function_assignment (scope) {
        // TODO: keyword 'function' must become a reserved keyword
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
            var functionScope = scope.createNestedScope();
            var variableNames = [];
            var variables = [];
            while (true) {
                getToken();
                if (token_type == TOKENTYPE.SYMBOL) {
                    // store parameter
                    var variableName = token;
                    var variable = functionScope.createDef(variableName);
                    variableNames.push(variableName);
                    variables.push(variable);
                }
                else {
                    throw createSyntaxError('Variable name expected');
                }

                getToken();
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
            var expression = parse_range(functionScope);
            var result = scope.createDef(name);

            return  new FunctionAssignment(name, variableNames, variables,
                expression, result);
        }

        return parse_assignment(scope);
    }

    /**
     * Assignment of a variable, can be a variable like "a=2.3" or a updating an
     * existing variable like "matrix(2,3:5)=[6,7,8]"
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_assignment (scope) {
        var linkExisted = false;
        if (token_type == TOKENTYPE.SYMBOL) {
            linkExisted = scope.hasLink(token);
        }

        var node = parse_range(scope);

        // TODO: support chained assignments like "a = b = 2.3"
        if (token == '=') {
            if (!(node instanceof Symbol)) {
                throw createSyntaxError('Symbol expected at the left hand side ' +
                    'of assignment operator =');
            }
            var name = node.name;
            var params = node.params;

            if (!linkExisted) {
                // we parsed the assignment as if it where an expression instead,
                // therefore, a link was created to the symbol. This link must
                // be cleaned up again, and only if it wasn't existing before
                scope.removeLink(name);
            }

            // parse the expression, with the correct function scope
            getToken();
            var expression = parse_range(scope);
            var link = node.hasParams() ? scope.createUpdate(name) : scope.createDef(name);
            return new Assignment(name, params, expression, link);
        }

        return node;
    }

    /**
     * parse range, "start:end" or "start:step:end"
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_range (scope) {
        var node = parse_conditions(scope);

        if (token == ':') {
            var params = [node];

            while (token == ':') {
                getToken();
                params.push(parse_conditions(scope));
            }

            if (params.length > 3) {
                throw new TypeError('Invalid range');
            }

            var name = 'range';
            var fn = range;
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * conditions like and, or, in
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_conditions (scope) {
        var node = parse_bitwise_conditions(scope);

        // TODO: precedence of And above Or?
        var operators = {
            'in' : 'in'
            /* TODO: implement conditions
             'and' : 'and',
             '&&' : 'and',
             'or': 'or',
             '||': 'or',
             'xor': 'xor'
             */
        };
        while (operators[token] !== undefined) {
            // TODO: with all operators: only load one instance of the operator, use the scope
            var name = token;
            var fn = math[operators[name]];

            getToken();
            var params = [node, parse_bitwise_conditions(scope)];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * conditional operators and bitshift
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_bitwise_conditions (scope) {
        var node = parse_comparison(scope);

        /* TODO: implement bitwise conditions
         var operators = {
         '&' : 'bitwiseand',
         '|' : 'bitwiseor',
         // todo: bitwise xor?
         '<<': 'bitshiftleft',
         '>>': 'bitshiftright'
         };
         while (operators[token] !== undefined) {
         var name = token;
         var fn = math[operators[name]];

         getToken();
         var params = [node, parse_comparison()];
         node = new Symbol(name, fn, params);
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
    function parse_comparison (scope) {
        var node = parse_addsubtract(scope);

        var operators = {
            '==': 'equal',
            '!=': 'unequal',
            '<': 'smaller',
            '>': 'larger',
            '<=': 'smallereq',
            '>=': 'largereq'
        };
        while (operators[token] !== undefined) {
            var name = token;
            var fn = math[operators[name]];

            getToken();
            var params = [node, parse_addsubtract(scope)];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * add or subtract
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_addsubtract (scope)  {
        var node = parse_multiplydivide(scope);

        var operators = {
            '+': 'add',
            '-': 'subtract'
        };
        while (operators[token] !== undefined) {
            var name = token;
            var fn = math[operators[name]];

            getToken();
            var params = [node, parse_multiplydivide(scope)];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * multiply, divide, modulus
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_multiplydivide (scope) {
        var node = parse_unaryminus(scope);

        var operators = {
            '*': 'multiply',
            '/': 'divide',
            '%': 'mod',
            'mod': 'mod'
        };
        while (operators[token] !== undefined) {
            var name = token;
            var fn = math[operators[name]];

            getToken();
            var params = [node, parse_unaryminus(scope)];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * Unary minus
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_unaryminus (scope) {
        if (token == '-') {
            var name = token;
            var fn = unaryminus;
            getToken();
            var params = [parse_pow(scope)];

            return new Symbol(name, fn, params);
        }

        return parse_pow(scope);
    }

    /**
     * power
     * Node: power operator is right associative
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_pow (scope) {
        var nodes = [
            parse_factorial(scope)
        ];

        // stack all operands of a chained power operator (like '2^3^3')
        while (token == '^') {
            getToken();
            nodes.push(parse_factorial(scope));
        }

        // evaluate the operands from right to left (right associative)
        var node = nodes.pop();
        while (nodes.length) {
            var leftNode = nodes.pop();
            var name = '^';
            var fn = pow;
            var params = [leftNode, node];
            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * Factorial
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_factorial (scope)  {
        var node = parse_plot(scope);

        while (token == '!') {
            var name = token;
            var fn = factorial;
            getToken();
            var params = [node];

            node = new Symbol(name, fn, params);
        }

        return node;
    }

    /**
     * parse plot
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_plot (scope) {
        /* TODO: implement plot
         if (token_type == TOKENTYPE.SYMBOL &&
         token == 'plot') {
         getToken();

         // parse the parentheses and parameters of the plot
         // the parameters are something like: plot(sin(x), cos(x), x)
         var functions = [];
         if (token == '(') {
         var plotScope = scope.createNestedScope();

         getToken();
         functions.push(parse_range(plotScope));

         // parse a list with parameters
         while (token == ',') {
         getToken();
         functions.push(parse_range(plotScope));
         }

         if (token != ')') {
         throw createSyntaxError('Parenthesis ) missing');
         }
         getToken();
         }

         // check what the variable of the functions is.
         var variable = undefined;
         var lastFunction = functions[functions.length - 1];
         if (lastFunction) {
         // if the last function is a variable, remove it from the functions list
         // and use its variable func
         var lastIsSymbol = (lastFunction instanceof Symbol &&
         !lastFunction.hasParams());
         if (lastIsSymbol) {
         functions.pop();
         variable = lastFunction.fn;
         }
         }
         return new plot(functions, variable, plotScope);
         }
         */

        return parse_symbol(scope);
    }

    /**
     * parse symbols: functions, variables, constants, units
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_symbol (scope) {
        if (token_type == TOKENTYPE.SYMBOL) {
            var name = token;

            getToken();

            var link = scope.createLink(name);
            // TODO: split applying arguments from symbol?
            var arguments = parse_arguments(scope);
            var symbol = new Symbol(name, link, arguments);

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                symbol = parse_arguments(scope, symbol);
            }
            */
            return symbol;
        }

        return parse_string(scope);
    }

    /**
     * parse arguments, enclosed in parenthesis
     * @param {Scope} scope
     * @return {Node[]} arguments
     * @private
     */
    function parse_arguments (scope) {
        var arguments = [];
        if (token == '(') {
            // TODO: in case of Plot, create a new scope.

            getToken();

            if (token != ')') {
                arguments.push(parse_range(scope));

                // parse a list with parameters
                while (token == ',') {
                    getToken();
                    arguments.push(parse_range(scope));
                }
            }

            if (token != ')') {
                throw createSyntaxError('Parenthesis ) missing');
            }
            getToken();
        }

        return arguments;
    }

    /**
     * parse a string.
     * A string is enclosed by double quotes
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_string (scope) {
        if (token == '"') {
            // string "..."
            var str = '';
            var tPrev = '';
            while (c != '' && (c != '\"' || tPrev == '\\')) { // also handle escape character
                str += c;
                tPrev = c;
                getChar();
            }

            getToken();
            if (token != '"') {
                throw createSyntaxError('End of string " missing');
            }
            getToken();

            var node = new Constant(str);

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                node = parse_arguments(scope, node);
            }
            */

            return node;
        }

        return parse_matrix(scope);
    }

    /**
     * parse the matrix
     * @param {Scope} scope
     * @return {Node} A MatrixNode
     * @private
     */
    function parse_matrix (scope) {
        if (token == '[') {
            // matrix [...]
            var array;

            // skip newlines
            getToken();
            while (token == '\n') {
                getToken();
            }

            // check if this is an empty matrix "[ ]"
            if (token != ']') {
                // this is a non-empty matrix
                var params = [];
                var r = 0, c = 0;

                params[0] = [parse_range(scope)];

                // the columns in the matrix are separated by commas, and the rows by dot-comma's
                while (token == ',' || token == ';') {
                    if (token == ',') {
                        c++;
                    }
                    else {
                        r++;
                        c = 0;
                        params[r] = [];
                    }

                    // skip newlines
                    getToken();
                    while (token == '\n') {
                        getToken();
                    }

                    params[r][c] = parse_range(scope);

                    // skip newlines
                    while (token == '\n') {
                        getToken();
                    }
                }

                var rows =  params.length;
                var cols = (params.length > 0) ? params[0].length : 0;

                // check if the number of columns matches in all rows
                for (r = 1; r < rows; r++) {
                    if (params[r].length != cols) {
                        throw createError('Number of columns must match ' +
                            '(' + params[r].length + ' != ' + cols + ')');
                    }
                }

                if (token != ']') {
                    throw createSyntaxError('End of matrix ] missing');
                }

                getToken();
                array = new MatrixNode(params);
            }
            else {
                // this is an empty matrix "[ ]"
                getToken();
                array = new MatrixNode([]);
            }

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                array = parse_arguments(scope, array);
            }
            */

            return array;
        }

        return parse_number(scope);
    }

    /**
     * parse a number
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_number (scope) {
        if (token_type == TOKENTYPE.NUMBER) {
            // this is a number
            var number;
            if (token == '.') {
                number = 0.0;
            } else {
                number = Number(token);
            }
            getToken();

            /* TODO: implicit multiplication?
             // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
             // check for implicit multiplication
             if (token_type == TOKENTYPE.VARIABLE) {
             node = multiply(node, parse_pow());
             }
             //*/

            var value;
            if (token_type == TOKENTYPE.SYMBOL) {
                if (token == 'i' || token == 'I') {
                    value = new Complex(0, number);
                    getToken();
                    return new Constant(value);
                }

                if (Unit.isUnit(token)) {
                    value = new Unit(number, token);
                    getToken();
                    return new Constant(value);
                }

                throw createTypeError('Unknown unit "' + token + '"');
            }

            // just a regular number
            var node = new Constant(number);

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                node = parse_arguments(scope, node);
            }
            */

            return node;
        }

        return parse_parentheses(scope);
    }

    /**
     * parentheses
     * @param {Scope} scope
     * @return {Node} node
     * @private
     */
    function parse_parentheses (scope) {
        // check if it is a parenthesized expression
        if (token == '(') {
            // parentheses (...)
            getToken();
            var node = parse_range(scope); // start again

            if (token != ')') {
                throw createSyntaxError('Parenthesis ) expected');
            }
            getToken();

            /* TODO: implicit multiplication?
             // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
             // check for implicit multiplication
             if (token_type == TOKENTYPE.VARIABLE) {
             node = multiply(node, parse_pow());
             }
             //*/

            /* TODO: parse arguments
            // parse arguments
            while (token == '(') {
                node = parse_arguments(scope, node);
            }
            */

            return node;
        }

        return parse_end(scope);
    }

    /**
     * Evaluated when the expression is not yet ended but expected to end
     * @param {Scope} scope
     * @return {Node} res
     * @private
     */
    function parse_end (scope) {
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
        var row = row();
        var col = col();
        if (row === undefined) {
            if (col === undefined) {
                return message;
            } else {
                return message + ' (col ' + col + ')';
            }
        } else {
            return message + ' (ln ' + row + ', col ' + col + ')';
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

})();
