var assert = require('assert'),
    math = require('../../../index')();

describe('help', function() {

  it('should contain documentation for all available functions', function() {
    var help = math.help('sin');
    assert.ok(help instanceof math.type.Help);
    assert.deepEqual(help.doc, math.expression.docs.sin);

    // names to ignore
    var ignore = ['workspace', 'compile', 'parse', 'parser', 'select', 'unary', 'print', 'config', 'in'];

    // test whether all functions are documented
    for (var prop in math) {
      if (math.hasOwnProperty(prop)) {
        var obj = math[prop];
        if (math['typeof'](obj) != 'object') {
          if (!math.expression.docs[prop] && (ignore.indexOf(prop) == -1)) {
            // TODO: find a better solution for this
            console.log('WARNING: Function ' + prop + ' is undocumented');
          }
        }
      }
    }
  });

  it('should contain functions for all available documentation', function() {
    // test whether there is documentation for non existing functions
    var docs = math.expression.docs;
    for (var prop in docs) {
      if (docs.hasOwnProperty(prop)) {
        if (math[prop] === undefined && !math.type[prop]) {
          // TODO: find a better solution for this
          console.log('WARNING: Documentation for a non-existing function "' + prop + '"');
        }
      }
    }
  });

  it('should throw an error on wrong number of arguments', function() {
    assert.throws(function () {math.help()}, SyntaxError);
    assert.throws(function () {math.help('sin', 2)}, SyntaxError);
  });

  it('should find help from a function name', function() {
    var help = math.help('sin');
    assert(help instanceof math.type.Help);
    assert.equal(help.doc.name, 'sin');
  });

  it('should find help from a function', function() {
    var help = math.help(math.sin);
    assert(help instanceof math.type.Help);
    assert.equal(help.doc.name, 'sin');
  });

  it('should find help from a constant name', function() {
    var help = math.help('pi');
    assert(help instanceof math.type.Help);
    assert.equal(help.doc.name, 'pi');
  });

  it('should find help from a constant', function() {
    var help = math.help(math.pi);
    assert(help instanceof math.type.Help);
    assert.equal(help.doc.name, 'pi');
  });

  it('should throw an error when no help is found', function() {
    assert.throws(function () {math.help(undefined)}, /No documentation found/);
    assert.throws(function () {math.help('nonExistingFunction')}, /No documentation found/);
    assert.throws(function () {math.help('parse')}, /No documentation found/);
  });

});