const assert = require('assert')
const math = require('../../src/main')
const reviver = math.json.reviver
const Range = math.type.Range

describe('reviver', function () {
  it('should parse generic JSON', function () {
    const json = '{"foo":[1,2,3],"bar":null,"baz":"str"}'
    const data = { foo: [1, 2, 3], bar: null, baz: 'str' }
    assert.deepStrictEqual(JSON.parse(json, reviver), data)
  })

  it('should parse a stringified complex number', function () {
    const json = '{"mathjs":"Complex","re":2,"im":4}'
    const c = new math.type.Complex(2, 4)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Complex)
    assert.deepStrictEqual(obj, c)
  })

  it('should parse a stringified BigNumber', function () {
    const json = '{"mathjs":"BigNumber","value":"0.2"}'
    const b = new math.type.BigNumber(0.2)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.BigNumber)
    assert.deepStrictEqual(obj, b)
  })

  it('should parse a stringified Fraction', function () {
    const json = '{"mathjs":"Fraction","n":3,"d":8}'
    const b = new math.type.Fraction(0.375)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Fraction)
    assert.strictEqual(obj.s, b.s)
    assert.strictEqual(obj.n, b.n)
    assert.strictEqual(obj.d, b.d)
  })

  it('should parse a stringified Range', function () {
    const json = '{"mathjs":"Range","start":2,"end":10}'
    const r = new math.type.Range(2, 10)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Range)
    assert.deepStrictEqual(obj, r)
  })

  it('should parse a stringified Unit', function () {
    const json = '{"mathjs":"Unit","value":5,"unit":"cm","fixPrefix":false}'
    const u = new math.type.Unit(5, 'cm')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Unit)
    assert.deepStrictEqual(obj, u)
  })

  it('should parse a stringified Range (2)', function () {
    const json = '{"mathjs":"Range","start":2,"end":10,"step":2}'
    const r = new math.type.Range(2, 10, 2)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Range)
    assert.deepStrictEqual(obj, r)
  })

  it('should parse a stringified ResultSet', function () {
    const json = '{"mathjs":"ResultSet","entries":[1,2,{"mathjs":"Complex","re":3,"im":4}]}'
    const r = new math.type.ResultSet([1, 2, new math.type.Complex(3, 4)])

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.ResultSet)
    assert.deepStrictEqual(obj, r)
  })

  it('should parse a stringified Index', function () {
    const json = '{"mathjs":"Index","dimensions":[' +
        '{"mathjs":"Range","start":0,"end":10,"step":1},' +
        '{"mathjs":"Range","start":2,"end":3,"step":1}' +
        ']}'
    const i = new math.type.Index(new Range(0, 10), new Range(2, 3))

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Index)
    assert.deepStrictEqual(obj, i)
  })

  it('should parse a stringified Index (2)', function () {
    const json = '{"mathjs":"Index","dimensions":[[0, 10],2]}'
    const i = new math.type.Index([0, 10], 2)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Index)
    assert.deepStrictEqual(obj, i)
  })

  it('should parse a stringified Matrix, dense storage format', function () {
    const json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,4]],"size":[2,2]}'
    const m = math.matrix([[1, 2], [3, 4]], 'dense')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Matrix)
    assert.deepStrictEqual(obj, m)
  })

  it('should parse a stringified Matrix containing a complex number, dense storage format', function () {
    const json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,{"mathjs":"Complex","re":4,"im":5}]],"size":[2,2]}'
    const c = new math.type.Complex(4, 5)
    const m = math.matrix([[1, 2], [3, c]], 'dense')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Matrix)
    assert(obj._data[1][1] instanceof math.type.Complex)
    assert.deepStrictEqual(obj, m)
  })

  it('should parse a Matrix, sparse', function () {
    const json = '{"mathjs":"SparseMatrix","values":[1,3,2,4],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}'
    const m = math.matrix([[1, 2], [3, 4]], 'sparse')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.SparseMatrix)
    assert(obj instanceof math.type.Matrix)
    assert.deepStrictEqual(obj, m)
  })

  it('should parse a stringified Help', function () {
    const json = '{"mathjs":"Help","name":"foo","description":"bar"}'
    const h = new math.type.Help({ name: 'foo', description: 'bar' })
    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Help)
    assert.deepStrictEqual(obj, h)
  })

  it('should parse a stringified Chain', function () {
    const json = '{"mathjs":"Chain","value":2.3}'
    const c = math.chain(2.3)
    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.type.Chain)
    assert.deepStrictEqual(obj, c)
  })

  it('should parse a stringified node tree', function () {
    const json = JSON.stringify({
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
    })

    const node = JSON.parse(json, reviver)

    assert.strictEqual(node.type, 'OperatorNode')
    assert.strictEqual(node.toString(), '2 + sin(3 x)')
  })
})
