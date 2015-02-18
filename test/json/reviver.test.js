var assert= require('assert');
var reviver = require('../../lib/json/reviver');
var Complex = require('../../lib/type/Complex');
var Range = require('../../lib/type/Range');
var Index = require('../../lib/type/Index');
var Unit = require('../../lib/type/Unit');
var Matrix = require('../../lib/type/Matrix');
var BigNumber = require('../../lib/type/BigNumber');
var ResultSet = require('../../lib/type/ResultSet');

describe('reviver', function () {

  it('should parse generic JSON', function () {
    var json = '{"foo":[1,2,3],"bar":null,"baz":"str"}';
    var data = {foo: [1,2,3], bar: null, baz: 'str'};
    assert.deepEqual(JSON.parse(json, reviver), data);
  });

  it('should parse a stringified complex number', function () {
    var json = '{"@type":"Complex","re":2,"im":4}';
    var c = new Complex(2, 4);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Complex);
    assert.deepEqual(obj, c);
  });

  it('should parse a stringified BigNumber', function () {
    var json = '{"@type":"BigNumber","value":"0.2"}';
    var b = new BigNumber(0.2);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof BigNumber);
    assert.deepEqual(obj, b);
  });

  it('should parse a stringified Range', function () {
    var json = '{"@type":"Range","start":2,"end":10}';
    var r = new Range(2, 10);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Range);
    assert.deepEqual(obj, r);
  });

  it('should parse a stringified Unit', function () {
    var json = '{"@type":"Unit","value":5,"unit":"cm","fixPrefix":false}';
    var u = new Unit(5, 'cm');

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Unit);
    assert.deepEqual(obj, u);
  });

  it('should parse a stringified Range (2)', function () {
    var json = '{"@type":"Range","start":2,"end":10,"step":2}';
    var r = new Range(2, 10, 2);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Range);
    assert.deepEqual(obj, r);
  });

  it('should parse a stringified ResultSet', function () {
    var json = '{"@type":"ResultSet","entries":[1,2,{"@type":"Complex","re":3,"im":4}]}';
    var r = new ResultSet([1,2,new Complex(3,4)]);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof ResultSet);
    assert.deepEqual(obj, r);
  });

  it('should parse a stringified Index', function () {
    var json = '{"@type":"Index","ranges":[' +
        '{"@type":"Range","start":0,"end":10,"step":1},' +
        '{"@type":"Range","start":2,"end":3,"step":1}' +
        ']}';
    var i = new Index([0, 10], 2);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Index);
    assert.deepEqual(obj, i);
  });

  it('should parse a stringified Index (2)', function () {
    var json = '{"@type":"Index","ranges":[[0, 10],2]}';
    var i = new Index([0, 10], 2);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Index);
    assert.deepEqual(obj, i);
  });

  it('should parse a stringified Matrix', function () {
    var json = '{"@type":"Matrix","data":[[1,2],[3,4]]}';
    var m = new Matrix([[1,2],[3,4]]);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Matrix);
    assert.deepEqual(obj, m);
  });

  it('should parse a stringified Matrix containing a complex number', function () {
    var json = '{"@type":"Matrix","data":[[1,2],[3,{"@type":"Complex","re":4,"im":5}]]}';
    var c = new Complex(4, 5);
    var m = new Matrix([[1,2],[3,c]]);

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Matrix);
    assert(obj._data[1][1] instanceof Complex);
    assert.deepEqual(obj, m);
  });

});
