import * as assert from 'assert'
import { expectTypeOf } from 'expect-type'
import {
  AccessorNode,
  addDependencies,
  all,
  ArrayNode,
  AssignmentNode,
  BigNumber,
  BlockNode,
  Complex,
  ConditionalNode,
  ConstantNode,
  create,
  divideDependencies,
  EvalFunction,
  factory,
  formatDependencies,
  Fraction,
  fractionDependencies,
  FunctionAssignmentNode,
  FunctionNode,
  Help,
  Index,
  IndexNode,
  isSymbolNode,
  LUDecomposition,
  MapLike,
  MathArray,
  MathCollection,
  MathJsChain,
  MathJsFunctionName,
  MathNode,
  MathNodeCommon,
  MathNumericType,
  MathScalarType,
  MathScope,
  MathType,
  Matrix,
  Node,
  ObjectNode,
  OperatorNode,
  OperatorNodeFn,
  OperatorNodeOp,
  ParenthesisNode,
  PolarCoordinates,
  QRDecomposition,
  RangeNode,
  SimplifyRule,
  SLUDecomposition,
  SymbolNode,
  Unit,
  evaluate,
  isResultSet,
  UnitPrefix
} from 'mathjs'

// This file serves a dual purpose:
// 1) examples of how to use math.js in TypeScript
// 2) tests for the TypeScript declarations provided by math.js

/*
Basic usage examples
*/
{
  const math = create(all)

  const m2by2 = [
    [-1, 2],
    [3, 1]
  ]
  const m2by3 = [
    [1, 2, 3],
    [4, 5, 6]
  ]

  // functions and constants
  math.round(math.e, 3)
  math.round(100.123, 3)
  const _res = math.atan2(3, -3) / math.pi
  math.log(10000, 10)
  math.nthRoot(16, 5)
  math.nthRoots(1, 3)
  math.sqrt(-4)

  math.pow(m2by2, 2)
  const angle = 0.2
  math.add(math.pow(math.sin(angle), 2), math.pow(math.cos(angle), 2))
  math.add(2, 3, 4)
  math.add(2, 3, math.bignumber(4))
  // @ts-expect-error: string arguments are not supported by the types, but it works (if the string contains a number)
  math.add(2, '3')
  // @ts-expect-error: string arguments are not supported by the types, but it works (if the string contains a number), but should throw an error if it is something else
  assert.throws(() => math.add(2, '3 + 5'))
  // @ts-expect-error: string arguments are not supported by the types, but it works (if the string contains a number), but should throw an error if it is something else
  assert.throws(() => math.add(2, '3 cm'))
  // @ts-expect-error: no arguments are not supported by the types, and should throw an error
  assert.throws(() => math.add())
  // @ts-expect-error: 1 argument is not supported by the types, and should throw an error
  assert.throws(() => math.add(1))

  math.multiply(2, 3, 4)
  math.multiply(2, 3, math.bignumber(4))
  // @ts-expect-error: string arguments are not supported by the types, but it works (if the string contains a number)
  math.multiply(2, '2') // currently not supported by the types, but turns out to work
  // @ts-expect-error: string arguments are not supported by the types, but it works (if the string contains a number), but should throw an error if it is something else
  assert.throws(() => math.multiply(2, '3 + 5'))
  // @ts-expect-error: string arguments are not supported by the types, but it works (if the string contains a number), but should throw an error if it is something else
  assert.throws(() => math.multiply(2, '3 cm'))
  // @ts-expect-error: no arguments are not supported by the types, and should throw an error
  assert.throws(() => math.multiply())
  // @ts-expect-error: 1 argument is not supported by the types, and should throw an error
  assert.throws(() => math.multiply(1))

  // std and variance check

  math.std(1, 2, 3)
  math.std([1, 2, 3])
  math.std([1, 2, 3], 'biased')
  math.std([1, 2, 3], 0, 'biased')
  math.std(m2by3, 1, 'unbiased')
  math.std(m2by3, 1, 'uncorrected')
  math.variance(1, 2, 3)
  math.variance([1, 2, 3])
  math.variance([1, 2, 3], 'biased')
  math.variance([1, 2, 3], 0, 'biased')
  math.variance(m2by3, 1, 'unbiased')
  math.variance(m2by3, 1, 'uncorrected')

  // std and variance on chain
  math.chain([1, 2, 3]).std('unbiased')
  math.chain(m2by3).std(0, 'biased').std(0, 'uncorrected')
  math.chain(m2by3).std(0, 'biased').std(0, 'uncorrected')
  math.chain([1, 2, 3]).std('unbiased')
  math.chain(m2by3).variance(0, 'biased')
  math.chain(m2by3).variance(1, 'uncorrected').variance('unbiased')

  math.variance(math.variance(m2by3, 'uncorrected'))

  // count and sum check
  math.count([10, 10, 10])
  math.count([
    [1, 2, 3],
    [4, 5, 6]
  ])
  math.count('mathjs')

  math.sum(1, 2, 3, 4)
  math.sum([1, 2, 3, 4])
  math.sum([
    [1, 2],
    [3, 4],
    [5, 6]
  ])

  // expressions
  math.evaluate('1.2 * (2 + 4.5)')

  // chained operations
  const a = math.chain(3).add(4).multiply(2).done()
  assert.strictEqual(a, 14)

  // mixed use of different data types in functions
  assert.deepStrictEqual(math.add(4, [5, 6]), [9, 10]) // number + Array
  assert.deepStrictEqual(
    math.multiply(math.unit('5 mm'), 3),
    math.unit('15 mm')
  ) // Unit * number
  assert.deepStrictEqual(math.subtract([2, 3, 4], 5), [-3, -2, -1]) // Array - number
  assert.deepStrictEqual(
    math.add(math.matrix([2, 3]), [4, 5]),
    math.matrix([6, 8])
  ) // Matrix + Array

  // narrowed type inference
  const _b: Matrix = math.add(math.matrix([2]), math.matrix([3]))
  const _c: Matrix = math.subtract(math.matrix([4]), math.matrix([5]))
}

/*
Bignumbers examples
*/
{
  // configure the default type of numbers as BigNumbers
  const math = create(all, {
    number: 'BigNumber',
    precision: 20
  })

  {
    assert.deepStrictEqual(
      math.add(math.bignumber(0.1), math.bignumber(0.2)),
      math.bignumber(0.3)
    )
    assert.deepStrictEqual(
      math.divide(math.bignumber(0.3), math.bignumber(0.2)),
      math.bignumber(1.5)
    )
  }
}
const result = evaluate('1 + 1; 2 + 2;') // multi-expression input

if (isResultSet(result)) {
  const entries = result.valueOf() // ✅ should be typed as unknown[]
  const _last = entries.slice(-1)[0] // ✅ access last result safely
}

/*
  Arithmetic function examples
*/
{
  const math = create(all, {})

  const _e: number = math.exp(1)
  const _bige: BigNumber = math.exp(math.bignumber(1))
  const _compe: Complex = math.exp(math.complex(1, 0))
  // TODO: Typescript type declarations are not understanding typed-function's
  // automatic conversions, so the following do not work:

  // const _compeagain: Complex = math.exp(math.fraction(1, 1))
  // const _eagain: number = math.exp('1')
  // const _eanother: number = math.exp(true)
}

/*
  Algebra function examples
*/
{
  const math = create(all, {})
  const derivVal = math.derivative('x^3 + x^2', 'x').evaluate({ x: 2 })
  assert.strictEqual(derivVal, 16)
  const roots = math.polynomialRoot(9, 6, 1)
  assert.strictEqual(roots.length, 1) // double root, so only one of them
  assert.strictEqual(roots[0], -3)
}

/*
Chaining examples
*/
{
  const math = create(all, {})
  const a = math.chain(3).add(4).multiply(2).done()
  assert.strictEqual(a, 14)

  // Another example, calculate square(sin(pi / 4))
  const _b = math.chain(math.pi).divide(4).sin().square().done()

  // toString will return a string representation of the chain's value
  const chain = math.chain(2).divide(3)
  const str: string = chain.toString()
  assert.strictEqual(str, '0.6666666666666666')

  chain.valueOf()

  // the function subset can be used to get or replace sub matrices
  const array = [
    [1, 2],
    [3, 4]
  ]
  const v = math.chain(array).subset(math.index(1, 0)).done()
  assert.strictEqual(v, 3)

  const _m = math.chain(array).subset(math.index(0, 0), 8).multiply(3).done()

  // filtering
  assert.deepStrictEqual(
    math
      .chain([-1, 0, 1.1, 2, 3, 1000])
      .filter(math.isPositive)
      .filter(math.isInteger)
      .filter((n) => n !== 1000)
      .done(),
    [2, 3]
  )

  const r = math.chain(-0.483).round([0, 1, 2]).floor().add(0.52).fix(1).done()

  assert.deepStrictEqual(r, [0.5, -0.4, -0.4])

  expectTypeOf(
    math.chain('x + y').parse().resolve({ x: 1 }).done()
  ).toMatchTypeOf<MathNode>()
  expectTypeOf(
    math.chain('x + y').parse().resolve().done()
  ).toMatchTypeOf<MathNode>()

  // bignum
  expectTypeOf(math.chain(math.bignumber(12))).toMatchTypeOf<
    MathJsChain<BigNumber>
  >()
  expectTypeOf(math.chain(12).bignumber()).toMatchTypeOf<
    MathJsChain<BigNumber>
  >()
  expectTypeOf(math.chain([12, 13, 14]).bignumber()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // bigint
  expectTypeOf(math.chain(math.bigint(12))).toMatchTypeOf<MathJsChain<bigint>>()
  expectTypeOf(math.chain(12).bigint()).toMatchTypeOf<MathJsChain<bigint>>()
  expectTypeOf(math.chain([12, 13, 14]).bigint()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // chain
  expectTypeOf(math.chain(12).bignumber().clone()).toMatchTypeOf<
    MathJsChain<BigNumber>
  >()

  // boolean
  expectTypeOf(math.chain(math.boolean(true))).toMatchTypeOf<
    MathJsChain<boolean>
  >()
  expectTypeOf(math.chain(true).boolean()).toMatchTypeOf<MathJsChain<boolean>>()
  expectTypeOf(math.chain([12, 13, 14]).boolean()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // complex
  expectTypeOf(math.chain(math.complex('123'))).toMatchTypeOf<
    MathJsChain<Complex>
  >()
  expectTypeOf(math.chain('123').complex()).toMatchTypeOf<
    MathJsChain<Complex>
  >()
  expectTypeOf(math.chain('123').complex(1)).toMatchTypeOf<
    MathJsChain<Complex>
  >()
  expectTypeOf(math.chain([12, 13, 14]).complex()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // createUnit
  expectTypeOf(math.chain(math.createUnit('furlong'))).toMatchTypeOf<
    MathJsChain<Unit>
  >()
  expectTypeOf(
    math.chain(
      math.createUnit({
        fresnel: '1234'
      })
    )
  ).toMatchTypeOf<MathJsChain<Unit>>()

  // fraction
  expectTypeOf(math.chain(math.fraction('123'))).toMatchTypeOf<
    MathJsChain<Fraction>
  >()
  expectTypeOf(math.chain('123').fraction()).toMatchTypeOf<
    MathJsChain<Fraction>
  >()
  expectTypeOf(math.chain('123').fraction(2)).toMatchTypeOf<
    MathJsChain<Fraction>
  >()
  expectTypeOf(math.chain([12, 13, 14]).fraction()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()
  expectTypeOf(math.chain([12, 13, 14]).fraction()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // index
  expectTypeOf(math.chain([12, 13, 14]).index()).toMatchTypeOf<
    MathJsChain<Index>
  >()

  // matrix
  expectTypeOf(math.chain([12, 13, 14, 15]).matrix()).toMatchTypeOf<
    MathJsChain<Matrix>
  >()

  // number
  expectTypeOf(math.chain('12').number()).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain([12, 13, 14]).number()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // numeric
  expectTypeOf(math.chain('12').numeric('bigint')).toMatchTypeOf<
    MathJsChain<bigint>
  >()
  expectTypeOf(math.chain(12).numeric('BigNumber')).toMatchTypeOf<
    MathJsChain<BigNumber>
  >()

  // sparse
  expectTypeOf(math.chain([12, 13, 14, 15]).sparse()).toMatchTypeOf<
    MathJsChain<Matrix>
  >()

  // split unit
  expectTypeOf(math.chain(math.unit('furlong')).splitUnit([])).toMatchTypeOf<
    MathJsChain<Unit[]>
  >()

  // string
  expectTypeOf(math.chain('test').string()).toMatchTypeOf<MathJsChain<string>>()
  expectTypeOf(math.chain([1, 2, 3]).string()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // unit
  expectTypeOf(math.chain(12).unit()).toMatchTypeOf<MathJsChain<Unit>>()
  expectTypeOf(math.chain([1, 2, 3]).unit()).toMatchTypeOf<
    MathJsChain<Unit[]>
  >()

  // compile
  expectTypeOf(math.chain('a + b').compile()).toMatchTypeOf<
    MathJsChain<EvalFunction>
  >()

  // evaluate
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expectTypeOf(math.chain('1 + 1').evaluate()).toMatchTypeOf<MathJsChain<any>>()
  expectTypeOf(math.chain(['1 + 1', '2 + 2']).evaluate()).toMatchTypeOf<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MathJsChain<any[]>
  >()

  // parse
  expectTypeOf(math.chain('1 + 1').parse()).toMatchTypeOf<
    MathJsChain<MathNode>
  >()
  expectTypeOf(math.chain(['1 + 1', '2 + 2']).parse()).toMatchTypeOf<
    MathJsChain<MathNode[]>
  >()

  // resolve
  expectTypeOf(math.chain(math.parse('1 + 1')).resolve({})).toMatchTypeOf<
    MathJsChain<MathNode>
  >()
  expectTypeOf(
    math.chain([math.parse('1 + 1'), math.parse('1 + 1')]).resolve({})
  ).toMatchTypeOf<MathJsChain<MathNode[]>>()

  // derivative
  expectTypeOf(math.chain(math.parse('x^2')).derivative('x')).toMatchTypeOf<
    MathJsChain<MathNode>
  >()

  // lsolve
  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4]
      ])
      .lsolve([1, 2])
  ).toMatchTypeOf<MathJsChain<MathArray>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .lsolve([1, 2])
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // lup
  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4]
      ])
      .lup()
  ).toMatchTypeOf<MathJsChain<LUDecomposition>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .lup()
  ).toMatchTypeOf<MathJsChain<LUDecomposition>>()

  // lusolve
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .lusolve(math.matrix([1, 2]))
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .lusolve([1, 2])
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4]
      ])
      .lusolve(math.matrix([1, 2]))
  ).toMatchTypeOf<MathJsChain<MathArray>>()

  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4]
      ])
      .lusolve([1, 2])
  ).toMatchTypeOf<MathJsChain<MathArray>>()

  // qr
  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4]
      ])
      .qr()
  ).toMatchTypeOf<MathJsChain<QRDecomposition>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .qr()
  ).toMatchTypeOf<MathJsChain<QRDecomposition>>()

  // rationalize
  expectTypeOf(math.chain('1.23').rationalize()).toMatchTypeOf<
    MathJsChain<MathNode>
  >()
  expectTypeOf(math.chain(math.parse('1.23')).rationalize()).toMatchTypeOf<
    MathJsChain<MathNode>
  >()

  // simplify
  expectTypeOf(math.chain('a + a + b').simplify()).toMatchTypeOf<
    MathJsChain<MathNode>
  >()
  expectTypeOf(math.chain(math.parse('a + a + b')).simplify()).toMatchTypeOf<
    MathJsChain<MathNode>
  >()

  // symbolicEqual
  assert.strictEqual(
    math.symbolicEqual(math.parse('x*y'), math.parse('y*x')),
    true
  )
  assert.strictEqual(
    math.symbolicEqual(math.parse('x*y'), math.parse('y*x'), {
      exactFractions: true
    }),
    true
  )
  assert.strictEqual(
    math.chain(math.parse('x*y')).symbolicEqual(math.parse('y*x')).done(),
    true
  )

  // leafCount
  assert.strictEqual(math.leafCount(math.parse('x*y')), 2)
  assert.strictEqual(math.chain(math.parse('x*y')).leafCount().done(), 2)

  // slu
  expectTypeOf(
    math
      .chain(
        math.sparse([
          [1, 2],
          [3, 4]
        ])
      )
      .slu(2, 0.5)
  ).toMatchTypeOf<MathJsChain<SLUDecomposition>>()

  // usolve
  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4]
      ])
      .usolve([1, 2])
  ).toMatchTypeOf<MathJsChain<MathArray>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .usolve([1, 2])
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // abs
  expectTypeOf(math.chain(1).abs()).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain(math.bignumber(1)).abs()).toMatchTypeOf<
    MathJsChain<BigNumber>
  >()
  expectTypeOf(math.chain(math.fraction(1, 2)).abs()).toMatchTypeOf<
    MathJsChain<Fraction>
  >()
  expectTypeOf(math.chain(math.complex(1, 2)).abs()).toMatchTypeOf<
    MathJsChain<number>
  >()
  expectTypeOf(math.chain([1, 2]).abs()).toMatchTypeOf<MathJsChain<MathArray>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .abs()
  ).toMatchTypeOf<MathJsChain<Matrix>>()
  expectTypeOf(math.chain(math.unit('furlong')).abs()).toMatchTypeOf<
    MathJsChain<Unit>
  >()

  // add
  expectTypeOf(math.chain(1).add(2)).toMatchTypeOf<MathJsChain<MathType>>()
  expectTypeOf(math.chain([1]).add(2)).toMatchTypeOf<MathJsChain<MathType>>()
  expectTypeOf(
    math.chain(
      math.matrix([
        [1, 2],
        [3, 4]
      ])
    )
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // mapSlices
  expectTypeOf(math.chain([1, 2, 3]).mapSlices(0, () => 1)).toMatchTypeOf<
    MathJsChain<number[]>
  >()

  // cbrt
  expectTypeOf(math.chain(1).cbrt()).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain(math.bignumber(1)).cbrt()).toMatchTypeOf<
    MathJsChain<BigNumber>
  >()
  expectTypeOf(math.chain(math.complex(1, 2)).cbrt()).toMatchTypeOf<
    MathJsChain<Complex>
  >()
  // @ts-expect-error ... verify cbrt does not run on arrays.
  assert.throws(() => math.chain([1, 2]).cbrt(), TypeError)
  assert.throws(
    () =>
      // @ts-expect-error ... verify cbrt does not run on matrices.
      math
        .chain(
          math.matrix([
            [1, 2],
            [3, 4]
          ])
        )
        .cbrt(),
    TypeError
  )

  // ceil
  expectTypeOf(math.chain(1).ceil()).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(math.chain([1]).ceil()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()
  expectTypeOf(
    math.chain(math.unit('5.2cm')).ceil(math.unit('cm'))
  ).toMatchTypeOf<MathJsChain<Unit>>()

  // fix
  expectTypeOf(math.chain(1).fix()).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(math.chain([1]).fix()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()
  expectTypeOf(
    math.chain(math.unit('5.2cm')).fix(math.unit('cm'))
  ).toMatchTypeOf<MathJsChain<Unit>>()

  // floor
  expectTypeOf(math.chain(1).floor()).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(math.chain([1]).floor()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()
  expectTypeOf(
    math.chain(math.unit('5.2cm')).floor(math.unit('cm'))
  ).toMatchTypeOf<MathJsChain<Unit>>()
  expectTypeOf(
    math.chain(math.unit('5.2cm')).round(2, math.unit('cm'))
  ).toMatchTypeOf<MathJsChain<Unit>>()

  // round
  expectTypeOf(math.chain(1).round()).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(math.chain([1]).round()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()
  expectTypeOf(
    math.chain(math.unit('5.2cm')).round(math.unit('cm'))
  ).toMatchTypeOf<MathJsChain<Unit>>()

  // cube
  expectTypeOf(math.chain(1).cube()).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain(math.bignumber(1)).cube()).toMatchTypeOf<
    MathJsChain<BigNumber>
  >()
  expectTypeOf(math.chain(math.fraction(1, 2)).cube()).toMatchTypeOf<
    MathJsChain<Fraction>
  >()
  expectTypeOf(math.chain(math.complex(1, 2)).cube()).toMatchTypeOf<
    MathJsChain<Complex>
  >()

  // @ts-expect-error ... verify cube does not run on arrays.
  assert.throws(() => math.chain([1, 2]).cube(), TypeError)
  assert.throws(
    () =>
      // @ts-expect-error ... verify cube does not run on matrices.
      math
        .chain(
          math.matrix([
            [1, 2],
            [3, 4]
          ])
        )
        .cube(),
    TypeError
  )

  expectTypeOf(math.chain(math.unit('furlong')).cube()).toMatchTypeOf<
    MathJsChain<Unit>
  >()

  // divide
  expectTypeOf(
    math.chain(math.unit('furlong')).divide(math.unit('femtosecond'))
  ).toMatchTypeOf<MathJsChain<number | Unit>>()
  expectTypeOf(math.chain(math.unit('furlong')).divide(6)).toMatchTypeOf<
    MathJsChain<Unit>
  >()
  expectTypeOf(math.chain(2).divide(6)).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain([1, 2, 3]).divide(6)).toMatchTypeOf<
    MathJsChain<MathType>
  >()

  // dotDivide
  expectTypeOf(math.chain(1).dotDivide(2)).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .dotDivide(2)
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // dotMultiply
  expectTypeOf(math.chain(1).dotMultiply(2)).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .dotMultiply(2)
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // dotPow
  expectTypeOf(math.chain(1).dotPow(2)).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .dotPow(2)
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // diff
  expectTypeOf(math.chain([1, 2, 3]).diff()).toMatchTypeOf<
    MathJsChain<MathArray>
  >()
  expectTypeOf(math.chain([1, 2, 3]).diff(0)).toMatchTypeOf<
    MathJsChain<MathArray>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .diff(1)
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // exp
  expectTypeOf(math.chain(1).exp()).toMatchTypeOf<MathJsChain<MathType>>()
  // @ts-expect-error ... verify exp does not run on arrays.
  assert.throws(() => math.chain([1, 2]).exp(), TypeError)
  assert.throws(
    () =>
      // @ts-expect-error ... verify exp does not run on matrices.
      math
        .chain(
          math.matrix([
            [1, 2],
            [3, 4]
          ])
        )
        .exp(),
    TypeError
  )

  // expm1
  expectTypeOf(math.chain(1).expm1()).toMatchTypeOf<MathJsChain<MathType>>()

  // @ts-expect-error ... verify expm1 does not run on arrays
  assert.throws(() => math.chain([1, 2]).expm1(), TypeError)
  assert.throws(
    () =>
      // @ts-expect-error ... verify expm1 does not run on arrays
      math
        .chain(
          math.matrix([
            [1, 2],
            [3, 4]
          ])
        )
        .expm1(),
    TypeError
  )

  // gcd
  expectTypeOf(math.chain([1, 2]).gcd(3)).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain([1, 2]).gcd(3, 4)).toMatchTypeOf<
    MathJsChain<number>
  >()
  expectTypeOf(math.chain([1, 2]).gcd()).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(
    math.chain([math.bignumber(1), math.bignumber(1)]).gcd()
  ).toMatchTypeOf<MathJsChain<BigNumber>>()
  expectTypeOf(
    math.chain([math.bignumber(1), math.bignumber(1)]).gcd()
  ).toMatchTypeOf<MathJsChain<BigNumber>>()
  expectTypeOf(
    math.gcd(math.bignumber(1), math.bignumber(1))
  ).toMatchTypeOf<BigNumber>()
  expectTypeOf(
    math.gcd([
      math.matrix([
        [1, 2],
        [3, 4]
      ]),
      math.matrix([
        [1, 2],
        [3, 4]
      ])
    ])
  ).toMatchTypeOf<Matrix>()
  expectTypeOf(
    math.gcd(
      [
        [1, 2],
        [3, 4]
      ],
      [
        [1, 2],
        [3, 4]
      ]
    )
  ).toMatchTypeOf<MathArray>()

  assert.throws(
    () =>
      math.gcd([
        [
          [1, 5],
          [10, 49]
        ],
        [
          [1, 5],
          [5, 7]
        ]
      ]),
    Error
  )

  // hypot
  expectTypeOf(math.chain([1, 2]).hypot()).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(
    math.chain([math.bignumber(1), math.bignumber(1)]).hypot()
  ).toMatchTypeOf<MathJsChain<BigNumber>>()

  // lcm
  expectTypeOf(math.chain(1).lcm(2)).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(
    math.chain(math.bignumber(1)).lcm(math.bignumber(2))
  ).toMatchTypeOf<MathJsChain<BigNumber>>()
  expectTypeOf(math.chain([1, 2]).lcm([3, 4])).toMatchTypeOf<
    MathJsChain<MathArray>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .lcm(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // log
  expectTypeOf(math.chain(1).log(2)).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(
    math.chain(math.bignumber(1)).log(math.bignumber(2))
  ).toMatchTypeOf<MathJsChain<BigNumber>>()

  // log10
  expectTypeOf(math.chain(1).log10()).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain(math.bignumber(1)).log10()).toMatchTypeOf<
    MathJsChain<BigNumber>
  >()
  expectTypeOf(math.chain([1, 2]).log10()).toMatchTypeOf<
    MathJsChain<MathArray>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4]
        ])
      )
      .log10()
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // nthRoot(s)
  expectTypeOf(math.chain(81).nthRoot(4)).toMatchTypeOf<
    MathJsChain<number | Complex>
  >()
  expectTypeOf(math.chain(1).nthRoots(5)).toMatchTypeOf<
    MathJsChain<Array<Complex>>
  >()

  expectTypeOf(math.chain([1, 2]).count()).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain('mathjs').count()).toMatchTypeOf<
    MathJsChain<number>
  >()
  expectTypeOf(math.chain([1, 2]).sum()).toMatchTypeOf<MathJsChain<number>>()

  expectTypeOf(math.chain(7).isBounded()).toMatchTypeOf<MathJsChain<boolean>>()
  expectTypeOf(math.chain(8).isFinite()).toMatchTypeOf<MathJsChain<boolean>>()
  expectTypeOf(math.chain([1, Infinity]).isBounded()).toMatchTypeOf<
    MathJsChain<boolean>
  >()
  expectTypeOf(math.chain([1, Infinity]).isFinite()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // bernoulli
  expectTypeOf(math.chain(math.bigint(4)).bernoulli()).toMatchTypeOf<
    MathJsChain<Fraction>
  >()

  // TODO complete the rest of these...
}

/*
Simplify examples
*/
{
  const math = create(all)

  math.simplify('2 * 1 * x ^ (2 - 1)')
  math.simplifyConstant('2 * 1 * x ^ (2 - 1)')
  math.simplifyCore('2 * 1 * x ^ (2 - 1)')
  math.simplify('2 * 3 * x', { x: 4 })

  expectTypeOf(math.simplify.rules).toMatchTypeOf<Array<SimplifyRule>>()

  const f = math.parse('2 * 1 * x ^ (2 - 1)')
  math.simplify(f)

  math.simplify('0.4 * x', {}, { exactFractions: true })
  math.simplifyConstant('0.4 * x', { exactFractions: true })
  math.simplify('0.4 * x', {}, { exactFractions: false })
  math.simplify('0.4 * x', {}, { fractionsLimit: 2 })
  math.simplify('0.4 * x', {}, { consoleDebug: false })

  math.simplify(
    '0.4 * x',
    {},
    {
      context: {
        xor: {
          trivial: true,
          total: true,
          commutative: true,
          associative: true
        }
      }
    }
  )

  math.simplify('0.4 * x', [])
  math.simplify('0.4 * x', [
    'n * n -> 2n',
    {
      s: 'n * n -> 2n',
      repeat: true,
      assuming: {
        multiply: {
          trivial: true,
          total: true,
          commutative: true,
          associative: true
        }
      },
      imposeContext: {
        multiply: {
          trivial: true,
          total: true,
          commutative: true,
          associative: true
        }
      }
    },
    {
      l: 'n * n',
      r: '2n',
      repeat: true,
      assuming: {
        multiply: {
          trivial: true,
          total: true,
          commutative: true,
          associative: true
        }
      },
      imposeContext: {
        multiply: {
          trivial: true,
          total: true,
          commutative: true,
          associative: true
        }
      }
    },
    (node: MathNode) => node
  ])
  math.simplifyCore('0.4 * x + 0', { exactFractions: false })

  math
    .chain('0.4 * x + 0')
    .parse()
    .simplifyCore({ exactFractions: false })
    .simplifyConstant()
}

/*
Complex numbers examples
*/
{
  const math = create(all, {})
  const a = math.complex(2, 3)
  // create a complex number by providing a string with real and complex parts
  const b = math.complex('3 - 7i')

  // read the real and complex parts of the complex number
  {
    const _x: number = a.re
    const _y: number = a.im

    // adjust the complex value
    a.re = 5
  }

  // clone a complex value
  {
    const _clone = a.clone()
  }

  // perform operations with complex numbers
  {
    math.add(a, b)
    math.multiply(a, b)
    math.sin(a)
  }

  // create a complex number from polar coordinates
  {
    const p: PolarCoordinates = {
      r: math.sqrt(2) as number, // must be real but a sqrt could be Complex
      phi: math.pi / 4
    }
    const c: Complex = math.complex(p)
    assert.strictEqual(c.im, 1)
    assert.ok(Math.abs(c.re - 1) < 1e-12)
  }

  // get polar coordinates of a complex number
  {
    const _p: PolarCoordinates = math.complex(3, 4).toPolar()
  }
}

/*
Parenthesis examples
*/
{
  const math = create(all, {})

  expectTypeOf(
    new math.ParenthesisNode(new math.ConstantNode(3))
  ).toMatchTypeOf<ParenthesisNode<ConstantNode>>()
}

/*
Expressions examples
*/
{
  const math = create(all, {})
  // evaluate expressions
  {
    math.evaluate('sqrt(3^2 + 4^2)')
  }

  // evaluate multiple expressions at once
  {
    math.evaluate(['f = 3', 'g = 4', 'f * g'])
  }

  // get content of a parenthesis node
  {
    const node = math.parse('(1)')
    if (node.type !== 'ParenthesisNode') {
      throw Error(`expected ParenthesisNode, got ${node.type}`)
    }
  }

  // scope can contain both variables and functions
  {
    const scope: MathScope = { hello: (name: string) => `hello, ${name}!` }
    assert.strictEqual(math.evaluate('hello("hero")', scope), 'hello, hero!')
  }

  // define a function as an expression
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scope: MathScope = {
      a: 3,
      b: 4
    }
    const f = math.evaluate('f(x) = x ^ a', scope)
    f(2)
    scope.f(2)
  }

  // using JavaScript's built-in Map as scope
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapScope = new Map<string, any>()
    mapScope.set('x', 3)

    assert.strictEqual(math.evaluate('x', mapScope), 3)
    assert.strictEqual(math.evaluate('y = 2 * x', mapScope), 6)
    assert.strictEqual(mapScope.get('y'), 6)

    math.evaluate('area(length, width) = length * width', mapScope)
    assert.strictEqual(math.evaluate('area(4, 5)', mapScope), 20)
    assert.strictEqual(mapScope.get('area')(4, 5), 20)
  }

  // using custom implementation with type validation and additional utility methods.
  {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    type ValueType = string | number | Function

    class CustomMap implements MapLike<string, ValueType> {
      private readonly map = new Map<string, ValueType>()

      // ensure that the value being set is of a valid type
      private validateValueType(value: ValueType): void | never {
        if (
          typeof value !== 'number' &&
          typeof value !== 'function' &&
          typeof value !== 'string'
        ) {
          throw new TypeError(
            `CustomMap only supports values of type number, string, or function, got ${typeof value}`
          )
        }
      }

      get(key: string): ValueType {
        return this.map.get(key)
      }

      set(key: string, value: ValueType): CustomMap {
        // additional validation to ensure the value is of a valid type
        this.validateValueType(value)
        this.map.set(key, value)
        return this
      }

      has(key: string): boolean {
        return this.map.has(key)
      }

      keys(): IterableIterator<string> {
        return this.map.keys()
      }

      // additional method to get all values in the map
      getAllValues(): ValueType[] {
        const values: ValueType[] = []
        for (const key of this.keys()) {
          values.push(this.get(key))
        }
        return values
      }
    }

    const customMap = new CustomMap()
    customMap.set('x', 4)

    assert.strictEqual(math.evaluate('x + 2', customMap), 6)
    assert.strictEqual(math.evaluate('z = x * 3', customMap), 12)
    assert.strictEqual(customMap.get('z'), 12)

    math.evaluate('multiply(a, b) = a * b', customMap)
    assert.strictEqual(math.evaluate('multiply(3, 4)', customMap), 12)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const multiply = customMap.get('multiply') as Function
    assert.strictEqual(multiply(3, 4), 12)

    const x = customMap.get('x')
    const z = customMap.get('z')
    assert.deepStrictEqual(customMap.getAllValues(), [x, z, multiply])

    assert.throws(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      () => math.evaluate('invalid = true', customMap),
      TypeError
    )
  }

  {
    const node2 = math.parse('x^a')
    const _code2: EvalFunction = node2.compile()
    node2.toString()
  }

  // 3. using function math.compile
  // parse an expression
  {
    // provide a scope for the variable assignment
    const code2 = math.compile('a = a + 3')
    const scope: MathScope = { a: 7 }
    code2.evaluate(scope)
  }
  // 4. using a parser
  const parser = math.parser()

  // get and set variables and functions
  {
    assert.strictEqual(parser.evaluate('x = 7 / 2'), 3.5)
    assert.strictEqual(parser.evaluate('x + 3'), 6.5)
    parser.evaluate('f(x, y) = x^y') // f(x, y)
    assert.strictEqual(parser.evaluate('f(2, 3)'), 8)

    const _x = parser.get('x')
    const f = parser.get('f')
    const _y = parser.getAll()
    const _z = parser.getAllAsMap()
    const _g = f(3, 3)

    parser.set('h', 500)
    assert.strictEqual(parser.get('h'), 500)
    assert.strictEqual(parser.evaluate('h'), 500)
    parser.set('hello', (name: string) => `hello, ${name}!`)
    parser.remove('h')
    assert.strictEqual(parser.get('h'), undefined)
  }

  // clear defined functions and variables
  parser.clear()
}

/*
Fractions examples
*/
{
  // configure the default type of numbers as Fractions
  const math = create(all, {
    number: 'Fraction'
  })

  const x = math.fraction(0.125)
  const y = math.fraction('1/3')
  math.fraction(2, 3)

  math.add(x, y)
  math.divide(x, y)

  // output formatting
  const _a = math.fraction('2/3')
}

/*
Transform examples
*/
{
  const math = create(all, {})
  {
    const myTransform1 = (node: MathNode): OperatorNode<'+', 'add'> =>
      new OperatorNode('+', 'add', [node, new ConstantNode(1)])
    const myTransform2 = (
      node: OperatorNode<'+', 'add'>
    ): OperatorNode<'-', 'subtract'> =>
      new OperatorNode('-', 'subtract', [node, new ConstantNode(5)])

    expectTypeOf(
      math.parse('sqrt(3^2 + 4^2)').transform(myTransform1)
    ).toMatchTypeOf<OperatorNode<'+', 'add', MathNode[]>>()

    assert.deepStrictEqual(
      math.parse('sqrt(3^2 + 4^2)').transform(myTransform1).toString(),
      'sqrt(3 ^ 2 + 4 ^ 2) + 1'
    )

    expectTypeOf(
      math
        .parse('sqrt(3^2 + 4^2)')
        .transform(myTransform1)
        .transform(myTransform2)
    ).toMatchTypeOf<OperatorNode<'-', 'subtract', MathNode[]>>()

    assert.deepStrictEqual(
      math
        .parse('sqrt(3^2 + 4^2)')
        .transform(myTransform1)
        .transform(myTransform2)
        .toString(),
      'sqrt(3 ^ 2 + 4 ^ 2) + 1 - 5'
    )
  }
}

/*
Matrices examples
*/
{
  const math = create(all, {})

  // create matrices and arrays. a matrix is just a wrapper around an Array,
  // providing some handy utilities.
  const a: Matrix = math.matrix([1, 4, 9, 16, 25])
  const b: Matrix = math.matrix(math.ones([2, 3]))
  b.size()

  // @ts-expect-error ... ones() in a chain cannot take more dimensions
  assert.throws(() => math.chain(3).ones(2, 'dense').done(), /Error:.*ones/)
  // @ts-expect-error ... and neither can zeros()
  assert.throws(() => math.chain(3).zeros(2, 'sparse').done(), /Error:.*zeros/)

  // the Array data of a Matrix can be retrieved using valueOf()
  const _array = a.valueOf()

  // Matrices can be cloned
  const _clone: Matrix = a.clone()

  // perform operations with matrices
  math.map(a, math.sqrt)
  math.mapSlices(b, 1, math.sum)
  math.factorial(a)

  // create and manipulate matrices. Arrays and Matrices can be used mixed.
  {
    const a = [
      [1, 2],
      [3, 4]
    ]
    const b: Matrix = math.matrix([
      [5, 6],
      [1, 1]
    ])

    b.subset(math.index(1, [0, 1]), [[7, 8]])
    const _c = math.multiply(a, b)
    const f: Matrix = math.matrix([1, 0])
    const _d: Matrix = f.subset(math.index(1))
    const g: number[] = math.matrixFromFunction(
      [3],
      (i: number[]) => i[0] * i[0]
    )
    assert.strictEqual(g[2], 4)
    const h: Matrix = math.matrixFromFunction(
      [2, 2],
      (i: number[]) => math.fraction(i[0], i[1] + 1),
      'dense'
    )
    const j: number[][] = math.matrixFromRows(
      [1, 2, 3],
      math.matrix([[4], [5], [6]])
    )
    assert.strictEqual(j[1][2], 6)
    const _k: Matrix = math.matrixFromRows(f, math.row(h, 1))
    const l: number[][] = math.matrixFromColumns(
      [1, 2, 3],
      math.matrix([[4], [5], [6]])
    )
    assert.strictEqual(l[2][1], 6)
    const _m: Matrix = math.matrixFromColumns(f, math.row(h, 1))
  }

  // get a sub matrix
  {
    const a: Matrix = math.diag(math.range(1, 4))
    a.subset(math.index([1, 2], [1, 2]))
    const b: Matrix = math.range(1, 6)
    b.subset(math.index(math.range(1, 4)))
  }

  // resize a multi dimensional matrix
  {
    const a = math.matrix()
    a.resize([2, 2, 2], 0)
    a.size()
    a.resize([2, 2])
    a.size()
  }

  // can set a subset of a matrix to uninitialized
  {
    const m = math.matrix()
    m.subset(math.index(2), 6, math.uninitialized)
  }

  // create ranges
  {
    math.range(1, 6)
    math.range(0, 18, 3)
    math.range('2:-1:-3')
    math.factorial(math.range('1:6'))
  }

  // map matrix
  {
    const arr = [1, 2, 3]
    assert.deepStrictEqual(
      math.map(arr, function (value) {
        return value * value
      }),
      [1, 4, 9]
    )

    assert.deepStrictEqual(
      math.map(arr, function (value, index, self) {
        const indexValue = index[0]
        expectTypeOf(indexValue).toMatchTypeOf<number>()
        assert.deepStrictEqual(self, arr)

        return value * value
      }),
      [1, 4, 9]
    )
  }

  // filter matrix
  {
    const arr = [6, -2, -1, 4, 3]
    assert.deepStrictEqual(
      math.filter(arr, function (x) {
        return x > 0
      }),
      [6, 4, 3]
    )
    assert.deepStrictEqual(
      math.filter(['23', 'foo', '100', '55', 'bar'], /\d+/),
      ['23', '100', '55']
    )
    assert.deepStrictEqual(
      math.filter(arr, function (x, index, self) {
        const indexValue = index[0]
        expectTypeOf(indexValue).toMatchTypeOf<number>()
        assert.deepStrictEqual(self, arr)

        return x > 0
      }),
      [6, 4, 3]
    )
  }

  // forEach matrix
  {
    const arr = [6, -2, -1, 4, 3]

    const output: number[] = []
    math.forEach(arr, function (x, index, self) {
      const indexValue = index[0]
      expectTypeOf(indexValue).toMatchTypeOf<number>()
      assert.deepStrictEqual(self, arr)
      output.push(x)
    })

    assert.deepStrictEqual(output, arr)
  }

  // concat matrix
  {
    assert.deepStrictEqual(math.concat([[0, 1, 2]], [[1, 2, 3]]), [
      [0, 1, 2, 1, 2, 3]
    ])
    assert.deepStrictEqual(math.concat([[0, 1, 2]], [[1, 2, 3]], 0), [
      [0, 1, 2],
      [1, 2, 3]
    ])
  }

  // Matrix is available as a constructor for instanceof checks
  {
    assert.strictEqual(math.matrix([1, 2, 3]) instanceof math.Matrix, true)
  }

  // Eigenvalues and eigenvectors
  {
    const D = [
      [1, 1],
      [0, 1]
    ]
    const eig = math.eigs(D)
    assert.ok(math.deepEqual(eig.values, [1, 1]))
    assert.deepStrictEqual(eig.eigenvectors, [{ value: 1, vector: [1, 0] }])
    const eigvv = math.eigs(D, { precision: 1e-6 })
    assert.ok(math.deepEqual(eigvv.values, [1, 1]))
    assert.deepStrictEqual(eigvv.eigenvectors, [{ value: 1, vector: [1, 0] }])
    const eigv = math.eigs(D, { eigenvectors: false })
    assert.ok(math.deepEqual(eigv.values, [1, 1]))
    //@ts-expect-error  ...verify that eigenvectors not expected to be there
    const _eigenvectors = eigv.eigenvectors
  }

  // Fourier transform and inverse
  {
    assert.ok(
      math.deepEqual(
        math.fft([
          [1, 0],
          [1, 0]
        ]),
        [
          [math.complex(2, 0), math.complex(2, 0)],
          [math.complex(0, 0), math.complex(0, 0)]
        ]
      )
    )
    assert.ok(
      math.deepEqual(
        math.fft(
          math.matrix([
            [1, 0],
            [1, 0]
          ])
        ),
        math.matrix([
          [math.complex(2, 0), math.complex(2, 0)],
          [math.complex(0, 0), math.complex(0, 0)]
        ])
      )
    )
    assert.ok(
      math.deepEqual(
        math.ifft([
          [2, 2],
          [0, 0]
        ]),
        [
          [math.complex(1, 0), math.complex(0, 0)],
          [math.complex(1, 0), math.complex(0, 0)]
        ]
      )
    )
    assert.ok(
      math.deepEqual(
        math.ifft(
          math.matrix([
            [2, 2],
            [0, 0]
          ])
        ),
        math.matrix([
          [math.complex(1, 0), math.complex(0, 0)],
          [math.complex(1, 0), math.complex(0, 0)]
        ])
      )
    )
  }

  // Moore–Penrose inverse
  {
    assert.ok(
      math.deepEqual(
        math.pinv([
          [1, 2],
          [3, 4]
        ]),
        [
          [-2, 1],
          [1.5, -0.5]
        ]
      )
    )
    assert.ok(
      math.deepEqual(
        math.pinv(
          math.matrix([
            [1, 2],
            [3, 4]
          ])
        ),
        math.matrix([
          [-2, 1],
          [1.5, -0.5]
        ])
      )
    )
    assert.ok(math.deepEqual(math.pinv(4), 0.25))
  }
}

/*
Math types examples: Type results after multiplying  'MathTypes' with matrices
 */
{
  const math = create(all, {})

  const abc: MathArray = [1, 2, 3, 4]
  const bcd: MathArray = [
    [1, 2, 3, 4],
    [2, 3, 4, 5],
    [4, 5, 6, 7],
    [5, 6, 7, 8]
  ]

  const efg: MathArray = [1, 2, 3, 4, 5]
  const fgh: MathArray = [2, 3, 4, 5, 6]

  const ghi: number[] = [1, 2, 3, 4]
  const hij: number[][] = [[1], [2], [3], [4]]
  const ijk: number[][] = [[1, 2, 3, 4]]

  const Mbcd = math.matrix(bcd)
  const Mabc = math.matrix(abc)

  // Number
  const _r1 = math.multiply(1, 2)

  // Unit
  const a = math.unit(45, 'cm') // 450 mm
  const b = math.unit(math.fraction(90, 2), 'cm') // 450 mm
  const _r2 = math.multiply(a, b)

  // 1D JS Array
  const r3 = math.multiply(abc, bcd) // 1D * 2D => Array
  const r3a = math.multiply(efg, fgh) // 1D * 1D => Scalar
  const r3b = math.multiply(ghi, ghi) // 1D * 1D => Scalar

  const _r31 = r3[1]
  assert.strictEqual(typeof r3a, 'number')
  assert.strictEqual(typeof r3b, 'number')

  // 2D JS Array
  const r12 = math.multiply(bcd, bcd)
  // Example to sort ambiguity between multidimensional & singledimensional arrays
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const multiDimensional = (x: any): x is any[][] => x.length && x[0].length
  if (multiDimensional(r12)) {
    const _r1211 = r12[1][1]
  }

  const r12a = math.multiply(hij, ijk)

  const _r12a00 = r12a[0][0]

  // Matrix: matrix * vector
  const r7 = math.multiply(Mabc, bcd)
  r7.toArray() // Matrix-es have toArray function

  // Matrix
  const _r8 = math.multiply(Mabc, 4)

  // Matrix
  const _r11 = math.multiply(4, Mabc)

  // Matrix of units
  const _r9 = math.multiply(Mabc, a)
  const _r10 = math.multiply(a, Mabc)

  // Matrix
  const _r6 = math.multiply(abc, Mbcd)

  // 2D JS Array
  const _r5 = math.multiply(bcd, abc)

  // Number
  const _r4 = math.multiply(abc, math.transpose(abc))
}

/*
Sparse matrices examples
*/
{
  const math = create(all, {})

  // create a sparse matrix
  const a = math.identity(1000, 1000, 'sparse')

  // do operations with a sparse matrix
  const b = math.multiply(a, a)
  const _c = math.multiply(b, math.complex(2, 2))
  const d = math.matrix([0, 1])
  const e = math.transpose(d)
  const _f = math.multiply(e, d)
}

/*
Rotation matrices examples
*/
{
  const math = create(all, {})

  // create a rotation matrix
  const a = math.rotationMatrix()
  const b = math.rotationMatrix(math.pi, [1, 1, 0], 'sparse')

  expectTypeOf(a).toMatchTypeOf<MathCollection>()
  expectTypeOf(b).toMatchTypeOf<MathCollection>()

  assert.throws(
    // @ts-expect-error ... verify format parameter is either null, 'sparse' or 'dense'
    () => math.rotationMatrix(math.pi, [1, 1, 0], 'format'),
    TypeError
  )

  assert.throws(
    // @ts-expect-error ... verify theta is number
    () => math.rotationMatrix('pi'),
    TypeError
  )

  assert.throws(
    // @ts-expect-error ... verify axis is of MathColletion Type
    () => math.rotationMatrix(math.pi, 1),
    TypeError
  )
}

/*
Units examples
*/
{
  const math = create(all, {})

  /*
  Unit function type tests
  */
  {
    // Test unit function with string argument
    expectTypeOf(math.unit('5 cm')).toExtend<Unit>()

    // Test unit function with Unit argument
    expectTypeOf(math.unit(math.unit('5 cm'))).toExtend<Unit>()

    // Test unit function with MathNumericType and string
    expectTypeOf(math.unit(5, 'cm')).toExtend<Unit>()
    expectTypeOf(math.unit(math.bignumber(5), 'cm')).toExtend<Unit>()
    expectTypeOf(math.unit(math.fraction(5, 2), 'cm')).toExtend<Unit>()
    expectTypeOf(math.unit(math.complex(5, 0), 'cm')).toExtend<Unit>()

    // Test unit function with just MathNumericType (optional unit parameter)
    expectTypeOf(math.unit(5)).toExtend<Unit>()
    expectTypeOf(math.unit(math.bignumber(5))).toExtend<Unit>()
    expectTypeOf(math.unit(math.fraction(5, 2))).toExtend<Unit>()
    // Shouldn't this also work? Currently it does not.
    // expectTypeOf(math.unit(math.complex(5, 0))).toExtend<Unit>()

    // Test unit function with just MathCollection
    expectTypeOf(math.unit(math.matrix([1, 2, 3]))).toExtend<Unit[]>()
    expectTypeOf(math.unit([1, 2, 3])).toExtend<Unit[]>()
    expectTypeOf(math.unit(math.matrix(['2cm', '5cm']))).toExtend<Unit[]>()
  }

  // units can be created by providing a value and unit name, or by providing
  // a string with a valued unit.
  const a = math.unit(45, 'cm') // 450 mm
  const b = math.unit('0.1m') // 100 mm
  const _c = math.unit(b)

  // creating units
  math.createUnit('foo')
  math.createUnit('furlong', '220 yards')
  math.createUnit('furlong', '220 yards', { override: true })
  math.createUnit('testunit', { definition: '0.555556 kelvin', offset: 459.67 })
  math.createUnit(
    'testunit',
    { definition: '0.555556 kelvin', offset: 459.67 },
    { override: true }
  )
  math.createUnit('knot', {
    definition: '0.514444 m/s',
    aliases: ['knots', 'kt', 'kts']
  })
  math.createUnit(
    'knot',
    { definition: '0.514444 m/s', aliases: ['knots', 'kt', 'kts'] },
    { override: true }
  )
  math.createUnit(
    'knot',
    {
      definition: '0.514444 m/s',
      aliases: ['knots', 'kt', 'kts'],
      prefixes: 'long'
    },
    { override: true }
  )
  math.createUnit(
    {
      foo2: {
        prefixes: 'long'
      },
      bar: '40 foo',
      baz: {
        definition: '1 bar/hour',
        prefixes: 'long'
      }
    },
    {
      override: true
    }
  )
  // use Unit as definition
  math.createUnit('c', { definition: b })
  math.createUnit('c', { definition: b }, { override: true })
  math.createUnit('customUnit', math.unit(0.5, 'm'))

  // units can be added, subtracted, and multiplied or divided by numbers and by other units
  math.add(a, b)
  math.multiply(b, 2)
  math.divide(math.unit('1 m'), math.unit('1 s'))
  math.pow(math.unit('12 in'), 3)

  // units can be converted to a specific type, or to a number
  b.to('cm')
  b.to(math.unit('m'))
  math.to(b, 'inch')
  b.toNumber('cm')
  math.number(b, 'cm')
  b.toBest()
  b.toBest(['m'])
  b.toBest(['m', 'cm'], { offset: 1.5 })
  math.unit('1000 m').toBest()
  math.unit('1000 m').toBest(['km'])
  math.unit('1000 m').toBest(['m', 'cm'], { offset: 1.5 })

  // the expression parser supports units too
  math.evaluate('2 inch to cm')

  // units can be converted to SI
  math.unit('1 inch').toSI()

  // units can be split into other units
  math.unit('1 m').splitUnit(['ft', 'in'])
}

/**
 * Unit static methods and members
 */
{
  expectTypeOf(new Unit(15, 'cm')).toMatchTypeOf<Unit>()

  const prefixes = Unit.PREFIXES
  assert.ok(Object.keys(prefixes).length > 0)
  expectTypeOf(Unit.PREFIXES).toMatchTypeOf<Record<string, UnitPrefix>>()

  const baseDimensions = Unit.BASE_DIMENSIONS
  assert.ok(baseDimensions.length > 0)
  expectTypeOf(Unit.BASE_DIMENSIONS).toMatchTypeOf<string[]>()

  const baseUnits = Unit.BASE_UNITS
  assert.ok(Object.keys(baseUnits).length > 0)

  const units = Unit.UNITS
  assert.ok(Object.keys(units).length > 0)

  Unit.createUnit(
    {
      foo: {
        prefixes: 'long',
        baseName: 'essence-of-foo'
      },
      bar: '40 foo',
      baz: {
        definition: '1 bar/hour',
        prefixes: 'long'
      }
    },
    {
      override: true
    }
  )

  Unit.createUnitSingle('knot', '0.514444444 m/s')

  const unitSystems = Unit.UNIT_SYSTEMS
  assert.ok(Object.keys(unitSystems).length > 0)

  Unit.setUnitSystem('si')
  assert.strictEqual(Unit.getUnitSystem(), 'si')

  expectTypeOf(Unit.isValuelessUnit('cm')).toMatchTypeOf<boolean>()
  expectTypeOf(Unit.parse('5cm')).toMatchTypeOf<Unit>()
  expectTypeOf(
    Unit.fromJSON({ value: 5.2, unit: 'inch' })
  ).toMatchTypeOf<Unit>()
  expectTypeOf(Unit.isValidAlpha('cm')).toMatchTypeOf<boolean>()
}

/**
 * Example of custom fallback for onUndefinedSymbol & onUndefinedFunction
 */
{
  const math = create(all, {})

  math.SymbolNode.onUndefinedSymbol = () => null

  assert.strictEqual(math.evaluate('nonExistingSymbol'), null)

  math.FunctionNode.onUndefinedFunction = () => () => 42
}

/*
Expression tree examples
*/
{
  const math = create(all, {})

  // Filter an expression tree
  const node = math.parse('x^2 + x/4 + 3*y')
  const filtered = node.filter(
    (node) => isSymbolNode(node) && node.name === 'x'
  )

  const _arr: string[] = filtered.map((node: MathNode) => node.toString())

  // Traverse an expression tree
  const node1: MathNode = math.parse('3 * x + 2')
  node1.traverse((node: MathNode, _path: string, _parent: MathNode) => {
    switch (node.type) {
      case 'OperatorNode':
        return node.type === 'OperatorNode'
      case 'ConstantNode':
        return node.type === 'ConstantNode'
      case 'SymbolNode':
        return node.type === 'SymbolNode'
      default:
        return
    }
  })
}

/*
Function ceil examples
*/
{
  const math = create(all, {})

  // number input
  assert.strictEqual(math.ceil(3.2), 4)
  assert.strictEqual(math.ceil(-4.2), -4)

  // number input
  // roundoff result to 2 decimals
  assert.strictEqual(math.ceil(3.212, 2), 3.22)
  assert.deepStrictEqual(
    math.ceil(3.212, math.bignumber(2)),
    math.bignumber(3.22)
  )
  assert.strictEqual(math.ceil(-4.212, 2), -4.21)

  // bignumber input
  assert.deepStrictEqual(math.ceil(math.bignumber(3.212)), math.bignumber(4))
  assert.deepStrictEqual(
    math.ceil(math.bignumber(3.212), 2),
    math.bignumber(3.22)
  )
  assert.deepStrictEqual(
    math.ceil(math.bignumber(3.212), math.bignumber(2)),
    math.bignumber(3.22)
  )

  // fraction input
  assert.deepStrictEqual(math.ceil(math.fraction(44, 7)), math.fraction(7))
  assert.deepStrictEqual(math.ceil(math.fraction(-44, 7)), math.fraction(-6))
  assert.deepStrictEqual(
    math.ceil(math.fraction(44, 7), 2),
    math.fraction(629, 100)
  )
  assert.deepStrictEqual(
    math.ceil(math.fraction(44, 7), math.bignumber(2)),
    math.fraction(629, 100)
  )

  // Complex input
  const c = math.complex(3.24, -2.71)
  assert.deepStrictEqual(math.ceil(c), math.complex(4, -2))
  assert.deepStrictEqual(math.ceil(c, 1), math.complex(3.3, -2.7))
  assert.deepStrictEqual(
    math.ceil(c, math.bignumber(1)),
    math.complex(3.3, -2.7)
  )

  // unit input
  const u1 = math.unit(3.2, 'cm')
  const u2 = math.unit('cm')
  const u3 = math.unit(5.51, 'cm')

  // unit array input
  const unitArray: MathArray<Unit> = [u1, u3]
  const array = [u1, u3, 1]
  array.pop()
  const array2 = [
    [u1, u3],
    [1, 5]
  ]
  array2.pop()

  assert.deepStrictEqual(math.ceil(u1, u2), math.unit(4, 'cm'))
  assert.deepStrictEqual(math.ceil(u1, 1, u2), math.unit(3.2, 'cm'))
  assert.deepStrictEqual(math.ceil(unitArray, 1, math.unit('cm')), [
    math.unit(3.2, 'cm'),
    math.unit(5.6, 'cm')
  ])

  // Can assert that the array is a Unit[]
  assert.deepStrictEqual(math.ceil(array as Unit[], 1, math.unit('cm')), [
    math.unit(3.2, 'cm'),
    math.unit(5.6, 'cm')
  ])

  // Can assert that the array is a Unit[][]
  assert.deepStrictEqual(math.ceil(array2 as Unit[][], 1, math.unit('cm')), [
    [math.unit(3.2, 'cm'), math.unit(5.6, 'cm')]
  ])

  // unit matrix input
  const unitMatrix = math.matrix<Unit>(unitArray)
  const matrix = math.matrix([u1, u3])

  assert.deepStrictEqual(
    math.ceil(unitMatrix, 1, math.unit('cm')),
    math.matrix([math.unit(3.2, 'cm'), math.unit(5.6, 'cm')])
  )

  // Can assert that the matrix is a Matrix<Unit>
  assert.deepStrictEqual(
    math.ceil(matrix as Matrix<Unit>, 1, math.unit('cm')),
    math.matrix([math.unit(3.2, 'cm'), math.unit(5.6, 'cm')])
  )

  // array input
  assert.deepStrictEqual(math.ceil([3.2, 3.8, -4.7]), [4, 4, -4])
  assert.deepStrictEqual(math.ceil([3.21, 3.82, -4.71], 1), [3.3, 3.9, -4.7])
  assert.deepStrictEqual(
    math.ceil([3.21, 3.82, -4.71], math.bignumber(1)),
    math.bignumber([3.3, 3.9, -4.7])
  )

  // numeric input, array or matrix of decimals
  const numCeiled: MathArray = math.ceil(math.tau, [2, 3])
  assert.deepStrictEqual(numCeiled, [6.29, 6.284])
  const bigCeiled: Matrix = math.ceil(
    math.bignumber(6.28318),
    math.matrix([2, 3])
  )
  assert.deepStrictEqual(bigCeiled, math.matrix(math.bignumber([6.29, 6.284])))
  assert.deepStrictEqual(math.ceil(math.fraction(44, 7), [2, 3]), [
    math.fraction(629, 100),
    math.fraction(6286, 1000)
  ])

  // @ts-expect-error ... verify ceil(array, array) throws an error (for now)
  assert.throws(() => math.ceil([3.21, 3.82], [1, 2]), TypeError)
}

/*
Function fix examples
*/
{
  const math = create(all, {})

  // number input
  assert.strictEqual(math.fix(3.2), 3)
  assert.strictEqual(math.fix(-4.2), -4)

  // number input
  // roundoff result to 2 decimals
  assert.strictEqual(math.fix(3.212, 2), 3.21)
  assert.deepStrictEqual(
    math.fix(3.212, math.bignumber(2)),
    math.bignumber(3.21)
  )
  assert.strictEqual(math.fix(-4.212, 2), -4.21)

  // bignumber input
  assert.deepStrictEqual(math.fix(math.bignumber(3.212)), math.bignumber(3))
  assert.deepStrictEqual(
    math.fix(math.bignumber(3.212), 2),
    math.bignumber(3.21)
  )
  assert.deepStrictEqual(
    math.fix(math.bignumber(3.212), math.bignumber(2)),
    math.bignumber(3.21)
  )

  // fraction input
  assert.deepStrictEqual(math.fix(math.fraction(44, 7)), math.fraction(6))
  assert.deepStrictEqual(math.fix(math.fraction(-44, 7)), math.fraction(-6))
  assert.deepStrictEqual(
    math.fix(math.fraction(44, 7), 2),
    math.fraction(628, 100)
  )
  assert.deepStrictEqual(
    math.fix(math.fraction(44, 7), math.bignumber(2)),
    math.fraction(628, 100)
  )

  // Complex input
  const c = math.complex(3.24, -2.71)
  assert.deepStrictEqual(math.fix(c), math.complex(3, -2))
  assert.deepStrictEqual(math.fix(c, 1), math.complex(3.2, -2.7))
  assert.deepStrictEqual(
    math.fix(c, math.bignumber(1)),
    math.complex(3.2, -2.7)
  )

  // unit input
  const u1 = math.unit(3.2, 'cm')
  const u2 = math.unit('cm')
  const u3 = math.unit(5.51, 'cm')
  const unitArray = [u1, u3]
  const unitMatrix = math.matrix<Unit>(unitArray)
  assert.deepStrictEqual(math.fix(u1, u2), math.unit(3, 'cm'))
  assert.deepStrictEqual(math.fix(u1, 1, u2), math.unit(3.2, 'cm'))
  assert.deepStrictEqual(math.fix(unitArray, 1, math.unit('cm')), [
    math.unit(3.2, 'cm'),
    math.unit(5.5, 'cm')
  ])
  assert.deepStrictEqual(
    math.fix(unitMatrix, 1, math.unit('cm')),
    math.matrix([math.unit(3.2, 'cm'), math.unit(5.5, 'cm')])
  )

  // array input
  assert.deepStrictEqual(math.fix([3.2, 3.8, -4.7]), [3, 3, -4])
  assert.deepStrictEqual(math.fix([3.21, 3.82, -4.71], 1), [3.2, 3.8, -4.7])
  assert.deepStrictEqual(
    math.fix([3.21, 3.82, -4.71], math.bignumber(1)),
    math.bignumber([3.2, 3.8, -4.7])
  )

  // numeric input, array or matrix of decimals
  const numFixed: MathArray = math.fix(math.tau, [2, 3])
  assert.deepStrictEqual(numFixed, [6.28, 6.283])
  const bigFixed: Matrix = math.fix(
    math.bignumber(6.28318),
    math.matrix([2, 3])
  )
  assert.deepStrictEqual(bigFixed, math.matrix(math.bignumber([6.28, 6.283])))
  assert.deepStrictEqual(math.fix(math.fraction(44, 7), [2, 3]), [
    math.fraction(628, 100),
    math.fraction(6285, 1000)
  ])

  // @ts-expect-error ... verify fix(array, array) throws an error (for now)
  assert.throws(() => math.fix([3.21, 3.82], [1, 2]), TypeError)
}

/*
Function floor examples
*/
{
  const math = create(all, {})

  // number input
  assert.strictEqual(math.floor(3.2), 3)
  assert.strictEqual(math.floor(-4.2), -5)

  // number input
  // roundoff result to 2 decimals
  assert.strictEqual(math.floor(3.212, 2), 3.21)
  assert.deepStrictEqual(
    math.floor(3.212, math.bignumber(2)),
    math.bignumber(3.21)
  )
  assert.strictEqual(math.floor(-4.212, 2), -4.22)

  // bignumber input
  assert.deepStrictEqual(math.floor(math.bignumber(3.212)), math.bignumber(3))
  assert.deepStrictEqual(
    math.floor(math.bignumber(3.212), 2),
    math.bignumber(3.21)
  )
  assert.deepStrictEqual(
    math.floor(math.bignumber(3.212), math.bignumber(2)),
    math.bignumber(3.21)
  )

  // fraction input
  assert.deepStrictEqual(math.floor(math.fraction(44, 7)), math.fraction(6))
  assert.deepStrictEqual(math.floor(math.fraction(-44, 7)), math.fraction(-7))
  assert.deepStrictEqual(
    math.floor(math.fraction(44, 7), 2),
    math.fraction(628, 100)
  )
  assert.deepStrictEqual(
    math.floor(math.fraction(44, 7), math.bignumber(2)),
    math.fraction(628, 100)
  )

  // Complex input
  const c = math.complex(3.24, -2.71)
  assert.deepStrictEqual(math.floor(c), math.complex(3, -3))
  assert.deepStrictEqual(math.floor(c, 1), math.complex(3.2, -2.8))
  assert.deepStrictEqual(
    math.floor(c, math.bignumber(1)),
    math.complex(3.2, -2.8)
  )

  // unit input
  const u1 = math.unit(3.2, 'cm')
  const u2 = math.unit('cm')
  const u3 = math.unit(5.51, 'cm')
  const unitArray = [u1, u3]
  const unitMatrix = math.matrix<Unit>(unitArray)
  assert.deepStrictEqual(math.floor(u1, u2), math.unit(3, 'cm'))
  assert.deepStrictEqual(math.floor(u1, 1, u2), math.unit(3.2, 'cm'))
  assert.deepStrictEqual(math.floor(unitArray, 1, math.unit('cm')), [
    math.unit(3.2, 'cm'),
    math.unit(5.5, 'cm')
  ])
  assert.deepStrictEqual(
    math.floor(unitMatrix, 1, math.unit('cm')),
    math.matrix([math.unit(3.2, 'cm'), math.unit(5.5, 'cm')])
  )

  // array input
  assert.deepStrictEqual(math.floor([3.2, 3.8, -4.7]), [3, 3, -5])
  assert.deepStrictEqual(math.floor([3.21, 3.82, -4.71], 1), [3.2, 3.8, -4.8])
  assert.deepStrictEqual(
    math.floor([3.21, 3.82, -4.71], math.bignumber(1)),
    math.bignumber([3.2, 3.8, -4.8])
  )

  // numeric input, array or matrix of decimals
  const numFloored: MathArray = math.floor(math.tau, [2, 3])
  assert.deepStrictEqual(numFloored, [6.28, 6.283])
  const bigFloored: Matrix = math.floor(
    math.bignumber(6.28318),
    math.matrix([2, 3])
  )
  assert.deepStrictEqual(bigFloored, math.matrix(math.bignumber([6.28, 6.283])))
  assert.deepStrictEqual(math.floor(math.fraction(44, 7), [2, 3]), [
    math.fraction(628, 100),
    math.fraction(6285, 1000)
  ])

  // @ts-expect-error ... verify floor(array, array) throws an error (for now)
  assert.throws(() => math.floor([3.21, 3.82], [1, 2]), TypeError)
}

/*
Function round examples
*/
{
  const math = create(all, {})

  // number input
  assert.strictEqual(math.round(3.2), 3)
  assert.strictEqual(math.round(-4.2), -4)

  // number input
  // roundoff result to 2 decimals
  assert.strictEqual(math.round(3.212, 2), 3.21)
  assert.deepStrictEqual(
    math.round(3.212, math.bignumber(2)),
    math.bignumber(3.21)
  )
  assert.strictEqual(math.round(-4.212, 2), -4.21)

  // bignumber input
  assert.deepStrictEqual(math.round(math.bignumber(3.212)), math.bignumber(3))
  assert.deepStrictEqual(
    math.round(math.bignumber(3.212), 2),
    math.bignumber(3.21)
  )
  assert.deepStrictEqual(
    math.round(math.bignumber(3.212), math.bignumber(2)),
    math.bignumber(3.21)
  )

  // fraction input
  assert.deepStrictEqual(math.round(math.fraction(44, 7)), math.fraction(6))
  assert.deepStrictEqual(math.round(math.fraction(-44, 7)), math.fraction(-6))
  assert.deepStrictEqual(
    math.round(math.fraction(44, 7), 2),
    math.fraction(629, 100)
  )
  assert.deepStrictEqual(
    math.round(math.fraction(44, 7), math.bignumber(2)),
    math.fraction(629, 100)
  )

  // Complex input
  const c = math.complex(3.24, -2.71)
  assert.deepStrictEqual(math.round(c), math.complex(3, -3))
  assert.deepStrictEqual(math.round(c, 1), math.complex(3.2, -2.7))
  assert.deepStrictEqual(
    math.round(c, math.bignumber(1)),
    math.complex(3.2, -2.7)
  )

  // unit input
  const u1 = math.unit(3.2, 'cm')
  const u2 = math.unit('cm')
  const u3 = math.unit(5.51, 'cm')
  const unitArray = [u1, u3]
  const unitMatrix = math.matrix<Unit>(unitArray)
  assert.deepStrictEqual(math.round(u1, u2), math.unit(3, 'cm'))
  assert.deepStrictEqual(math.round(u1, 1, u2), math.unit(3.2, 'cm'))
  assert.deepStrictEqual(
    math.round(u1, math.bignumber(1), u2),
    math.unit(3.2, 'cm')
  )
  assert.deepStrictEqual(math.round(unitArray, 1, math.unit('cm')), [
    math.unit(3.2, 'cm'),
    math.unit(5.5, 'cm')
  ])
  assert.deepStrictEqual(
    math.round(unitArray, math.bignumber(1), math.unit('cm')),
    [math.unit(3.2, 'cm'), math.unit(5.5, 'cm')]
  )
  assert.deepStrictEqual(
    math.round(unitMatrix, 1, math.unit('cm')),
    math.matrix([math.unit(3.2, 'cm'), math.unit(5.5, 'cm')])
  )

  // array input
  assert.deepStrictEqual(math.round([3.2, 3.8, -4.7]), [3, 4, -5])
  assert.deepStrictEqual(math.round([3.21, 3.82, -4.71], 1), [3.2, 3.8, -4.7])
  assert.deepStrictEqual(
    math.round([3.21, 3.82, -4.71], math.bignumber(1)),
    math.bignumber([3.2, 3.8, -4.7])
  )

  // numeric input, array or matrix of decimals
  const numRounded: MathArray = math.round(math.tau, [2, 3])
  assert.deepStrictEqual(numRounded, [6.28, 6.283])
  const bigRounded: Matrix = math.round(
    math.bignumber(6.28318),
    math.matrix([2, 3])
  )
  assert.deepStrictEqual(bigRounded, math.matrix(math.bignumber([6.28, 6.283])))
  assert.deepStrictEqual(math.round(math.fraction(44, 7), [2, 3]), [
    math.fraction(629, 100),
    math.fraction(6286, 1000)
  ])

  // @ts-expect-error ... verify round(array, array) throws an error (for now)
  assert.throws(() => math.round([3.21, 3.82], [1, 2]), TypeError)
}

/*
Function diff examples
*/
{
  const math = create(all, {})

  // Array input
  assert.deepStrictEqual(math.diff([1, 2, 4, 7, 0]), [1, 2, 3, -7])
  assert.deepStrictEqual(math.diff([1, 2, 4, 7, 0], 0), [1, 2, 3, -7])

  // Matrix input
  assert.deepStrictEqual(
    math.diff(math.matrix([1, 2, 4, 7, 0])),
    math.matrix([1, 2, 3, -7])
  )
  assert.deepStrictEqual(
    math.diff(math.matrix([1, 2, 4, 7, 0]), 0),
    math.matrix([1, 2, 3, -7])
  )

  // with bignumber
  assert.deepStrictEqual(
    math.diff(
      [
        [1, 2],
        [3, 4]
      ],
      math.bignumber(1)
    ),
    [[1], [1]]
  )

  // type checks
  expectTypeOf(math.diff([1, 2, 3])).toMatchTypeOf<MathArray>()
  expectTypeOf(math.diff([1, 2, 3], 0)).toMatchTypeOf<MathArray>()
  expectTypeOf(math.diff(math.matrix([1, 2, 3]))).toMatchTypeOf<Matrix>()
  expectTypeOf(math.diff(math.matrix([1, 2, 3]), 0)).toMatchTypeOf<Matrix>()
}
/*
 Clone examples
  */
{
  const math = create(all, {})
  expectTypeOf(
    new math.OperatorNode('/', 'divide', [
      new math.ConstantNode(3),
      new math.SymbolNode('x')
    ])
  ).toMatchTypeOf<OperatorNode<'/', 'divide', (ConstantNode | SymbolNode)[]>>()

  expectTypeOf(new math.ConstantNode(1).clone()).toMatchTypeOf<ConstantNode>()
  expectTypeOf(
    new math.OperatorNode('*', 'multiply', [
      new math.ConstantNode(3),
      new math.SymbolNode('x')
    ]).clone()
  ).toMatchTypeOf<
    OperatorNode<'*', 'multiply', (ConstantNode | SymbolNode)[]>
  >()

  expectTypeOf(
    new math.ConstantNode(1).cloneDeep()
  ).toMatchTypeOf<ConstantNode>()
  expectTypeOf(
    new math.OperatorNode('+', 'unaryPlus', [
      new math.ConstantNode(3),
      new math.SymbolNode('x')
    ]).cloneDeep()
  ).toMatchTypeOf<
    OperatorNode<'+', 'unaryPlus', (ConstantNode | SymbolNode)[]>
  >()

  expectTypeOf(
    math.clone(new math.ConstantNode(1))
  ).toMatchTypeOf<ConstantNode>()
}

/*
JSON serialization/deserialization
*/
{
  const math = create(all, {})

  const data = {
    bigNumber: math.bignumber('1.5')
  }
  const stringified = JSON.stringify(data)
  const parsed = JSON.parse(stringified, math.reviver)
  assert.deepStrictEqual(parsed.bigNumber, math.bignumber('1.5'))
}

/*
Extend functionality with import
 */

declare module 'mathjs' {
  interface MathJsInstance {
    testFun(): number
    value: number
  }
}

{
  const math = create(all, {})
  const testFun = () => 5

  math.import(
    {
      testFun,
      value: 10
    },
    {}
  )

  math.testFun()

  expectTypeOf(math.testFun()).toMatchTypeOf<number>()

  expectTypeOf(
    math.import({
      myvalue: 42,
      myFunc: (name: string) => `myFunc ${name}`
    })
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import(
      {
        myvalue: 42,
        myFunc: (name: string) => `myFunc ${name}`
      },
      {
        override: true
      }
    )
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import(
      {
        myvalue2: 42
      },
      {
        silent: true
      }
    )
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import(
      {
        myvalue3: 42
      },
      {
        wrap: true
      }
    )
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import({
      myvalue4: 42
    })
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import([
      {
        myvalue5: 42
      },
      {
        myFunc2: (name: string) => `myFunc2 ${name}`
      }
    ])
  ).toMatchTypeOf<void>()
}

/*
Renamed functions from v5 => v6
 */
{
  const math = create(all, {})
  math.typeOf(1)
  math.variance([1, 2, 3, 4])
  math.evaluate('1 + 2')

  // chained operations
  math.chain(3).typeOf().done()
  math.chain([1, 2, 3]).variance().done()
  math.chain('1 + 2').evaluate().done()
}

/*
Factory Test
 */
{
  // create a factory function
  const name = 'negativeSquare'
  const dependencies: MathJsFunctionName[] = ['multiply', 'unaryMinus']
  const createNegativeSquare = factory(name, dependencies, (injected) => {
    const { multiply, unaryMinus } = injected
    return function negativeSquare(x: number): number {
      return unaryMinus(multiply(x, x))
    }
  })

  // create an instance of the function yourself:
  const multiply = (a: number, b: number) => a * b
  const unaryMinus = (a: number) => -a
  const negativeSquare = createNegativeSquare({ multiply, unaryMinus })
  negativeSquare(3)
}

/**
 * Dependency map typing test from mathjs official document:
 * https://mathjs.org/docs/custom_bundling.html#using-just-a-few-functions
 */
{
  const config = {
    // optionally, you can specify configuration
  }

  // Create just the functions we need
  const { fraction, add, divide, format } = create(
    {
      fractionDependencies,
      addDependencies,
      divideDependencies,
      formatDependencies
    },
    config
  )

  // Use the created functions
  const a = fraction(1, 3)
  const b = fraction(3, 7)
  const c = add(a, b)
  const d = divide(a, b)
  assert.strictEqual(format(c), '16/21')
  assert.strictEqual(format(d), '7/9')
  assert.strictEqual(format(255, { notation: 'bin' }), '0b11111111')
  assert.strictEqual(format(255, { notation: 'hex' }), '0xff')
  assert.strictEqual(format(255, { notation: 'oct' }), '0o377')
}

/**
 * Custom parsing functions
 * https://mathjs.org/docs/expressions/customization.html#customize-supported-characters
 */
{
  const math = create(all, {})
  const isAlphaOriginal = math.parse.isAlpha
  math.parse.isAlpha = (c, cPrev, cNext) => {
    return isAlphaOriginal(c, cPrev, cNext) || c === '\u260E'
  }

  // now we can use the \u260E (phone) character in expressions
  const result = math.evaluate('\u260Efoo', { '\u260Efoo': 42 })
  assert.strictEqual(result, 42)
}

/**
 * Util functions
 * https://mathjs.org/docs/reference/functions.html#utils-functions
 */
{
  const math = create(all, {})

  // hasNumericValue function
  assert.strictEqual(math.hasNumericValue(2), true)
  assert.strictEqual(math.hasNumericValue('2'), true)
  assert.strictEqual(math.isNumeric('2'), false)
  assert.strictEqual(math.hasNumericValue(0), true)
  assert.strictEqual(math.hasNumericValue(math.bignumber(500)), true)
  assert.deepStrictEqual(math.hasNumericValue([2.3, 'foo', false]), [
    true,
    false,
    true
  ])
  assert.strictEqual(math.hasNumericValue(math.fraction(4)), true)
  assert.strictEqual(math.hasNumericValue(math.complex('2-4i')), false)
  assert.strictEqual(math.isBounded(NaN), false)
  assert.deepStrictEqual(math.isFinite([2, math.fraction(-3, 4), Infinity]), [
    true,
    true,
    false
  ])
}

/**
 * src/util/is functions
 */
{
  const math = create(all, {})

  type IsFunc = (x: unknown) => boolean
  const isFuncs: IsFunc[] = [
    math.isNumber,
    math.isBigNumber,
    math.isComplex,
    math.isFraction,
    math.isUnit,
    math.isString,
    math.isArray,
    math.isMatrix,
    math.isCollection,
    math.isDenseMatrix,
    math.isSparseMatrix,
    math.isRange,
    math.isIndex,
    math.isBoolean,
    math.isResultSet,
    math.isHelp,
    math.isFunction,
    math.isDate,
    math.isRegExp,
    math.isObject,
    math.isMap,
    math.isPartitionedMap,
    math.isObjectWrappingMap,
    math.isNull,
    math.isUndefined,
    math.isAccessorNode,
    math.isArrayNode,
    math.isAssignmentNode,
    math.isBlockNode,
    math.isConditionalNode,
    math.isConstantNode,
    math.isFunctionAssignmentNode,
    math.isFunctionNode,
    math.isIndexNode,
    math.isNode,
    math.isObjectNode,
    math.isOperatorNode,
    math.isParenthesisNode,
    math.isRangeNode,
    math.isRelationalNode,
    math.isSymbolNode,
    math.isChain
  ]

  isFuncs.forEach((f) => {
    const result = f(1)
    const isResultBoolean = result === true || result === false
    assert.ok(isResultBoolean)
  })

  // Check guards do type refinement

  const x: unknown = undefined

  if (math.isNumber(x)) {
    expectTypeOf(x).toMatchTypeOf<number>()
  }
  if (math.isBigNumber(x)) {
    expectTypeOf(x).toMatchTypeOf<BigNumber>()
  }
  if (math.isComplex(x)) {
    expectTypeOf(x).toMatchTypeOf<Complex>()
  }
  if (math.isFraction(x)) {
    expectTypeOf(x).toMatchTypeOf<Fraction>()
  }
  if (math.isUnit(x)) {
    expectTypeOf(x).toMatchTypeOf<Unit>()
  }
  if (math.isString(x)) {
    expectTypeOf(x).toMatchTypeOf<string>()
  }
  if (math.isArray(x)) {
    expectTypeOf(x).toMatchTypeOf<unknown[]>()
  }
  if (math.isMatrix(x)) {
    expectTypeOf(x).toMatchTypeOf<Matrix>()
  }
  if (math.isDenseMatrix(x)) {
    expectTypeOf(x).toMatchTypeOf<Matrix>()
  }
  if (math.isSparseMatrix(x)) {
    expectTypeOf(x).toMatchTypeOf<Matrix>()
  }
  if (math.isIndex(x)) {
    expectTypeOf(x).toMatchTypeOf<Index>()
  }
  if (math.isBoolean(x)) {
    expectTypeOf(x).toMatchTypeOf<boolean>()
  }
  if (math.isHelp(x)) {
    expectTypeOf(x).toMatchTypeOf<Help>()
  }
  if (math.isDate(x)) {
    expectTypeOf(x).toMatchTypeOf<Date>()
  }
  if (math.isRegExp(x)) {
    expectTypeOf(x).toMatchTypeOf<RegExp>()
  }
  if (math.isNull(x)) {
    expectTypeOf(x).toMatchTypeOf<null>()
  }
  if (math.isUndefined(x)) {
    expectTypeOf(x).toMatchTypeOf<undefined>()
  }

  if (math.isAccessorNode(x)) {
    expectTypeOf(x).toMatchTypeOf<AccessorNode>()
  }
  if (math.isArrayNode(x)) {
    expectTypeOf(x).toMatchTypeOf<ArrayNode>()
  }
  if (math.isAssignmentNode(x)) {
    expectTypeOf(x).toMatchTypeOf<AssignmentNode>()
  }
  if (math.isBlockNode(x)) {
    expectTypeOf(x).toMatchTypeOf<BlockNode>()
  }
  if (math.isConditionalNode(x)) {
    expectTypeOf(x).toMatchTypeOf<ConditionalNode>()
  }
  if (math.isConstantNode(x)) {
    expectTypeOf(x).toMatchTypeOf<ConstantNode>()
  }
  if (math.isFunctionAssignmentNode(x)) {
    expectTypeOf(x).toMatchTypeOf<FunctionAssignmentNode>()
  }
  if (math.isFunctionNode(x)) {
    expectTypeOf(x).toMatchTypeOf<FunctionNode>()
  }
  if (math.isIndexNode(x)) {
    expectTypeOf(x).toMatchTypeOf<IndexNode>()
  }
  if (math.isNode(x)) {
    expectTypeOf(x).toMatchTypeOf<MathNode>()
  }
  if (math.isNode(x)) {
    expectTypeOf(x).toMatchTypeOf<MathNode>()
  }
  if (math.isObjectNode(x)) {
    expectTypeOf(x).toMatchTypeOf<ObjectNode>()
  }
  if (math.isOperatorNode(x)) {
    expectTypeOf(x).toMatchTypeOf<
      OperatorNode<OperatorNodeOp, OperatorNodeFn, MathNode[]>
    >()
  }
  if (math.isParenthesisNode(x)) {
    expectTypeOf(x).toMatchTypeOf<ParenthesisNode>()
  }
  if (math.isRangeNode(x)) {
    expectTypeOf(x).toMatchTypeOf<RangeNode>()
  }
  if (math.isRelationalNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.RelationalNode>()
  }
  if (math.isSymbolNode(x)) {
    expectTypeOf(x).toMatchTypeOf<SymbolNode>()
  }
  if (math.isChain(x)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectTypeOf(x).toMatchTypeOf<MathJsChain<any>>()
  }
}

/*
Probability function examples
*/
{
  const math = create(all, {})

  expectTypeOf(math.bernoulli(math.fraction(12))).toMatchTypeOf<Fraction>()
  expectTypeOf(math.lgamma(1.5)).toMatchTypeOf<number>()
  expectTypeOf(math.lgamma(math.complex(1.5, -1.5))).toMatchTypeOf<Complex>()
}

/*
toTex examples
*/

{
  const math = create(all, {})

  expectTypeOf(math.parse('a/b').toTex()).toMatchTypeOf<string>()

  // TODO add proper types for toTex options
  expectTypeOf(
    math.parse('a/b').toTex({
      a: '123'
    })
  ).toMatchTypeOf<string>()
}

/*
Resolve examples
*/
{
  const math = create(all, {})

  expectTypeOf(math.resolve('x + y')).toMatchTypeOf<MathNode>()
  expectTypeOf(math.resolve(math.parse('x + y'))).toMatchTypeOf<MathNode>()
  expectTypeOf(
    math.resolve(math.parse('x + y'), { x: 0 })
  ).toMatchTypeOf<MathNode>()
  expectTypeOf(math.resolve('x + y', { x: 0 })).toMatchTypeOf<MathNode>()
  expectTypeOf(
    math.resolve([math.parse('x + y'), 'x*x'], { x: 0 })
  ).toMatchTypeOf<MathNode[]>()
  expectTypeOf(math.resolve(math.matrix(['x', 'y']))).toMatchTypeOf<Matrix>()
}

/*
Random examples
*/
{
  const math = create(all, {})
  expectTypeOf(math.pickRandom([1, 2, 3])).toMatchTypeOf<number>()
  expectTypeOf(math.pickRandom(['a', { b: 10 }, 42])).toMatchTypeOf<
    string | number | { b: number }
  >()
  expectTypeOf(math.pickRandom([1, 2, 3])).toMatchTypeOf<number>()
  expectTypeOf(math.pickRandom([1, 2, 3], 2)).toMatchTypeOf<number[]>()

  expectTypeOf(math.chain([1, 2, 3]).pickRandom(2)).toMatchTypeOf<
    MathJsChain<number[]>
  >()
}

/*
MathNode examples
*/
{
  class CustomNode extends Node {
    a: MathNode
    constructor(a: MathNode) {
      super()
      this.a = a
    }
  }

  // Basic node
  const instance1 = new Node()

  // Built-in subclass of Node
  const instance2 = new ConstantNode(2)

  // Custom subclass of node
  const instance3 = new CustomNode(new ConstantNode(2))

  expectTypeOf(instance1).toMatchTypeOf<MathNode>()
  expectTypeOf(instance1).toMatchTypeOf<MathNodeCommon>()

  expectTypeOf(instance2).toMatchTypeOf<MathNode>()
  expectTypeOf(instance2).toMatchTypeOf<MathNodeCommon>()
  expectTypeOf(instance2).toMatchTypeOf<ConstantNode>()

  expectTypeOf(instance3).toMatchTypeOf<MathNode>()
  expectTypeOf(instance3).toMatchTypeOf<MathNodeCommon>()
  expectTypeOf(instance3).toMatchTypeOf<CustomNode>()
}

/*
Statistics functions' return types
*/
{
  const math = create(all, {})
  expectTypeOf(math.min(1, 2, 3)).toMatchTypeOf<number>()
  expectTypeOf(math.min([1, 2, 3])).toMatchTypeOf<number>()
  expectTypeOf(
    math.min(math.bignumber('123'), math.bignumber('456'))
  ).toMatchTypeOf<BigNumber>()
  expectTypeOf(
    math.min(math.unit('5cm'), math.unit('10cm'))
  ).toMatchTypeOf<Unit>()
  expectTypeOf(
    math.min([math.unit('5cm'), math.unit('10cm')])
  ).toMatchTypeOf<Unit>()
  expectTypeOf(math.min(123, math.bignumber('456'))).toMatchTypeOf<
    number | BigNumber | bigint | Fraction | Complex | Unit
  >()
  expectTypeOf(
    math.min(
      [
        [1, 2],
        [3, 4]
      ],
      1
    )
  ).toMatchTypeOf<MathScalarType>()

  expectTypeOf(math.max(1, 2, 3)).toMatchTypeOf<number>()
  expectTypeOf(math.max([1, 2, 3])).toMatchTypeOf<number>()
  expectTypeOf(
    math.max(math.bignumber('123'), math.bignumber('456'))
  ).toMatchTypeOf<BigNumber>()
  expectTypeOf(
    math.max(math.unit('5cm'), math.unit('10cm'))
  ).toMatchTypeOf<Unit>()
  expectTypeOf(
    math.max([math.unit('5cm'), math.unit('10cm')])
  ).toMatchTypeOf<Unit>()
  expectTypeOf(
    math.max(123, math.bignumber('456'))
  ).toMatchTypeOf<MathScalarType>()

  expectTypeOf(math.mean(1, 2, 3)).toMatchTypeOf<number>()
  expectTypeOf(math.mean([1, 2, 3])).toMatchTypeOf<number>()
  expectTypeOf(
    math.mean(math.bignumber('123'), math.bignumber('456'))
  ).toMatchTypeOf<BigNumber>()
  expectTypeOf(
    math.mean(math.unit('5cm'), math.unit('10cm'))
  ).toMatchTypeOf<Unit>()
  expectTypeOf(
    math.mean([math.unit('5cm'), math.unit('10cm')])
  ).toMatchTypeOf<Unit>()
  expectTypeOf(math.mean(123, math.bignumber('456'))).toMatchTypeOf<
    number | BigNumber | bigint | Fraction | Complex | Unit
  >()

  expectTypeOf(math.median(1, 2, 3)).toMatchTypeOf<number>()
  expectTypeOf(math.median([1, 2, 3])).toMatchTypeOf<number>()
  expectTypeOf(
    math.median(math.bignumber('123'), math.bignumber('456'))
  ).toMatchTypeOf<BigNumber>()
  expectTypeOf(
    math.median(math.unit('5cm'), math.unit('10cm'))
  ).toMatchTypeOf<Unit>()
  expectTypeOf(
    math.median([math.unit('5cm'), math.unit('10cm')])
  ).toMatchTypeOf<Unit>()
  expectTypeOf(math.median(123, math.bignumber('456'))).toMatchTypeOf<
    number | BigNumber | bigint | Fraction | Complex | Unit
  >()

  expectTypeOf(math.quantileSeq([1, 2, 3], 0.75)).toMatchTypeOf<number>()
  expectTypeOf(math.quantileSeq([1, 2, 3, 4, 5], [0.25, 0.75])).toMatchTypeOf<
    MathArray | MathScalarType
  >()
  expectTypeOf(
    math.quantileSeq([1, 2, 3, 4, 5], [0.25, 0.75]) as number[]
  ).toMatchTypeOf<number[]>()
  expectTypeOf(math.quantileSeq([[1, 2, 3]], 0.75)).toMatchTypeOf<number>()
  expectTypeOf(
    math.quantileSeq([math.bignumber('123')], 0.75)
  ).toMatchTypeOf<BigNumber>()
  expectTypeOf(math.quantileSeq(math.matrix([1, 2, 3]), 0.75)).toMatchTypeOf<
    MathScalarType | MathArray
  >()
  expectTypeOf(
    math.quantileSeq([math.unit('5cm'), math.unit('10cm')], 0.75)
  ).toMatchTypeOf<Unit>()
}

/*
Match types of exact positional arguments.
*/
{
  const node1 = new ConstantNode(2)
  const node2 = new SymbolNode('x')
  const node3 = new FunctionNode('sqrt', [node2])
  const node4 = new OperatorNode('+', 'add', [node1, node3])
  expectTypeOf(node4.args[0]).toMatchTypeOf<ConstantNode>()
  expectTypeOf(node4.args[1].args[0]).toMatchTypeOf<SymbolNode>()
}
{
  const node1 = new ConstantNode(2)
  const node2 = new SymbolNode('x')
  const node3 = new ArrayNode([node1, node2])
  expectTypeOf(node3.items[0]).toMatchTypeOf<ConstantNode>()
  expectTypeOf(node3.items[1]).toMatchTypeOf<SymbolNode>()
}

/**
 * mode Return Types
 */
{
  const math = create(all, {})
  const a = math.mode<number>([1, 2, 3])
  expectTypeOf(a).toMatchTypeOf<number[]>()
  assert.deepStrictEqual(a, [1, 2, 3])

  const b = math.mode<number>([
    [1, 2],
    [2, 2],
    [3, 5]
  ])
  expectTypeOf(b).toMatchTypeOf<number[]>()
  assert.deepStrictEqual(b, [2])

  const c = math.mode<number>(1, 2, 2, 2, 3, 5)
  expectTypeOf(c).toMatchTypeOf<number[]>()
  assert.deepStrictEqual(c, [2])

  const d = math.mode(1, 2, 2, 2, 3, 5)
  expectTypeOf(d).toMatchTypeOf<number[]>()
  assert.deepStrictEqual(d, [2])

  const mathCollection = math.concat([1, 2, 3], [1], [4, 5])
  const e = math.mode(mathCollection)
  expectTypeOf(e).toMatchTypeOf<MathScalarType[]>()
  assert.deepStrictEqual(e, [1])
}

/**
 * N-dimensional array examples
 */
{
  const math = create(all, {})

  const array1 = [1, 2, 3]
  const array2 = [
    [1, 2],
    [3, 4]
  ]
  const array3 = [
    [
      [1, 2],
      [3, 4]
    ],
    [
      [5, 6],
      [7, 8]
    ]
  ]
  const array4 = [
    [[[1, 2]], [[3, 4]]],
    [[[5, 6]], [[7, 8]]],
    [[[9, 10]], [[11, 12]]]
  ]

  const mixArray3 = [
    [
      [1, math.unit(2, 'cm'), math.bignumber(1), math.complex(1, 2)],
      [3, math.unit(4, 'cm'), math.bignumber(2), math.complex(3, 4)]
    ],
    [
      [5, math.unit(6, 'cm'), math.bignumber(3), math.complex(5, 6)],
      [7, math.unit(8, 'cm'), math.bignumber(4), math.complex(7, 8)]
    ]
  ]

  const unitArray3 = [
    [[math.unit(1, 'cm'), math.unit(2, 'cm')]],
    [[math.unit(3, 'cm'), math.unit(4, 'cm')]]
  ]

  expectTypeOf(array1).toMatchTypeOf<MathArray>()
  expectTypeOf(array2).toMatchTypeOf<MathArray>()
  expectTypeOf(array3).toMatchTypeOf<MathArray>()
  expectTypeOf(array4).toMatchTypeOf<MathArray>()

  expectTypeOf(mixArray3).toMatchTypeOf<MathArray<MathScalarType>>()
  expectTypeOf(unitArray3).toMatchTypeOf<MathArray<Unit>>()
}
