// TODO: do not use this.token, but a local variable var token for better speed? -> getToken() must return token.
// TODO: make all parse methods private

/**
 * @constructor math.parser.Parser
 * TODO: add comments to the Parser constructor
 */
function Parser() {
    // token types enumeration
    this.TOKENTYPE = {
        NULL : 0,
        DELIMITER : 1,
        NUMBER : 2,
        SYMBOL : 3,
        UNKNOWN : 4
    };

    this.expr = '';        // current expression
    this.index = 0;        // current index in expr
    this.c = '';           // current token character in expr
    this.token = '';       // current token
    this.token_type = this.TOKENTYPE.NULL; // type of the token

    this.scope = new Scope();
}

math.parser.Parser = Parser;

/**
 * Parse an expression end return the parsed function node.
 * The node can be evaluated via node.eval()
 * @param {String} expr
 * @param {Scope} [scope]
 * @return {Node} node
 * @throws {Error}
 */
Parser.prototype.parse = function (expr, scope) {
    this.expr = expr || '';

    if (!scope) {
        scope = this.scope;
    }

    return this.parse_start(scope);
};

/**
 * Parse and evaluate the given expression
 * @param {String} expr     A string containing an expression, for example "2+3"
 * @return {*} result       The result, or undefined when the expression was
 *                          empty
 * @throws {Error}
 */
Parser.prototype.eval = function (expr) {
    var result = undefined;

    try {
        var node = this.parse(expr);
        result = node.eval();
    } catch (err) {
        result = err.toString ? err.toString() : err;
    }

    return result;
};

/**
 * Get a variable (a function or variable) by name from the parsers scope.
 * Returns undefined when not found
 * @param {String} name
 * @return {* | undefined} value
 */
Parser.prototype.get = function (name) {
    var symbol = this.scope.findDef(name);
    if (symbol) {
        return symbol();
    }
    return undefined;
};

/**
 * Put a symbol (a function or variable) by name from the parsers scope.
 * @param {String} name
 * @param {* | undefined} value
 */
Parser.prototype.put = function (name, value) {
    this.scope.createDef(name, value);
};

/**
 * Clear the scope with variables and functions
 */
Parser.prototype.clear = function () {
    this.scope.clear();
};

/**
 * Get the next character from the expression.
 * The character is stored into the char t.
 * If the end of the expression is reached, the function puts an empty
 * string in t.
 * @private
 */
Parser.prototype.getChar = function () {
    this.index++;
    this.c = this.expr.charAt(this.index);
};

/**
 * Get the first character from the expression.
 * The character is stored into the char t.
 * If the end of the expression is reached, the function puts an empty
 * string in t.
 * @private
 */
Parser.prototype.getFirstChar = function () {
    this.index = 0;
    this.c = this.expr.charAt(0);
};

/**
 * Get next token in the current string expr.
 * Uses the Parser data expr, e, token, t, token_type and err
 * The token and token type are available at this.token_type and this.token
 * @private
 */
Parser.prototype.getToken = function () {
    this.token_type = this.TOKENTYPE.NULL;
    this.token = '';

    // skip over whitespaces
    while (this.c == ' ' || this.c == '\t') {  // space or tab
        this.getChar();
    }

    // skip comment
    if (this.c == '#') {
        while (this.c != '\n' && this.c != '') {
            this.getChar();
        }
    }

    // check for end of expression
    if (this.c == '') {
        // token is still empty
        this.token_type = this.TOKENTYPE.DELIMITER;
        return;
    }

    // check for minus, comma, parentheses, quotes, newline, semicolon
    if (this.c == '-' || this.c == ',' ||
        this.c == '(' || this.c == ')' ||
        this.c == '[' || this.c == ']' ||
        this.c == '\"' || this.c == '\n' ||
        this.c == ';' || this.c == ':') {
        this.token_type = this.TOKENTYPE.DELIMITER;
        this.token += this.c;
        this.getChar();
        return;
    }

    // check for operators (delimiters)
    if (this.isDelimiter(this.c)) {
        this.token_type = this.TOKENTYPE.DELIMITER;
        while (this.isDelimiter(this.c)) {
            this.token += this.c;
            this.getChar();
        }
        return;
    }

    // check for a number
    if (this.isDigitDot(this.c)) {
        this.token_type = this.TOKENTYPE.NUMBER;
        while (this.isDigitDot(this.c)) {
            this.token += this.c;
            this.getChar();
        }

        // check for scientific notation like "2.3e-4" or "1.23e50"
        if (this.c == 'E' || this.c == 'e') {
            this.token += this.c;
            this.getChar();

            if (this.c == '+' || this.c == '-') {
                this.token += this.c;
                this.getChar();
            }

            // Scientific notation MUST be followed by an exponent
            if (!this.isDigit(this.c)) {
                // this is no legal number, exponent is missing.
                this.token_type = this.TOKENTYPE.UNKNOWN;
            }

            while (this.isDigit(this.c)) {
                this.token += this.c;
                this.getChar();
            }
        }
        return;
    }
    // check for variables or functions
    if (this.isAlpha(this.c)) {
        this.token_type = this.TOKENTYPE.SYMBOL;

        while (this.isAlpha(this.c) || this.isDigit(this.c))
        {
            this.token += this.c;
            this.getChar();
        }
        return;
    }

    // something unknown is found, wrong characters -> a syntax error
    this.token_type = this.TOKENTYPE.UNKNOWN;
    while (this.c != '') {
        this.token += this.c;
        this.getChar();
    }
    throw this.createSyntaxError('Syntax error in part "' + this.token + '"');
};

/**
 * checks if the given char c is a delimiter
 * minus is not checked in this method (can be unary minus)
 * @param {String} c   a string with one character
 * @return {Boolean}
 * @private
 */
Parser.prototype.isDelimiter = function (c) {
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
};

/**
 * Check if a given name is valid
 * if not, an error is thrown
 * @param {String} name
 * @return {boolean} valid
 * @private
 */
Parser.prototype.isValidSymbolName = function (name) {
    for (var i = 0, iMax = name.length; i < iMax; i++) {
        var c = name.charAt(i);
        //var valid = (this.isAlpha(c) || (i > 0 && this.isDigit(c))); // TODO
        var valid = (this.isAlpha(c));
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
Parser.prototype.isAlpha = function (c) {
    return ((c >= 'a' && c <= 'z') ||
        (c >= 'A' && c <= 'Z') ||
        c == '_');
};

/**
 * checks if the given char c is a digit or dot
 * @param {String} c   a string with one character
 * @return {Boolean}
 * @private
 */
Parser.prototype.isDigitDot = function (c) {
    return ((c >= '0' && c <= '9') ||
        c == '.');
};

/**
 * checks if the given char c is a digit
 * @param {String} c   a string with one character
 * @return {Boolean}
 * @private
 */
Parser.prototype.isDigit = function (c) {
    return ((c >= '0' && c <= '9'));
};

/**
 * Start of the parse levels below, in order of precedence
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_start = function (scope) {
    // get the first character in expression
    this.getFirstChar();

    this.getToken();

    var node;
    if (this.token == '') {
        // empty expression
        node = new Constant(undefined);
    }
    else {
        node = this.parse_block(scope);
    }

    // check for garbage at the end of the expression
    // an expression ends with a empty character '' and token_type DELIMITER
    if (this.token != '') {
        if (this.token_type == this.TOKENTYPE.DELIMITER) {
            // user entered a not existing operator like "//"

            // TODO: give hints for aliases, for example with "<>" give as hint " did you mean != ?"
            throw this.createError('Unknown operator ' + this.token);
        }
        else {
            throw this.createSyntaxError('Unexpected part "' + this.token + '"');
        }
    }

    return node;
};


/**
 * Parse assignment of ans.
 * Ans is assigned when the expression itself is no variable or function
 * assignment
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_ans = function (scope) {
    var expression = this.parse_function_assignment(scope);

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
};


/**
 * Parse a block with expressions. Expressions can be separated by a newline
 * character '\n', or by a semicolon ';'. In case of a semicolon, no output
 * of the preceding line is returned.
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_block = function (scope) {
    var node, block, visible;

    if (this.token != '\n' && this.token != ';' && this.token != '') {
        node = this.parse_ans(scope);
    }

    while (this.token == '\n' || this.token == ';') {
        if (!block) {
            // initialize the block
            block = new Block();
            if (node) {
                visible = (this.token != ';');
                block.add(node, visible);
            }
        }

        this.getToken();
        if (this.token != '\n' && this.token != ';' && this.token != '') {
            node = this.parse_ans(scope);

            visible = (this.token != ';');
            block.add(node, visible);
        }
    }

    if (block) {
        return block;
    }

    if (!node) {
        node = this.parse_ans(scope);
    }

    return node;
};

/**
 * Parse a function assignment like "function f(a,b) = a*b"
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_function_assignment = function (scope) {
    // TODO: keyword 'function' must become a reserved keyword
    if (this.token_type == this.TOKENTYPE.SYMBOL && this.token == 'function') {
        // get function name
        this.getToken();
        if (this.token_type != this.TOKENTYPE.SYMBOL) {
            throw this.createSyntaxError('Function name expected');
        }
        var name = this.token;

        // get parenthesis open
        this.getToken();
        if (this.token != '(') {
            throw this.createSyntaxError('Opening parenthesis ( expected');
        }

        // get function variables
        var functionScope = scope.createNestedScope();
        var variableNames = [];
        var variables = [];
        while (true) {
            this.getToken();
            if (this.token_type == this.TOKENTYPE.SYMBOL) {
                // store parameter
                var variableName = this.token;
                var variable = functionScope.createDef(variableName);
                variableNames.push(variableName);
                variables.push(variable);
            }
            else {
                throw this.createSyntaxError('Variable name expected');
            }

            this.getToken();
            if (this.token == ',') {
                // ok, nothing to do, read next variable
            }
            else if (this.token == ')') {
                // end of variable list encountered. break loop
                break;
            }
            else {
                throw this.createSyntaxError('Comma , or closing parenthesis ) expected"');
            }
        }

        this.getToken();
        if (this.token != '=') {
            throw this.createSyntaxError('Equal sign = expected');
        }

        // parse the expression, with the correct function scope
        this.getToken();
        var expression = this.parse_range(functionScope);
        var result = scope.createDef(name);

        return  new FunctionAssignment(name, variableNames, variables,
            expression, result);
    }

    return this.parse_assignment(scope);
};

/**
 * Assignment of a variable, can be a variable like "a=2.3" or a updating an
 * existing variable like "matrix(2,3:5)=[6,7,8]"
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_assignment = function (scope) {
    var linkExisted = false;
    if (this.token_type == this.TOKENTYPE.SYMBOL) {
        linkExisted = scope.hasLink(this.token);
    }

    var node = this.parse_range(scope);

    if (this.token == '=') {
        if (!(node instanceof Symbol)) {
            throw this.createSyntaxError('Symbol expected at the left hand side ' +
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
        this.getToken();
        var expression = this.parse_range(scope);
        var link = node.hasParams() ? scope.createUpdate(name) : scope.createDef(name);
        return new Assignment(name, params, expression, link);
    }

    return node;
};

/**
 * parse range, "start:end" or "start:step:end"
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_range = function (scope) {
    var node = this.parse_conditions(scope);

    /* TODO: implement range
    if (this.token == ':') {
        var params = [node];

        while (this.token == ':') {
            this.getToken();
            params.push(this.parse_conditions(scope));
        }

        var fn = range;
        var name = ':';
        node = new Symbol(name, fn, params);
    }
    */

    return node;
};

/**
 * conditions like and, or, in
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_conditions = function (scope) {
    var node = this.parse_bitwise_conditions(scope);

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
    while (operators[this.token] !== undefined) {
        // TODO: with all operators: only load one instance of the operator, use the scope
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_bitwise_conditions(scope)];
        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * conditional operators and bitshift
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_bitwise_conditions = function (scope) {
    var node = this.parse_comparison(scope);

    /* TODO: implement bitwise conditions
    var operators = {
        '&' : 'bitwiseand',
        '|' : 'bitwiseor',
        // todo: bitwise xor?
        '<<': 'bitshiftleft',
        '>>': 'bitshiftright'
    };
    while (operators[this.token] !== undefined) {
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_comparison()];
        node = new Symbol(name, fn, params);
    }
    */

    return node;
};

/**
 * comparison operators
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_comparison = function (scope) {
    var node = this.parse_addsubtract(scope);

    var operators = {
        '==': 'equal',
        '!=': 'unequal',
        '<': 'smaller',
        '>': 'larger',
        '<=': 'smallereq',
        '>=': 'largereq'
    };
    while (operators[this.token] !== undefined) {
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_addsubtract(scope)];
        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * add or subtract
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_addsubtract = function (scope)  {
    var node = this.parse_multiplydivide(scope);

    var operators = {
        '+': 'add',
        '-': 'subtract'
    };
    while (operators[this.token] !== undefined) {
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_multiplydivide(scope)];
        node = new Symbol(name, fn, params);
    }

    return node;
};


/**
 * multiply, divide, modulus
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_multiplydivide = function (scope) {
    var node = this.parse_pow(scope);

    var operators = {
        '*': 'multiply',
        '/': 'divide',
        '%': 'mod',
        'mod': 'mod'
    };
    while (operators[this.token] !== undefined) {
        var name = this.token;
        var fn = math[operators[name]];

        this.getToken();
        var params = [node, this.parse_pow(scope)];
        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * power
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_pow = function (scope) {
    var node = this.parse_factorial(scope);

    while (this.token == '^') {
        var name = this.token;
        var fn = pow;
        this.getToken();
        var params = [node, this.parse_factorial(scope)];

        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * Factorial
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_factorial = function (scope)  {
    var node = this.parse_unaryminus(scope);

    while (this.token == '!') {
        var name = this.token;
        var fn = factorial;
        this.getToken();
        var params = [node];

        node = new Symbol(name, fn, params);
    }

    return node;
};

/**
 * Unary minus
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_unaryminus = function (scope) {
    if (this.token == '-') {
        var name = this.token;
        var fn = unaryminus;
        this.getToken();
        var params = [this.parse_plot(scope)];

        return new Symbol(name, fn, params);
    }

    return this.parse_plot(scope);
};

/**
 * parse plot
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_plot = function (scope) {
    /* TODO: implement plot
    if (this.token_type == this.TOKENTYPE.SYMBOL &&
        this.token == 'plot') {
        this.getToken();

        // parse the parentheses and parameters of the plot
        // the parameters are something like: plot(sin(x), cos(x), x)
        var functions = [];
        if (this.token == '(') {
            var plotScope = scope.createNestedScope();

            this.getToken();
            functions.push(this.parse_range(plotScope));

            // parse a list with parameters
            while (this.token == ',') {
                this.getToken();
                functions.push(this.parse_range(plotScope));
            }

            if (this.token != ')') {
                throw this.createSyntaxError('Parenthesis ) missing');
            }
            this.getToken();
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

    return this.parse_symbol(scope);
};

/**
 * parse symbols: functions, variables, constants, units
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_symbol = function (scope) {
    if (this.token_type == this.TOKENTYPE.SYMBOL) {
        var name = this.token;

        this.getToken();

        var link = scope.createLink(name);
        var arguments = this.parse_arguments(scope); // TODO: not so nice to "misuse" creating a Function
        var symbol = new Symbol(name, link, arguments);

        /* TODO: parse arguments
        // parse arguments
        while (this.token == '(') {
            symbol = this.parse_arguments(scope, symbol);
        }
        */
        return symbol;
    }

    return this.parse_string(scope);
};

/**
 * parse symbol parameters
 * @param {Scope} scope
 * @return {Node[]} arguments
 * @private
 */
Parser.prototype.parse_arguments = function (scope) {
    var arguments = [];
    if (this.token == '(') {
        // TODO: in case of Plot, create a new scope.

        this.getToken();
        arguments.push(this.parse_range(scope));

        // parse a list with parameters
        while (this.token == ',') {
            this.getToken();
            arguments.push(this.parse_range(scope));
        }

        if (this.token != ')') {
            throw this.createSyntaxError('Parenthesis ) missing');
        }
        this.getToken();
    }

    return arguments;
};

/**
 * parse a string.
 * A string is enclosed by double quotes
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_string = function (scope) {
    if (this.token == '"') {
        // string "..."
        var str = '';
        var tPrev = '';
        while (this.c != '' && (this.c != '\"' || tPrev == '\\')) { // also handle escape character
            str += this.c;
            tPrev = this.c;
            this.getChar();
        }

        this.getToken();
        if (this.token != '"') {
            throw this.createSyntaxError('End of string " missing');
        }
        this.getToken();

        var res = new Constant(str);

        /* TODO: implement string with arguments
        // parse arguments
        while (this.token == '(') {
            res = this.parse_arguments(scope, res);
        }
        */

        return res;
    }

    return this.parse_matrix(scope);
};

/**
 * parse the matrix
 * @param {Scope} scope
 * @return {Node} A MatrixNode
 * @private
 */
Parser.prototype.parse_matrix = function (scope) {
    /* TODO: implement matrix
    if (this.token == '[') {
        // matrix [...]
        var matrix;

        // skip newlines
        this.getToken();
        while (this.token == '\n') {
            this.getToken();
        }

        // check if this is an empty matrix "[ ]"
        if (this.token != ']') {
            // this is a non-empty matrix
            var params = [];
            var r = 0, c = 0;

            params[0] = [this.parse_range(scope)];

            // the columns in the matrix are separated by commas, and the rows by dot-comma's
            while (this.token == ',' || this.token == ';') {
                if (this.token == ',') {
                    c++;
                }
                else {
                    r++;
                    c = 0;
                    params[r] = [];
                }

                // skip newlines
                this.getToken();
                while (this.token == '\n') {
                    this.getToken();
                }

                params[r][c] = this.parse_range(scope);

                // skip newlines
                while (this.token == '\n') {
                    this.getToken();
                }
            }

            var rows =  params.length;
            var cols = (params.length > 0) ? params[0].length : 0;

            // check if the number of columns matches in all rows
            for (r = 1; r < rows; r++) {
                if (params[r].length != cols) {
                    throw this.createError('Number of columns must match ' +
                            '(' + params[r].length + ' != ' + cols + ')');
                }
            }

            if (this.token != ']') {
                throw this.createSyntaxError('End of matrix ] missing');
            }

            this.getToken();
            matrix = new MatrixNode(params);
        }
        else {
            // this is an empty matrix "[ ]"
            this.getToken();
            matrix = new MatrixNode();
        }

        // parse arguments
        while (this.token == '(') {
            matrix = this.parse_arguments(scope, matrix);
        }

        return matrix;
    }
    */

    return this.parse_number(scope);
};

/**
 * parse a number
 * @param {Scope} scope
 * @return {Node} node
 * @private
 */
Parser.prototype.parse_number = function (scope) {
    if (this.token_type == this.TOKENTYPE.NUMBER) {
        // this is a number
        var number;
        if (this.token == '.') {
            number = 0.0;
        } else {
            number = Number(this.token);
        }
        this.getToken();

        /* TODO: implicit multiplication?
         // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
         // check for implicit multiplication
         if (token_type == TOKENTYPE.VARIABLE) {
         node = multiply(node, parse_pow());
         }
         //*/

        var value;
        if (this.token_type == this.TOKENTYPE.SYMBOL) {
            if (this.token == 'i' || this.token == 'I') {
                value = new Complex(0, number);
                this.getToken();
                return new Constant(value);
            }

            if (Unit.isUnit(this.token)) {
                value = new Unit(number, this.token);
                this.getToken();
                return new Constant(value);
            }

            throw this.createTypeError('Unknown unit "' + this.token + '"');
        }

        // just a regular number
        var res = new Constant(number);

        /* TODO: implement number with arguments
        // parse arguments
        while (this.token == '(') {
            res = this.parse_arguments(scope, res);
        }
        */

        return res;
    }

    return this.parse_parentheses(scope);
};

/**
 * parentheses
 * @param {Scope} scope
 * @return {Node} res
 * @private
 */
Parser.prototype.parse_parentheses = function (scope) {
    // check if it is a parenthesized expression
    if (this.token == '(') {
        // parentheses (...)
        this.getToken();
        var res = this.parse_range(scope); // start again

        if (this.token != ')') {
            throw this.createSyntaxError('Parenthesis ) expected');
        }
        this.getToken();

        /* TODO: implicit multiplication?
         // TODO: how to calculate a=3; 2/2a ? is this (2/2)*a or 2/(2*a) ?
         // check for implicit multiplication
         if (token_type == TOKENTYPE.VARIABLE) {
         node = multiply(node, parse_pow());
         }
         //*/

        /* TODO: parse parentheses with arguments
        // parse arguments
        while (this.token == '(') {
            res = this.parse_arguments(scope, res);
        }
        */

        return res;
    }

    return this.parse_end(scope);
};

/**
 * Evaluated when the expression is not yet ended but expected to end
 * @param {Scope} scope
 * @return {Node} res
 * @private
 */
Parser.prototype.parse_end = function (scope) {
    if (this.token == '') {
        // syntax error or unexpected end of expression
        throw this.createSyntaxError('Unexpected end of expression');
    } else {
        throw this.createSyntaxError('Value expected');
    }
};

/**
 * Shortcut for getting the current row value (one based)
 * Returns the line of the currently handled expression
 * @private
 */
Parser.prototype.row = function () {
    // TODO: also register row number during parsing
    return undefined;
};

/**
 * Shortcut for getting the current col value (one based)
 * Returns the column (position) where the last token starts
 * @private
 */
Parser.prototype.col = function () {
    return this.index - this.token.length + 1;
};


/**
 * Build up an error message
 * @param {String} message
 * @return {String} message with row and column information
 * @private
 */
Parser.prototype.createErrorMessage = function(message) {
    var row = this.row();
    var col = this.col();
    if (row === undefined) {
        if (col === undefined) {
            return message;
        } else {
            return message + ' (col ' + col + ')';
        }
    } else {
        return message + ' (ln ' + row + ', col ' + col + ')';
    }
};

/**
 * Create an error
 * @param {String} message
 * @return {SyntaxError} instantiated error
 * @private
 */
Parser.prototype.createSyntaxError = function(message) {
    return new SyntaxError(this.createErrorMessage(message));
};

/**
 * Create an error
 * @param {String} message
 * @return {TypeError} instantiated error
 * @private
 */
Parser.prototype.createTypeError = function(message) {
    return new TypeError(this.createErrorMessage(message));
};

/**
 * Create an error
 * @param {String} message
 * @return {Error} instantiated error
 * @private
 */
Parser.prototype.createError = function(message) {
    return new Error(this.createErrorMessage(message));
};
