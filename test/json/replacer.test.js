const assert = require('assert')
const math = require('../../src/main')

describe('replacer', function () {
  it('should stringify generic JSON', function () {
    const data = { foo: [1, 2, 3], bar: null, baz: 'str' }
    const json = '{"foo":[1,2,3],"bar":null,"baz":"str"}'
    assert.deepStrictEqual(JSON.stringify(data), json)
  })

  it('should stringify a Complex number', function () {
    const c = new math.type.Complex(2, 4)
    const json = '{"mathjs":"Complex","re":2,"im":4}'

    assert.deepStrictEqual(JSON.stringify(c), json)
  })

  it('should stringify a BigNumber', function () {
    const b = new math.type.BigNumber(5)
    const json = '{"mathjs":"BigNumber","value":"5"}'

    assert.deepStrictEqual(JSON.stringify(b), json)
  })

  it('should stringify a Fraction', function () {
    const b = new math.type.Fraction(0.375)
    const json = '{"mathjs":"Fraction","n":3,"d":8}'

    assert.deepStrictEqual(JSON.stringify(b), json)
  })

  it('should stringify a Range', function () {
    const r = new math.type.Range(2, 10)
    const json = '{"mathjs":"Range","start":2,"end":10,"step":1}'
    assert.deepStrictEqual(JSON.stringify(r), json)
  })

  it('should stringify an Index', function () {
    const i = new math.type.Index(new math.type.Range(0, 10), 2)
    const json = '{"mathjs":"Index","dimensions":[' +
        '{"mathjs":"Range","start":0,"end":10,"step":1},' +
        '{"mathjs":"ImmutableDenseMatrix","data":[2],"size":[1]}' +
        ']}'
    assert.deepStrictEqual(JSON.stringify(i), json)
  })

  it('should stringify a Range (2)', function () {
    const r = new math.type.Range(2, 10, 2)
    const json = '{"mathjs":"Range","start":2,"end":10,"step":2}'
    assert.deepStrictEqual(JSON.stringify(r), json)
  })

  it('should stringify a Unit', function () {
    const u = new math.type.Unit(5, 'cm')
    const json = '{"mathjs":"Unit","value":5,"unit":"cm","fixPrefix":false}'
    assert.deepStrictEqual(JSON.stringify(u), json)
  })

  it('should stringify a Matrix, dense', function () {
    const m = math.matrix([[1, 2], [3, 4]], 'dense')
    const json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,4]],"size":[2,2]}'

    assert.deepStrictEqual(JSON.stringify(m), json)
  })

  it('should stringify a Matrix, sparse', function () {
    const m = math.matrix([[1, 2], [3, 4]], 'sparse')
    const json = '{"mathjs":"SparseMatrix","values":[1,3,2,4],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}'

    assert.deepStrictEqual(JSON.stringify(m), json)
  })

  it('should stringify a ResultSet', function () {
    const r = new math.type.ResultSet([1, 2, new math.type.Complex(3, 4)])
    const json = '{"mathjs":"ResultSet","entries":[1,2,{"mathjs":"Complex","re":3,"im":4}]}'
    assert.deepStrictEqual(JSON.stringify(r), json)
  })

  it('should stringify a Matrix containing a complex number, dense', function () {
    const c = new math.type.Complex(4, 5)
    const m = math.matrix([[1, 2], [3, c]], 'dense')
    const json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,{"mathjs":"Complex","re":4,"im":5}]],"size":[2,2]}'

    assert.deepStrictEqual(JSON.stringify(m), json)
  })

  it('should stringify a Matrix containing a complex number, sparse', function () {
    const c = new math.type.Complex(4, 5)
    const m = math.matrix([[1, 2], [3, c]], 'sparse')
    const json = '{"mathjs":"SparseMatrix","values":[1,3,2,{"mathjs":"Complex","re":4,"im":5}],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}'

    assert.deepStrictEqual(JSON.stringify(m), json)
  })

  it('should stringify a Chain', function () {
    const c = math.chain(2.3)
    const json = '{"mathjs":"Chain","value":2.3}'
    assert.deepStrictEqual(JSON.stringify(c), json)
  })

  it('should stringify a node tree', function () {
    const node = math.parse('2 + sin(3 x)')
    const json = {
      'mathjs': 'OperatorNode',
      'op': '+',
      'fn': 'add',
      'args': [
        {
          'mathjs': 'ConstantNode',
          'value': 2
        },
        {
          'mathjs': 'FunctionNode',
          'fn': {
            'mathjs': 'SymbolNode',
            'name': 'sin'
          },
          'args': [
            {
              'mathjs': 'OperatorNode',
              'op': '*',
              'fn': 'multiply',
              'args': [
                {
                  'mathjs': 'ConstantNode',
                  'value': 3
                },
                {
                  'mathjs': 'SymbolNode',
                  'name': 'x'
                }
              ],
              'implicit': true
            }
          ]
        }
      ],
      'implicit': false
    }

    assert.deepStrictEqual(JSON.parse(JSON.stringify(node)), json)
  })

  it('should stringify Help', function () {
    const h = new math.type.Help({ name: 'foo', description: 'bar' })
    const json = '{"mathjs":"Help","name":"foo","description":"bar"}'
    assert.deepStrictEqual(JSON.parse(JSON.stringify(h)), JSON.parse(json))
  })
})
