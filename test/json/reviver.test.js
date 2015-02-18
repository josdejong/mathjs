var assert= require('assert');
var reviver = require('../../lib/json/reviver');
var Complex = require('../../lib/type/Complex');
var Range = require('../../lib/type/Range');
var Index = require('../../lib/type/Index');
var Unit = require('../../lib/type/Unit');
var Matrix = require('../../lib/type/Matrix');
var BigNumber = require('../../lib/type/BigNumber');
var Help = require('../../lib/type/Help');
var ResultSet = require('../../lib/type/ResultSet');

describe('reviver', function () {

  it('should parse generic JSON', function () {
    var json = '{"foo":[1,2,3],"bar":null,"baz":"str"}';
    var data = {foo: [1,2,3], bar: null, baz: 'str'};
    assert.deepEqual(JSON.parse(json, reviver), data);
  });

  it('should parse a stringified complex number', function () {
    var json = '{"mathjs":"Complex","re":2,"im":4}';
    var c = new Complex(2, 4);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Complex);
    assert.deepEqual(obj, c);
  });

  it('should parse a stringified BigNumber', function () {
    var json = '{"mathjs":"BigNumber","value":"0.2"}';
    var b = new BigNumber(0.2);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof BigNumber);
    assert.deepEqual(obj, b);
  });

  it('should parse a stringified Range', function () {
    var json = '{"mathjs":"Range","start":2,"end":10}';
    var r = new Range(2, 10);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Range);
    assert.deepEqual(obj, r);
  });

  it('should parse a stringified Unit', function () {
    var json = '{"mathjs":"Unit","value":5,"unit":"cm","fixPrefix":false}';
    var u = new Unit(5, 'cm');

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Unit);
    assert.deepEqual(obj, u);
  });

  it('should parse a stringified Range (2)', function () {
    var json = '{"mathjs":"Range","start":2,"end":10,"step":2}';
    var r = new Range(2, 10, 2);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Range);
    assert.deepEqual(obj, r);
  });

  it('should parse a stringified ResultSet', function () {
    var json = '{"mathjs":"ResultSet","entries":[1,2,{"mathjs":"Complex","re":3,"im":4}]}';
    var r = new ResultSet([1,2,new Complex(3,4)]);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof ResultSet);
    assert.deepEqual(obj, r);
  });

  it('should parse a stringified Index', function () {
    var json = '{"mathjs":"Index","ranges":[' +
        '{"mathjs":"Range","start":0,"end":10,"step":1},' +
        '{"mathjs":"Range","start":2,"end":3,"step":1}' +
        ']}';
    var i = new Index([0, 10], 2);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Index);
    assert.deepEqual(obj, i);
  });

  it('should parse a stringified Index (2)', function () {
    var json = '{"mathjs":"Index","ranges":[[0, 10],2]}';
    var i = new Index([0, 10], 2);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Index);
    assert.deepEqual(obj, i);
  });

  it('should parse a stringified Matrix', function () {
    var json = '{"mathjs":"Matrix","data":[[1,2],[3,4]]}';
    var m = new Matrix([[1,2],[3,4]]);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Matrix);
    assert.deepEqual(obj, m);
  });

  it('should parse a stringified Matrix containing a complex number', function () {
    var json = '{"mathjs":"Matrix","data":[[1,2],[3,{"mathjs":"Complex","re":4,"im":5}]]}';
    var c = new Complex(4, 5);
    var m = new Matrix([[1,2],[3,c]]);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Matrix);
    assert(obj._data[1][1] instanceof Complex);
    assert.deepEqual(obj, m);
  });

  it('should parse a stringified Help', function () {
    var json = '{"mathjs":"Help","name":"foo","description":"bar"}';
    var h = new Help({name: 'foo', description: 'bar'});
    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Help);
    assert.deepEqual(obj, h);
  });

});
