var assert = require('assert');
var math = require('../../../index.js');
var prop;

describe('help', function() {

  it('should contain documentation for all available functions', function() {
    var help = math.help('sin');
    assert.ok(help instanceof math.type.Help);
    assert.deepEqual(help.doc, math.docs.sin);

    // names to ignore
    var ignore = ['workspace', 'parse', 'parser', 'select', 'unary'];

    // test whether all functions are documented
    for (prop in math) {
      if (math.hasOwnProperty(prop)) {
        var obj = math[prop];
        if (math['typeof'](obj) != 'object') {
          if (!math.docs[prop] && (ignore.indexOf(prop) == -1)) {
            // TODO: find a better solution for this
            console.log('WARNING: Function ' + prop + ' is undocumented');
          }
        }
      }
    }
  });

  it('should contain functions for all available documentation', function() {
    // test whether there is documentation for non existing functions
    var docs = math.docs;
    for (prop in docs) {
      if (docs.hasOwnProperty(prop)) {
        if (math[prop] === undefined && !math.type[prop]) {
          // TODO: find a better solution for this
          console.log('WARNING: Documentation for a non-existing function "' + prop + '"');
        }
      }
    }
  });

});