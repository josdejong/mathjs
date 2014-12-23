'use strict';

var util = require('../util/index'),
    object = util.object,
    string = util.string;

/**
 * Documentation object
 * @param {Object} math The math.js namespace
 * @param {Object} doc  Object containing properties:
 *                      {String} name
 *                      {String} category
 *                      {String[]} syntax
 *                      {String[]} examples
 *                      {String[]} seealso
 * @constructor
 */
function Help (math, doc) {
  if (!(this instanceof Help)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  // TODO: throw an error when math or doc is not provided

  this.math = math;
  this.doc = doc;
}

/**
 * Test whether a value is an instance of Help
 * @param {*} value
 * @return {Boolean} isHelp
 */
Help.isHelp = function (value) {
  return (value instanceof Help);
};

/**
 * Generate readable description from a Help object
 * @return {String} readableDoc
 * @private
 */
Help.prototype.toString = function () {
  var doc = this.doc || {};
  var desc = '\n';

  if (doc.name) {
    desc += 'Name: ' + doc.name + '\n\n';
  }
  if (doc.category) {
    desc += 'Category: ' + doc.category + '\n\n';
  }
  if (doc.description) {
    desc += 'Description:\n    ' + doc.description + '\n\n';
  }
  if (doc.syntax) {
    desc += 'Syntax:\n    ' + doc.syntax.join('\n    ') + '\n\n';
  }
  if (doc.examples) {
    var parser = this.math.parser();
    desc += 'Examples:\n';
    for (var i = 0; i < doc.examples.length; i++) {
      var expr = doc.examples[i];
      var res;
      try {
        res = parser.eval(expr);
      }
      catch (e) {
        res = e;
      }
      desc += '    ' + expr + '\n';
      if (res !== undefined && !(res instanceof Help)) {
        desc += '        ' + string.format(res, {precision: 14}) + '\n';
      }
    }
    desc += '\n';
  }
  if (doc.seealso) {
    desc += 'See also: ' + doc.seealso.join(', ') + '\n';
  }

  return desc;
};

// TODO: implement a toHTML function in Help

/**
 * Export the help object to JSON
 */
Help.prototype.toJSON = function () {
  return object.clone(this.doc);
};

/**
 * Returns a string representation of the Help object
 */
Help.prototype.valueOf = Help.prototype.toString;

// exports
module.exports = Help;
