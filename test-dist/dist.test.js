// Only use native node.js API's here, this file is not transpiled!
const assert = require('assert')
const { createSnapshotFromFactories, validateBundle } = require('../lib/utils/snapshot')
const factoriesAny = require('../lib/factoriesAny')
const version = require('../package.json').version

const { expectedInstanceStructure } = createSnapshotFromFactories(factoriesAny)

describe('dist', function () {
  it('should load dist/math.js', function () {
    const math = require('../dist/math.js')

    assert.strictEqual(math.add(2, 3), 5)
    assert.strictEqual(math.version, version)
  })

  it('should load dist/math.min.js', function () {
    const math = require('../dist/math.min.js')

    assert.strictEqual(math.add(2, 3), 5)
    assert.strictEqual(math.version, version)
  })

  it('should have all expected functions in dist/main.js', function () {
    // snapshot testing
    const math = require('../dist/math.js')

    // don't output all warnings "math.foo.bar is move to math.bar, ..."
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (args.join(' ').indexOf('is moved to') === -1) {
        originalWarn.apply(console, args)
      }
    }

    validateBundle(expectedInstanceStructure, math)

    console.warn = originalWarn
  })

  it('should have all expected functions in dist/main.min.js', function () {
    // snapshot testing
    const math = require('../dist/math.js')

    // don't output all warnings "math.foo.bar is move to math.bar, ..."
    const originalWarn = console.warn
    console.warn = (...args) => {
      if (args.join(' ').indexOf('is moved to') === -1) {
        originalWarn.apply(console, args)
      }
    }

    validateBundle(expectedInstanceStructure, math)

    console.warn = originalWarn
  })
})
