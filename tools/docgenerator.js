/**
 * This is a little tool to generate reference documentation of all math.js
 * functions under ./lib/functions. This is NO generic solution.
 *
 * The tool can parse documentation information from the block comment in the
 * functions code, and generate a markdown file with the documentation.
 */
import fs from 'node:fs'
import { glob } from 'glob'
import { mkdirp } from 'mkdirp'
import { deleteSync } from 'del'
import log from 'fancy-log'

// special cases for function syntax
const SYNTAX = {
  cbrt: 'math.cbrt(x [, allRoots])',
  createUnit: 'math.createUnit(units)',
  gcd: 'math.gcd(a, b)',
  log: 'math.log(x [, base])',
  lcm: 'math.lcm(a, b)',
  norm: 'math.norm(x [, p])',
  round: 'math.round(x [, n])',
  complex: 'math.complex(re, im)',
  matrix: 'math.matrix(x)',
  sparse: 'math.sparse(x)',
  unit: 'math.unit(x)',
  evaluate: 'math.evaluate(expr [, scope])',
  parse: 'math.parse(expr [, scope])',
  concat: 'math.concat(a, b, c, ... [, dim])',
  ones: 'math.ones(m, n, p, ...)',
  range: 'math.range(start, end [, step])',
  resize: 'math.resize(x, size [, defaultValue])',
  subset: 'math.subset(x, index [, replacement])',
  splitUnit: 'math.splitUnit(unit, parts)',
  zeros: 'math.zeros(m, n, p, ...)',
  permutations: 'math.permutations(n [, k])',
  random: 'math.random([min, max])',
  randomInt: 'math.randomInt([min, max])',
  format: 'math.format(value [, precision])',
  import: 'math.import(object, override)',
  print: 'math.print(template, values [, precision])'
}

const IGNORE_FUNCTIONS = {
  addScalar: true,
  subtractScalar: true,
  divideScalar: true,
  multiplyScalar: true,
  equalScalar: true,
  eval: true
}

const IGNORE_WARNINGS = {
  seeAlso: ['help', 'intersect', 'clone', 'typeOf', 'chain', 'import', 'config', 'typed',
    'distance', 'kldivergence', 'erf'],
  parameters: ['parser'],
  returns: ['forEach', 'import']
}

/**
 * Extract JSON documentation from the comments in a file with JavaScript code
 * @param {String} name    Function name
 * @param {String} code    javascript code containing a block comment
 *                         describing a math.js function
 * @return {Object} doc    json document
 */
export function generateDoc (name, code) {
  // get block comment from code
  const commentRegex = /\/\*\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*+\//g
  // const match = commentRegex.exec(code)

  const comments = findAll(code, commentRegex).map(match => getCommentContents(match[0]))

  // Find the right comment.
  // First search a comment containing the text "Syntax:" and "Examples:".
  // If not found, select the first comment
  const comment = comments.find(comment => {
    return /\n *syntax: *\n/i.exec(comment) && /\n *examples: *\n/i.exec(comment)
  }) || comments[0]

  if (!comment) {
    return null
  }

  // get text content inside block comment
  function getCommentContents (comment) {
    return comment.replace('/**', '')
      .replace('*/', '')
      .replace(/\n\s*\* ?/g, '\n')
      .replace(/\r/g, '')
  }

  const lines = comment.split('\n')
  let line = ''

  // get next line
  function next () {
    line = lines.shift()
  }

  // returns true if current line is empty
  function empty () {
    return !line || !line.trim()
  }

  // returns true if there still is a current line
  function exists () {
    return line !== undefined
  }

  // returns true if current line is a header like 'Syntax:'
  function isHeader () {
    return /^(Name|Syntax|Description|Examples|See also)/i.test(line)
  }

  // returns true if the current line starts with an annotation like @param
  function isAnnotation () {
    return /^@/.test(line)
  }

  function skipEmptyLines () {
    while (exists() && empty()) next()
  }

  function stripLeadingSpaces (lines) {
    let spaces = null
    lines.forEach(function (line) {
      const match = /^ +/.exec(line)
      const s = match && match[0] && match[0].length
      if (s > 0 && (spaces === null || s < spaces)) {
        spaces = s
      }
    })

    if (spaces) {
      lines.forEach(function (line, index) {
        lines[index] = line.substring(spaces)
      })
    }
  }

  function parseDescription () {
    let description = ''

    while (exists() && !isHeader() && !isAnnotation()) {
      description += line + '\n'

      next()
    }

    // remove trailing returns
    while (description.charAt(description.length - 1) === '\n') {
      description = description.substring(0, description.length - 1)
    }

    doc.description = description
  }

  function parseSyntax () {
    if (/^syntax/i.test(line)) {
      next()
      skipEmptyLines()

      while (exists() && !empty()) {
        doc.syntax.push(line)
        next()
      }
      stripLeadingSpaces(doc.syntax)

      skipEmptyLines()

      return true
    }
    return false
  }

  function parseWhere () {
    if (/^where/i.test(line)) {
      next()
      skipEmptyLines()

      while (exists() && !empty()) {
        doc.where.push(line)
        next()
      }

      skipEmptyLines()

      return true
    }
    return false
  }

  function parseExamples () {
    if (/^example/i.test(line)) {
      next()
      skipEmptyLines()

      while (exists() && (empty() || line.charAt(0) === ' ')) {
        doc.examples.push(line)
        next()
      }
      stripLeadingSpaces(doc.examples)

      if (doc.examples.length > 0 && doc.examples[doc.examples.length - 1].trim() === '') {
        doc.examples.pop()
      }

      skipEmptyLines()

      return true
    }
    return false
  }

  function parseSeeAlso () {
    if (/^see also/i.test(line)) {
      next()
      skipEmptyLines()

      while (exists() && !empty()) {
        const names = line.split(',')
        doc.seeAlso = doc.seeAlso.concat(names.map(function (name) {
          return name.trim()
        }))
        next()
      }

      skipEmptyLines()

      return true
    }
    return false
  }

  function trim (text) {
    return text.trim()
  }

  // replace characters like '<' with HTML entities like '&lt;'
  function escapeTags (text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function parseParameters () {
    let count = 0
    let match
    do {
      match = /\s*@param\s*\{(.*)}\s*\[?(\w*)]?\s*(.*)?$/.exec(line)
      if (match) {
        next()

        count++
        const annotation = {
          name: match[2] || '',
          description: (match[3] || '').trim(),
          types: match[1].split('|').map(trim).map(escapeTags)
        }
        doc.parameters.push(annotation)

        // TODO: this is an ugly hack to extract the default value
        const index = annotation.description.indexOf(']')
        let defaultValue = null
        if (index !== -1) {
          defaultValue = annotation.description.substring(1, index).trim()
          annotation.description = annotation.description.substring(index + 1).trim()
        }

        // multi line description (must be non-empty and not start with @param or @return)
        while (exists() && !empty() && !/^\s*@/.test(line)) {
          const lineTrim = line.trim()
          const separator = (lineTrim[0] === '-' ? '</br>' : ' ')
          annotation.description += separator + lineTrim
          next()
        }

        if (defaultValue !== null) {
          annotation.description += ' Default value: ' + defaultValue + '.'
        }
      }
    } while (match)

    return count > 0
  }

  function parseThrows () {
    let count = 0
    let match
    do {
      match = /\s*@throws\s*\{(.*)}\s*(.*)?$/.exec(line)
      if (match) {
        next()

        count++
        const annotation = {
          description: (match[2] || '').trim(),
          type: (match[1] || '').trim()
        }
        doc.mayThrow.push(annotation)

        // multi line description (must be non-empty and not start with @param or @return)
        while (exists() && !empty() && !/^\s*@/.test(line)) {
          const lineTrim = line.trim()
          const separator = (lineTrim[0] === '-' ? '</br>' : ' ')
          annotation.description += separator + lineTrim
          next()
        }
      }
    } while (match)

    return count > 0
  }

  function parseReturns () {
    const match = /\s*@returns?\s*\{(.*)}\s*(.*)?$/.exec(line)
    if (match) {
      next()

      doc.returns = {
        description: match[2] || '',
        types: match[1].split('|').map(trim).map(escapeTags)
      }

      // multi line description
      while (exists() && !empty() && !/^\s*@/.test(line)) {
        doc.returns.description += ' ' + line.trim()
        next()
      }

      return true
    }
    return false
  }

  // initialize doc
  const doc = {
    name: name,
    description: '',
    syntax: [],
    where: [],
    examples: [],
    seeAlso: [],
    parameters: [],
    returns: null,
    mayThrow: []
  }

  next()
  skipEmptyLines()
  parseDescription()

  do {
    skipEmptyLines()

    const handled = parseSyntax() ||
        parseWhere() ||
        parseExamples() ||
        parseSeeAlso() ||
        parseParameters() ||
        parseReturns() ||
        parseThrows()

    if (!handled) {
      // skip this line, no one knows what to do with it
      next()
    }
  } while (exists())

  return doc
}

/**
 * Validate whether all required fields are available in given doc
 * @param {Object} doc
 * @return {String[]} issues
 */
export function validateDoc (doc) {
  const issues = []

  function ignore (field) {
    return IGNORE_WARNINGS[field].includes(doc.name)
  }

  if (!doc.name) {
    issues.push('name missing in document')
  }

  if (!doc.description) {
    issues.push('function "' + doc.name + '": description missing')
  }

  if (!doc.syntax || doc.syntax.length === 0) {
    issues.push('function "' + doc.name + '": syntax missing')
  }

  if (!doc.examples || doc.examples.length === 0) {
    issues.push('function "' + doc.name + '": examples missing')
  }

  if (doc.parameters && doc.parameters.length) {
    doc.parameters.forEach(function (param, index) {
      if (!param.name || !param.name.trim()) {
        issues.push('function "' + doc.name + '": name missing of parameter ' + index + '')
      }
      if (!param.description || !param.description.trim()) {
        issues.push('function "' + doc.name + '": description missing for parameter ' + (param.name || index))
      }
      if (!param.types || !param.types.length) {
        issues.push('function "' + doc.name + '": types missing for parameter ' + (param.name || index))
      }
    })
  } else {
    if (!ignore('parameters')) {
      issues.push('function "' + doc.name + '": parameters missing')
    }
  }

  if (doc.mayThrow && doc.mayThrow.length) {
    doc.mayThrow.forEach(function (err, index) {
      if (!err.type) {
        issues.push(
          'function "' + doc.name + '": error type missing for throw ' + index)
      }
    })
  }

  if (doc.returns) {
    if (!doc.returns.description || !doc.returns.description.trim()) {
      issues.push('function "' + doc.name + '": description missing of returns')
    }
    if (!doc.returns.types || !doc.returns.types.length) {
      issues.push('function "' + doc.name + '": types missing of returns')
    }
  } else {
    if (!ignore('returns')) {
      issues.push('function "' + doc.name + '": returns missing')
    }
  }

  if (!doc.seeAlso || doc.seeAlso.length === 0) {
    if (!ignore('seeAlso')) {
      issues.push('function "' + doc.name + '": seeAlso missing')
    }
  }

  return issues
}

/**
 * Generate markdown
 * @param {Object} doc          A JSON object generated with generateDoc()
 * @param {Object} functions    All functions, used to generate correct links
 *                              under seeAlso
 * @returns {string} markdown   Markdown contents
 */
export function generateMarkdown (doc, functions) {
  let text = ''

  // TODO: should escape HTML characters in text

  text += '<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->\n\n'

  text += '# Function ' + doc.name + '\n\n'

  text += doc.description + '\n\n\n'

  if (doc.syntax && doc.syntax.length) {
    text += '## Syntax\n\n' +
        '```js\n' +
        doc.syntax.join('\n') +
        '\n```\n\n'
  }

  if (doc.where && doc.where.length) {
    text += '### Where\n\n' + doc.where.join('\n') + '\n\n'
  }

  text += '### Parameters\n\n' +
      'Parameter | Type | Description\n' +
      '--------- | ---- | -----------\n' +
      doc.parameters.map(function (p) {
        return '`' + p.name + '` | ' +
            (p.types ? p.types.join(' &#124; ') : '') + ' | ' +
            p.description
      }).join('\n') +
      '\n\n'

  if (doc.returns) {
    text += '### Returns\n\n' +
        'Type | Description\n' +
        '---- | -----------\n' +
        (doc.returns.types ? doc.returns.types.join(' &#124; ') : '') + ' | ' + doc.returns.description +
        '\n\n\n'
  }

  if (doc.mayThrow) {
    text += '### Throws\n\n' +
      'Type | Description\n' +
      '---- | -----------\n' +
      doc.mayThrow.map(function (t) {
        return (t.type || '') + ' | ' + t.description
      }).join('\n') +
      '\n\n'
  }

  if (doc.examples && doc.examples.length) {
    text += '## Examples\n\n' +
        '```js\n' +
        doc.examples.join('\n') +
        '\n```\n\n\n'
  }

  if (doc.seeAlso && doc.seeAlso.length) {
    text += '## See also\n\n' +
        doc.seeAlso.map(function (name) {
          return '[' + name + '](' + name + '.md)'
        }).join(',\n') +
        '\n'
  }

  return text
}

/**
 * Delete all generated function docs (*.md)
 * @param {String} outputPath       Path to /docs/reference/functions
 * @param {String} outputRoot       Path to /docs/reference
 */
export function cleanup (outputPath, outputRoot) {
  // cleanup previous docs
  deleteSync([
    outputPath + '/*.md',
    outputRoot + '/functions.md'
  ])
}

/**
 * Iterate over all source files and produce an object with information on
 * all in-line documentation.
 * @param {String[]} functionNames  List with all functions exported from the main instance of mathjs
 * @param {String} inputPath        Path to location of source files
 * @returns {object} docinfo
 *     Object whose keys are function names, and whose values are objects with
 *     keys name, category, fullPath, doc, and issues
 *     giving the relevant information
 */
export function collectDocs (functionNames, inputPath) {
  function normalizeWindowsPath(path) {
    return path.replace(/\\/g, '/')
  }

  // glob doesn't work on Windows, which has \ separators instead of /
  const linuxInputPath = normalizeWindowsPath(inputPath + '**/*.js')
  const files = glob.sync(linuxInputPath).sort().map(normalizeWindowsPath)

  // generate path information for each of the files
  const functions = {} // TODO: change to array
  files.forEach(function (fullPath) {
    const path = fullPath.split('/')
    const name = path.pop().replace(/.js$/, '')
    const functionIndex = path.indexOf('function')
    let category

    // Note: determining whether a file is a function and what it's category
    // is a bit tricky and quite specific to the structure of the code,
    // we reckon with some edge cases here.
    if (!path.includes('docs') && functionIndex !== -1) {
      if (path.includes('expression')) {
        category = 'expression'
      } else if (/\/src\/type\/[a-zA-Z0-9_]*\/function/.test(fullPath)) {
        // for type/bignumber/function/bignumber.js, type/fraction/function/fraction.js, etc
        category = 'construction'
      } else if (/\/src\/core\/function/.test(fullPath)) {
        category = 'core'
      } else {
        category = path[functionIndex + 1]
      }
    } else if (fullPath.endsWith('/src/expression/parse.js')) {
      // TODO: this is an ugly special case
      category = 'expression'
    } else if (path.join('/').endsWith('/src/type')) {
      // for boolean.js, number.js, string.js
      category = 'construction'
    }

    if (!functionNames.includes(name) || IGNORE_FUNCTIONS[name]) {
      category = null
    }

    if (category) {
      functions[name] = {
        name,
        category,
        fullPath
      }
    } else {
      // TODO: throw a warning that no category could be found (instead of silently ignoring it).
      //  Right now, this matches too many functions, so to do that, we first must make the glob matching relevant
      //  files more specific, and we need to extend the list with functions we want to ignore.
    }
  })

  // loop over all files, generate a doc for each of them
  Object.keys(functions).forEach(name => {
    const fn = functions[name]
    const code = String(fs.readFileSync(fn.fullPath))

    const isFunction = (functionNames.includes(name)) && !IGNORE_FUNCTIONS[name]
    const doc = isFunction ? generateDoc(name, code) : null

    if (isFunction && doc) {
      fn.doc = doc
      fn.issues = validateDoc(doc)
    } else {
      // log('Ignoring', fn.fullPath)
      delete functions[name]
    }
  })
  return functions
}

/**
 * Iterate over all source files and generate markdown documents for each of them
 * @param {String[]} functionNames  List with all functions exported from the main instance of mathjs
 * @param {String} inputPath        Path to /lib/
 * @param {String} outputPath       Path to /docs/reference/functions
 * @param {String} outputRoot       Path to /docs/reference
 */
export function iteratePath (functionNames, inputPath, outputPath, outputRoot) {
  if (!fs.existsSync(outputPath)) {
    mkdirp.sync(outputPath)
  }
  const functions = collectDocs(functionNames, inputPath)
  let issues = []
  for (const fn of Object.values(functions)) {
    issues = issues.concat(fn.issues)
    const markdown = generateMarkdown(fn.doc, functions)
    fs.writeFileSync(outputPath + '/' + fn.name + '.md', markdown)
  }

  /**
   * Helper function to generate a markdown list entry for a function.
   * Used to generate both alphabetical and categorical index pages.
   * @param {string} name Function name
     * @returns {string}    Returns a markdown list entry
     */
  function functionEntry (name) {
    const fn = functions[name]
    let syntax = SYNTAX[name] || (fn.doc && fn.doc.syntax && fn.doc.syntax[0]) || name
    syntax = syntax
      // .replace(/^math\./, '')
      .replace(/\s+\/\/.*$/, '')
      .replace(/;$/, '')
    if (syntax.length < 40) {
      syntax = syntax.replace(/ /g, '&nbsp;')
    }

    let description = ''
    if (fn.doc.description) {
      description = fn.doc.description.replace(/\n/g, ' ').split('.')[0] + '.'
    }

    return '[' + syntax + '](functions/' + name + '.md) | ' + description
  }

  /**
   * Change the first letter of the given string to upper case
   * @param {string} text
   */
  function toCapital (text) {
    return text[0].toUpperCase() + text.slice(1)
  }

  const order = ['core', 'construction', 'expression'] // and then the rest
  function categoryIndex (entry) {
    const index = order.indexOf(entry)
    return index === -1 ? Infinity : index
  }
  function compareAsc (a, b) {
    return a > b ? 1 : (a < b ? -1 : 0)
  }
  function compareCategory (a, b) {
    const indexA = categoryIndex(a)
    const indexB = categoryIndex(b)
    return (indexA > indexB) ? 1 : (indexA < indexB ? -1 : compareAsc(a, b))
  }

  // generate categorical page with all functions
  const categories = {}
  Object.keys(functions).forEach(function (name) {
    const fn = functions[name]
    const category = categories[fn.category]
    if (!category) {
      categories[fn.category] = {}
    }
    categories[fn.category][name] = fn
  })
  let categorical = '# Function reference\n\n'
  categorical += Object.keys(categories).sort(compareCategory).map(function (category) {
    const functions = categories[category]

    return '## ' + toCapital(category) + ' functions\n\n' +
      'Function | Description\n' +
      '---- | -----------\n' +
      Object.keys(functions).sort().map(functionEntry).join('\n') + '\n'
  }).join('\n')
  categorical += '\n\n\n<!-- Note: This file is automatically generated from source code comments. Changes made in this file will be overridden. -->\n'

  fs.writeFileSync(outputRoot + '/' + 'functions.md', categorical)

  // output all issues
  if (issues.length) {
    issues.forEach(function (issue) {
      log('Warning: ' + issue)
    })
    log(issues.length + ' warnings')
  }
}

function findAll (text, regex) {
  const matches = []
  let match

  do {
    match = regex.exec(text)
    if (match) {
      matches.push(match)
    }
  } while (match)

  return matches
}
