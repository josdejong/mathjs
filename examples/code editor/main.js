import './style.css'
import 'github-markdown-css/github-markdown.css'

import Alpine from 'alpinejs'

import 'katex/dist/katex.min.css'
import katex from 'katex'

import { EditorState } from "@codemirror/state"
import { EditorView, basicSetup } from "codemirror"
import { create, all } from 'mathjs'

const math = create(all)
const digits = 14
let parser = math.parser()

let expressions

const doc = [
  "round(e, 3)",
  "atan2(3, -3) / pi",
  "log(10000, 10)",
  "sqrt(-4)",
  "derivative('x^2 + x', 'x')",
  "pow([[-1, 2], [3, 1]], 2)",
  "# expressions",
  "1.2 * (2 + 4.5)",
  "12.7 cm to inch",
  "sin(45 deg) ^ 2",
  "9 / 3 + 2i",
  "det([-1, 2; 3, 1])"
].join('\n')

let startState = EditorState.create({
  doc,
  extensions: [
    basicSetup,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        expressions = getExpressions(update.state.doc.toString())
      }
    })
  ],
})

let editor = new EditorView({
  state: startState,
  parent: document.querySelector('#editor')
})

function calc(expression) {
  let result
  try {
    result = parser.evaluate(expression)
  } catch (error) {
    result = error.toString()
  }
  return result
}

function getExpressions(str) {
  const lines = str.split('\n');
  let nextLineToParse = 0;
  const result = [];

  for (let lineID = 0; lineID < lines.length; lineID++) {
    const linesToTest = lines.slice(nextLineToParse, lineID + 1).join('\n');
    if (canBeParsed(linesToTest)) {
      if (!isEmptyString(linesToTest)) {
        result.push({ from: nextLineToParse, to: lineID, source: linesToTest });
      }
      nextLineToParse = lineID + 1;
    }
  }
  const linesToTest = lines.slice(nextLineToParse).join('\n');
  if (!isEmptyString(linesToTest)) {
    result.push({ from: nextLineToParse, to: lines.length - 1, source: linesToTest });
  }
  return result;
}

function canBeParsed(expression) {
  try {
    math.parse(expression)
    return true
  } catch (error) {
    return false
  }
}

function isEmptyString(str) {
  return str.trim() === ""
}

const formatResult = math.typed({
  'number': x => math.format(x, { precision: digits }),
  'undefined': () => '',
  'string': x => `<code>${x}</code>`,
  'any': math.typed.referTo(
    'number',
    fnumber => x => katex.renderToString(math.parse(fnumber(x)).toTex())
  )
}
)

function processExpressions(expressions) {
  parser.clear()
  return expressions.map(expression => {
    const result = calc(expression.source)
    const outputs = formatResult(result)
    const visible = result === undefined ? false : result.isResultSet ? false : true
    return ({
      ...expression,
      outputs,
      visible
    })
  })
}

window.Alpine = Alpine

Alpine.data(
  'app',
  () => ({
    expressions: processExpressions(getExpressions(editor.state.doc.toString())),
    get calcExpressions() {
      this.expressions = processExpressions(getExpressions(editor.state.doc.toString()))
    }
  })
)

Alpine.start()