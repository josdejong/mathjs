import assert from 'assert'
import { approxDeepEqual, approxEqual } from '../../../../../tools/approx.js'
import math from '../../../../../src/defaultInstance.js'
import { createCsSpsolve } from '../../../../../src/function/algebra/sparse/csSpsolve.js'

describe('slu', function () {
  it('should decompose matrix, 4 x 4, natural ordering (order=0), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // partial pivoting
    const r = math.slu(m, 0, 1)

    // verify M[p,q]=L*U
    approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A+A\') (order=1)', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // partial pivoting
    const r = math.slu(m, 1, 1)

    // verify M[p,q]=L*U
    approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A\'*A) (order=2), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // partial pivoting
    const r = math.slu(m, 2, 1)

    // verify M[p,q]=L*U
    approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  it('should decompose matrix, 4 x 4, amd(A\'*A) (order=3), partial pivoting', function () {
    const m = math.sparse(
      [
        [4.5, 0, 3.2, 0],
        [3.1, 2.9, 0, 0.9],
        [0, 1.7, 3, 0],
        [3.5, 0.4, 0, 1]
      ])

    // partial pivoting
    const r = math.slu(m, 3, 1)

    // verify M[p,q]=L*U
    approxDeepEqual(_permute(m, r.p, r.q).valueOf(), math.multiply(r.L, r.U).valueOf())
  })

  // Reuse the existing sparse LU example with explicitly declared domains.
  const scalarValues = [
    [4.5, 0, 3.2, 0],
    [3.1, 2.9, 0, 0.9],
    [0, 1.7, 3, 0],
    [3.5, 0.4, 0, 1]
  ]

  for (const [datatype, convert] of [
    ['number', value => value],
    ['BigNumber', value => math.bignumber(value)],
    ['Complex', value => math.complex(value)],
    ['Fraction', value => math.fraction(value)]
  ]) {
    const orders = datatype === 'number' ? [0, 1, 2, 3] : [0]
    for (const order of orders) {
      it('should preserve declared ' + datatype + ' arithmetic with order=' + order, function () {
        const m = math.sparse(scalarValues.map(row => row.map(convert)), datatype)
        const r = math.slu(m, order, 1)

        _assertReconstruction(m, r)
      })
    }
  }

  for (const kind of ['plain', 'typed', 'broad']) {
    it('should preserve injected ' + kind + ' scalar operations', function () {
      const instance = math.create()
      const calls = { divideScalar: 0, multiply: 0, subtract: 0 }
      const operations = {}
      for (const name of Object.keys(calls)) {
        const original = instance[name]
        const observed = (a, b) => {
          calls[name]++
          return original(a, b)
        }
        operations[name] = kind === 'plain'
          ? observed
          : instance.typed(name, {
            [kind === 'typed' ? 'number, number' : 'any, any']: observed
          })
      }
      instance.import(operations, { override: true })

      const m = instance.sparse(scalarValues, 'number')
      const r = instance.slu(m, 0, 1)
      for (const name of Object.keys(calls)) {
        assert.ok(calls[name] > 0, name + ' override was not called')
      }
      _assertReconstruction(m, r)
    })
  }

  it('should dispatch changed intermediate domains from declared number matrices', function () {
    const instance = math.create()
    const divide = instance.divideScalar
    const multiply = instance.multiply
    let promoted = 0
    let nonNumberProducts = 0
    instance.import({
      divideScalar: instance.typed('divideScalar', {
        'number, number': (a, b) => {
          promoted++
          return instance.bignumber(a).div(b)
        },
        'any, any': divide
      }),
      multiply: instance.typed('multiply', {
        'number, number': multiply,
        'any, any': (a, b) => {
          nonNumberProducts++
          return multiply(a, b)
        }
      })
    }, { override: true })

    const m = instance.sparse(scalarValues, 'number')
    const r = instance.slu(m, 0, 1)
    assert.ok(promoted > 0)
    assert.ok(nonNumberProducts > 0)
    assert.ok(r.U._values.some(value => value && value.isBigNumber))
    _assertReconstruction(m, r)
  })

  it('should read the previous workspace value before injected multiplication', function () {
    const x = [0, 0]
    const solve = createCsSpsolve({
      typed: math.typed,
      divideScalar: (a, b) => a / b,
      multiply: (a, b) => {
        x[1] = 100
        return a * b
      },
      subtract: (a, b) => a - b
    })
    const g = math.sparse([[1, 0], [2, 1]], 'number')
    const b = math.sparse([[1], [3]], 'number')

    solve(g, b, 0, new Array(4), x, null, true)

    assert.deepStrictEqual(x, [1, 1])
  })

  function _assertReconstruction (m, r) {
    const expected = _permute(m, r.p, r.q).valueOf()
    const actual = math.multiply(r.L, r.U).valueOf()
    for (let i = 0; i < expected.length; i++) {
      for (let j = 0; j < expected[i].length; j++) {
        const a = expected[i][j]
        const b = actual[i][j]
        // approxEqual supports BigNumber and Complex directly. Normalize only
        // Fraction values instead of comparing their implementation fields.
        approxEqual(a && a.isFraction ? a.valueOf() : a,
          b && b.isFraction ? b.valueOf() : b)
      }
    }
  }

  /**
   * C = A(p,q) where p is the row permutation vector and q the column permutation vector.
   */
  function _permute (A, pinv, q) {
    // matrix arrays
    const values = A._values
    const index = A._index
    const ptr = A._ptr
    const size = A._size
    // columns
    const n = size[1]
    // c arrays
    const cvalues = []
    const cindex = []
    const cptr = []
    // loop columns
    for (let k = 0; k < n; k++) {
      cptr[k] = cindex.length
      // column in C
      const j = q ? (q[k]) : k
      // values in column j
      for (let t = ptr[j]; t < ptr[j + 1]; t++) {
        cvalues.push(values[t])
        cindex.push(pinv ? (pinv[index[t]]) : index[t])
      }
    }
    cptr[n] = cindex.length
    // return matrix
    return new math.SparseMatrix({
      values: cvalues,
      index: cindex,
      ptr: cptr,
      size,
      datatype: A._datatype
    })
  }
})
