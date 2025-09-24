/**
 * Create mathjs syntax highlighting for CodeMirror
 *
 * TODO: this is using CodeMirror v5 functionality, upgrade this to v6
 *
 * @param {Object} math A mathjs instance
 */
export function mathjsLang(math) {
  function wordRegexp(words) {
    return new RegExp('^((' + words.join(')|(') + '))\\b')
  }

  const singleOperators = new RegExp("^[-+*/&|^~<>!%']")
  const singleDelimiters = new RegExp('^[([{},:=;.?]')
  const doubleOperators = new RegExp('^((==)|(!=)|(<=)|(>=)|(<<)|(>>)|(\\.[-+*/^]))')
  const doubleDelimiters = new RegExp('^((!=)|(^\\|))')
  const tripleDelimiters = new RegExp('^((>>>)|(<<<))')
  const expressionEnd = new RegExp('^[\\])]')
  const identifiers = new RegExp('^[_A-Za-z\xa1-\uffff][_A-Za-z0-9\xa1-\uffff]*')

  const mathFunctions = []
  const mathPhysicalConstants = []
  const mathIgnore = ['expr', 'type']
  const numberLiterals = [
    'e',
    'E',
    'i',
    'Infinity',
    'LN2',
    'LN10',
    'LOG2E',
    'LOG10E',
    'NaN',
    'null',
    'phi',
    'pi',
    'PI',
    'SQRT1_2',
    'SQRT2',
    'tau',
    'undefined',
    'version'
  ]

  // based on https://github.com/josdejong/mathjs/blob/develop/bin/cli.js
  for (const expr in math.expression.mathWithTransform) {
    if (!mathIgnore.includes(expr)) {
      if (typeof math[expr] === 'function') {
        mathFunctions.push(expr)
      } else if (!numberLiterals.includes(expr)) {
        mathPhysicalConstants.push(expr)
      }
    }
  }

  // generates a list of all valid units in mathjs
  const listOfUnits = []
  for (const unit in math.Unit.UNITS) {
    for (const prefix in math.Unit.UNITS[unit].prefixes) {
      listOfUnits.push(prefix + unit)
    }
  }

  const builtins = wordRegexp(mathFunctions)

  const keywords = wordRegexp(['to', 'in', 'and', 'not', 'or', 'xor', 'mod'])

  const units = wordRegexp(Array.from(new Set(listOfUnits)))
  const physicalConstants = wordRegexp(mathPhysicalConstants)

  // tokenizers
  function tokenTranspose(stream, state) {
    if (!stream.sol() && stream.peek() === "'") {
      stream.next()
      state.tokenize = tokenBase
      return 'operator'
    }
    state.tokenize = tokenBase
    return tokenBase(stream, state)
  }

  function tokenComment(stream, state) {
    if (stream.match(/^.*#}/)) {
      state.tokenize = tokenBase
      return 'comment'
    }
    stream.skipToEnd()
    return 'comment'
  }

  function tokenBase(stream, state) {
    // whitespaces
    if (stream.eatSpace()) return null

    // Handle one line Comments
    if (stream.match('#{')) {
      state.tokenize = tokenComment
      stream.skipToEnd()
      return 'comment'
    }

    if (stream.match(/^#/)) {
      stream.skipToEnd()
      return 'comment'
    }

    // Handle Number Literals
    if (stream.match(/^[0-9.+-]/, false)) {
      if (stream.match(/^[+-]?0x[0-9a-fA-F]+[ij]?/)) {
        stream.tokenize = tokenBase
        return 'number'
      }
      if (stream.match(/^[+-]?\d*\.\d+([EeDd][+-]?\d+)?[ij]?/)) {
        return 'number'
      }
      if (stream.match(/^[+-]?\d+([EeDd][+-]?\d+)?[ij]?/)) {
        return 'number'
      }
    }
    if (stream.match(wordRegexp(numberLiterals))) {
      return 'number'
    }

    // Handle Strings
    let m = stream.match(/^"(?:[^"]|"")*("|$)/) || stream.match(/^'(?:[^']|'')*('|$)/)
    if (m) {
      return m[1] ? 'string' : 'string error'
    }

    // Handle words
    if (stream.match(keywords)) {
      return 'keyword'
    }
    if (stream.match(builtins)) {
      return 'builtin'
    }
    if (stream.match(physicalConstants)) {
      return 'tag'
    }
    if (stream.match(units)) {
      return 'attribute'
    }
    if (stream.match(identifiers)) {
      return 'variable'
    }
    if (stream.match(singleOperators) || stream.match(doubleOperators)) {
      return 'operator'
    }
    if (
      stream.match(singleDelimiters) ||
      stream.match(doubleDelimiters) ||
      stream.match(tripleDelimiters)
    ) {
      return null
    }
    if (stream.match(expressionEnd)) {
      state.tokenize = tokenTranspose
      return null
    }
    // Handle non-detected items
    stream.next()
    return 'error'
  }

  return {
    name: 'mathjs',

    startState: function () {
      return {
        tokenize: tokenBase
      }
    },

    token: function (stream, state) {
      const style = state.tokenize(stream, state)
      if (style === 'number' || style === 'variable') {
        state.tokenize = tokenTranspose
      }
      return style
    },

    languageData: {
      commentTokens: { line: '#' },
      autocomplete: myCompletions
    }
  }

  function myCompletions(context) {
    let word = context.matchBefore(/\w*/)
    if (word.from == word.to && !context.explicit) return null
    let options = []
    mathFunctions.forEach((func) => options.push({ label: func, type: 'function' }))

    mathPhysicalConstants.forEach((constant) => options.push({ label: constant, type: 'constant' }))

    numberLiterals.forEach((number) => options.push({ label: number, type: 'variable' }))

    // units as enum
    for (const name in math.Unit.UNITS) {
      if (hasOwnPropertySafe(math.Unit.UNITS, name)) {
        if (name.startsWith(word.text)) {
          options.push({ label: name, type: 'enum' })
        }
      }
    }
    for (const name in math.Unit.PREFIXES) {
      if (hasOwnPropertySafe(math.Unit.PREFIXES, name)) {
        const prefixes = math.Unit.PREFIXES[name]
        for (const prefix in prefixes) {
          if (hasOwnPropertySafe(prefixes, prefix)) {
            if (prefix.startsWith(word.text)) {
              options.push({ label: prefix, type: 'enum' })
            } else if (word.text.startsWith(prefix)) {
              const unitKeyword = word.text.substring(prefix.length)
              for (const n in math.Unit.UNITS) {
                const fullUnit = prefix + n
                if (hasOwnPropertySafe(math.Unit.UNITS, n)) {
                  if (
                    !options.includes(fullUnit) &&
                    n.startsWith(unitKeyword) &&
                    math.Unit.isValuelessUnit(fullUnit)
                  ) {
                    options.push({ label: fullUnit, type: 'enum' })
                  }
                }
              }
            }
          }
        }
      }
    }

    return {
      from: word.from,
      options
    }
  }
}

// helper function to safely check whether an object has a property
// copy from the function in object.js which is ES6
function hasOwnPropertySafe(object, property) {
  return object && Object.hasOwnProperty.call(object, property)
}