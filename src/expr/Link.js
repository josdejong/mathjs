// TODO: comment link

math.expr.Link = function Link (scope, name, value) {
    this.scope = scope;
    this.name = name;
    this.value = value;
};

/**
 * Get the links value
 * @returns {*} value
 */
math.expr.Link.prototype.get = function () {
    var value = this.value;
    if (!value) {
        // try to resolve again
        value = this.value = this.scope.findDef(this.name);

        if (!value) {
            throw new Error('Undefined symbol ' + this.name);
        }
    }

    // resolve a chain of links
    while (value instanceof math.expr.Link) {
        value = value.get();
    }

    return value;
};

/**
 * Set the value for the link
 * @param {*} value
 */
math.expr.Link.prototype.set = function (value) {
    this.value = value;
};
