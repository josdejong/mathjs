import assert from 'assert'
import math from '../../../src/defaultInstance.js'
const reviver = math.reviver
const Range = math.Range

describe('reviver', function () {
  it('should parse generic JSON', function () {
    const json = '{"foo":[1,2,3],"bar":null,"baz":"str"}'
    const data = { foo: [1, 2, 3], bar: null, baz: 'str' }
    assert.deepStrictEqual(JSON.parse(json, reviver), data)
  })

  it('should parse a stringified numbers', function () {
    assert.strictEqual(JSON.parse('2.3', reviver), 2.3)
    assert.strictEqual(JSON.parse('{"mathjs":"number","value":"2.3"}', reviver), 2.3)
    assert.strictEqual(JSON.parse('{"mathjs":"number","value":"Infinity"}', reviver), Infinity)
    assert.strictEqual(JSON.parse('{"mathjs":"number","value":"-Infinity"}', reviver), -Infinity)
    assert(isNaN(JSON.parse('{"mathjs":"number","value":"NaN"}', reviver)))
  })

  it('should parse a stringified complex number', function () {
    const json = '{"mathjs":"Complex","re":2,"im":4}'
    const c = new math.Complex(2, 4)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Complex)
    assert.deepStrictEqual(obj, c)
  })

  it('should parse a stringified BigNumber', function () {
    const json = '{"mathjs":"BigNumber","value":"0.2"}'
    const b = new math.BigNumber(0.2)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.BigNumber)
    assert.deepStrictEqual(obj, b)
  })

  it('should parse a stringified bigint', function () {
    const json = '{"mathjs":"bigint","value":"12345678901234567890"}'

    assert.deepStrictEqual(JSON.parse(json, reviver), 12345678901234567890n)
  })

  it('should parse a stringified Fraction (fraction.js v4 with numbers)', function () {
    const json = '{"mathjs":"Fraction","n":3,"d":8}'
    const b = new math.Fraction(0.375)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Fraction)
    assert.strictEqual(obj.s, b.s)
    assert.strictEqual(obj.n, b.n)
    assert.strictEqual(obj.d, b.d)
  })

  it('should parse a stringified Fraction', function () {
    const json = '{"mathjs":"Fraction","n":{"mathjs":"bigint","value":"3"},"d":{"mathjs":"bigint","value":"8"}}'
    const b = new math.Fraction(0.375)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Fraction)
    assert.strictEqual(obj.s, b.s)
    assert.strictEqual(obj.n, b.n)
    assert.strictEqual(obj.d, b.d)
  })

  it('should parse a stringified Range', function () {
    const json = '{"mathjs":"Range","start":2,"end":10}'
    const r = new math.Range(2, 10)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Range)
    assert.deepStrictEqual(obj, r)
  })

  it('should parse a stringified Unit', function () {
    const json = '{"mathjs":"Unit","value":5,"unit":"cm","fixPrefix":false,"skipSimp":true}'
    const u = new math.Unit(5, 'cm')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Unit)
    assert.deepStrictEqual(obj, u)
  })

  it('should parse a stringified Unit with a value only', function () {
    const json = '{"mathjs":"Unit","value":5,"unit":null,"fixPrefix":false,"skipSimp":true}'
    const u = new math.Unit(5)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Unit)
    assert.deepStrictEqual(obj, u)
  })

  it('should parse a stringified Unit without a value', function () {
    const json = '{"mathjs":"Unit","value":null,"unit":"cm","fixPrefix":false,"skipSimp":true}'
    const u = new math.Unit(null, 'cm')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Unit)
    assert.deepStrictEqual(obj, u)
  })

  it('should parse a stringified Range (2)', function () {
    const json = '{"mathjs":"Range","start":2,"end":10,"step":2}'
    const r = new math.Range(2, 10, 2)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Range)
    assert.deepStrictEqual(obj, r)
  })

  it('should parse a stringified ResultSet', function () {
    const json = '{"mathjs":"ResultSet","entries":[1,2,{"mathjs":"Complex","re":3,"im":4}]}'
    const r = new math.ResultSet([1, 2, new math.Complex(3, 4)])

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.ResultSet)
    assert.deepStrictEqual(obj, r)
  })

  it('should parse a stringified Index', function () {
    const json = '{"mathjs":"Index","dimensions":[' +
        '{"mathjs":"Range","start":0,"end":10,"step":1},' +
        '{"mathjs":"Range","start":2,"end":3,"step":1}' +
        ']}'
    const i = new math.Index(new Range(0, 10), new Range(2, 3))

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Index)
    assert.deepStrictEqual(obj, i)
  })

  it('should parse a stringified Index (2)', function () {
    const json = '{"mathjs":"Index","dimensions":[[0, 10],2]}'
    const i = new math.Index([0, 10], 2)

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Index)
    assert.deepStrictEqual(obj, i)
  })

  it('should parse a stringified Matrix, dense storage format', function () {
    const json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,4]],"size":[2,2]}'
    const m = math.matrix([[1, 2], [3, 4]], 'dense')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Matrix)
    assert.deepStrictEqual(obj, m)
  })

  it('should parse a stringified Matrix containing a complex number, dense storage format', function () {
    const json = '{"mathjs":"DenseMatrix","data":[[1,2],[3,{"mathjs":"Complex","re":4,"im":5}]],"size":[2,2]}'
    const c = new math.Complex(4, 5)
    const m = math.matrix([[1, 2], [3, c]], 'dense')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Matrix)
    assert(obj._data[1][1] instanceof math.Complex)
    assert.deepStrictEqual(obj, m)
  })

  it('should parse a Matrix, sparse', function () {
    const json = '{"mathjs":"SparseMatrix","values":[1,3,2,4],"index":[0,1,0,1],"ptr":[0,2,4],"size":[2,2]}'
    const m = math.matrix([[1, 2], [3, 4]], 'sparse')

    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.SparseMatrix)
    assert(obj instanceof math.Matrix)
    assert.deepStrictEqual(obj, m)
  })

  it('should parse a stringified Help', function () {
    const json = '{"mathjs":"Help","name":"foo","description":"bar"}'
    const h = new math.Help({ name: 'foo', description: 'bar' })
    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Help)
    assert.deepStrictEqual(obj, h)
  })

  it('should parse a stringified Chain', function () {
    const json = '{"mathjs":"Chain","value":2.3}'
    const c = math.chain(2.3)
    const obj = JSON.parse(json, reviver)

    assert(obj instanceof math.Chain)
    assert.deepStrictEqual(obj, c)
  })

  it('should parse a stringified node tree', function () {
    const json = JSON.stringify({
      mathjs: 'OperatorNode',
      op: '+',
      fn: 'add',
      args: [
        {
          mathjs: 'ConstantNode',
          value: 2
        },
        {
          mathjs: 'FunctionNode',
          fn: {
            mathjs: 'SymbolNode',
            name: 'sin'
          },
          args: [
            {
              mathjs: 'OperatorNode',
              op: '*',
              fn: 'multiply',
              args: [
                {
                  mathjs: 'ConstantNode',
                  value: 3
                },
                {
                  mathjs: 'SymbolNode',
                  name: 'x'
                }
              ],
              implicit: true
            }
          ]
        }
      ],
      implicit: false
    })

    const node = JSON.parse(json, reviver)

    assert.strictEqual(node.type, 'OperatorNode')
    assert.strictEqual(node.toString(), '2 + sin(3 x)')
  })

  it('should parse a stringified Parser', function () {
    const json = JSON.stringify({
      mathjs: 'Parser',
      variables: {
        a: 42,
        c: { mathjs: 'BigNumber', value: '6' },
        w: { mathjs: 'BigNumber', value: '2' }
      },
      functions: {
        f: 'f(x) = w * x'
      }
    })

    const parser = JSON.parse(json, reviver)

    assert.deepStrictEqual(parser.get('a'), 42)
    assert.deepStrictEqual(parser.get('c'), math.bignumber('6'))
    assert.deepStrictEqual(parser.get('w'), math.bignumber('2'))
    assert.deepStrictEqual(parser.evaluate('f(4)'), math.bignumber('8'))
  })
})
