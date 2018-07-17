const assert = require('assert')
const cp = require('child_process')

function run (args, done) {
  cp.exec('bin/cli.js "' + args + '"', function (e, r) {
    done(e, r.replace(/\n$/g, ''))
  })
}

describe('command line interface', function () {
  it('should sum numbers', function (done) {
    run('1+1', function (e, result) {
      assert.equal(result, 2)
      done()
    })
  })

  it('should multiply matrices', function (done) {
    run('[1,2] * [3,4]', function (e, result) {
      assert.equal(result, 11)
      done()
    })
  })

  it('should thow error', function (done) {
    run('y=x', function (e, result) {
      assert.equal(/^Error/g.test(e.toString()), true)
      done()
    })
  })

  it('should interpret scripts', function (done) {
    run('test-dist/cli/script1" "test-dist/cli/script2', function (e, result) {
      result = result.split('\n')
      assert.equal(result[0], 2)
      assert.equal(result[1], 8)
      done()
    })
  })
})
