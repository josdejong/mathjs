import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import { approxEqual, approxDeepEqual } from '../../../../tools/approx.js'
const { eigs, add, complex, divide, exp, fraction, matrix, matrixFromColumns, multiply, abs, size, transpose, bignumber: bignum, zeros, Matrix, Complex } = math

describe('eigs', function () {
  // helper to examine eigenvectors
  function testEigenvectors (soln, predicate) {
    soln.eigenvectors.forEach((ev, i) => predicate(ev.vector, i))
  }

  it('only accepts a square matrix', function () {
    assert.throws(function () { eigs(matrix([[1, 2, 3], [4, 5, 6]])) }, /Matrix must be square/)
    assert.throws(function () { eigs([[1, 2, 3], [4, 5, 6]]) }, /Matrix must be square/)
    assert.throws(function () { eigs([[1, 2], [4, 5, 6]]) }, /DimensionError: Dimension mismatch/)
    assert.throws(function () { eigs([4, 5, 6]) }, /Matrix must be square/)
    assert.throws(function () { eigs(1.0) }, /TypeError: Unexpected type of argument/)
    assert.throws(function () { eigs('random') }, /TypeError: Unexpected type of argument/)
  })

  it('follows aiao-mimo', function () {
    const realSymArray = eigs([[1, 0], [0, 1]])
    assert(Array.isArray(realSymArray.values) && typeof realSymArray.values[0] === 'number')
    testEigenvectors(realSymArray, vector => assert(Array.isArray(vector)))
    assert(typeof realSymArray.eigenvectors[0].vector[0] === 'number')

    const genericArray = eigs([[0, 1], [-1, 0]])
    assert(Array.isArray(genericArray.values) && genericArray.values[0] instanceof Complex)
    testEigenvectors(genericArray,
      vector => assert(Array.isArray(vector) && vector[0] instanceof Complex)
    )

    const id2 = matrix([[1, 0], [0, 1]])
    const realSymMatrix = eigs(id2)
    assert(realSymMatrix.values instanceof Matrix)
    assert.deepStrictEqual(size(realSymMatrix.values), [2])
    testEigenvectors(realSymMatrix, vector => {
      assert(vector instanceof Matrix)
      assert.deepStrictEqual(size(vector), [2])
    })
    // Check we get exact values in this trivial case with lower precision
    const rough = eigs(id2, { precision: 1e-6 })
    assert.deepStrictEqual(realSymMatrix, rough)

    const genericMatrix = eigs(matrix([[0, 1], [-1, 0]]))
    assert(genericMatrix.values instanceof Matrix)
    assert.deepStrictEqual(size(genericMatrix.values), [2])
    testEigenvectors(genericMatrix, vector => {
      assert(vector instanceof Matrix)
      assert.deepStrictEqual(size(vector), [2])
    })
  })

  it('only accepts a matrix with valid element type', function () {
    assert.throws(function () { eigs([['x', 2], [4, 5]]) }, /Cannot convert "x" to a number/)
  })

  it('eigenvalue check for diagonal matrix', function () {
    // trivial test
    approxDeepEqual(eigs(
      [[1, 0], [0, 1]]).values, [1, 1]
    )
    approxDeepEqual(eigs(
      [[2, 0, 0], [0, 1, 0], [0, 0, 5]]).values, [1, 2, 5]
    )
    approxDeepEqual(eigs(
      [[complex(2, 1), 0, 0], [0, 1, 0], [0, 0, complex(0, 5)]]).values, [complex(1, 0), complex(2, 1), complex(0, 5)]
    )
  })

  it('calculates eigenvalues for 2x2 simple matrix', function () {
    // 2x2 test
    approxDeepEqual(eigs(
      [[1, 0.1], [0.1, 1]]).values, [0.9, 1.1]
    )
    approxDeepEqual(eigs(
      matrix([[1, 0.1], [0.1, 1]])).values, matrix([0.9, 1.1])
    )
    approxDeepEqual(eigs(
      [[5, 2.3], [2.3, 1]]).values, [-0.04795013082563382, 6.047950130825635]
    )
  })

  it('calculates eigenvalues for 2x2 matrix with complex entries', function () {
    approxDeepEqual(
      eigs([[3, -2], [complex(4, 2), -1]]).values,
      [complex(0.08982028, 2.197368227), complex(1.91017972, -2.197368227)])
    approxDeepEqual(
      eigs([[2, -2], [complex(0, 2), complex(0, -2)]]).values,
      [0, complex(2, -2)])
  })

  it('calculates eigenvalues for 3x3 and 4x4 matrix', function () {
    // 3x3 test and 4x4
    approxDeepEqual(eigs(
      [[1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0],
        [1.0, 1.0, 1.0]]).values,
    [0, 0, 3]
    )
    const sym4 =
      [[0.6163396801190624, -3.8571699139231796, 2.852995822026198, 4.1957619745869845],
        [-3.8571699139231796, 0.7047577966772156, 0.9122549659760404, 0.9232933211541949],
        [2.852995822026198, 0.9122549659760404, 1.6598316026960402, -1.2931270747054358],
        [4.1957619745869845, 0.9232933211541949, -1.2931270747054358, -4.665994662426116]]
    const fullValues = eigs(sym4).values
    approxDeepEqual(fullValues,
      [-0.9135495807127523, 2.26552473288741, 5.6502090685149735, -8.687249803623432]
    )
    const justEigs = eigs(sym4, { eigenvectors: false })
    assert.deepStrictEqual(fullValues, justEigs.values)
    assert.ok(!('eigenvectors' in justEigs))
  })

  it('calculates eigenvalues and eigenvectors for 5x5 matrix', function () {
    const m = zeros([5, 5])
    m[4][3] = m[3][4] = m[3][2] = m[2][4] = 1

    approxDeepEqual(eigs(m).values, [
      0, 0,
      complex(-0.6623589786223121, 0.5622795120622232),
      complex(-0.6623589786223121, -0.5622795120622232),
      1.3247179572446257
    ])

    // Here the rows are eigenvectors (from Wolfram Alpha) in the
    // same order as the eigenvalues
    const expectedEigenRows = [
      [0, 1, 0, 0, 0],
      [1, 0, 0, 0, 0],
      [0, 0, complex(-0.877439, -0.7448622), complex(-0.662359, 0.56228), 1],
      [0, 0, complex(-0.877439, 0.7448622), complex(-0.662359, -0.56228), 1],
      [0, 0, 0.754878, 1.32472, 1]
    ]
    // These vectors are very convenient because every row has an entry
    // equal to 1, the indices of which are given by:
    const oneIndex = [1, 0, 4, 4, 4]

    // inverse iteration is stochastic, check it multiple times
    for (let i = 0; i < 5; i++) {
      const eigenRows = eigs(m).eigenvectors.map(obj => obj.vector)
      // if we scale each row to the expected scale, they should match
      for (let j = 0; j < 5; j++) {
        approxDeepEqual(divide(eigenRows[i], eigenRows[i][oneIndex[i]]),
          expectedEigenRows[i])
      }
    }
  })

  it('eigenvector check', function () {
    const H = [[-4.78, -1.0, -2.59, -3.26, 4.24, 4.14],
      [-1.0, -2.45, -0.92, -2.33, -4.68, 4.27],
      [-2.59, -0.92, -2.45, 4.17, -3.33, 3.05],
      [-3.26, -2.33, 4.17, 2.51, 1.67, 2.24],
      [4.24, -4.68, -3.33, 1.67, 2.80, 2.73],
      [4.14, 4.27, 3.05, 2.24, 2.73, -4.47]]
    const ans = eigs(H)
    const E = ans.values
    const justvalues = eigs(H, { eigenvectors: false })
    assert.deepStrictEqual(E, justvalues.values)
    testEigenvectors(ans,
      (v, j) => approxDeepEqual(multiply(E[j], v), multiply(H, v))
    )
    assert.ok(!('eigenvectors' in justvalues))
    const Vcols = ans.eigenvectors.map(obj => obj.vector)
    const V = matrixFromColumns(...Vcols)
    const VtHV = multiply(transpose(V), H, V)
    const Ei = Array(H.length)
    for (let i = 0; i < H.length; i++) {
      Ei[i] = VtHV[i][i]
    }
    approxDeepEqual(Ei, E)
  })

  it('complex matrix eigenvector check', function () {
    // Example from issue #2478
    const A = [[1, 2, 3], [2, 4, 0], [3, 0, 1]]
    const cnt = 0.1
    const Ath = multiply(exp(multiply(complex(0, 1), -cnt)), A)
    const Hth = divide(add(Ath, transpose(Ath)), 2)
    const example = eigs(Hth)
    testEigenvectors(example, (v, i) =>
      approxDeepEqual(multiply(Hth, v), multiply(example.values[i], v))
    )
  })

  it('supports fractions', function () {
    const aij = fraction('1/2')
    approxDeepEqual(eigs(
      [[aij, aij, aij],
        [aij, aij, aij],
        [aij, aij, aij]]).values,
    [0, 0, 1.5]
    )
  })

  it('handles some 2x2 defective matrices', function () {
    const check = eigs([[2.0, 1.0], [0.0, 2.0]]) // Test case from #2879
    assert.deepStrictEqual(check, {
      values: [2, 2],
      eigenvectors: [{ value: 2, vector: [1, 0] }]
    })
    const fromWeb = eigs([[-2, 1], [-1, 0]]) // https://ocw.mit.edu/courses/18-03sc-differential-equations-fall-2011/051316d5fa93f560934d3e410f8d153d_MIT18_03SCF11_s33_8text.pdf
    assert.strictEqual(fromWeb.eigenvectors.length, 1)
    const vec = fromWeb.eigenvectors[0].vector
    approxEqual(vec[0], vec[1])
  })

  it('handles a 3x3 defective matrix', function () {
    const fromWeb = eigs([[2, -5, 0], [0, 2, 0], [-1, 4, 1]]) // https://math.libretexts.org/Bookshelves/Differential_Equations/Differential_Equations_for_Engineers_(Lebl)/3%3A_Systems_of_ODEs/3.7%3A_Multiple_Eigenvalues
    assert.strictEqual(fromWeb.eigenvectors.length, 2)
    const ev = fromWeb.eigenvectors
    approxEqual(ev[0].value, 1)
    approxEqual(ev[1].value, 2)
    approxEqual(ev[0].vector[0], 0)
    approxEqual(ev[0].vector[1], 0)
    assert.ok(abs(ev[0].vector[2]) > math.config.relTol)
    approxEqual(ev[1].vector[0], -ev[1].vector[2])
    approxEqual(ev[1].vector[1], 0)
    const web2 = eigs([[1, 1, 0], [0, 1, 2], [0, 0, 3]]) // https://www2.math.upenn.edu/~moose/240S2013/slides7-31.pdf
    assert.strictEqual(web2.eigenvectors.length, 2)
    const ev2 = web2.eigenvectors
    assert.strictEqual(ev2[0].value, 1)
    assert.strictEqual(ev2[1].value, 3)
    assert.strictEqual(ev2[0].vector[1], 0)
    assert.strictEqual(ev2[0].vector[2], 0)
    assert.ok(abs(ev2[0].vector[0]) > math.config.relTol)
    assert.strictEqual(ev2[1].vector[1], ev2[1].vector[2])
    approxEqual(ev2[1].vector[1], 2 * ev2[1].vector[0])
  })

  it('accepts a precision argument', function () {
    // The following is a matrix with an algebraically triple eigenvalue
    // equal to 2 which has a unique eigenvector (up to scale, of course).
    // It is from https://web.uvic.ca/~tbazett/diffyqs/sec_multeigen.html
    // The iterative eigenvalue calculation currently being used has a
    // great deal of difficulty converging. We can use a fine precision,
    // but it still doesn't produce good eigenvalues. Hopefully someday
    // we'll be able to get closer.
    const difficult = [[2, 0, 0], [-1, -1, 9], [0, -1, 5]]
    const poor = eigs(difficult, 1e-14)
    assert.strictEqual(poor.values.length, 3)
    approxDeepEqual(poor.values, [2, 2, 2], 7e-6)
    // Note the eigenvectors are junk, so we don't test them. The function
    // eigs thinks there are three of them, for example. Hopefully some
    // future iteration of mathjs will be able to discover there is really
    // only one.
    const poorm = eigs(matrix(difficult), 1e-14)
    assert.deepStrictEqual(poorm.values.size(), [3])
    // Make sure the precision argument can go in the options object
    const stillbad = eigs(difficult, { precision: 1e-14, eigenvectors: false })
    assert.deepStrictEqual(stillbad.values, poor.values)
    assert.ok(!('eigenvectors' in stillbad))
  })

  it('diagonalizes matrix with bigNumber', function () {
    const x = [[bignum(1), bignum(0)], [bignum(0), bignum(1)]]
    approxDeepEqual(eigs(x).values, [bignum(1), bignum(1)])
    const y = [[bignum(1), bignum(1.0)], [bignum(1.0), bignum(1)]]
    const E1 = eigs(y).values
    approxEqual(E1[0].toNumber(), 0.0)
    approxEqual(E1[1].toNumber(), 2.0)
    const H = bignum([[-4.78, -1.0, -2.59, -3.26, 4.24, 4.14],
      [-1.0, -2.45, -0.92, -2.33, -4.68, 4.27],
      [-2.59, -0.92, -2.45, 4.17, -3.33, 3.05],
      [-3.26, -2.33, 4.17, 2.51, 1.67, 2.24],
      [4.24, -4.68, -3.33, 1.67, 2.80, 2.73],
      [4.14, 4.27, 3.05, 2.24, 2.73, -4.47]])
    const ans = eigs(H)
    const justvalues = eigs(H, { eigenvectors: false })
    assert.deepStrictEqual(ans.values, justvalues.values)
    assert.ok(!('eigenvectors' in justvalues))
    const E = ans.values
    const Vcols = ans.eigenvectors.map(obj => obj.vector)
    const V = matrixFromColumns(...Vcols)
    const VtHV = multiply(transpose(V), H, V)
    const Ei = Array(H.length)
    for (let i = 0; i < H.length; i++) {
      Ei[i] = bignum(VtHV[i][i])
    }
    approxDeepEqual(Ei, E)
  })

  it('actually calculates BigNumbers input with BigNumber precision', function () {
    const B = bignum([
      [0, 1],
      [1, 0]
    ])
    const eig = eigs(B)

    assert.strictEqual(eig.values[0].toString(),
      '-0.9999999999999999999999999999999999999999999999999999999999999999')
    assert.strictEqual(eig.values[1].toString(),
      '0.9999999999999999999999999999999999999999999999999999999999999999')
  })
})
