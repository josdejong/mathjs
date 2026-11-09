// Runs the ```js code blocks of the markdown pages under docs/ and checks the
// lines that end in a comment stating their result, like
//
//     math.add(2, 3)          // 5
//     math.sqrt(-4)           // returns Complex 2i
//     math.matrix([1, 2])     // Matrix, [1, 2]
//     math.zeros(3)           // Matrix, size [3], [0, 0, 0]
//     const a = math.add(2, 3) // 5; the value of a is checked
//
// Which comments state a value is decided by valueFromComment and
// sizeFromComment in docExpectations.js, the same code that reads the JSDoc
// examples for doc.test.js. A comment that does not evaluate to a value, like
// "// retrieve subset", is prose and is not checked, and so is the text after
// a semicolon, as in "// 6; *not* 10". A comment on a line of its own states
// the result of the line before it, when that line has no comment.
//
// How the examples are run:
// - Each code block runs on its own. To check a line, the block is run with
//   eval from its first line through that line, and the value of that last
//   line is compared with the comment. For a line that declares one variable,
//   the value of that variable is compared; for a console.log line, the
//   logged value. A line that throws is left out when later lines are run.
// - Every run starts with a fresh `math = create(all)`. Import statements are
//   left out; instead the names the docs import from 'mathjs' (create, all,
//   factory, sqrt) are available, and require('mathjs') returns mathjs.
//   Blocks that import from another module, like 'mathjs/number', are not run.
// - Not checked: the examples listed in skipExamples.
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as mathjs from '../../lib/esm/index.js'
import { valueFromComment, compareWithExpected, sizeFromComment } from './docExpectations.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(__dirname, '../../docs')
// list the comments that are not checked, with the reason:
//     npx mocha test/node-tests/docs-examples.test.js --ignored-docs
const showIgnored = process.argv.includes('--ignored-docs')

// Examples that cannot run here, by page and statement, with the reason
const skipExamples = {
  "custom_bundling.md: console.log('c =', format(c))": 'imports the dependency collections',
  "custom_bundling.md: console.log('d =', format(d))": 'imports the dependency collections'
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
  const ignored = []
  const ignore = (number, text, reason) => ignored.push(`${page}:${number}  ${text.trim()}  (${reason})`)
  for (const block of jsBlocks(fs.readFileSync(file, 'utf8'))) {
    let code = ''
    let codeBefore = '' // the code before the last line with a statement
    let uncommented = null // the statement of the line before, if it has no comment
    let inImport = false
    for (const { text, number } of block) {
      // leave out import statements, which can span several lines
      if (text.startsWith('import ')) inImport = true
      if (inImport) {
        if (text.includes(' from ') && !text.includes(" from 'mathjs'")) {
          ignore(number, text, 'block imports from another module, not run')
          break
        }
        inImport = !text.includes(' from ')
        continue
      }

      const at = text.indexOf('//')
      const ownStatement = (at === -1 ? text : text.slice(0, at)).trim()
      if (ownStatement !== '') codeBefore = code
      code += text + '\n'
      const previous = uncommented
      uncommented = (at === -1 && ownStatement !== '') ? ownStatement : null
      if (at === -1) continue

      // A comment on a line of its own states the result of the line before
      // it, when that line has no comment of its own
      const statement = ownStatement || previous
      const comment = text.slice(at + 2).trim()
      if (!statement) {
        ignore(number, text, 'comment on its own line')
        continue
      }
      if (`${page}: ${statement}` in skipExamples) {
        ignore(number, text, skipExamples[`${page}: ${statement}`])
        continue
      }

      // For a declaration like `const a = ...`, check the value of `a`
      let codeToCheck = code
      if (/^(const|let|var) /.test(statement)) {
        const name = statement.split(' ')[1]
        if (!/^\w+$/.test(name)) {
          ignore(number, text, 'declares more than one name')
          continue
        }
        codeToCheck = code + name + '\n'
      }

      const { size, type, comment: valueComment } = sizeFromComment(comment)
      const expected = valueFromComment(math, valueComment, false, true)
      if (expected === undefined && size === undefined && type === undefined) {
        ignore(number, text, 'no value stated')
        continue
      }

      const logged = []
      let actual
      try {
        actual = run(codeToCheck, logged)
        if (statement.startsWith('console.log(')) actual = logged[logged.length - 1]
      } catch (err) {
        actual = err.toString()
        code = codeBefore // later lines run without the line that throws
      }
      try {
        compareWithExpected(math, expected, actual)
        if (size !== undefined) {
          assert.deepStrictEqual(math.size(actual).valueOf(), size)
        }
        if (type === 'Matrix') assert.ok(math.isMatrix(actual))
        if (type === 'Array') assert.ok(Array.isArray(actual))
      } catch (err) {
        failures.push(`line ${number}: ${statement}  // ${comment}\n    got: ${mathjs.format(actual)}`)
      }
    }
  }
  if (showIgnored) ignored.forEach(line => console.log('IGNORED ' + line))
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
