// Runs the ```js code blocks of the markdown pages under docs/ and checks the
// lines that end in a comment stating their result, like
//
//     math.add(2, 3)          // 5
//     math.sqrt(-4)           // returns Complex 2i
//     math.matrix([1, 2])     // Matrix, [1, 2]
//
// Which comments state a value is decided by valueFromComment in
// docExpectations.js, the same code that reads the JSDoc examples for
// doc.test.js. A comment that does not evaluate to a value, like
// "// retrieve subset", is prose and is not checked.
//
// How the examples are run:
// - Each code block runs on its own. To check a line, the block is run with
//   eval from its first line through that line, and the value of that last
//   line is compared with the comment. For a console.log line, the logged
//   value is compared.
// - Every run starts with a fresh `math = create(all)`. Import statements are
//   left out; instead the names the docs import from 'mathjs' (create, all,
//   factory, sqrt) are available, and require('mathjs') returns mathjs.
//   Blocks that import from another module, like 'mathjs/number', are not run.
// - Not checked: comments on lines that declare a variable (const, let, var)
//   and the examples listed in skipExamples.
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as mathjs from '../../lib/esm/index.js'
import { valueFromComment, compareWithExpected } from './docExpectations.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(__dirname, '../../docs')

// Examples that cannot run here, by page and statement, with the reason
const skipExamples = {
  "custom_bundling.md: console.log('c =', format(c))": 'imports the dependency collections',
  "custom_bundling.md: console.log('d =', format(d))": 'imports the dependency collections',
  'expressions/algebra.md: console.log(math.simplify(f, {x: 4}).toString())':
    'uses f from the previous block',
  "expressions/algebra.md: console.log(math.simplify(f, {x: math.parse('y+z')}).toString())":
    'uses f from the previous block'
}

function listPages (dir) {
  const pages = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) pages.push(...listPages(file))
    else if (entry.name.endsWith('.md')) pages.push(file)
  }
  return pages
}

// Return the ```js blocks of a markdown page, each as a list of
// { text, number } lines, with the indentation of the fence removed
function jsBlocks (markdown) {
  const blocks = []
  let block = null
  let indent = 0
  markdown.split('\n').forEach((line, index) => {
    const trimmed = line.trim()
    if (trimmed.startsWith('```')) {
      if (block === null) {
        block = (trimmed === '```js' || trimmed === '```javascript') ? [] : 'other'
        indent = line.indexOf('```')
      } else {
        if (block !== 'other') blocks.push(block)
        block = null
      }
    } else if (block !== null && block !== 'other') {
      block.push({ text: line.slice(indent), number: index + 1 })
    }
  })
  return blocks
}

// Run example code with eval and return the value of its last line. The
// constants below are the names the code can use without importing them.
// console.log calls are collected in `logged` instead of being printed.
function run (code, logged) {
  /* eslint-disable no-unused-vars */
  const { create, all, factory, sqrt } = mathjs
  const math = create(all)
  const require = () => mathjs
  const console = { log: value => logged.push(value) }
  /* eslint-enable no-unused-vars */
  return eval(code) // eslint-disable-line no-eval
}

function runPage (file, page) {
  const math = mathjs.create(mathjs.all) // to read the expected values
  const failures = []
  for (const block of jsBlocks(fs.readFileSync(file, 'utf8'))) {
    let code = ''
    let inImport = false
    for (const { text, number } of block) {
      // leave out import statements, which can span several lines
      if (text.startsWith('import ')) inImport = true
      if (inImport) {
        if (text.includes(' from ') && !text.includes(" from 'mathjs'")) {
          break // a block that imports from another module is not run
        }
        inImport = !text.includes(' from ')
        continue
      }
      code += text + '\n'

      const at = text.indexOf('//')
      if (at === -1) continue
      const statement = text.slice(0, at).trim()
      const comment = text.slice(at + 2).trim()
      if (statement === '' || /^(const|let|var) /.test(statement)) continue
      if (`${page}: ${statement}` in skipExamples) continue
      const expected = valueFromComment(math, comment, false, true)
      if (expected === undefined) continue

      const logged = []
      let actual
      try {
        actual = run(code, logged)
        if (statement.startsWith('console.log(')) actual = logged[logged.length - 1]
      } catch (err) {
        actual = err.toString()
      }
      try {
        compareWithExpected(math, expected, actual)
      } catch (err) {
        failures.push(`line ${number}: ${statement}  // ${comment}\n    got: ${mathjs.format(actual)}`)
      }
    }
  }
  return failures
}

describe('Testing examples from the docs/ pages', function () {
  for (const file of listPages(docsDir)) {
    const page = path.relative(docsDir, file).split(path.sep).join('/')
    if (page.startsWith('reference/functions')) continue // see doc.test.js
    it('satisfies ' + page, function () {
      assert.deepStrictEqual(runPage(file, page), [])
    })
  }
})
