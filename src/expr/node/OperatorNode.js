/**
 * @constructor OperatorNode
 * An operator with two arguments, like 2+3
 * @param {String} name     Function name, for example '+'
 * @param {function} fn     Function, for example math.add
 * @param {Node[]} params   Parameters
 */
function OperatorNode (name, fn, params) {
    this.name = name;
    this.fn = fn;
    this.params = params;
}

OperatorNode.prototype = new Node();

math.expr.node.OperatorNode = OperatorNode;

/**
 * Evaluate the parameters
 * @return {*} result
 */
OperatorNode.prototype.eval = function() {
    return this.fn.apply(this, this.params.map(function (param) {
        return param.eval();
    }));
};

/**
 * Get string representation
 * @return {String} str
 */
OperatorNode.prototype.toString = function() {
    var params = this.params;

    // special case: unary minus
    if (this.fn === math.unaryminus) {
        return '-' + params[0].toString();
    }

    switch (params.length) {
        case 1: // for example '5!'
            return params[0].toString() + this.name;

        case 2: // for example '2+3'
            var lhs = params[0].toString();
            if (params[0] instanceof OperatorNode) {
                lhs = '(' + lhs + ')';
            }
            var rhs = params[1].toString();
            if (params[1] instanceof OperatorNode) {
                rhs = '(' + rhs + ')';
            }
            return lhs + ' ' + this.name + ' ' + rhs;

        default: // this should occur. format as a function call
            return this.name + '(' + this.params.join(', ') + ')';
    }
};
