var assert= require('assert');
var math = require('../../index');
var reviver = math.json.reviver;
var Complex = math.type.Complex;
var Range = math.type.Range;
var Index = math.type.Index;
var Unit = math.type.Unit;
var Matrix = math.type.Matrix;
var BigNumber = require('../../lib/type/BigNumber');
var Help = math.type.Help;
var ResultSet = math.type.ResultSet;

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
    var b = new math.type.BigNumber(0.2);

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

  it('should parse a stringified Matrix, dense storage format', function () {
    var json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,4]],"size":[2,2]}';
    var m = math.matrix([[1,2],[3,4]], 'dense');

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Matrix);
    assert.deepEqual(obj, m);
  });

  it('should parse a stringified Matrix containing a complex number, dense storage format', function () {
    var json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,{"mathjs":"Complex","re":4,"im":5}]],"size":[2,2]}';
    var c = new Complex(4, 5);
    var m = math.matrix([[1,2],[3,c]], 'dense');

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Matrix);
    assert(obj._data[1][1] instanceof Complex);
    assert.deepEqual(obj, m);
  });

  it('should parse a Matrix, ccs storage format', function () {
    var json = '{"mathjs":"CcsMatrix","values":[1,3,2,4],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}';
    var m = math.matrix([[1,2],[3,4]], 'ccs');

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof math.type.CcsMatrix);
    assert(obj instanceof Matrix);
    assert.deepEqual(obj, m);
  });

  it('should parse a Matrix, crs storage format', function () {
    var json = '{"mathjs":"CrsMatrix","values":[1,2,3,4],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}';
    var m = math.matrix([[1,2],[3,4]], 'crs');

    var obj = JSON.parse(json, reviver);

    assert(obj instanceof Matrix);
    assert(obj instanceof math.type.CrsMatrix);
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
