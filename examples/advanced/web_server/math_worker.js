const { create, all } = require('../../..')
const workerpool = require('workerpool')
const math = create(all)

// disable the import function so the math.js instance cannot be changed
function noImport () {
  throw new Error('function import is disabled.')
}
math.import({ import: noImport }, { override: true })

/**
 * Evaluate an expression
 * @param {string} expr
 * @return {string} result
 */
function evaluate (expr) {
  const ans = math.evaluate(expr)
  return math.format(ans)
}

// create a worker and register public functions
workerpool.worker({
  evaluate: evaluate
})
