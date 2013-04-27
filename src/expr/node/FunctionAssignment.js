/**
 * @constructor FunctionAssignment
 * assigns a custom defined function
 *
 * @param {String} name             Function name
 * @param {String[]} variableNames  Variable names
 * @param {function[]} variables    Links to the variables in a scope
 * @param {Node} expr               The function expression
 * @param {math.expr.Link} result   Link to store the result
 */
function FunctionAssignment(name, variableNames, variables, expr, result) {
    this.name = name;
    this.variables = variables;

    this.values = [];
    for (var i = 0, iMax = this.variables.length; i < iMax; i++) {
        this.values[i] = (function () {
            var value = function () {
                return value.value;
            };
            value.value = undefined;
            return value;
        })();
    }

    this.def = this.createFunction(name, variableNames, variables, expr);

    this.result = result;
}

FunctionAssignment.prototype = new Node();

math.expr.node.FunctionAssignment = FunctionAssignment;

/**
 * Create a function from the function assignment
 * @param {String} name             Function name
 * @param {String[]} variableNames  Variable names
 * @param {function[]} values       Zero or more functions
 * @param {Node} expr               The function expression
 *
 */
FunctionAssignment.prototype.createFunction = function (name, variableNames,
                                                        values, expr) {
    var fn = function () {
        // validate correct number of arguments
        var valuesNum = values ? values.length : 0;
        var argumentsNum = arguments ? arguments.length : 0;
        if (valuesNum != argumentsNum) {
            throw newArgumentsError(name, argumentsNum, valuesNum);
        }

        // fill in all parameter values
        if (valuesNum > 0) {
            for (var i = 0; i < valuesNum; i++){
                values[i].value = arguments[i];
            }
        }

        // evaluate the expression
        return expr.eval();
    };

    fn.toString = function() {
        return name + '(' + variableNames.join(', ') + ')';
    };

    return fn;
};

/**
 * Evaluate the function assignment
 * @return {function} result
 */
FunctionAssignment.prototype.eval = function() {
    // link the variables to the values of this function assignment
    var variables = this.variables,
        values = this.values;
    for (var i = 0, iMax = variables.length; i < iMax; i++) {
        variables[i].value = values[i];
    }

    // put the definition in the result
    this.result.set(this.def);

    // TODO: what to return? a neat "function y(x) defined"?
    return this.def;
};

/**
 * get string representation
 * @return {String} str
 */
FunctionAssignment.prototype.toString = function() {
    return this.def.toString();
};
