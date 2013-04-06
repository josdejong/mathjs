/**
 * @constructor MatrixNode
 * Holds an n-dimensional array with nodes
 * @param {Array} nodes
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
        // recursively evaluate the nodes in the array, and merge the result
        var array = evalArray(this.nodes);
        if (containsMatrix(array)) {
            array = merge(array);
        }
        return new Matrix(array);
    };

    /**
     * Recursively evaluate an array with nodes
     * @param {Array} array
     * @returns {Array} results
     */
    function evalArray(array) {
        return array.map(function (child) {
            if (child instanceof Array) {
                // evaluate a nested array
                return evalArray(child);
            }
            else {
                // evaluate a node (end point)
                return child.eval();
            }
        })
    }

    /**
     * Merge nested Matrices in an Array.
     * @param {Array} array    Two-dimensional array containing Matrices
     * @return {Array} merged  The merged array (two-dimensional)
     */
    function merge (array) {
        var merged = [];
        var rows = array.length;
        for (var r = 0; r < rows; r++) {
            var row = array[r];
            var cols = row.length;
            var submatrix = null;
            var submatrixRows = null;
            for (var c = 0; c < cols; c++) {
                var entry = math.clone(row[c]);
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
     * Recursively test whether a multidimensional array contains at least one
     * Matrix or Range.
     * @param {Array} array
     * @return {Boolean} containsMatrix
     */
    function containsMatrix(array) {
        return array.some(function (child) {
            if (child instanceof Matrix || child instanceof Range) {
                return true;
            }
            else if (child instanceof Array) {
                return containsMatrix(child);
            }
            else {
                return false;
            }
        });
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