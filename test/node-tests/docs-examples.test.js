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
// - Each code block runs once top-to-bottom on its own (except blocks listed
//   in continuePreviousBlock, which share scope with the preceding block).
//   Each checked statement is recorded via a tiny `_check` helper: for a
//   declaration of one variable we record that variable, for a console.log
//   call we record the logged value, and for an expression we record its
//   value (or err.toString() if it throws) so later lines still run.
// - Every block starts with a fresh `math = create(all)`. Import statements
//   are left out; instead the names the docs use without importing (create,
//   all, factory, sqrt, Range) are available, and require('mathjs') returns mathjs.
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
  "custom_bundling.md: console.log('d =', format(d))": 'imports the dependency collections',
  // TODO: check these two again once the dimension in the broadcasting error is fixed (see #3839)
  'datatypes/matrices.md: math.add([1, 2], [3, 4, 5])': 'known issue: wrong dimension in the error',
  'datatypes/matrices.md: math.add([[1], [2], [3]], [[4], [5]])': 'known issue: wrong dimension in the error'
}

// Blocks that continue directly from the preceding block on the same page
const continuePreviousBlock = new Set([
  'expressions/customization.md: math.import(customFunctions)'
])

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

// Run a block script once with eval. The constants below are the names the
// docs can use without importing them; _check verifies each checked statement
// immediately when it runs (before later lines can mutate the result) and
// catches thrown errors so subsequent lines still run.
function runBlock (code, checks, standardMath, failures) {
  const logged = []
  /* eslint-disable no-unused-vars */
  const { create, all, factory, sqrt } = mathjs
  const math = create(all)
  const { Range } = math
  const require = () => mathjs
  const console = { log: value => logged.push(value) }
  const _check = (id, fn) => {
    const { number, statement, comment, expected, size, type } = checks[id]
    let actual
    try {
      actual = fn()
    } catch (err) {
      actual = err.toString()
    }
    try {
      compareWithExpected(standardMath, expected, actual)
      if (size !== undefined) {
        assert.deepStrictEqual(standardMath.size(actual), size)
      }
      if (type === 'Matrix') assert.ok(standardMath.isMatrix(actual))
      if (type === 'Array') assert.ok(Array.isArray(actual))
    } catch (err) {
      failures.push(`line ${number}: ${statement}  // ${comment}\n    got: ${mathjs.format(actual)}`)
    }
  }
  /* eslint-enable no-unused-vars */
  eval(code) // eslint-disable-line no-eval
}

function runPage (file, page) {
  const math = mathjs.create(mathjs.all) // to read the expected values
  const failures = []
  const ignored = []
  const ignore = (number, text, reason) => ignored.push(`${page}:${number}  ${text.trim()}  (${reason})`)

  // Merge blocks explicitly marked as continuing the preceding block
  const blocks = []
  for (const block of jsBlocks(fs.readFileSync(file, 'utf8'))) {
    const first = block.find(l => l.text.trim() !== '')?.text.trim()
    if (first && continuePreviousBlock.has(`${page}: ${first}`) && blocks.length > 0) {
      blocks[blocks.length - 1] = [...blocks[blocks.length - 1], ...block]
    } else {
      blocks.push(block)
    }
  }

  for (const block of blocks) {
    const scriptLines = []
    const checks = []
    let uncommented = null // the statement of the line before, if it has no comment
    let inImport = false
    let skipBlock = false
    for (const { text, number } of block) {
      // leave out import statements, which can span several lines
      if (text.startsWith('import ')) inImport = true
      if (inImport) {
        if (text.includes(' from ') && !text.includes(" from 'mathjs'")) {
          ignore(number, text, 'block imports from another module, not run')
          skipBlock = true
          break
        }
        inImport = !text.includes(' from ')
        continue
      }

      const at = text.indexOf('//')
      const ownStatement = (at === -1 ? text : text.slice(0, at)).trim()
      const previous = uncommented
      uncommented = (at === -1 && ownStatement !== '') ? ownStatement : null
      if (at === -1) {
        scriptLines.push(text)
        continue
      }

      // A comment on a line of its own states the result of the line before
      // it, when that line has no comment of its own
      const statement = ownStatement || previous
      const comment = text.slice(at + 2).trim()
      if (!statement) {
        ignore(number, text, 'comment on its own line')
        scriptLines.push(text)
        continue
      }
      if (`${page}: ${statement}` in skipExamples) {
        ignore(number, text, skipExamples[`${page}: ${statement}`])
        if (!ownStatement) scriptLines.pop()
        continue
      }

      const { size, type, comment: valueComment } = sizeFromComment(comment)
      const expected = valueFromComment(math, valueComment, false, true)
      if (expected === undefined && size === undefined && type === undefined) {
        ignore(number, text, 'no value stated')
        scriptLines.push(text)
        continue
      }

      const id = checks.length
      if (/^(const|let|var) /.test(statement)) {
        const name = statement.split(' ')[1]
        if (!/^\w+$/.test(name)) {
          ignore(number, text, 'declares more than one name')
          scriptLines.push(text)
          continue
        }
        if (ownStatement) scriptLines.push(text)
        scriptLines.push(`;_check(${id}, () => ${name});`)
      } else if (statement.startsWith('console.log(')) {
        if (!ownStatement) scriptLines.pop()
        scriptLines.push(`;_check(${id}, () => { ${statement}; return logged[logged.length - 1] });`)
      } else {
        let expr = ownStatement
        if (!ownStatement) {
          expr = scriptLines.pop().trim()
        } else if (ownStatement.startsWith('.')) {
          // Multi-line chained call, e.g. math.chain(3)\n  .add(4)\n  .done()
          const parts = [ownStatement]
          while (scriptLines.length > 0 && scriptLines[scriptLines.length - 1].trim() !== '') {
            const line = scriptLines.pop().trim()
            parts.unshift(line)
            if (!line.startsWith('.')) break
          }
          expr = parts.join('\n')
        }
        expr = expr.replace(/;+$/, '')
        scriptLines.push(`;_check(${id}, () => (${expr}));`)
      }
      checks.push({ id, number, statement, comment, expected, size, type })
    }

    if (skipBlock || checks.length === 0) continue

    runBlock(scriptLines.join('\n'), checks, math, failures)
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
