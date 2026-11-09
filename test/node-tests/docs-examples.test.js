// Runs the ```js code blocks of the markdown pages under docs/ and checks
// every line that ends in a comment stating its result, so that the examples
// cannot silently drift from the actual behavior.
//
// The result comments use the same syntax as the JSDoc examples checked by
// doc.test.js (see docExpectations.js), for example:
//
//     math.add(2, 3)                 // 5
//     math.sqrt(-4)                  // returns Complex 2i
//     math.matrix([1, 2])            // Matrix, [1, 2]
//     math.parse('2x').toString()    // '2 x'
//     math.boolean('yes')            // throws Error
//
// That is: an optional "returns", an optional type keyword (here also
// accepted with a trailing comma), then the value, with strings in quotes.
// A comment that does not parse as a value, like "// retrieve subset", is
// prose and is not checked. For a console.log line the logged value is
// checked. Code lines are collected until the next result comment, and the
// variables they define stay available to the rest of the page, while each
// block starts from the default configuration. Examples that cannot run here
// are listed in skipExamples with the reason.
import assert from 'node:assert'
import fs from 'node:fs'
import path from 'node:path'
import { format } from 'node:util'
import { fileURLToPath } from 'node:url'
import * as mathjs from '../../lib/esm/index.js'
import * as mathjsNumber from '../../lib/esm/number.js'
import { extractExpectation, checkExpectation } from './docExpectations.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const docsDir = path.resolve(__dirname, '../../docs')
const modules = { mathjs, 'mathjs/number': mathjsNumber }

// Pages or examples that cannot run here, with the reason
const skipPages = {
  'reference/functions': 'generated from the JSDoc comments, see doc.test.js'
}
const skipExamples = {
  'core/extension.md: math.fibonacci(7)': 'needs the numbers package',
  "core/extension.md: math.evaluate('fibonacci(7)')": 'needs the numbers package',
  "datatypes/units.md: const incorrect = math.unit('8.314 m^3 Pa / mol K')":
    'the units parsed from the comment come out in another order'
}

function listPages (dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory()) return listPages(file)
    return entry.name.endsWith('.md') ? [file] : []
  })
}

// Return the ```js blocks of a markdown page as arrays of { line, number }
function codeBlocks (text) {
  const blocks = []
  let block = null
  text.split('\n').forEach((line, index) => {
    const fence = line.match(/^(\s*)```\s*(\S*)\s*$/)
    if (fence && !block) {
      block = { lang: fence[2], indent: fence[1].length, lines: [] }
    } else if (fence) {
      if (block.lang === 'js' || block.lang === 'javascript') blocks.push(block.lines)
      block = null
    } else if (block) {
      block.lines.push({ line: line.slice(block.indent), number: index + 1 })
    }
  })
  return blocks
}

// Split a line into code and a trailing comment, ignoring // inside strings
function splitComment (line) {
  const match = line.match(/^((?:[^'"`/]|'[^']*'|"[^"]*"|`[^`]*`|\/(?!\/))*)\/\/(.*)$/)
  return match ? [match[1], match[2].trim()] : [line, null]
}

// Turn import statements and top level declarations into code that can run
// as a script and keeps its variables for the following examples
function toScript (code) {
  return code
    .replace(/^import\s+\*\s+as\s+(\w+)\s+from\s+'([^']+)'/gm, "var $1 = __import('$2')")
    .replace(/^import\s+(\{[^}]*\})\s+from\s+'([^']+)'/gm,
      (all, names, from) => `var ${names.replace(/\s+as\s+/g, ': ')} = __import('${from}')`)
    .replace(/^(const|let)\s/gm, 'var ')
    .replace(/^(?=[A-Za-z_$][\w$]*\s*=[^=])/gm, 'var ') // no implicit globals
}

function isComplete (code) {
  try {
    new Function(toScript(code)) // eslint-disable-line no-new, no-new-func
    return true
  } catch (err) {
    return !(err instanceof SyntaxError)
  }
}

// Return the value stated by a result comment, or undefined when the comment
// is prose rather than a value
function expectedValue (math, comment) {
  const spec = comment
    .replace(/^(\w+),\s*/, '$1 ')
    .replace(/^Number\b/, 'number')
    .replace(/^String\b/, 'string')
    .replace(/^BigNumber (.+)$/, "BigNumber '$1'") // keep all digits
    .replace(/^\{.*\}$/, '($&)') // an object, not a block
  if (/^[A-Za-z]\w*$/.test(spec) && !/^(true|false|null|NaN|Infinity)$/.test(spec)) {
    return undefined // a type name or a word, not a value
  }
  let value
  try {
    value = extractExpectation(math, spec)
  } catch (err) {
    return undefined
  }
  // extractExpectation falls back to the comment text when it does not
  // evaluate; only a quoted string or "throws ..." states a string
  const stated = spec.replace(/^(returns|outputs:?)\s+/, '').replace(/^string\s+/, '')
  if (typeof value === 'string' && !/^(['"`]|throws\b)/.test(stated)) {
    return undefined
  }
  return value
}

// Create the scope a page runs in: a generator that evaluates the code it is
// sent, so the variables declared by one example stay available to the next
// ones without becoming globals
function createScope (names) {
  // eslint-disable-next-line no-new-func
  const scope = new Function(...Object.keys(names), `return (function * () {
    function typed () { return math.typed.apply(math, arguments) }
    let __result
    while (true) {
      const __code = yield __result
      try { __result = { value: eval(__code) } } catch (error) { __result = { error } }
    }
  })()`)(...Object.values(names))
  scope.next()
  return code => {
    const { value, error } = scope.next(code).value
    if (error) throw error
    return value
  }
}

function runPage (file) {
  const math = mathjs.create(mathjs.all)
  const defaultConfig = math.config()
  const page = path.relative(docsDir, file).split(path.sep).join('/')
  const failures = []
  const logged = []
  const evaluate = createScope({
    math,
    create: mathjs.create,
    all: mathjs.all,
    require: name => modules[name],
    __import: name => {
      if (!(name in modules)) throw new Error(`Cannot import '${name}' in docs-examples.test.js`)
      return modules[name]
    },
    console: {
      log: (...args) => logged.push(args.length === 1 ? args[0] : format(...args)),
      warn: () => {} // like the deprecation warning of legacySubset
    }
  })

  function run (code) {
    logged.length = 0
    const script = toScript(code)
    const result = evaluate(script)
    const declared = script.match(/(?:^|\n)var\s+(\w+)\s*=[^\n]*\n$/)
    if (code.includes('console.log(')) return logged[logged.length - 1]
    return declared ? evaluate(declared[1]) : result
  }

  // code without a result comment is setup for the next examples; when it
  // fails (some blocks show signatures, not code) those examples fail instead
  function runUnchecked (code) {
    try {
      run(code)
    } catch (err) {}
  }

  for (const block of codeBlocks(fs.readFileSync(file, 'utf8'))) {
    math.config(defaultConfig) // undo config changes of earlier blocks
    let code = ''
    for (const { line, number } of block) {
      const [lineCode, comment] = splitComment(line)
      if (lineCode.trim() !== '') code += lineCode + '\n'
      if (comment === null || !isComplete(code)) continue
      if (lineCode.trim() === '') {
        if (/^\s/.test(line)) continue // comment inside a function body
        if (code) runUnchecked(code) // comment introducing the next example
        code = ''
        continue
      }
      const snippet = lineCode.trim()
      // a page can replace math, possibly with the number only build
      const pageMath = evaluate('math').Unit ? evaluate('math') : math
      const expected = expectedValue(pageMath, comment)
      let actual
      try {
        actual = run(code)
      } catch (err) {
        actual = err.toString()
      }
      code = ''
      if (expected === undefined || `${page}: ${snippet}` in skipExamples) continue
      try {
        checkExpectation(pageMath, expected, actual)
      } catch (err) {
        failures.push(`docs/${page}:${number}: ${snippet}  // ${comment}\n    got: ${mathjs.format(actual)}`)
      }
    }
    if (code) runUnchecked(code)
  }
  return failures
}

describe('Testing examples from the docs/ pages', function () {
  for (const file of listPages(docsDir)) {
    const page = path.relative(docsDir, file).split(path.sep).join('/')
    if (Object.keys(skipPages).some(skip => page.startsWith(skip))) continue

    it('satisfies ' + page, function () {
      assert.deepStrictEqual(runPage(file), [])
    })
  }
})
