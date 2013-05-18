/**
 * @constructor MatrixNode
 * Holds an 2-dimensional array with nodes
 * @param {Array[]} nodes    2 dimensional array with nodes
 * @extends {Node}
 */
function MatrixNode(nodes) {
    this.nodes = nodes || [];
}

MatrixNode.prototype = new Node();

math.expr.node.MatrixNode = MatrixNode;

(function () {
    /**
     * Evaluate the array
     * @return {Matrix} results
     * @override
     */
    MatrixNode.prototype.eval = function() {
        // evaluate all nodes in the 2d array, and merge the results into a matrix
        var nodes = this.nodes,
            results = [],
            mergeNeeded = false;

        for (var r = 0, rows = nodes.length; r < rows; r++) {
            var nodes_r = nodes[r];
            var results_r = [];
            for (var c = 0, cols = nodes_r.length; c < cols; c++) {
                var results_rc = nodes_r[c].eval();
                if (results_rc instanceof Matrix ||
                    results_rc instanceof Range ||
                    results_rc instanceof Array) {
                    mergeNeeded = true;
                }
                results_r[c] = results_rc;
            }
            results[r] = results_r;
        }

        if (mergeNeeded) {
            results = merge(results);
        }

        return new Matrix(results);
    };

    /**
     * Merge nested Matrices in a two dimensional Array.
     * @param {Array} array    Two-dimensional array containing Matrices
     * @return {Array} merged  The merged array (two-dimensional)
     */
    function merge (array) {
        var merged = [];
        var rows = array.length;
        for (var r = 0; r < rows; r++) {
            var array_r = array[r];
            var cols = array_r.length;
            var submatrix = null;
            var submatrixRows = null;
            for (var c = 0; c < cols; c++) {
                var entry = math.clone(array_r[c]);
                var size;
                if (entry instanceof Matrix) {
                    // get the data from the matrix
                    size = entry.size();
                    entry = entry.valueOf();
                    if (size.length == 1) {
                        entry = [entry];
                        size = [1, size[0]];
                    }
                    else if (size.length > 2) {
                        throw new Error('Cannot merge a multi dimensional matrix');
                    }
                }
                else if (entry instanceof Range) {
                    // change range into an 1xn matrix
                    entry = [entry.valueOf()];
                    size = [1, entry[0].length];
                }
                else if (entry instanceof Array) {
                    // change array into a 1xn matrix
                    size = [1, entry.length];
                    entry = [entry];
                }
                else {
                    // change scalar into a 1x1 matrix
                    size = [1, 1];
                    entry = [[entry]];
                }

                // check the height of this row
                if (submatrix == null) {
                    // first entry
                    submatrix = entry;
                    submatrixRows = size[0];
                }
                else if (size[0] == submatrixRows) {
                    // merge
                    for (var s = 0; s < submatrixRows; s++) {
                        submatrix[s] = submatrix[s].concat(entry[s]);
                    }
                }
                else {
                    // no good...
                    throw new Error('Dimension mismatch ' +
                        '(' + size[0] + ' != ' + submatrixRows + ')');
                }
            }

            // merge the submatrix
            merged = merged.concat(submatrix);
        }

        return merged;
    }

    /**
     * Get string representation
     * @return {String} str
     * @override
     */
    MatrixNode.prototype.toString = function() {
        return util.formatArray(this.nodes);
    };
})();