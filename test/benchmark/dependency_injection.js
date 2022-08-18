const Benchmark = require('benchmark')
const { create, factory, isComplex } = require('../../lib/cjs/index.js')
const { flatten } = require('../../lib/cjs/utils/array.js')
const { all } = require('../../lib/cjs/index.js')

// In this benchmark we verify whether injecting dependencies on every individual function signature
// has an impact on the performance, since this is the approach that pocomath takes
//
// Benchmark result:
// both have the same performance, so there is no noticeable difference
// this is indeed what I would expect: this is something the JS engine can optimize on,
// it is still a bunch of references to functions passed via function arguments

const math = create(all)

const name = 'hypot2'
const dependencies = ['typed', 'abs', 'addScalar', 'divideScalar', 'multiplyScalar', 'sqrt', 'smaller', 'isPositive']
const createHypot2 = factory(name, dependencies, (deps) => {
  // in hypot2 we resolve the dependencies on every individual signature
  function resolve (fn) {
    return fn(deps)
  }

  return deps.typed(name, {
    '... number | BigNumber': resolve(_createHypot),

    Array: resolve(_createHypot),

    Matrix: resolve(deps => {
      const hypot = _createHypot(deps)

      return M => hypot((flatten(M.toArray())))
    })
  })

  function _createHypot ({ abs, addScalar, divideScalar, multiplyScalar, sqrt, smaller, isPositive }) {
    /**
     * Calculate the hypotenusa for an Array with values
     * @param {Array.<number | BigNumber>} args
     * @return {number | BigNumber} Returns the result
     * @private
     */
    return function _hypot (args) {
      // code based on `hypot` from es6-shim:
      // https://github.com/paulmillr/es6-shim/blob/master/es6-shim.js#L1619-L1633
      let result = 0
      let largest = 0

      for (let i = 0; i < args.length; i++) {
        if (isComplex(args[i])) {
          throw new TypeError('Unexpected type of argument to hypot')
        }
        const value = abs(args[i])
        if (smaller(largest, value)) {
          result = multiplyScalar(result,
            multiplyScalar(divideScalar(largest, value), divideScalar(largest, value)))
          result = addScalar(result, 1)
          largest = value
        } else {
          result = addScalar(result, isPositive(value)
            ? multiplyScalar(divideScalar(value, largest), divideScalar(value, largest))
            : value)
        }
      }

      return multiplyScalar(largest, sqrt(result))
    }
  }
})
math.import(createHypot2)

const values = [3, 4, 5, 6, 7]

const suite = new Benchmark.Suite()
suite
  .add('hypot original (dependency injection on the whole function)', function () {
    math.hypot(values)
  })
  .add('hypot2 (dependency injection per signature)', function () {
    math.hypot2(values)
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
  })
  .run()
