import assert from 'assert'
import math from '../../../../src/defaultInstance.js'

const solveODE = math.solveODE
const matrix = math.matrix
const subtract = math.subtract
const exp = math.exp
const min = math.min
const max = math.max
const abs = math.abs
const tol = 1e-3
const smaller = math.smaller
const smallerEq = math.smallerEq
const largerEq = math.largerEq
const multiply = math.multiply
const dotMultiply = math.dotMultiply
const divide = math.divide
const diff = math.diff
const unit = math.unit
const map = math.map
const transpose = math.transpose

function withinTolerance (A, B, tol) {
  const maxAbsError = max(abs(subtract(A, B)))
  return smaller(maxAbsError, tol)
}

describe('solveODE', function () {
  function f (t, y) { return y }
  function exactSol (T, y0) { return dotMultiply(y0, map(transpose([T]), exp)) } // this is only valid for y' = y
  const tspan = [0, 4]
  const y0 = [1, 2]

  it('should throw an error if the first argument is not a function', function () {
    assert.throws(function () {
      const sol = solveODE('notAFunction', tspan, y0)
      assert.deepStrictEqual(
        withinTolerance(sol.y, exactSol(sol.t, y0), tol),
        true
      )
    }, /TypeError: Unexpected type of argument in function solveODE \(expected: function.*/)
  })

  it('should throw an error if the second argument is not an array like', function () {
    assert.throws(function () {
      const sol = solveODE(f, 'NotAnArrayLike', y0)
      assert.deepStrictEqual(
        withinTolerance(sol.y, exactSol(sol.t, y0), tol),
        true
      )
    }, /TypeError: Unexpected type of argument in function solveODE \(expected: Array or Matrix,.*/)
  })

  it('should throw an error if the second argument does not have a second member', function () {
    assert.throws(function () {
      const wrongTSpan = [tspan[0]]
      const sol = solveODE(f, wrongTSpan, y0)
      assert.deepStrictEqual(
        withinTolerance(sol.y, exactSol(sol.t, y0), tol),
        true
      )
    }, /TypeError: Unexpected type of argument in function.*/)
  })

  it('should throw an error if the name of the method is wrong', function () {
    assert.throws(function () {
      const method = 'wrongMethodName'
      const sol = solveODE(f, tspan, y0, { method })
      assert.deepStrictEqual(
        withinTolerance(sol.y, exactSol(sol.t, y0), tol),
        true
      )
    }, /TypeError: .* is not a function/)
  })

  it('should solve close to the analytical solution', function () {
    const sol = solveODE(f, tspan, y0)
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(sol.t, y0), tol),
      true
    )
  })

  it('should solve backwards', function () {
    const exactSolEnd = exactSol([4], y0)[0]
    const sol = solveODE(f, [tspan[1], tspan[0]], exactSolEnd)
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(sol.t, sol.y[sol.y.length - 1]), tol),
      true
    )
  })

  it('should solve if the arguments are matrices', function () {
    const sol = solveODE(f, matrix(tspan), matrix(y0))
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(sol.t, y0), tol),
      true
    )
  })

  it('should solve if with options even if they are empty', function () {
    const options = {}
    const sol = solveODE(f, matrix(tspan), matrix(y0), options)
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(sol.t, y0), tol),
      true
    )
  })

  it('should solve when y0 is a scalar', function () {
    const sol = solveODE(f, tspan, y0[0])
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(sol.t, [y0[0]]).map(x => x[0]), 2 * tol),
      true
    )
  })

  it('should solve with units', function () {
    const seconds = unit('s')
    function fWithUnits (t, y) { return divide(y, seconds) }
    const tspanWithUnits = multiply(tspan, seconds)
    const sol = solveODE(fWithUnits, tspanWithUnits, y0)
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(divide(sol.t, seconds), y0), tol),
      true
    )
  })

  it('should solve close to the analytical solution with RK23 method', function () {
    const sol = solveODE(f, tspan, y0, { method: 'RK23' })
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(sol.t, y0), tol),
      true
    )
  })

  it('should solve close to the analytical solution with RK45 method', function () {
    const sol = solveODE(f, tspan, y0, { method: 'RK45' })
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(sol.t, y0), tol),
      true
    )
  })

  it('should solve with method name in lower case', function () {
    const sol = solveODE(f, tspan, y0, { method: 'rk45' })
    assert.deepStrictEqual(
      withinTolerance(sol.y, exactSol(sol.t, y0), tol),
      true
    )
  })

  it('should solve with less steps if a higher tolerance is specified', function () {
    const sol = solveODE(f, tspan, y0, { method: 'RK45', tol: 1e-2 })
    assert.deepStrictEqual(
      smallerEq(sol.y.length, 6),
      true
    )
  })

  it('should respect maxStep', function () {
    const maxStep = 0.4
    const sol = solveODE(f, tspan, y0, { method: 'RK45', maxStep })
    assert.deepStrictEqual(
      smallerEq(max(diff(sol.t)), maxStep),
      true
    )
  })

  it('should respect minStep', function () {
    const minStep = 0.2
    const sol = solveODE(f, tspan, y0, { method: 'RK45', minStep })
    assert.deepStrictEqual(
      largerEq(min(diff(sol.t)), minStep),
      true
    )
  })

  it('should respect first step', function () {
    const firstStep = 0.1
    const sol = solveODE(f, tspan, y0, { firstStep })
    assert.deepStrictEqual(
      subtract(sol.t[1], sol.t[0]),
      firstStep
    )
  })
})
