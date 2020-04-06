// Only use native node.js API's and references to ./lib here, this file is not transpiled!
const assert = require('assert')
const path = require('path')
const cp = require('child_process')

function run (args, done) {
  cp.exec('node bin/cli.js ' + args, function (e, r) {
    done(e, r.replace(/\n$/g, ''))
  })
}

describe('command line interface', function () {
  it('should sum numbers', function (done) {
    run('"1+1"', function (e, result) {
      assert.strictEqual(result, '2')
      done()
    })
  })

  it('should multiply matrices', function (done) {
    run('"[1,2] * [3,4]"', function (e, result) {
      assert.strictEqual(result, '11')
      done()
    })
  })

  it('should thow error', function (done) {
    run('"y=x"', function (e, result) {
      assert.strictEqual(/^Error/g.test(e.toString()), true)
      done()
    })
  })

  it('should interpret scripts', function (done) {
    const path1 = path.join(__dirname, 'script1')
    const path2 = path.join(__dirname, 'script2')

    run('"' + path1 + '" "' + path2 + '"', function (e, result) {
      assert.strictEqual(result, '2\n8\n')
      done()
    })
  })
})
