import assert from 'assert'
import math from '../../../../src/defaultInstance.js'
import approx from '../../../../tools/approx.js'

const solveODE = math.solveODE
const matrix = math.matrix
const add = math.add
const subtract = math.subtract
const exp = math.exp
const min = math.min
const max = math.max
const tol = 1e-3
const smallerEq = math.smallerEq
const largerEq = math.largerEq
const multiply = math.multiply
const dotMultiply = math.dotMultiply
const divide = math.divide
const diff = math.diff
const unit = math.unit
const map = math.map
const transpose = math.transpose
const isMatrix = math.isMatrix
const bignumber = math.bignumber

describe('solveODE', function () {
  function f (t, y) { return subtract(y, t) }
  function exactSol (T, y0) { return add(dotMultiply(subtract(y0, 1), map(transpose([T]), exp)), transpose([T]), 1) } // this is only valid for y' = y - t
  const tspan = [0, 4]
  const y0 = [1, 2]

  it('should throw an error if the first argument is not a function', function () {
    assert.throws(function () {
      solveODE('notAFunction', tspan, y0)
    }, /TypeError: Unexpected type of argument in function solveODE \(expected: function.*/)
  })

  it('should throw an error if the second argument is not an array like', function () {
    assert.throws(function () {
      solveODE(f, 'NotAnArrayLike', y0)
    }, /TypeError: Unexpected type of argument in function solveODE \(expected: Array or Matrix,.*/)
  })

  it('should throw an error if the second argument does not have a second member', function () {
    assert.throws(function () {
      const wrongTSpan = [tspan[0]]
      solveODE(f, wrongTSpan, y0)
    }, /TypeError: Unexpected type of argument in function.*/)
  })

  it('should throw an error if the name of the method is wrong', function () {
    assert.throws(function () {
      const method = 'wrongMethodName'
      solveODE(f, tspan, y0, { method })
    }, /Unavailable method.*/)
  })

  it('should throw an error if the maximum number of iterations is reached', function () {
    assert.throws(function () {
      solveODE(f, tspan, y0, { maxIter: 1 })
    }, /Maximum number of iterations reached.*/)
  })

  it('should solve close to the analytical solution', function () {
    const sol = solveODE(f, tspan, y0)
    approx.deepEqual(sol.y, exactSol(sol.t, y0), tol)
  })

  it('should solve backwards', function () {
    const exactSolEnd = exactSol([4], y0)[0]
    const sol = solveODE(f, [tspan[1], tspan[0]], exactSolEnd)
    approx.deepEqual(sol.y, exactSol(sol.t, sol.y[sol.y.length - 1]), tol)
  })

  it('should solve if the arguments are matrices', function () {
    const sol = solveODE(f, matrix(tspan), matrix(y0))
    approx.deepEqual(sol.y, matrix(exactSol(sol.t, y0)), tol)
    assert.deepStrictEqual(
      isMatrix(sol.t) && isMatrix(sol.y),
      true
    )
  })

  /*
  it('should solve if the arguments have bignumbers', function () {
    const sol = solveODE(f, bignumber(tspan), bignumber(y0))
    approx.deepEqual(sol.y, bignumber(exactSol(sol.t, y0)), tol)
  })
  */

  it('should solve with options even if they are empty', function () {
    const options = {}
    const sol = solveODE(f, tspan, y0, options)
    approx.deepEqual(sol.y, exactSol(sol.t, y0), tol)
  })

  it('should solve when y0 is a scalar', function () {
    const sol = solveODE(f, tspan, y0[0])
    approx.deepEqual(sol.y, exactSol(sol.t, [y0[0]]).map(x => x[0]), tol)
  })

  it('should solve with units', function () {
    const seconds = unit('s')
    const meters = unit('m')
    function fWithUnits (t, y) { return subtract(divide(y, seconds), multiply(t, divide(meters, multiply(seconds, seconds)))) }
    const tspanWithUnits = multiply(tspan, seconds)
    const y0withUnits = multiply(y0, meters)
    const sol = solveODE(fWithUnits, tspanWithUnits, y0withUnits)
    approx.deepEqual(divide(sol.y, meters), exactSol(divide(sol.t, seconds), y0), tol)
  })

  it('should solve close to the analytical solution with RK23 method', function () {
    const sol = solveODE(f, tspan, y0, { method: 'RK23' })
    approx.deepEqual(sol.y, exactSol(sol.t, y0), tol)
  })

  it('should solve close to the analytical solution with RK45 method', function () {
    const sol = solveODE(f, tspan, y0, { method: 'RK45' })
    approx.deepEqual(sol.y, exactSol(sol.t, y0), tol)
  })

  it('should solve with method name in lower case', function () {
    const sol = solveODE(f, tspan, y0, { method: 'rk45' })
    approx.deepEqual(sol.y, exactSol(sol.t, y0), tol)
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
    const sol = solveODE(f, tspan, y0, { maxStep })
    assert.deepStrictEqual(
      smallerEq(max(diff(sol.t)), maxStep),
      true
    )
  })

  it('should respect minStep', function () {
    const minStep = 0.1
    const sol = solveODE(f, tspan, y0, { minStep })
    assert.deepStrictEqual(
      // slicing to exclude the last step
      largerEq(min(diff(sol.t.slice(0, sol.t.length - 1))), minStep),
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
