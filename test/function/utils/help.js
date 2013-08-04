// test help
var assert = require('assert');
var math = require('../../../dist/math.js');
var prop;

var doc = math.help('sin');
assert.ok(doc instanceof math.type.Help);
assert.deepEqual(doc, math.docs.sin);

// names to ignore
var ignore = ['workspace', 'parse', 'parser', 'select', 'unaryminus'];

// test whether all functions are documented
var undocumented = [];
for (prop in math) {
  if (math.hasOwnProperty(prop)) {
    var obj = math[prop];
    if (math['typeof'](obj) != 'object') {
      if (!math.docs[prop] && (ignore.indexOf(prop) == -1)) {
        undocumented.push(prop);
      }
    }
  }
}
if (undocumented.length) {
  console.log('WARNING: The following objects are undocumented: ' +
      undocumented.join(', '));
}

// test whether there is documentation for non existing functions
var nonexisting = [];
var docs = math.docs;
for (prop in docs) {
  if (docs.hasOwnProperty(prop)) {
    if (math[prop] === undefined && !math.type[prop]) {
      nonexisting.push(prop);
    }
  }
}
if (nonexisting.length) {
  console.log('WARNING: There is documentation available on the following ' +
      'non-existing objects: ' + nonexisting.join(', '));
}
