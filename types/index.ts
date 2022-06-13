import {
  create,
  factory,
  all,
  MathJsFunctionName,
  fractionDependencies,
  addDependencies,
  divideDependencies,
  formatDependencies,
  MathNode,
  MathJsChain,
  BigNumber,
  MathCollection,
  Complex,
  Unit,
  Fraction,
  MathArray,
  Index,
  Matrix,
  EvalFunction,
  LUDecomposition,
  QRDecomposition,
  SLUDecomposition,
  MathType,
  MathNumericType,
  ConstantNode,
  OperatorNode,
  OperatorNodeFn,
  OperatorNodeOp,
  SymbolNode,
  ParenthesisNode,
} from 'mathjs'
import * as assert from 'assert'
import { expectTypeOf } from 'expect-type'

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
    [3, 1],
  ]
  const m2by3 = [
    [1, 2, 3],
    [4, 5, 6],
  ]

  // functions and constants
  math.round(math.e, 3)
  math.round(100.123, 3)
  math.atan2(3, -3) / math.pi
  math.log(10000, 10)
  math.sqrt(-4)

  math.pow(m2by2, 2)
  const angle = 0.2
  math.add(math.pow(math.sin(angle), 2), math.pow(math.cos(angle), 2))

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
  const _b: math.Matrix = math.add(math.matrix([2]), math.matrix([3]))
  const _c: math.Matrix = math.subtract(math.matrix([4]), math.matrix([5]))
}

/*
Bignumbers examples
*/
{
  // configure the default type of numbers as BigNumbers
  const math = create(all, {
    number: 'BigNumber',
    precision: 20,
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
    [3, 4],
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
        fresnel: '1234',
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
        [3, 4],
      ])
      .lsolve([1, 2])
  ).toMatchTypeOf<MathJsChain<MathArray>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .lsolve([1, 2])
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // lup
  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4],
      ])
      .lup()
  ).toMatchTypeOf<MathJsChain<LUDecomposition>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
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
          [3, 4],
        ])
      )
      .lusolve(math.matrix([1, 2]))
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .lusolve([1, 2])
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4],
      ])
      .lusolve(math.matrix([1, 2]))
  ).toMatchTypeOf<MathJsChain<MathArray>>()

  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4],
      ])
      .lusolve([1, 2])
  ).toMatchTypeOf<MathJsChain<MathArray>>()

  // qr
  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4],
      ])
      .qr()
  ).toMatchTypeOf<MathJsChain<QRDecomposition>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
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

  // slu
  expectTypeOf(
    math
      .chain(
        math.sparse([
          [1, 2],
          [3, 4],
        ])
      )
      .slu(2, 0.5)
  ).toMatchTypeOf<MathJsChain<SLUDecomposition>>()

  // usolve
  expectTypeOf(
    math
      .chain([
        [1, 2],
        [3, 4],
      ])
      .usolve([1, 2])
  ).toMatchTypeOf<MathJsChain<MathArray>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
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
    MathJsChain<Complex>
  >()
  expectTypeOf(math.chain([1, 2]).abs()).toMatchTypeOf<MathJsChain<MathArray>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
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
        [3, 4],
      ])
    )
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // apply
  expectTypeOf(math.chain([1, 2, 3]).apply(0, () => 1)).toMatchTypeOf<
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
  expectTypeOf(math.chain([1, 2]).cbrt()).toMatchTypeOf<
    MathJsChain<MathArray>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .cbrt()
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // cbrt
  expectTypeOf(math.chain(1).ceil()).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(math.chain([1]).ceil()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // fix
  expectTypeOf(math.chain(1).fix()).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(math.chain([1]).fix()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // floor
  expectTypeOf(math.chain(1).floor()).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(math.chain([1]).floor()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

  // round
  expectTypeOf(math.chain(1).round()).toMatchTypeOf<
    MathJsChain<MathNumericType>
  >()
  expectTypeOf(math.chain([1]).round()).toMatchTypeOf<
    MathJsChain<MathCollection>
  >()

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
  expectTypeOf(math.chain([1, 2]).cube()).toMatchTypeOf<
    MathJsChain<MathArray>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .cube()
  ).toMatchTypeOf<MathJsChain<Matrix>>()
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
    MathJsChain<MathType>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .dotDivide(2)
  ).toMatchTypeOf<MathJsChain<MathType>>()

  // dotMultiply
  expectTypeOf(math.chain(1).dotMultiply(2)).toMatchTypeOf<
    MathJsChain<MathType>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .dotMultiply(2)
  ).toMatchTypeOf<MathJsChain<MathType>>()

  // dotPow
  expectTypeOf(math.chain(1).dotPow(2)).toMatchTypeOf<MathJsChain<MathType>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .dotPow(2)
  ).toMatchTypeOf<MathJsChain<MathType>>()

  // exp
  expectTypeOf(math.chain(1).exp()).toMatchTypeOf<MathJsChain<MathType>>()
  expectTypeOf(math.chain([1, 2]).exp()).toMatchTypeOf<MathJsChain<MathArray>>()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .exp()
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // expm1
  expectTypeOf(math.chain(1).expm1()).toMatchTypeOf<MathJsChain<MathType>>()
  expectTypeOf(math.chain([1, 2]).expm1()).toMatchTypeOf<
    MathJsChain<MathArray>
  >()
  expectTypeOf(
    math
      .chain(
        math.matrix([
          [1, 2],
          [3, 4],
        ])
      )
      .expm1()
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // gcd
  expectTypeOf(math.chain([1, 2]).gcd(3)).toMatchTypeOf<MathJsChain<number>>()
  expectTypeOf(math.chain([1, 2]).gcd(3, 4)).toMatchTypeOf<
    MathJsChain<number>
  >()
  // TODO make gcd() work in the following cases
  // expectTypeOf(math.chain([1, 2]).gcd()).toMatchTypeOf<MathJsChain<number>>()
  // expectTypeOf(math.chain([[1], [2]]).gcd()).toMatchTypeOf<
  //   MathJsChain<MathArray>
  // >()
  // expectTypeOf(
  //   math.chain([math.bignumber(1), math.bignumber(1)]).gcd()
  // ).toMatchTypeOf<MathJsChain<BigNumber>>()
  // expectTypeOf(
  //   math.chain([math.complex(1, 2), math.complex(1, 2)]).gcd()
  // ).toMatchTypeOf<MathJsChain<Complex>>()
  // expectTypeOf(
  //   math
  //     .chain(
  //       math.matrix([
  //         [1, 2],
  //         [3, 4],
  //       ])
  //     )
  //     .expm1()
  // ).toMatchTypeOf<MathJsChain<Matrix>>()

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
          [3, 4],
        ])
      )
      .lcm(
        math.matrix([
          [1, 2],
          [3, 4],
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
          [3, 4],
        ])
      )
      .log10()
  ).toMatchTypeOf<MathJsChain<Matrix>>()

  // TODO complete the rest of these...
}

/*
Simplify examples
*/
{
  const math = create(all)

  math.simplify('2 * 1 * x ^ (2 - 1)')
  math.simplify('2 * 3 * x', { x: 4 })

  const f = math.parse('2 * 1 * x ^ (2 - 1)')
  math.simplify(f)

  math.simplify('0.4 * x', {}, { exactFractions: true })
  math.simplify('0.4 * x', {}, { exactFractions: false })
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
    const p: math.PolarCoordinates = { r: math.sqrt(2), phi: math.pi / 4 }
    const _c: math.Complex = math.complex(p)
  }

  // get polar coordinates of a complex number
  {
    const _p: math.PolarCoordinates = math.complex(3, 4).toPolar()
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
    const _innerNode = node.content
  }

  // scope can contain both variables and functions
  {
    const scope = { hello: (name: string) => `hello, ${name}!` }
    assert.strictEqual(math.evaluate('hello("hero")', scope), 'hello, hero!')
  }

  // define a function as an expression
  {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const scope: any = {
      a: 3,
      b: 4,
    }
    const f = math.evaluate('f(x) = x ^ a', scope)
    f(2)
    scope.f(2)
  }

  {
    const node2 = math.parse('x^a')
    const _code2: math.EvalFunction = node2.compile()
    node2.toString()
  }

  // 3. using function math.compile
  // parse an expression
  {
    // provide a scope for the variable assignment
    const code2 = math.compile('a = a + 3')
    const scope = { a: 7 }
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
    const _g = f(3, 3)

    parser.set('h', 500)
    parser.set('hello', (name: string) => `hello, ${name}!`)
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
    number: 'Fraction',
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
  const a: math.Matrix = math.matrix([1, 4, 9, 16, 25])
  const b: math.Matrix = math.matrix(math.ones([2, 3]))
  b.size()

  // the Array data of a Matrix can be retrieved using valueOf()
  const _array = a.valueOf()

  // Matrices can be cloned
  const _clone: math.Matrix = a.clone()

  // perform operations with matrices
  math.sqrt(a)
  math.factorial(a)

  // create and manipulate matrices. Arrays and Matrices can be used mixed.
  {
    const a = [
      [1, 2],
      [3, 4],
    ]
    const b: math.Matrix = math.matrix([
      [5, 6],
      [1, 1],
    ])

    b.subset(math.index(1, [0, 1]), [[7, 8]])
    const _c = math.multiply(a, b)
    const f: math.Matrix = math.matrix([1, 0])
    const _d: math.Matrix = f.subset(math.index(1))
  }

  // get a sub matrix
  {
    const a: math.Matrix = math.diag(math.range(1, 4))
    a.subset(math.index([1, 2], [1, 2]))
    const b: math.Matrix = math.range(1, 6)
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
    assert.deepStrictEqual(
      math.map([1, 2, 3], function (value) {
        return value * value
      }),
      [1, 4, 9]
    )
  }

  // filter matrix
  {
    assert.deepStrictEqual(
      math.filter([6, -2, -1, 4, 3], function (x) {
        return x > 0
      }),
      [6, 4, 3]
    )
    assert.deepStrictEqual(
      math.filter(['23', 'foo', '100', '55', 'bar'], /[0-9]+/),
      ['23', '100', '55']
    )
  }

  // concat matrix
  {
    assert.deepStrictEqual(math.concat([[0, 1, 2]], [[1, 2, 3]]), [
      [0, 1, 2, 1, 2, 3],
    ])
    assert.deepStrictEqual(math.concat([[0, 1, 2]], [[1, 2, 3]], 0), [
      [0, 1, 2],
      [1, 2, 3],
    ])
  }

  // Matrix is available as a constructor for instanceof checks
  {
    assert.strictEqual(math.matrix([1, 2, 3]) instanceof math.Matrix, true)
  }

  // Fourier transform and inverse
  {
    assert.ok(
      math.deepEqual(
        math.fft([
          [1, 0],
          [1, 0],
        ]),
        [
          [math.complex(2, 0), math.complex(2, 0)],
          [math.complex(0, 0), math.complex(0, 0)],
        ]
      )
    )
    assert.ok(
      math.deepEqual(
        math.fft(
          math.matrix([
            [1, 0],
            [1, 0],
          ])
        ),
        math.matrix([
          [math.complex(2, 0), math.complex(2, 0)],
          [math.complex(0, 0), math.complex(0, 0)],
        ])
      )
    )
    assert.ok(
      math.deepEqual(
        math.ifft([
          [2, 2],
          [0, 0],
        ]),
        [
          [math.complex(1, 0), math.complex(0, 0)],
          [math.complex(1, 0), math.complex(0, 0)],
        ]
      )
    )
    assert.ok(
      math.deepEqual(
        math.ifft(
          math.matrix([
            [2, 2],
            [0, 0],
          ])
        ),
        math.matrix([
          [math.complex(1, 0), math.complex(0, 0)],
          [math.complex(1, 0), math.complex(0, 0)],
        ])
      )
    )
  }
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
Units examples
*/
{
  const math = create(all, {})

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
    aliases: ['knots', 'kt', 'kts'],
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
      prefixes: 'long',
    },
    { override: true }
  )
  math.createUnit(
    {
      foo2: {
        prefixes: 'long',
      },
      bar: '40 foo',
      baz: {
        definition: '1 bar/hour',
        prefixes: 'long',
      },
    },
    {
      override: true,
    }
  )
  // use Unit as definition
  math.createUnit('c', { definition: b })
  math.createUnit('c', { definition: b }, { override: true })

  // units can be added, subtracted, and multiplied or divided by numbers and by other units
  math.add(a, b)
  math.multiply(b, 2)
  math.divide(math.unit('1 m'), math.unit('1 s'))
  math.pow(math.unit('12 in'), 3)

  // units can be converted to a specific type, or to a number
  b.to('cm')
  math.to(b, 'inch')
  b.toNumber('cm')
  math.number(b, 'cm')

  // the expression parser supports units too
  math.evaluate('2 inch to cm')

  // units can be converted to SI
  math.unit('1 inch').toSI()

  // units can be split into other units
  math.unit('1 m').splitUnit(['ft', 'in'])
}

/*
Expression tree examples
*/
{
  const math = create(all, {})

  // Filter an expression tree
  const node: math.MathNode = math.parse('x^2 + x/4 + 3*y')
  const filtered: math.MathNode[] = node.filter(
    (node: math.MathNode) => node.type === 'SymbolNode' && node.name === 'x'
  )

  const _arr: string[] = filtered.map((node: math.MathNode) => node.toString())

  // Traverse an expression tree
  const node1: math.MathNode = math.parse('3 * x + 2')
  node1.traverse(
    (node: math.MathNode, _path: string, _parent: math.MathNode) => {
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
    }
  )
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

  // array input
  assert.deepStrictEqual(math.ceil([3.2, 3.8, -4.7]), [4, 4, -4])
  assert.deepStrictEqual(math.ceil([3.21, 3.82, -4.71], 1), [3.3, 3.9, -4.7])
  assert.deepStrictEqual(
    math.ceil([3.21, 3.82, -4.71], math.bignumber(1)),
    math.bignumber([3.3, 3.9, -4.7])
  )

  // numeric input, array or matrix of decimals
  const numCeiled: math.MathArray = math.ceil(math.tau, [2, 3])
  assert.deepStrictEqual(numCeiled, [6.29, 6.284])
  const bigCeiled: math.Matrix = math.ceil(
    math.bignumber(6.28318),
    math.matrix([2, 3])
  )
  assert.deepStrictEqual(bigCeiled, math.matrix(math.bignumber([6.29, 6.284])))
  assert.deepStrictEqual(math.ceil(math.fraction(44, 7), [2, 3]), [
    math.fraction(629, 100),
    math.fraction(6286, 1000),
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

  // array input
  assert.deepStrictEqual(math.fix([3.2, 3.8, -4.7]), [3, 3, -4])
  assert.deepStrictEqual(math.fix([3.21, 3.82, -4.71], 1), [3.2, 3.8, -4.7])
  assert.deepStrictEqual(
    math.fix([3.21, 3.82, -4.71], math.bignumber(1)),
    math.bignumber([3.2, 3.8, -4.7])
  )

  // numeric input, array or matrix of decimals
  const numFixed: math.MathArray = math.fix(math.tau, [2, 3])
  assert.deepStrictEqual(numFixed, [6.28, 6.283])
  const bigFixed: math.Matrix = math.fix(
    math.bignumber(6.28318),
    math.matrix([2, 3])
  )
  assert.deepStrictEqual(bigFixed, math.matrix(math.bignumber([6.28, 6.283])))
  assert.deepStrictEqual(math.fix(math.fraction(44, 7), [2, 3]), [
    math.fraction(628, 100),
    math.fraction(6285, 1000),
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

  // array input
  assert.deepStrictEqual(math.floor([3.2, 3.8, -4.7]), [3, 3, -5])
  assert.deepStrictEqual(math.floor([3.21, 3.82, -4.71], 1), [3.2, 3.8, -4.8])
  assert.deepStrictEqual(
    math.floor([3.21, 3.82, -4.71], math.bignumber(1)),
    math.bignumber([3.2, 3.8, -4.8])
  )

  // numeric input, array or matrix of decimals
  const numFloored: math.MathArray = math.floor(math.tau, [2, 3])
  assert.deepStrictEqual(numFloored, [6.28, 6.283])
  const bigFloored: math.Matrix = math.floor(
    math.bignumber(6.28318),
    math.matrix([2, 3])
  )
  assert.deepStrictEqual(bigFloored, math.matrix(math.bignumber([6.28, 6.283])))
  assert.deepStrictEqual(math.floor(math.fraction(44, 7), [2, 3]), [
    math.fraction(628, 100),
    math.fraction(6285, 1000),
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

  // array input
  assert.deepStrictEqual(math.round([3.2, 3.8, -4.7]), [3, 4, -5])
  assert.deepStrictEqual(math.round([3.21, 3.82, -4.71], 1), [3.2, 3.8, -4.7])
  assert.deepStrictEqual(
    math.round([3.21, 3.82, -4.71], math.bignumber(1)),
    math.bignumber([3.2, 3.8, -4.7])
  )

  // numeric input, array or matrix of decimals
  const numRounded: math.MathArray = math.round(math.tau, [2, 3])
  assert.deepStrictEqual(numRounded, [6.28, 6.283])
  const bigRounded: math.Matrix = math.round(
    math.bignumber(6.28318),
    math.matrix([2, 3])
  )
  assert.deepStrictEqual(bigRounded, math.matrix(math.bignumber([6.28, 6.283])))
  assert.deepStrictEqual(math.round(math.fraction(44, 7), [2, 3]), [
    math.fraction(629, 100),
    math.fraction(6286, 1000),
  ])

  // @ts-expect-error ... verify round(array, array) throws an error (for now)
  assert.throws(() => math.round([3.21, 3.82], [1, 2]), TypeError)
}

/*
 Clone examples
  */
{
  const math = create(all, {})
  expectTypeOf(
    new math.OperatorNode('/', 'divide', [
      new math.ConstantNode(3),
      new math.SymbolNode('x'),
    ])
  ).toMatchTypeOf<OperatorNode<'/', 'divide', (ConstantNode | SymbolNode)[]>>()

  expectTypeOf(new math.ConstantNode(1).clone()).toMatchTypeOf<ConstantNode>()
  expectTypeOf(
    new math.OperatorNode('*', 'multiply', [
      new math.ConstantNode(3),
      new math.SymbolNode('x'),
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
      new math.SymbolNode('x'),
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
    bigNumber: math.bignumber('1.5'),
  }
  const stringified = JSON.stringify(data)
  const parsed = JSON.parse(stringified, math.reviver)
  assert.deepStrictEqual(parsed.bigNumber, math.bignumber('1.5'))
}

/*
Extend functionality with import
 */

declare module 'mathjs' {
  interface MathJsStatic {
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
      value: 10,
    },
    {}
  )

  math.testFun()

  expectTypeOf(math.testFun()).toMatchTypeOf<number>()

  expectTypeOf(
    math.import({
      myvalue: 42,
      myFunc: (name: string) => `myFunc ${name}`,
    })
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import(
      {
        myvalue: 42,
        myFunc: (name: string) => `myFunc ${name}`,
      },
      {
        override: true,
      }
    )
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import(
      {
        myvalue2: 42,
      },
      {
        silent: true,
      }
    )
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import(
      {
        myvalue3: 42,
      },
      {
        wrap: true,
      }
    )
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import({
      myvalue4: 42,
    })
  ).toMatchTypeOf<void>()

  expectTypeOf(
    math.import([
      {
        myvalue5: 42,
      },
      {
        myFunc2: (name: string) => `myFunc2 ${name}`,
      },
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
      formatDependencies,
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
    true,
  ])
  assert.strictEqual(math.hasNumericValue(math.fraction(4)), true)
  assert.strictEqual(math.hasNumericValue(math.complex('2-4i')), false)
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
    math.isSymbolNode,
    math.isChain,
  ]

  isFuncs.forEach((f) => {
    const result = f(1)
    const isResultBoolean = result === true || result === false
    assert.ok(isResultBoolean)
  })

  // Check guards do type refinement

  let x: unknown

  if (math.isNumber(x)) {
    expectTypeOf(x).toMatchTypeOf<number>()
  }
  if (math.isBigNumber(x)) {
    expectTypeOf(x).toMatchTypeOf<math.BigNumber>()
  }
  if (math.isComplex(x)) {
    expectTypeOf(x).toMatchTypeOf<math.Complex>()
  }
  if (math.isFraction(x)) {
    expectTypeOf(x).toMatchTypeOf<math.Fraction>()
  }
  if (math.isUnit(x)) {
    expectTypeOf(x).toMatchTypeOf<math.Unit>()
  }
  if (math.isString(x)) {
    expectTypeOf(x).toMatchTypeOf<string>()
  }
  if (math.isArray(x)) {
    expectTypeOf(x).toMatchTypeOf<unknown[]>()
  }
  if (math.isMatrix(x)) {
    expectTypeOf(x).toMatchTypeOf<math.Matrix>()
  }
  if (math.isDenseMatrix(x)) {
    expectTypeOf(x).toMatchTypeOf<math.Matrix>()
  }
  if (math.isSparseMatrix(x)) {
    expectTypeOf(x).toMatchTypeOf<math.Matrix>()
  }
  if (math.isIndex(x)) {
    expectTypeOf(x).toMatchTypeOf<math.Index>()
  }
  if (math.isBoolean(x)) {
    expectTypeOf(x).toMatchTypeOf<boolean>()
  }
  if (math.isHelp(x)) {
    expectTypeOf(x).toMatchTypeOf<math.Help>()
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
    expectTypeOf(x).toMatchTypeOf<math.AccessorNode>()
  }
  if (math.isArrayNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.ArrayNode>()
  }
  if (math.isAssignmentNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.AssignmentNode>()
  }
  if (math.isBlockNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.BlockNode>()
  }
  if (math.isConditionalNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.ConditionalNode>()
  }
  if (math.isConstantNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.ConstantNode>()
  }
  if (math.isFunctionAssignmentNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.FunctionAssignmentNode>()
  }
  if (math.isFunctionNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.FunctionNode>()
  }
  if (math.isIndexNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.IndexNode>()
  }
  if (math.isNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.MathNodeCommon>()
  }
  if (math.isNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.MathNodeCommon>()
  }
  if (math.isObjectNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.ObjectNode>()
  }
  if (math.isOperatorNode(x)) {
    expectTypeOf(x).toMatchTypeOf<
      OperatorNode<OperatorNodeOp, OperatorNodeFn, MathNode[]>
    >()
  }
  if (math.isParenthesisNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.ParenthesisNode>()
  }
  if (math.isRangeNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.RangeNode>()
  }
  if (math.isSymbolNode(x)) {
    expectTypeOf(x).toMatchTypeOf<math.SymbolNode>()
  }
  if (math.isChain(x)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expectTypeOf(x).toMatchTypeOf<math.MathJsChain<any>>()
  }
}

/*
Probability function examples
*/
{
  const math = create(all, {})

  expectTypeOf(math.lgamma(1.5)).toMatchTypeOf<number>()
  expectTypeOf(
    math.lgamma(math.complex(1.5, -1.5))
  ).toMatchTypeOf<math.Complex>()
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
      a: '123',
    })
  ).toMatchTypeOf<string>()
}

/*
Resolve examples
*/
{
  const math = create(all, {})

  expectTypeOf(math.resolve(math.parse('x + y'))).toMatchTypeOf<MathNode>()
  expectTypeOf(
    math.resolve(math.parse('x + y'), { x: 0 })
  ).toMatchTypeOf<MathNode>()
  expectTypeOf(math.resolve([math.parse('x + y')], { x: 0 })).toMatchTypeOf<
    MathNode[]
  >()
}
