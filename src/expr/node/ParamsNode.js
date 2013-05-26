/**
 * @constructor ParamsNode
 * invoke a list with parameters on the results of a node
 * @param {Node} object
 * @param {Node[]} params
 * @param {Scope[]} paramScopes     A scope for every parameter, where the
 *                                  index variable 'end' can be defined.
 */
function ParamsNode (object, params, paramScopes) {
    this.object = object;
    this.params = params;
    this.paramScopes = paramScopes;

    // check whether any of the params expressions uses the context symbol 'end'
    this.hasContextParams = false;
    if (params) {
        var filter = {
            type: math.type.SymbolNode,
            properties: {
                name: 'end'
            }
        };

        for (var i = 0, len = params.length; i < len; i++) {
            if (params[i].find(filter).length > 0) {
                this.hasContextParams = true;
                break;
            }
        }
    }
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

    // evaluate the values of context parameter 'end' when needed
    if (this.hasContextParams) {
        var paramScopes = this.paramScopes,
            size = obj.size && obj.size();
        if (paramScopes && size) {
            for (i = 0, len = this.params.length; i < len; i++) {
                var paramScope = paramScopes[i];
                if (paramScope) {
                    paramScope.set('end', size[i]);
                }
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
    else {
        // get a subset of the object
        return math.subset(obj, results);
    }
};

/**
 * Find all nodes matching given filter
 * @param {Object} filter  See Node.find for a description of the filter options
 * @returns {Node[]} nodes
 */
ParamsNode.prototype.find = function (filter) {
    var nodes = [];

    // check itself
    if (this.match(filter)) {
        nodes.push(this);
    }

    // search object
    if (this.object) {
        nodes = nodes.concat(this.object.find(filter));
    }

    // search in parameters
    var params = this.params;
    if (params) {
        for (var i = 0, len = params.length; i < len; i++) {
            nodes = nodes.concat(params[i].find(filter));
        }
    }

    return nodes;
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
