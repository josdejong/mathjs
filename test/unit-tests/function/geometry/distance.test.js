import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

describe('distance', function () {
  it('should calculate the distance of two 1D points', function () {
    assert.strictEqual(math.distance([1], [2]), 1)
  })

  it('should calculate the distance of two 2D points', function () {
    assert.strictEqual(math.distance([0, 0], [10, 10]), 14.142135623730951)
    assert.strictEqual(math.distance(math.matrix([0, 0]), math.matrix([10, 10])), 14.142135623730951)
    assert.strictEqual(math.distance(math.matrix([0, 0, 0]), math.matrix([10, 10, 0])), 14.142135623730951)
    assert.strictEqual(math.distance({ pointOneX: 0, pointOneY: 0 }, { pointTwoX: 10, pointTwoY: 10 }), 14.142135623730951)
  })

  it('should calculate distance between two 3d points', function () {
    assert.strictEqual(math.distance([4, 5, 8], [2, 7, 9]), 3)
    assert.strictEqual(math.distance(math.matrix([0, 0, 0]), math.matrix([10, 10, 0])), 14.142135623730951)
    assert.strictEqual(math.distance(math.matrix([0.31, 0.2, -0.21]), [0.4234, -0.212, -0.2342]), 0.42800607472324503)
    assert.strictEqual(math.distance([67435, 654667, 3545567], [53467, 34567, 654356]), 2956995.1236931384)
    assert.strictEqual(math.distance([-21, -230, -2141], math.matrix([-1234, -3122, -1242])), 3262.396971553278)
    assert.strictEqual(math.distance({ pointOneX: 4, pointOneY: 5, pointOneZ: 8 }, { pointTwoX: 2, pointTwoY: 7, pointTwoZ: 9 }), 3)
  })

  it('should calculate distance between two N dimensional points', function () {
    assert.strictEqual(math.distance([10, 2, -5, 13, -6, 12, 0, 16, 8], [1, 11, 4, 4, 3, 3, -9, 7, 17]), 27)
    assert.strictEqual(math.distance(math.matrix([10, 2, -5, 13, -6, 12, 0, 16, 8]), math.matrix([1, 11, 4, 4, 3, 3, -9, 7, 17])), 27)
  })

  it('should calculate distance for inputs passed as objects', function () {
    assert.deepStrictEqual(math.distance({ pointX: 0, pointY: 0 }, { lineOnePtX: 3, lineOnePtY: 0 }, { lineTwoPtX: 0, lineTwoPtY: 4 }), 2.4)
    assert.deepStrictEqual(math.distance({ pointX: 10, pointY: 10 }, { xCoeffLine: 8, yCoeffLine: 1, constant: 3 }), 11.535230316796387)
    assert.strictEqual(math.distance({ pointOneX: 0, pointOneY: 0 }, { pointTwoX: 10, pointTwoY: 10 }), 14.142135623730951)
    assert.throws(function () { math.distance({ pointX: 1, pointY: 4 }, { lineOnePtX: 'l', lineOnePtY: 3 }, { lineTwoPtX: 2, lineTwoPtY: 8 }) }, TypeError)
    assert.strictEqual(math.distance({ pointOneX: 4, pointOneY: 5, pointOneZ: 8 }, { pointTwoX: 2, pointTwoY: 7, pointTwoZ: 9 }), 3)
  })

  it('should calculate distance for all non-zero values', function () {
    assert.strictEqual(math.distance([1, 1], [10, 10]), 12.727922061357855)
    assert.strictEqual(math.distance([-1, -1], [10, 10]), 15.556349186104045)
    assert.strictEqual(math.distance(math.matrix([-1, 8]), [5, 10]), 6.324555320336759)
    assert.strictEqual(math.distance([-100, 60], [0, 500]), 451.22056690713913)
    assert.strictEqual(math.distance([-100.78, 60.04], [0.3, 500.09]), 451.5098768576386)
    assert.strictEqual(math.distance([74, -34, -0.5], math.matrix([34, 100, -4.33])), 139.89520685141431)
    assert.deepStrictEqual(math.distance([1, -1, -1], [2, 2, 0.1, 1, 2, 2]), 1.3437096247164249)
  })

  it('should throw an error for incompatible parameter types', function () {
    assert.throws(function () { math.distance(0.5) }, TypeError)
    assert.throws(function () { math.distance('1') }, TypeError)
    assert.throws(function () { math.distance(['abc', 'def'], [1, 3]) }, TypeError)
    assert.throws(function () { math.distance([1, 3], ['abc', 'def']) }, TypeError)
    assert.throws(function () { math.distance(['2', '3'], math.matrix([1, 2]), [1, 2]) }, TypeError)
    assert.throws(function () { math.distance([2, 3], math.matrix(['a', 'b']), [1, 2]) }, TypeError)
    assert.throws(function () { math.distance([2, 3], math.matrix([1, 2]), ['a', 'b']) }, TypeError)
    assert.throws(function () { math.distance(math.matrix([0, 0]), math.matrix([3, 0]), math.matrix([3, 0])) }, TypeError)
    assert.throws(function () { math.distance([0, 0], [3, 0], [3, 0]) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 0, pointY: 0 }, { lineOnePtX: 3, lineOnePtY: 0 }, { lineTwoPtX: 3, lineTwoPtY: 0 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 'l', pointY: 4 }, { lineOnePtX: 1, lineOnePtY: 3 }, { lineTwoPtX: 2, lineTwoPtY: 8 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 1, pointY: 4 }, { lineOnePtX: 'l', lineOnePtY: 3 }, { lineTwoPtX: 2, lineTwoPtY: 8 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 1, pointY: 4 }, { lineOnePtX: 1, lineOnePtY: 3 }, { lineTwoPtX: 'l', lineTwoPtY: 8 }) }, TypeError)
    assert.throws(function () { math.distance({ wrongkeyname: 1, pointY: 4 }, { lineOnePtX: 1, lineOnePtY: 3 }, { lineTwoPtX: 2, lineTwoPtY: 8 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 1, pointY: 4 }, { wrongkeyname: 1, lineOnePtY: 3 }, { lineTwoPtX: 2, lineTwoPtY: 8 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 1, pointY: 4 }, { lineOnePtX: 1, lineOnePtY: 3 }, { wrongkeyname: 2, lineTwoPtY: 8 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 'a', pointY: 'b', pointZ: 'c' }, { x0: 1, y0: 1, z0: 2, a: 5, b: 0, c: 1 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 2, pointY: 3, pointZ: 1 }, { x0: 'a', y0: 'b', z0: 'c', a: 5, b: 0, c: 1 }) }, TypeError)
    assert.throws(function () { math.distance({ wrongkeyname: 2, english: 3, pointZ: 1 }, { x0: 1, y0: 1, z0: 2, a: 5, b: 0, c: 1 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 2, pointY: 3, pointZ: 1 }, { wrongkeyname: 1, y0: 1, z0: 2, a: 5, b: 0, c: 1 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 'a', pointY: 'b' }, { xCoeffLine: 8, yCoeffLine: 1, constant: 3 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 10, pointY: 10 }, { xCoeffLine: 'a', yCoeffLine: 'b', constant: 'c' }) }, TypeError)
    assert.throws(function () { math.distance({ wrongkeyname: 10, pointY: 10 }, { xCoeffLine: 8, yCoeffLine: 1, constant: 3 }) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 10, pointY: 10 }, { wrongkeyname: 8, yCoeffLine: 1, constant: 3 }) }, TypeError)
    assert.throws(function () { math.distance(['a', ' b', 'c', 'd'], [1, 2, 3, 4]) }, TypeError)
    assert.throws(function () { math.distance([1, 2, 3, 4], ['a', ' b', 'c', 'd']) }, TypeError)
    assert.throws(function () { math.distance({ pointX: 10, pointY: 10 }, { xCoeffLine: 8, yCoeffLine: 1, constant: 3, extraElement: 4 }) }, TypeError)
  })

  it('should throw an error for unsupported number of parameters', function () {
    assert.throws(function () { math.distance([0, 0]) }, TypeError)
    assert.throws(function () { math.distance([9, 4, 3.6]) }, TypeError)
    assert.throws(function () { math.distance([[1, 2, 4], math.matrix([1, 2]), [8, 1, 3]]) }, TypeError)
    assert.throws(function () { math.distance([-0.5, 4.3], [3.2, -4.654323, 3.3, 6.5, 3.4]) }, TypeError)
    assert.throws(function () { math.distance([1, 2, 3, 4, 5], [1, 2, 3, 4, 5, 6]) }, TypeError)
  })

  it('should calculate pairwise distance between more than two 2D points accurately', function () {
    assert.deepStrictEqual(math.distance([[1, 2], [1, 2], [1, 3]]), [0, 1, 1])
    assert.deepStrictEqual(math.distance([[0, 2], [-2, 0], [0, 2]]), [2.8284271247461903, 0, 2.8284271247461903])
    assert.deepStrictEqual(math.distance([[1, 2], [2, 3], [2, 4], [3, 0]]),
      [1.4142135623730951, 2.23606797749979, 2.8284271247461903, 1, 3.1622776601683795, 4.123105625617661])
  })

  it('should calculate pairwise distance between more than two 3D points accurately', function () {
    assert.deepStrictEqual(math.distance([[0, 0, 0], [1, 0, 0], [0, 1, 0], [0, 0, 1]]), [1, 1, 1, 1.4142135623730951, 1.4142135623730951, 1.4142135623730951])
    assert.deepStrictEqual(math.distance([[1, 2, 4], [1, 2, 6], [8, 1, 3]]), [2, 7.14142842854285, 7.681145747868608])
    assert.deepStrictEqual(math.distance([[-41, 52, 24], [61, -28, 60], [-38, 11, 53]]), [134.5362404707371, 50.309044912421065, 106.63489110042735])
    assert.deepStrictEqual(math.distance([[3.1, 5.2, 4.5], [4.1, 0.2, 6.4], [-5.8, -4.1, 3021]]), [5.441507144165116, 3016.5274654807968, 3014.6193225679426])
  })

  it('should calculate distance between a point and a line segment given by an equation in 2D accurately', function () {
    assert.deepStrictEqual(math.distance([0.1123, -0.242], [0.1316, -0.2421, 0.122135]), 0.7094821347343443)
    assert.deepStrictEqual(math.distance([10, 10], [8, 1, 3]), 11.535230316796387)
    assert.deepStrictEqual(math.distance([12.5, -0.5], [8.5, -1, 3.75]), 12.91095785619739)
    assert.deepStrictEqual(math.distance([-34510, -1032], [8996, -10599, 34653]), 21542.094604263482)
    assert.deepStrictEqual(math.distance({ pointX: 10, pointY: 10 }, { xCoeffLine: 8, yCoeffLine: 1, constant: 3 }), 11.535230316796387)
  })

  it('should calculate distance between a point and a line segment given by two points in 2D accurately', function () {
    assert.deepStrictEqual(math.distance(math.matrix([8, 0]), math.matrix([10, 0]), math.matrix([5, 0])), 0)
    assert.deepStrictEqual(math.distance(math.matrix([8, 3]), math.matrix([10, 0]), math.matrix([5, 0])), 3)
    assert.deepStrictEqual(math.distance(math.matrix([0, 0]), math.matrix([3, 0]), math.matrix([0, 4])), 2.4)
    assert.deepStrictEqual(math.distance([8, 0], [10, 0], [5, 0]), 0)
    assert.deepStrictEqual(math.distance([8, 3], [10, 0], [5, 0]), 3)
    assert.deepStrictEqual(math.distance([0, 0], [3, 0], [0, 4]), 2.4)
    assert.deepStrictEqual(math.distance({ pointX: 8, pointY: 0 }, { lineOnePtX: 10, lineOnePtY: 0 }, { lineTwoPtX: 5, lineTwoPtY: 0 }), 0)
    assert.deepStrictEqual(math.distance({ pointX: 8, pointY: 3 }, { lineOnePtX: 10, lineOnePtY: 0 }, { lineTwoPtX: 5, lineTwoPtY: 0 }), 3)
    assert.deepStrictEqual(math.distance({ pointX: 0, pointY: 0 }, { lineOnePtX: 3, lineOnePtY: 0 }, { lineTwoPtX: 0, lineTwoPtY: 4 }), 2.4)
    assert.deepStrictEqual(math.distance({ pointX: 1, pointY: 4 }, { lineOnePtX: 6, lineOnePtY: 3 }, { lineTwoPtX: 2, lineTwoPtY: 8 }), 3.2796489996607274)
  })

  it('should calculate distance between point and line segment(with parametric co-ordinates) in 3D accurately', function () {
    assert.deepStrictEqual(math.distance([2, 3, 1], [1, 1, 2, 5, 0, 1]), 2.3204774044612857)
    assert.deepStrictEqual(math.distance(math.matrix([1, -1, -1]), math.matrix([2, 2, 0, 1, 2, 2])), 1.414213562373095)
    assert.deepStrictEqual(math.distance([-341, 12, 84.34], [-3.2, 212, 1.240, -51241, 22.2, -4652]), 229.9871046141146)
    assert.deepStrictEqual(math.distance({ pointX: 2, pointY: 3, pointZ: 1 }, { x0: 1, y0: 1, z0: 2, a: 5, b: 0, c: 1 }), 2.3204774044612857)
  })

  it('should calculate the distance if coordinates are bignumbers', function () {
    const bigmath = math.create({ number: 'BigNumber', precision: 32 })
    const bigdistance = bigmath.distance
    const bignumber = bigmath.bignumber

    assert.deepStrictEqual(bigmath.evaluate('distance([1, 2], [4, 6])'), bignumber(5))
    assert.deepStrictEqual(bigdistance([bignumber(1), bignumber(2)], [bignumber(4), bignumber(6)]), bignumber(5))
    assert.deepStrictEqual(bigdistance([bignumber(1), 2], [4, bignumber(6)]), bignumber(5))
    assert.deepStrictEqual(bigdistance([bignumber(10), bignumber(2), bignumber(-5), bignumber(13), bignumber(-6), bignumber(12), bignumber(0), bignumber(16), bignumber(8)],
      [bignumber(1), bignumber(11), bignumber(4), bignumber(4), bignumber(3), bignumber(3), bignumber(-9), bignumber(7), bignumber(17)]), bignumber(27))
    assert.deepStrictEqual(bigmath.evaluate('distance([3, 5], [10, 1])'), bignumber('8.0622577482985496523666132303038'))
    assert.deepStrictEqual(bigmath.evaluate('distance([1, 2, 3], [-2, -3, -4])'), bignumber('9.1104335791442988819456261046887'))
    assert.deepStrictEqual(bigmath.evaluate('distance({pointOneX: 0, pointOneY: 0}, {pointTwoX: 10, pointTwoY: 10})'), bignumber('14.142135623730950488016887242097'))
    assert.deepStrictEqual(bigmath.evaluate('distance({pointOneX: 4, pointOneY: 5, pointOneZ: 8}, {pointTwoX: 2, pointTwoY: 7, pointTwoZ: 10})'), bignumber('3.4641016151377545870548926830117'))
    assert.deepStrictEqual(bigmath.evaluate('distance([[0,2],[-2,0],[0,2]])'), [bignumber('2.8284271247461900976033774484194'), bignumber('0'), bignumber('2.8284271247461900976033774484194')])
    assert.deepStrictEqual(bigmath.evaluate('distance([[1,2,4],[1,2,6],[8,1,3]])'), [bignumber('2'), bignumber('7.1414284285428499979993998113673'), bignumber('7.6811457478686081757696870217314')])
    assert.deepStrictEqual(bigmath.evaluate('distance([0.23, -0.1240], [-0.232, 13.292], [-0.34, 0.346])'), bignumber('0.57390093231864283264935146782154'))
    assert.deepStrictEqual(bigmath.evaluate('distance({pointX: 1, pointY: 4}, {lineOnePtX: 6, lineOnePtY: 3}, {lineTwoPtX: 2, lineTwoPtY: 8})'),
      bignumber('3.2796489996607273760061602723673'))
    assert.deepStrictEqual(bigmath.evaluate('distance([0.1123, -0.242], [0.1316, -0.2421, 0.122135])'), bignumber('0.709482134734344383494644726006'))
    assert.deepStrictEqual(bigmath.evaluate('distance({pointX: 10, pointY: 10}, {xCoeffLine: 8, yCoeffLine: 1, constant: 3})'), bignumber('11.535230316796386425693769698742'))
    assert.deepStrictEqual(bigmath.evaluate('distance([2, 3, 1], [1, 1, 2, 5, 0, 1])'), bignumber('2.3204774044612855517320588018918'))
    assert.deepStrictEqual(bigmath.evaluate('distance({pointX: 2, pointY: 3, pointZ: 1}, {x0: 1, y0: 1, z0: 2, a: 5, b: 0, c: 1})'),
      bignumber('2.3204774044612855517320588018918'))
    assert.deepStrictEqual(bigmath.evaluate('distance([10, 2, -5, 13, -6, 12, 0, 16, 8], [1, 11, 4, 4, 3, 3, -9, 7, 17])'), bignumber(27))
  })
})
