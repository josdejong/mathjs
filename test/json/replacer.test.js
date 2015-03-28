var assert= require('assert');
var math = require('../../index');
var Complex = math.type.Complex;
var Range = math.type.Range;
var Index = math.type.Index;
var Matrix = math.type.Matrix;
var Unit = math.type.Unit;
var Help = math.type.Help;
var BigNumber = require('../../lib/type/BigNumber');
var ResultSet = math.type.ResultSet;

describe('replacer', function () {

  it('should stringify generic JSON', function () {
    var data = {foo: [1,2,3], bar: null, baz: 'str'};
    var json = '{"foo":[1,2,3],"bar":null,"baz":"str"}';
    assert.deepEqual(JSON.stringify(data), json);
  });

  it('should stringify a Complex number', function () {
    var c = new Complex(2, 4);
    var json = '{"mathjs":"Complex","re":2,"im":4}';

    assert.deepEqual(JSON.stringify(c), json);
  });

  it('should stringify a BigNumber', function () {
    var b = new BigNumber(5);
    var json = '{"mathjs":"BigNumber","value":"5"}';

    assert.deepEqual(JSON.stringify(b), json);
  });

  it('should stringify a Range', function () {
    var r = new Range(2, 10);
    var json = '{"mathjs":"Range","start":2,"end":10,"step":1}';
    assert.deepEqual(JSON.stringify(r), json);
  });

  it('should stringify an Index', function () {
    var i = new Index([0, 10], 2);
    var json = '{"mathjs":"Index","ranges":[' +
        '{"mathjs":"Range","start":0,"end":10,"step":1},' +
        '{"mathjs":"Range","start":2,"end":3,"step":1}' +
        ']}';
    assert.deepEqual(JSON.stringify(i), json);
  });

  it('should stringify a Range (2)', function () {
    var r = new Range(2, 10, 2);
    var json = '{"mathjs":"Range","start":2,"end":10,"step":2}';
    assert.deepEqual(JSON.stringify(r), json);
  });

  it('should stringify a Unit', function () {
    var u = new Unit(5, 'cm');
    var json = '{"mathjs":"Unit","value":5,"unit":"cm","fixPrefix":false}';
    assert.deepEqual(JSON.stringify(u), json);
  });

  it('should stringify a Matrix, dense storage format', function () {
    var m = math.matrix([[1,2],[3,4]], 'dense');
    var json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,4]],"size":[2,2]}';

    assert.deepEqual(JSON.stringify(m), json);
  });
  
  it('should stringify a Matrix, ccs storage format', function () {
    var m = math.matrix([[1,2],[3,4]], 'ccs');
    var json = '{"mathjs":"CcsMatrix","values":[1,3,2,4],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}';

    assert.deepEqual(JSON.stringify(m), json);
  });

  it('should stringify a Matrix, crs storage format', function () {
    var m = math.matrix([[1,2],[3,4]], 'crs');
    var json = '{"mathjs":"CrsMatrix","values":[1,2,3,4],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}';

    assert.deepEqual(JSON.stringify(m), json);
  });

  it('should stringify a ResultSet', function () {
    var r = new ResultSet([1,2,new Complex(3,4)]);
    var json = '{"mathjs":"ResultSet","entries":[1,2,{"mathjs":"Complex","re":3,"im":4}]}';
    assert.deepEqual(JSON.stringify(r), json);
  });

  it('should stringify a Matrix containing a complex number, dense storage format', function () {
    var c = new Complex(4, 5);
    var m = math.matrix([[1,2],[3,c]], 'dense');
    var json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,{"mathjs":"Complex","re":4,"im":5}]],"size":[2,2]}';

    assert.deepEqual(JSON.stringify(m), json);
  });
  
  it('should stringify a Matrix containing a complex number, ccs storage format', function () {
    var c = new Complex(4, 5);
    var m = math.matrix([[1,2],[3,c]], 'ccs');
    var json = '{"mathjs":"CcsMatrix","values":[1,3,2,{"mathjs":"Complex","re":4,"im":5}],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}';

    assert.deepEqual(JSON.stringify(m), json);
  });

  it('should stringify Help', function () {
    var h = new Help({name: 'foo', description: 'bar'});
    var json = '{"mathjs":"Help","name":"foo","description":"bar"}';

    assert.deepEqual(JSON.parse(JSON.stringify(h)), JSON.parse(json));
  });

});
