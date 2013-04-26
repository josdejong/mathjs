// TODO: comment link

function Link (scope, name, value) {
    this.scope = scope;
    this.name = name;
    this.value = value;
}

/**
 * Get the links value
 * @returns {*} value
 */
Link.prototype.get = function () {
    var value = this.value;
    if (!value) {
        // try to resolve again
        value = this.value = this.scope.findDef(this.name);

        if (!value) {
            throw new Error('Undefined symbol ' + this.name);
        }
    }

    // resolve a chain of links
    while (value instanceof Link) {
        value = value.get();
    }

    return value;
};

/**
 * Set the value for the link
 * @param {*} value
 */
Link.prototype.set = function (value) {
    this.value = value;
};
