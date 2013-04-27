/**
 * @constructor ParamsNode
 * invoke a list with parameters on the results of a node
 * @param {Node} object
 * @param {Node[]} params
 */
function ParamsNode (object, params) {
    this.object = object;
    this.params = params;
}

ParamsNode.prototype = new Node();

math.expr.node.ParamsNode = ParamsNode;

/**
 * Evaluate the parameters
 * @return {*} result
 */
ParamsNode.prototype.eval = function() {
    var object = this.object;
    if (object == undefined) {
        throw new Error ('Node undefined');
    }
    var obj = object.eval();

    // evaluate the parameters
    var res = this.params.map(function (arg) {
        return arg.eval();
    });

    if (typeof obj === 'function') {
        // invoke a function with the parameters
        return obj.apply(this, res);
    }
    else if (obj instanceof Object && obj.get) {
        // apply method get with the parameters
        return obj.get(res);
    }
    // TODO: apply parameters on a string
    else {
        throw new TypeError('Cannot apply parameters to object of type ' +
            math['typeof'](obj));
    }
};

/**
 * Get string representation
 * @return {String} str
 */
ParamsNode.prototype.toString = function() {
    // format the parameters like "(2, 4.2)"
    var str = this.object ? this.object.toString() : '';
    if (this.params) {
        str += '(' + this.params.join(', ') + ')';
    }
    return str;
};
