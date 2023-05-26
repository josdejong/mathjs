import { isUnit } from '../../utils/is.js'
import { factory } from '../../utils/factory.js'

const name = 'solveODE'
const dependencies = [
  'typed',
  'add',
  'subtract',
  'multiply',
  'divide',
  'max',
  'map',
  'abs',
  'isPositive',
  'isNegative',
  'larger',
  'smaller'
]

export const createSolveODE = /* #__PURE__ */ factory(name, dependencies, (
  {
    typed,
    add,
    subtract,
    multiply,
    divide,
    max,
    map,
    abs,
    isPositive,
    isNegative,
    larger,
    smaller
  }
) => {
  /**
     * Numerical Integration of Ordinary Differential Equations
     *
     * Two variable step methods are privded:
     * - "RK23": Bogacki–Shampine method
     * - "RK45": Dormand-Prince method RK5(4)7M (default)
     *
     * The arguments are expected as follows.
     *
     * - `func` should be the forcing function `f(t,y)`
     * - `tspan` should be a vector of two numbers or units `[tStart, tEnd]`
     * - `y0` the initial values, should be a scalar or a flat array
     * - `options` should be an object with the following information:
     *   - `method` ('RK45'): ['RK23', 'RK45']
     *   - `tol` (1e-3): A numeric value
     *   - `initialStep`: A numeric value or unit
     *   - `minStep`: minimum step size of the method
     *   - `maxStep`: maximum step size of the method
     *   - `minDelta` (0.2): minimum ratio of change for the step
     *   - `maxDelta` (5): maximum ratio of change for the step
     *   - `maxIter` (1e4): maximum number of iterations
     *
     * Syntax:
     *
     *     math.solveODE(func, tspan, y0)
     *     math.solveODE(func, tspan, y0, options)
     *
     * Examples:
     *
     *     function func(t, y) {return y}
     *     const tspan = [0, 4]
     *     const y0 = 1
     *     math.solveODE(func, tspan, y0)
     *     math.solveODE(func, tspan, [1, 1.1])
     *     math.solveODE(func, tspan, y0, { method:"RK23", maxStep:0.1 })
     *
     * See also:
     *
     *     simplifyCore, derivative, evaluate, parse, rationalize, resolve
     *
     * @param {function} func The forcing function f(t,y)
     * @param {Array | Matrix} tspan The time span
     * @param {number | BigNumber | Unit | Array | Matrix} y0 The initial value
     * @param {Object} [options] Optional configuration options
     * @return {Object} Return an object with t and y values as arrays
     */

  function _rk (butcherTableau) {
    // generates an adaptive runge kutta method from it's butcher tableau

    return function (f, T, y0, options) {
      // adaptive runge kutta methods

      const t0 = T[0] // initial time
      const tf = T[1] // final time
      const steps = 1 // divide the time in this number of steps
      const tol = options.tol ? options.tol : 1e-4 // define a tolerance (must be an option)
      const maxStep = options.maxStep
      const minStep = options.minStep
      const minDelta = options.minDelta ? options.minDelta : 0.2
      const maxDelta = options.maxDelta ? options.maxDelta : 5
      const maxIter = options.maxIter ? options.maxIter : 10_000 // stop inifite evaluation if something goes wrong
      const [a, c, b, bp] = [butcherTableau.a, butcherTableau.c, butcherTableau.b, butcherTableau.bp]

      let h = options.initialStep
        ? options.initialStep
        : divide(subtract(tf, t0), steps) // define the initial step size
      const t = [t0] // start the time array
      const y = [y0] // start the solution array

      const dletaB = subtract(b, bp) // b - bp

      let n = 0
      let iter = 0
      // iterate unitil it reaches either the final time or maximum iterations
      while (ongoing(t[n], tf, h) && iter < maxIter) {
        const k = []

        // trim the time step so that it doesn't overshoot
        h = trimStep(t[n], tf, h)

        // calculate the first value of k
        k.push(f(t[n], y[n]))

        // calculate the rest of the values of k
        for (let i = 1; i < c.length; ++i) {
          k.push(
            f(
              add(t[n], multiply(c[i], h)),
              add(y[n], multiply(h, a[i], k))
            )
          )
        }

        // estimate the error by comparing solutions of different orders
        const TE = max(
          abs(
            map(multiply(dletaB, k), (X) =>
              isUnit(X) ? X.value : X
            )
          )
        )

        if (TE < tol && tol / TE > 1 / 4) {
          // if within tol then push everything
          t.push(add(t[n], h))
          y.push(add(y[n], multiply(h, b, k)))
          n++
        }

        // estimate the delta value that will affect the step size
        const delta = 0.84 * (tol / TE) ** (1 / 5)

        if (delta < minDelta) {
          h = multiply(h, minDelta)
        } else if (delta > maxDelta) {
          h = multiply(h, maxDelta)
        } else {
          h = multiply(h, delta)
        }

        if (maxStep && larger(abs(h), abs(maxStep))) {
          h = isPositive(h) ? abs(maxStep) : multiply(-1, abs(maxStep))
        } else if (minStep && smaller(abs(h), abs(minStep))) {
          h = isPositive(h) ? abs(minStep) : multiply(-1, abs(minStep))
        }
        iter++
      }
      return { t, y }
    }
  }

  function _rk23 (f, T, y0, options) {
    // Bogacki–Shampine method

    // Define the butcher table
    const a = [
      [],
      [1 / 2],
      [0, 3 / 4],
      [2 / 9, 1 / 3, 4 / 9]
    ]

    const c = [null, 1 / 2, 3 / 4, 1]
    const b = [2 / 9, 1 / 3, 4 / 9, 0]
    const bp = [7 / 24, 1 / 4, 1 / 3, 1 / 8]

    const butcherTableau = { a, c, b, bp }

    // Solve an adaptive step size rk method
    return _rk(butcherTableau)(f, T, y0, options)
  }

  function _rk45 (f, T, y0, options) {
    // Dormand Prince method

    // Define the butcher tableau
    const a = [
      [],
      [1 / 5],
      [3 / 40, 9 / 40],
      [44 / 45, -56 / 15, 32 / 9],
      [19372 / 6561, -25360 / 2187, 64448 / 6561, -212 / 729],
      [9017 / 3168, -355 / 33, 46732 / 5247, 49 / 176, -5103 / 18656],
      [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84]
    ]

    const c = [null, 1 / 5, 3 / 10, 4 / 5, 8 / 9, 1, 1]
    const b = [35 / 384, 0, 500 / 1113, 125 / 192, -2187 / 6784, 11 / 84, 0]
    const bp = [5179 / 57600, 0, 7571 / 16695, 393 / 640, -92097 / 339200, 187 / 2100, 1 / 40]

    const butcherTableau = { a, c, b, bp }

    // Solve an adaptive step size rk method
    return _rk(butcherTableau)(f, T, y0, options)
  }

  function _solveODE (f, T, y0, opt) {
    const method = opt.method ? opt.method : 'RK45'
    const methods = {
      RK23: _rk23,
      RK45: _rk45
    }
    const methodOptions = { ...opt } // clone the options object
    delete methodOptions.method // delete the method as it won't be needed
    return methods[method.toUpperCase()](f, T, y0, methodOptions)
  }

  function ongoing (t, tf, h) {
    // returns true if the time has not reached tf for both postitive an negative step (h)
    return isPositive(h)
      ? smaller(t, tf)
      : larger(t, tf)
  }

  function trimStep (t, tf, h) {
    // Trims the time step so that the next step doesn't overshoot
    const next = add(t, h)
    return (
      (isPositive(h) && larger(next, tf)) ||
            (isNegative(h) && smaller(next, tf))
    )
      ? subtract(tf, t)
      : h
  }

  return typed('solveODE', {
    'function, Array, Array, Object': _solveODE,
    'function, Array, Array': (f, T, y0) => _solveODE(f, T, y0, {}),
    'function, Array, number | BigNumber': (f, T, y0) => {
      const sol = _solveODE(f, T, [y0], {})
      return { t: sol.t, y: sol.y.map((Y) => Y[0]) }
    },
    'function, Array, number | BigNumber, Object': (f, T, y0, options) => {
      const sol = _solveODE(f, T, [y0], options)
      return { t: sol.t, y: sol.y.map((Y) => Y[0]) }
    }
  })
})
