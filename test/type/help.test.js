// test Help
var assert = require('assert'),
    math = require('../../index')();

var help = new math.type.Help(math, math.expression.docs.sin);

describe('help', function() {
  
  it('should generate the help for a function', function() {
    assert.deepEqual(help.doc.name, 'sin');
    assert.deepEqual(help.doc, math.expression.docs.sin);
  });

});