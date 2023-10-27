import './style.css'
import 'github-markdown-css/github-markdown.css'

import Alpine from 'alpinejs'

import 'katex/dist/katex.min.css'
import katex from 'katex'

import { EditorState } from "@codemirror/state"
import { EditorView, basicSetup } from "codemirror"
import { create, all } from 'mathjs'

const results = document.querySelector("#result")
const math = create(all)
const digits = 14
let parser = math.parser()

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
        const text = update.state.doc.toString()
        results.innerHTML = calc(text)
      }
    })
  ],
})

let editor = new EditorView({
  state: startState,
  parent: document.querySelector('#editor')
})

function calc(text) {
  const expressions = splitByParse(text)
  let results = ""
  let listOfIDText = []

  expressions.forEach(expression => {
    let result
    try {
      result = parser.evaluate(expression.text)
    } catch (error) {
      result = error.toString()
    }
    const idText = `F${expression.from}T${expression.to}`
    let currentID = idText
    listOfIDText.push({ from: expression.from, to: expression.to })
    if (result !== undefined) {
      const resultText = formatResults(result)
      if (result.entries && result.entries.length > 0) {
        results += `<li id='${idText}'>${resultText}</li>`
      } else if (result.entries === undefined) {
        results += `<li id='${idText}'>${resultText}</li>`
      }
    }
  })
  return `<ul>${results}</ul>`
}

function splitByParse(str) {
  const lines = str.split('\n');
  let nextLineToParse = 0;
  const result = [];

  for (let lineID = 0; lineID < lines.length; lineID++) {
    const linesToTest = lines.slice(nextLineToParse, lineID + 1).join('\n');
    if (canBeParsed(linesToTest)) {
      if (!isEmptyString(linesToTest)) {
        result.push({ from: nextLineToParse, to: lineID, text: linesToTest });
      }
      nextLineToParse = lineID + 1;
    }
  }
  const linesToTest = lines.slice(nextLineToParse).join('\n');
  if (!isEmptyString(linesToTest)) {
    result.push({ from: nextLineToParse, to: lines.length - 1, text: linesToTest });
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

function formatResults(result) {
  if (typeof result === "object" && result.isResultSet) {
      return result.entries.map(r => formatResult(r)).join('')
  }
  else {
      return formatResult(result)
  }
}

const formatResult = math.typed({
  'number': x => math.format(x, { precision: digits }),
  'undefined': () => '',
  'string': x => `<code>${x}</code>`,
  'any': math.typed.referTo(
    'number',
    fnumber => x => katex.renderToString(math.parse(fnumber(x)).toTex())
    )}
)

window.Alpine = Alpine

Alpine.start()