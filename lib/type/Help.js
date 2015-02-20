'use strict';

var util = require('../util/index');
var object = util.object;
var string = util.string;

/**
 * Documentation object
 * @param {Object} doc  Object containing properties:
 *                      {String} name
 *                      {String} category
 *                      {String} description
 *                      {String[]} syntax
 *                      {String[]} examples
 *                      {String[]} seealso
 * @constructor
 */
function Help (doc) {
  if (!(this instanceof Help)) {
    throw new SyntaxError('Constructor must be called with the new operator');
  }

  if (!doc)  throw new Error('Argument "doc" missing');

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
 * @param {Object} [math]   A math instance, used to evaluate the examples
 * @return {String} readableDoc
 * @private
 */
Help.prototype.toText = function (math) {
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
    var parser = math && math.parser();
    desc += 'Examples:\n';
    for (var i = 0; i < doc.examples.length; i++) {
      var expr = doc.examples[i];
      desc += '    ' + expr + '\n';

      if (parser) {
        var res;
        try {
          res = parser.eval(expr);
        }
        catch (e) {
          res = e;
        }
        if (res !== undefined && !(res instanceof Help)) {
          desc += '        ' + string.format(res, {precision: 14}) + '\n';
        }
      }
    }
    desc += '\n';
  }
  if (doc.seealso) {
    desc += 'See also: ' + doc.seealso.join(', ') + '\n';
  }

  return desc;
};

/**
 * Generate a string representation of the Help object
 * @return {String} Returns a string
 * @private
 */
Help.prototype.toString = function () {
  return this.toText();
};

/**
 * Export the help object to JSON
 */
Help.prototype.toJSON = function () {
  var obj = object.clone(this.doc);
  obj.mathjs = 'Help';
  return obj;
};

/**
 * Instantiate a Help object from a JSON object
 * @param {Object} json
 * @returns {Help} Returns a new Help object
 */
Help.fromJSON = function (json) {
  var doc = {};
  for (var prop in json) {
    if (prop !== 'mathjs') { // ignore mathjs field
      doc[prop] = json[prop];
    }
  }
  return new Help(doc);
};

/**
 * Returns a string representation of the Help object
 */
Help.prototype.valueOf = Help.prototype.toString;

// exports
module.exports = Help;
