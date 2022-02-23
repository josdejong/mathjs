// Only use native node.js API's and references to ./lib here, this file is not transpiled!
const assert = require('assert')
const cp = require('child_process')
const path = require('path')
const fs = require('fs')

describe('examples/', () => {
  const exampleDir = path.resolve(__dirname, '../../examples/')
  const referenceDir = path.resolve(__dirname, './examples/')
  const rawExamples = fs.readdirSync(exampleDir, { withFileTypes: true })
  const examples = []
  for (const example of rawExamples) {
    if (example.isDirectory()) {
      const subDir = path.join(exampleDir, example.name)
      const subFiles = fs.readdirSync(subDir)
      for (const subFile of subFiles) {
        if (subFile.substr(-3) === '.js') {
          examples.push(path.join(example.name, subFile))
        }
      }
    } else {
      if (example.name.substr(-3) === '.js') {
        examples.push(example.name)
      }
    }
  }
  for (const example of examples) {
    it(example, (done) => {
      const source = path.join(exampleDir, example)
      const outfile = path.join(referenceDir, example + '.out')
      const expected = fs.readFileSync(outfile).toString()
      let expectError = ''
      const errfile = path.join(referenceDir, example + '.err')
      if (fs.existsSync(errfile)) {
        expectError = fs.readFileSync(errfile).toString()
      }
      cp.exec('node ' + source, (error, stdout, stderr) => {
        assert.strictEqual(error, null)
        assert.strictEqual(stderr, expectError)
        assert.strictEqual(stdout, expected)
        done()
      })
    })
  }
})
