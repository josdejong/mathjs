
/**
 * Documentation object
 * @param {Object} doc  Object containing properties:
 *                      {String} name
 *                      {String} category
 *                      {String[]} syntax
 *                      {String[]} examples
 *                      {String[]} seealso
 * @constructor
 */
function Help (doc) {
    if (doc) {
        util.extend(this, doc);
    }
}

math.type.Help = Help;

/**
 * Generate readable description from a Help object
 * @return {String} readableDoc
 * @private
 */
Help.prototype.toString = function () {
    var desc = '\n';

    if (this.name) {
        desc += 'Name: ' + this.name + '\n\n';
    }
    if (this.category) {
        desc += 'Category: ' + this.category + '\n\n';
    }
    if (this.syntax) {
        desc += 'Syntax:\n    ' + this.syntax.join('\n    ') + '\n\n';
    }
    if (this.examples) {
        var parser = math.parser();
        desc += 'Examples:\n';
        for (var i = 0; i < this.examples.length; i++) {
            var expr = this.examples[i];
            var res;
            try {
                res = parser.eval(expr);
            }
            catch (e) {
                res = e;
            }
            desc += '    ' + expr + '\n';
            if (res && !(res instanceof Help)) {
                desc += '        ' + math.format(res) + '\n';
            }
        }
        desc += '\n';
    }
    if (this.seealso) {
        desc += 'See also: ' + this.seealso.join(', ') + '\n';
    }


    return desc;
};

// TODO: implement a toHTML function in Help

/**
 * Export the help object to JSON
 */
Help.prototype.toJSON = function () {
    return util.extend({}, this);
};
