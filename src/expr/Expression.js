
/**
 * @constructor math.expr.Expression
 *
 * An expression is a linked node which can hold a scope and an expression,
 * and calculates symbol dependencies.
 * Expression is used by Workspace.
 *
 * @param {Object} params Object containing parameters:
 *                        {Number} id
 *                        {String} expression   An expression, for example "2+3"
 *                        {Parser} parser
 *                        {Scope} scope
 *                        {math.expr.Expression} nextNode
 *                        {math.expr.Expression} previousNode
 */
math.expr.Expression = function Expression (params) {
    this.id = params.id;
    this.parser = params.parser;
    this.scope = params.scope;
    this.nextNode = params.nextNode;
    this.previousNode = params.previousNode;
    // TODO: throw error when id, parser, or scope is not given

    this.updateSeq = 0;
    this.node = undefined;

    this.symbols = {};
    this.assignments = {};
    this.updates = {};

    this.result = undefined;
    this.setExpr(params.expression);
};

/**
 * Set the node's expression
 * @param {String} expression
 */
math.expr.Expression.prototype.setExpr = function (expression) {
    this.expression = expression || '';
    this.scope.clear();
    this._parse();
    this._analyse();
};

/**
 * Get the node's expression
 * @return {String} expression
 */
math.expr.Expression.prototype.getExpr = function () {
    return this.expression;
};

/**
 * get the result of the nodes expression
 * @return {*} result
 */
math.expr.Expression.prototype.getResult = function () {
    // TODO: automatically evaluate when not up to date?
    return this.result;
};

/**
 * parse the node's expression
 * @private
 */
math.expr.Expression.prototype._parse = function () {
    try {
        this.node = this.parser.parse(this.expression, this.scope);
    }
    catch (err) {
        var value = 'Error: ' + String(err.message || err);
        this.node = new ConstantNode(value);
    }
};

/**
 * Analyse the expressions node tree: find all symbols, assignments, and updates
 * @private
 */
math.expr.Expression.prototype._analyse = function () {
    var i, len, node;

    if (this.node) {
        // find symbol nodes
        var symbols = this.node.find({
            type: math.expr.node.SymbolNode
        });
        this.symbols = {};
        for (i = 0, len = symbols.length; i < len; i++) {
            node = symbols[i];
            this.symbols[node.name] = node;
        }

        // find symbol assignments
        var assignments = this.node.find({
            type: math.expr.node.AssignmentNode
        });
        this.assignments = {};
        for (i = 0, len = assignments.length; i < len; i++) {
            node = assignments[i];
            this.assignments[node.name] = node;
        }

        // find symbol updates
        var updates = this.node.find({
            type: math.expr.node.UpdateNode
        });
        this.updates = {};
        for (i = 0, len = updates.length; i < len; i++) {
            node = updates[i];
            this.updates[node.name] = node;
        }

    }
};

/**
 * Evaluate the node expression
 * @return {*} result
 */
math.expr.Expression.prototype.eval = function () {
    try {
        this.scope.clear();
        this.result = this.node.eval();
    }
    catch (err) {
        this.scope.clear();
        this.result = 'Error: ' + String(err.message || err);
    }
    return this.result;
};
