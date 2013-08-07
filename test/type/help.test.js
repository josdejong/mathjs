// test Help
var assert = require('assert');
var math = require('../../src/index.js');

var help = new math.type.Help(math.docs.sin);

assert.deepEqual(help.name, 'sin');
assert.deepEqual(help, math.docs.sin);


