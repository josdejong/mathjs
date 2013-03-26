/**
 * @constructor mathnotepad.tree.Assignment
 * @param {String} name                 Symbol name
 * @param {Node[] | undefined} params   Zero or more parameters
 * @param {Node} expr                   The expression defining the symbol
 * @param {function} result             placeholder for the result
 */
function Assignment(name, params, expr, result) {
    this.name = name;
    this.params = params;
    this.expr = expr;
    this.result = result;
}

Assignment.prototype = new Node();

math.expr.node.Assignment = Assignment;

/**
 * Evaluate the assignment
 * @return {*} result
 */
Assignment.prototype.eval = function() {
    if (this.expr === undefined) {
        throw new Error('Undefined symbol ' + this.name);
    }

    var result;
    var params = this.params;

    if (params && params.length) {
        // change part of a matrix, for example "a=[]", "a(2,3)=4.5"
        var paramResults = [];
        this.params.forEach(function (param) {
            paramResults.push(param.eval());
        });

        var exprResult = this.expr.eval();

        // test if definition is currently undefined
        if (this.result.value == undefined) {
            throw new Error('Undefined symbol ' + this.name);
        }

        var prevResult = this.result.eval();
        result = prevResult.set(paramResults, exprResult); // TODO implement set subset

        this.result.value = result;
    }
    else {
        // variable definition, for example "a = 3/4"
        result = this.expr.eval();
        this.result.value = result;
    }

    return result;
};

/**
 * Get string representation
 * @return {String}
 */
Assignment.prototype.toString = function() {
    var str = '';

    str += this.name;
    if (this.params && this.params.length) {
        str += '(' + this.params.join(', ') + ')';
    }
    str += ' = ';
    str += this.expr.toString();

    return str;
};
