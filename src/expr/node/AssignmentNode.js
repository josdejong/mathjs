/**
 * @constructor AssignmentNode
 * @param {String} name                 Symbol name
 * @param {Node[] | undefined} params   Zero or more parameters
 * @param {Node} expr                   The expression defining the symbol
 * @param {math.expr.Symbol} symbol     placeholder for the symbol
 */
function AssignmentNode(name, params, expr, symbol) {
    this.name = name;
    this.params = params;
    this.expr = expr;
    this.symbol = symbol;
}

AssignmentNode.prototype = new Node();

math.expr.node.AssignmentNode = AssignmentNode;

/**
 * Evaluate the assignment
 * @return {*} result
 */
AssignmentNode.prototype.eval = function() {
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
        var prevResult = this.symbol.get();
        if (prevResult == undefined) {
            throw new Error('Undefined symbol ' + this.name);
        }

        // TODO: check type of prevResult: Matrix, Array, String, other...
        if (!prevResult.set) {
            throw new TypeError('Cannot apply a subset to object of type ' +
                math['typeof'](prevResult));
        }
        result = prevResult.set(paramResults, exprResult);

        this.symbol.set(result);
    }
    else {
        // variable definition, for example "a = 3/4"
        result = this.expr.eval();
        this.symbol.set(result);
    }

    return result;
};

/**
 * Get string representation
 * @return {String}
 */
AssignmentNode.prototype.toString = function() {
    var str = '';

    str += this.name;
    if (this.params && this.params.length) {
        str += '(' + this.params.join(', ') + ')';
    }
    str += ' = ';
    str += this.expr.toString();

    return str;
};
