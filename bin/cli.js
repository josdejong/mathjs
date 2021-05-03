#!/usr/bin/env node
/**
 * math.js
 * https://github.com/josdejong/mathjs
 *
 * Math.js is an extensive math library for JavaScript and Node.js,
 * It features real and complex numbers, units, matrices, a large set of
 * mathematical functions, and a flexible expression parser.
 *
 * Usage:
 *
 *     mathjs [scriptfile(s)] {OPTIONS}
 *
 * Options:
 *
 *     --version, -v       Show application version
 *     --help,    -h       Show this message
 *     --tex               Generate LaTeX instead of evaluating
 *     --string            Generate string instead of evaluating
 *     --parenthesis=      Set the parenthesis option to
 *                         either of "keep", "auto" and "all"
 *
 * Example usage:
 *     mathjs                                 Open a command prompt
 *     mathjs 1+2                             Evaluate expression
 *     mathjs script.txt                      Run a script file
 *     mathjs script1.txt script2.txt         Run two script files
 *     mathjs script.txt > results.txt        Run a script file, output to file
 *     cat script.txt | mathjs                Run input stream
 *     cat script.txt | mathjs > results.txt  Run input stream, output to file
 *
 * @license
 * Copyright (C) 2013-2021 Jos de Jong <wjosdejong@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy
 * of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

const fs = require('fs')
const path = require('path')
const { createEmptyMap } = require('../lib/cjs/utils/map.js')
let scope = createEmptyMap()

const PRECISION = 14 // decimals

/**
 * "Lazy" load math.js: only require when we actually start using it.
 * This ensures the cli application looks like it loads instantly.
 * When requesting help or version number, math.js isn't even loaded.
 * @return {*}
 */
function getMath () {
  return require('../lib/cjs/defaultInstance.js').default
}

/**
 * Helper function to format a value. Regular numbers will be rounded
 * to 14 digits to prevent round-off errors from showing up.
 * @param {*} value
 */
function format (value) {
  const math = getMath()

  return math.format(value, {
    fn: function (value) {
      if (typeof value === 'number') {
        // round numbers
        return math.format(value, PRECISION)
      } else {
        return math.format(value)
      }
    }
  })
}

/**
 * auto complete a text
 * @param {String} text
 * @return {[Array, String]} completions
 */
function completer (text) {
  const math = getMath()
  let matches = []
  let keyword
  const m = /[a-zA-Z_0-9]+$/.exec(text)
  if (m) {
    keyword = m[0]

    // scope variables
    for (const def in scope.keys()) {
      if (def.indexOf(keyword) === 0) {
        matches.push(def)
      }
    }

    // commandline keywords
    ['exit', 'quit', 'clear'].forEach(function (cmd) {
      if (cmd.indexOf(keyword) === 0) {
        matches.push(cmd)
      }
    })

    // math functions and constants
    const ignore = ['expr', 'type']
    for (const func in math.expression.mathWithTransform) {
      if (hasOwnProperty(math.expression.mathWithTransform, func)) {
        if (func.indexOf(keyword) === 0 && ignore.indexOf(func) === -1) {
          matches.push(func)
        }
      }
    }

    // units
    const Unit = math.Unit
    for (const name in Unit.UNITS) {
      if (hasOwnProperty(Unit.UNITS, name)) {
        if (name.indexOf(keyword) === 0) {
          matches.push(name)
        }
      }
    }
    for (const name in Unit.PREFIXES) {
      if (hasOwnProperty(Unit.PREFIXES, name)) {
        const prefixes = Unit.PREFIXES[name]
        for (const prefix in prefixes) {
          if (hasOwnProperty(prefixes, prefix)) {
            if (prefix.indexOf(keyword) === 0) {
              matches.push(prefix)
            } else if (keyword.indexOf(prefix) === 0) {
              const unitKeyword = keyword.substring(prefix.length)
              for (const n in Unit.UNITS) {
                if (hasOwnProperty(Unit.UNITS, n)) {
                  if (n.indexOf(unitKeyword) === 0 &&
                      Unit.isValuelessUnit(prefix + n)) {
                    matches.push(prefix + n)
                  }
                }
              }
            }
          }
        }
      }
    }

    // remove duplicates
    matches = matches.filter(function (elem, pos, arr) {
      return arr.indexOf(elem) === pos
    })
  }

  return [matches, keyword]
}

/**
 * Run stream, read and evaluate input and stream that to output.
 * Text lines read from the input are evaluated, and the results are send to
 * the output.
 * @param input   Input stream
 * @param output  Output stream
 * @param mode    Output mode
 * @param parenthesis Parenthesis option
 */
function runStream (input, output, mode, parenthesis) {
  const readline = require('readline')
  const rl = readline.createInterface({
    input: input || process.stdin,
    output: output || process.stdout,
    completer: completer
  })

  if (rl.output.isTTY) {
    rl.setPrompt('> ')
    rl.prompt()
  }

  // load math.js now, right *after* loading the prompt.
  const math = getMath()

  // TODO: automatic insertion of 'ans' before operators like +, -, *, /

  rl.on('line', function (line) {
    const expr = line.trim()

    switch (expr.toLowerCase()) {
      case 'quit':
      case 'exit':
        // exit application
        rl.close()
        break
      case 'clear':
        // clear memory
        scope = createEmptyMap()
        console.log('memory cleared')

        // get next input
        if (rl.output.isTTY) {
          rl.prompt()
        }
        break
      default:
        if (!expr) {
          break
        }
        switch (mode) {
          case 'evaluate':
            // evaluate expression
            try {
              let node = math.parse(expr)
              let res = node.evaluate(scope)

              if (math.isResultSet(res)) {
                // we can have 0 or 1 results in the ResultSet, as the CLI
                // does not allow multiple expressions separated by a return
                res = res.entries[0]
                node = node.blocks
                  .filter(function (entry) { return entry.visible })
                  .map(function (entry) { return entry.node })[0]
              }

              if (node) {
                if (math.isAssignmentNode(node)) {
                  const name = findSymbolName(node)
                  if (name !== null) {
                    const value = scope.get(name)
                    scope.set('ans', value)
                    console.log(name + ' = ' + format(value))
                  } else {
                    scope.set('ans', res)
                    console.log(format(res))
                  }
                } else if (math.isHelp(res)) {
                  console.log(res.toString())
                } else {
                  scope.set('ans', res)
                  console.log(format(res))
                }
              }
            } catch (err) {
              console.log(err.toString())
            }
            break

          case 'string':
            try {
              const string = math.parse(expr).toString({ parenthesis: parenthesis })
              console.log(string)
            } catch (err) {
              console.log(err.toString())
            }
            break

          case 'tex':
            try {
              const tex = math.parse(expr).toTex({ parenthesis: parenthesis })
              console.log(tex)
            } catch (err) {
              console.log(err.toString())
            }
            break
        }
    }

    // get next input
    if (rl.output.isTTY) {
      rl.prompt()
    }
  })

  rl.on('close', function () {
    console.log()
    process.exit(0)
  })
}

/**
 * Find the symbol name of an AssignmentNode. Recurses into the chain of
 * objects to the root object.
 * @param {AssignmentNode} node
 * @return {string | null} Returns the name when found, else returns null.
 */
function findSymbolName (node) {
  const math = getMath()
  let n = node

  while (n) {
    if (math.isSymbolNode(n)) {
      return n.name
    }
    n = n.object
  }

  return null
}

/**
 * Output application version number.
 * Version number is read version from package.json.
 */
function outputVersion () {
  fs.readFile(path.join(__dirname, '/../package.json'), function (err, data) {
    if (err) {
      console.log(err.toString())
    } else {
      const pkg = JSON.parse(data)
      const version = pkg && pkg.version ? pkg.version : 'unknown'
      console.log(version)
    }
    process.exit(0)
  })
}

/**
 * Output a help message
 */
function outputHelp () {
  console.log('math.js')
  console.log('https://mathjs.org')
  console.log()
  console.log('Math.js is an extensive math library for JavaScript and Node.js. It features ')
  console.log('real and complex numbers, units, matrices, a large set of mathematical')
  console.log('functions, and a flexible expression parser.')
  console.log()
  console.log('Usage:')
  console.log('    mathjs [scriptfile(s)|expression] {OPTIONS}')
  console.log()
  console.log('Options:')
  console.log('    --version, -v       Show application version')
  console.log('    --help,    -h       Show this message')
  console.log('    --tex               Generate LaTeX instead of evaluating')
  console.log('    --string            Generate string instead of evaluating')
  console.log('    --parenthesis=      Set the parenthesis option to')
  console.log('                        either of "keep", "auto" and "all"')
  console.log()
  console.log('Example usage:')
  console.log('    mathjs                                Open a command prompt')
  console.log('    mathjs 1+2                            Evaluate expression')
  console.log('    mathjs script.txt                     Run a script file')
  console.log('    mathjs script.txt script2.txt         Run two script files')
  console.log('    mathjs script.txt > results.txt       Run a script file, output to file')
  console.log('    cat script.txt | mathjs               Run input stream')
  console.log('    cat script.txt | mathjs > results.txt Run input stream, output to file')
  console.log()
  process.exit(0)
}

/**
 * Process input and output, based on the command line arguments
 */
const scripts = [] // queue of scripts that need to be processed
let mode = 'evaluate' // one of 'evaluate', 'tex' or 'string'
let parenthesis = 'keep'
let version = false
let help = false

process.argv.forEach(function (arg, index) {
  if (index < 2) {
    return
  }

  switch (arg) {
    case '-v':
    case '--version':
      version = true
      break

    case '-h':
    case '--help':
      help = true
      break

    case '--tex':
      mode = 'tex'
      break

    case '--string':
      mode = 'string'
      break

    case '--parenthesis=keep':
      parenthesis = 'keep'
      break

    case '--parenthesis=auto':
      parenthesis = 'auto'
      break

    case '--parenthesis=all':
      parenthesis = 'all'
      break

      // TODO: implement configuration via command line arguments

    default:
      scripts.push(arg)
  }
})

if (version) {
  outputVersion()
} else if (help) {
  outputHelp()
} else if (scripts.length === 0) {
  // run a stream, can be user input or pipe input
  runStream(process.stdin, process.stdout, mode, parenthesis)
} else {
  fs.stat(scripts[0], function (e, f) {
    if (e) {
      console.log(getMath().evaluate(scripts.join(' ')).toString())
    } else {
    // work through the queue of scripts
      scripts.forEach(function (arg) {
        // run a script file
        runStream(fs.createReadStream(arg), process.stdout, mode, parenthesis)
      })
    }
  })
}

// helper function to safely check whether an object as a property
// copy from the function in object.js which is ES6
function hasOwnProperty (object, property) {
  return object && Object.hasOwnProperty.call(object, property)
}
