// test Help
var assert = require('assert');
var math = require('../../index.js');

var help = new math.type.Help(math, math.docs.sin);

assert.deepEqual(help.doc.name, 'sin');
assert.deepEqual(help.doc, math.docs.sin);
