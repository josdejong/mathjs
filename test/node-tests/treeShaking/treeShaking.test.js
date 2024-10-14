// Only use native node.js API's and references to ./lib here, this file is not transpiled!
//
// Note that if this tree-shaking test fails, there is probably
// new functionality which forces Webpack to turn off tree shaking.
//
// Typical solutions to get tree-shaking working again are:
//
// - move code into a separate file to isolate it
// - add /* #__PURE__ */ when creating a variable

import path from 'node:path'
import cp from 'node:child_process'
import assert from 'node:assert'
import { fileURLToPath } from 'node:url'
import { deleteSync } from 'del'
import webpack from 'webpack'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

describe('tree shaking', function () {
  const appName = 'treeShakingApp.js'
  const bundleName = 'treeShakingApp.bundle.js'
  const bundleLicenseName = 'treeShakingApp.bundle.js.LICENSE.txt'

  before(function () {
    cleanup()
  })

  after(function () {
    cleanup()
  })

  function cleanup () {
    deleteSync(path.join(__dirname, bundleName))
    deleteSync(path.join(__dirname, bundleLicenseName))
  }

  it('should apply tree-shaking when bundling', function (done) {
    // This test takes a few seconds
    this.timeout(2 * 60 * 1000)

    const webpackConfig = {
      entry: path.join(__dirname, appName),
      mode: 'production',
      output: {
        filename: bundleName,
        path: __dirname
      }
    }

    webpack(webpackConfig).run(function (err, stats) {
      if (err) {
        console.error(err)
        done(err)
        return
      }

      const info = stats.toJson()
      if (stats.hasErrors()) {
        console.error('Webpack errors:', info.errors)
        done(new Error('Compile failed'))
        return
      }

      // Test whether the size is small enough
      // At this moment, the full library size is 559137 bytes (unzipped),
      // and the size of this tree-shaken bundle is 98494 bytes (unzipped)
      // this may grow or shrink in the future
      assert.strictEqual(info.assets[0].name, bundleName)
      const size = info.assets[0].size
      const maxSize = 135000
      assert(size < maxSize,
        'bundled size must be small enough ' +
        '(actual size: ' + size + ' bytes, max size: ' + maxSize + ' bytes)')

      // Execute the bundle to test whether it actually works
      cp.exec('node ' + path.join(__dirname, bundleName), function (err, result) {
        if (err) {
          done(err)
          return
        }

        assert.strictEqual(result.replace(/\s/g, ''), '3')

        done()
      })
    })
  })
})
