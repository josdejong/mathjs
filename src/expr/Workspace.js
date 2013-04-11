(function () {
    /**
     * @constructor math.expr.Workspace
     *
     * Workspace manages a set of expressions. Expressions can be added, replace,
     * deleted, and inserted in the workspace. The workspace keeps track on the
     * dependencies between the expressions, and automatically updates results of
     * depending expressions when variables or function definitions are changed in
     * the workspace.
     *
     * Methods:
     *     var id = workspace.append(expr);
     *     var id = workspace.insertBefore(expr, beforeId);
     *     var id = workspace.insertAfter(expr, afterId);
     *     workspace.replace(expr, id);
     *     workspace.remove(id);
     *     workspace.clear();
     *     var expr   = workspace.getExpr(id);
     *     var result = workspace.getResult(id);
     *     var deps   = workspace.getDependencies(id);
     *     var changes = workspace.getChanges(updateSeq);
     *
     * Usage:
     *     var workspace = new math.expr.Workspace();
     *     var id0 = workspace.append('a = 3/4');
     *     var id1 = workspace.append('a + 2');
     *     console.log('a + 2 = ' + workspace.getResult(id1));
     *     workspace.replace('a=5/2', id0);
     *     console.log('a + 2 = ' + workspace.getResult(id1));
     */
    function Workspace () {
        this.idMax = -1;
        this.updateSeq = 0;
        this.parser = new math.expr.Parser();
        this.scope = new math.expr.Scope();

        this.nodes = {};
        this.firstNode = undefined;
        this.lastNode = undefined;
    }

    math.expr.Workspace = Workspace;

    /**
     * clear the workspace
     */
    Workspace.prototype.clear = function () {
        this.nodes = {};
        this.firstNode = undefined;
        this.lastNode = undefined;
    };

    /**
     * append an expression to the workspace
     * @param {String}    expression
     * @return {Number}   id of the created node
     */
    Workspace.prototype.append = function (expression) {
        // create the node
        var id = this._getNewId();
        var parentScope = this.lastNode ? this.lastNode.scope : this.scope;
        var scope = new math.expr.Scope(parentScope);
        var node = new Workspace.Node({
            'id': id,
            'expression': expression,
            'parser': this.parser,
            'scope': scope,
            'nextNode': undefined,
            'previousNode': this.lastNode
        });
        this.nodes[id] = node;

        // link next and previous nodes
        if (!this.firstNode) {
            this.firstNode = node;
        }
        if (this.lastNode) {
            this.lastNode.nextNode = node;
        }
        this.lastNode = node;

        // update this node
        this._update([id]);

        return id;
    };

    /**
     * insert an expression before an existing expression
     * @param {String} expression   the new expression
     * @param {Number} beforeId     id of an existing expression
     * @return {Number} id          id of the created node
     */
    Workspace.prototype.insertBefore = function (expression, beforeId) {
        var nextNode = this.nodes[beforeId];
        if (!nextNode) {
            throw 'Node with id "' + beforeId + '" not found';
        }

        var previousNode = nextNode.previousNode;

        // create the node
        var id = this._getNewId();
        var previousScope = previousNode ? previousNode.scope : this.scope;
        var scope = new math.expr.Scope(previousScope);
        var node = new Workspace.Node({
            'id': id,
            'expression': expression,
            'parser': this.parser,
            'scope': scope,
            'nextNode': nextNode,
            'previousNode': previousNode
        });
        this.nodes[id] = node;

        // link next and previous nodes
        if (previousNode) {
            previousNode.nextNode = node;
        }
        else {
            this.firstNode = node;
        }
        nextNode.previousNode = node;

        // link to the new the scope
        nextNode.scope.parentScope = node.scope;

        // update this node and all dependent nodes
        var ids = this.getDependencies(id);
        if (ids.indexOf(id) == -1) {
            ids.unshift(id);
        }
        this._update(ids);

        return id;
    };

    /**
     * insert an expression after an existing expression
     * @param {String} expression   the new expression
     * @param {Number} afterId      id of an existing expression
     * @return {Number} id          id of the created expression
     */
    Workspace.prototype.insertAfter = function (expression, afterId) {
        var previousNode = this.nodes[afterId];
        if (!previousNode) {
            throw 'Node with id "' + afterId + '" not found';
        }

        if (previousNode == this.lastNode) {
            return this.append(expression);
        }
        else {
            return this.insertBefore(afterId + 1, expression);
        }
    };


    /**
     * remove an expression. If the expression is not found, no action will
     * be taken.
     * @param {Number} id           id of an existing expression
     */
    Workspace.prototype.remove = function (id) {
        var node = this.nodes[id];
        if (!node) {
            throw 'Node with id "' + id + '" not found';
        }

        // get the dependencies (needed to update them after deletion of this node)
        var dependentIds = this.getDependencies(id);

        // adjust links to previous and next nodes
        var previousNode = node.previousNode;
        var nextNode = node.nextNode;
        if (previousNode) {
            previousNode.nextNode = nextNode;
        }
        else {
            this.firstNode = nextNode;
        }
        if (nextNode) {
            nextNode.previousNode = previousNode;
        }
        else {
            this.lastNode = previousNode;
        }

        // re-link the scope
        var previousScope = previousNode ? previousNode.scope : this.scope;
        if (nextNode) {
            nextNode.scope.parentScope = previousScope;
        }

        // remove the node
        delete this.nodes[id];

        // update all dependent nodes
        this._update(dependentIds);
    };


    /**
     * replace an existing expression
     * @param {String} expression   the new expression
     * @param {Number} id           id of an existing expression
     */
    Workspace.prototype.replace = function (expression, id) {
        var node = this.nodes[id];
        if (!node) {
            throw 'Node with id "' + id + '" not found';
        }

        // get the dependencies
        var dependentIds = [id];
        Workspace._merge(dependentIds, this.getDependencies(id));

        var previousNode = node.previousNode;
        var nextNode = node.nextNode;
        var previousScope = previousNode ? previousNode.scope : this.scope;

        // replace the expression
        node.setExpr(expression);

        // add the new dependencies
        Workspace._merge(dependentIds, this.getDependencies(id));

        // update all dependencies
        this._update(dependentIds);
    };

    /**
     * @constructor Workspace.Node
     * @param {Object} params Object containing parameters:
     *                        {Number} id
     *                        {String} expression   An expression, for example "2+3"
     *                        {Parser} parser
     *                        {Scope} scope
     *                        {Workspace.Node} nextNode
     *                        {Workspace.Node} previousNode
     */
    Workspace.Node = function (params) {
        this.id = params.id;
        this.parser = params.parser;
        this.scope = params.scope;
        this.nextNode = params.nextNode;
        this.previousNode = params.previousNode;
        // TODO: throw error when id, parser, or scope is not given

        this.updateSeq = 0;
        this.result = undefined;
        this.setExpr(params.expression);
    };

    /**
     * set the node's expression
     * @param {String} expression
     */
    Workspace.Node.prototype.setExpr = function (expression) {
        this.expression = expression || '';
        this.scope.clear();
        this._parse();
    };

    /**
     * get the node's expression
     * @return {String} expression
     */
    Workspace.Node.prototype.getExpr = function () {
        return this.expression;
    };

    /**
     * get the result of the nodes expression
     * @return {*} result
     */
    Workspace.Node.prototype.getResult = function () {
        // TODO: automatically evaluate when not up to date?
        return this.result;
    };

    /**
     * parse the node's expression
     * @private
     */
    Workspace.Node.prototype._parse = function () {
        try {
            this.fn = this.parser.parse(this.expression, this.scope);
        }
        catch (err) {
            var value = 'Error: ' + String(err.message || err);
            this.fn = new Constant(value);
        }
    };

    /**
     * Evaluate the node expression
     * @return {*} result
     */
    Workspace.Node.prototype.eval = function () {
        try {
            this.scope.init();
            this.result = this.fn.eval();
        }
        catch (err) {
            this.scope.init();
            this.result = 'Error: ' + String(err.message || err);
        }
        return this.result;
    };

    /**
     * Merge array2 into array1, only adding distinct elements.
     * The elements are not sorted.
     * @param {Array} array1
     * @param {Array} array2
     * @private
     */
    Workspace._merge = function (array1, array2) {
        for (var i = 0, iMax = array2.length; i < iMax; i++) {
            var elem = array2[i];
            if (array1.indexOf(elem) == -1) {
                array1.push(elem);
            }
        }
    };

    /**
     * Retrieve the id's of the nodes which are dependent on this node
     * @param {Number} id
     * @return {Number[]} id's of dependent nodes. The ids are not ordered
     */
    Workspace.prototype.getDependencies = function (id) {
        var ids = [],
            name;

        var node = this.nodes[id];
        if (node) {
            // create a list with all symbol names defined/updated in this scope
            var defs = node.scope.defs;
            var updates = node.scope.updates;
            var symbolNames = [];
            for (name in defs) {
                if (defs.hasOwnProperty(name)) {
                    symbolNames.push(name);
                }
            }
            for (name in updates) {
                if (updates.hasOwnProperty(name) && symbolNames.indexOf(name) == -1) {
                    symbolNames.push(name);
                }
            }

            // loop through the nodes and retrieve the ids of nodes dependent on
            // these values. We start at current node
            var n = node.nextNode;
            while (n && symbolNames.length) {
                var scope = n.scope;
                // loop through each of the parameters and check if the scope
                // contains bindings to this parameter func
                var i = 0;
                while (i < symbolNames.length) {
                    name = symbolNames[i];

                    // check if this scope contains a link to the current symbol name
                    if (scope.hasLink(name) || scope.hasUpdate(name)) {
                        if (ids.indexOf(n.id) == -1) {
                            ids.push(n.id);

                            // recursively check the dependencies of this id
                            var childIds = this.getDependencies(n.id);
                            Workspace._merge(ids, childIds);
                        }
                    }

                    // stop propagation of the current symbol name as soon as it is
                    // redefined in one of the next scopes (not if it is updated)
                    if (scope.hasDef(name)) {
                        symbolNames.splice(i, 1);
                        i--;
                    }

                    i++;
                }

                n = n.nextNode;
            }
        }

        return ids;
    };

    /**
     * Retrieve an expression, the original string
     * @param {Number} id    Id of the expression to be retrieved
     * @return {String}      The original expression as a string
     */
    Workspace.prototype.getExpr = function (id) {
        var node = this.nodes[id];
        if (!node) {
            throw 'Node with id "' + id + '" not found';
        }

        return node.getExpr();
    };


    /**
     * get the result of and expression
     * @param {Number} id
     * @return {*} result
     */
    Workspace.prototype.getResult = function (id) {
        var node = this.nodes[id];
        if (!node) {
            throw 'Node with id "' + id + '" not found';
        }

        return node.getResult();
    };


    /**
     * Update the results of an expression and all dependent expressions
     * @param {Number[]} ids    Ids of the expressions to be updated
     * @private
     */
    Workspace.prototype._update = function (ids) {
        this.updateSeq++;
        var updateSeq = this.updateSeq;
        var nodes = this.nodes;

        for (var i = 0, iMax = ids.length; i < iMax; i++) {
            var id = ids[i];
            var node = nodes[id];
            if (node) {
                node.eval();
                //console.log('eval node=' + id + ' result=' + node.result.toString()); // TODO: cleanup
                node.updateSeq = updateSeq;
            }
            else {
                // TODO: throw error?
            }
        }
    };

    /**
     * Get all changes since an update sequence
     * @param {Number} updateSeq.    Optional. if not provided, all changes are
     *                               since the creation of the workspace are returned
     * @return {Object} ids    Object containing two parameters:
     *                         param {Number[]} ids         Array containing
     *                                                      the ids of the changed
     *                                                      expressions
     *                         param {Number} updateSeq     the current update
     *                                                      sequence
     */
    Workspace.prototype.getChanges = function (updateSeq) {
        var changedIds = [];
        var node = this.firstNode;
        updateSeq = updateSeq || 0;
        while (node) {
            if (node.updateSeq > updateSeq) {
                changedIds.push(node.id);
            }
            node = node.nextNode;
        }
        return {
            'ids': changedIds,
            'updateSeq': this.updateSeq
        };
    };

    /**
     * Return a new, unique id for an expression
     * @return {Number} new id
     * @private
     */
    Workspace.prototype._getNewId = function () {
        this.idMax++;
        return this.idMax;
    };

    /**
     * String representation of the Workspace
     * @return {String} description
     */
    Workspace.prototype.toString = function () {
        return JSON.stringify(this.toJSON());
    };

    /**
     * JSON representation of the Workspace
     * @return {Object} description
     */
    Workspace.prototype.toJSON = function () {
        var json = [];

        var node = this.firstNode;
        while (node) {
            var desc = {
                'id': node.id,
                'expression': node.expression,
                'dependencies': this.getDependencies(node.id)
            };

            try {
                desc.result = node.getResult();
            } catch (err) {
                desc.result = 'Error: ' + String(err.message || err);
            }

            json.push(desc);

            node = node.nextNode;
        }

        return json;
    };

})();