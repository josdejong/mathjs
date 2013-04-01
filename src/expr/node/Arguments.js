/**
 * @constructor Arguments
 * invoke a list with parameters on the results of a node
 * @param {Node} object
 * @param {Node[]} params
 */
function Arguments (object, params) {
    this.object = object;
    this.params = params;
}

Arguments.prototype = new Node();

math.expr.node.Arguments = Arguments;

/**
 * Evaluate the parameters
 * @return {*} result
 */
Arguments.prototype.eval = function() {
    var object = this.object;
    if (object == undefined) {
        throw new Error ('Node undefined');
    }
    var objectRes = object.eval();

    // evaluate the parameters
    var params = this.params;
    var paramsRes = [];
    for (var i = 0, len = params.length; i < len; i++) {
        paramsRes[i] = params[i].eval();
    }

    // TODO: check type of objectRes
    if (!objectRes.get) {
        throw new TypeError('Cannot apply arguments to object of type ' +
            math.typeof(objectRes));
    }
    return objectRes.get(paramsRes);
};

/**
 * Get string representation
 * @return {String} str
 */
Arguments.prototype.toString = function() {
    // format the arguments like "(2, 4.2)"
    var str = this.object ? this.object.toString() : '';
    if (this.params) {
        str += '(' + this.params.join(', ') + ')';
    }
    return str;
};
