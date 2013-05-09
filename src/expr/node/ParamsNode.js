/**
 * @constructor ParamsNode
 * invoke a list with parameters on the results of a node
 * @param {Node} object
 * @param {Node[]} params
 * @param {Scope[]} scopes      A scope for every parameter, where the index
 *                              variable 'end' can be defined.
 */
function ParamsNode (object, params, scopes) {
    this.object = object;
    this.params = params;
    this.scopes = scopes;

    // find the symbols 'end', which are index dependent
    var ends = null;
    if (scopes) {
        for (var i = 0, len = scopes.length; i < len; i++) {
            var scope = scopes[i];
            if (scope.hasLink('end')) {
                if (!ends) {
                    ends = [];
                }
                ends[i] = scope.createLink('end');
            }
        }
    }
    this.ends = ends;
}

ParamsNode.prototype = new Node();

math.expr.node.ParamsNode = ParamsNode;

/**
 * Evaluate the parameters
 * @return {*} result
 */
ParamsNode.prototype.eval = function() {
    var i, len;

    // evaluate the object
    var object = this.object;
    if (object == undefined) {
        throw new Error ('Node undefined');
    }
    var obj = object.eval();

    // evaluate the values of parameter 'end'
    if (this.ends) {
        var ends = this.ends,
            size = obj.size && obj.size();
        for (i = 0, len = this.params.length; i < len; i++) {
            var end = ends[i];
            if (end && size) {
                end.set(size[i]);
            }
        }
    }

    // evaluate the parameters
    var params = this.params,
        results = [];
    for (i = 0, len = this.params.length; i < len; i++) {
        results[i] = params[i].eval();
    }

    if (typeof obj === 'function') {
        // invoke a function with the parameters
        return obj.apply(this, results);
    }
    else if (obj instanceof Object && obj.get) {
        // apply method get with the parameters
        return obj.get(results);
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
