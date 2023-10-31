import './style.css'
import 'github-markdown-css/github-markdown.css'

import Alpine from 'alpinejs'

import 'katex/dist/katex.min.css'
import katex from 'katex'

import { mathjsLang } from './mathjs-lang.js'

import { EditorState } from "@codemirror/state"
import { EditorView, basicSetup } from "codemirror"
import { create, all } from 'mathjs'
import getExpressions from './getExpressions'

import {
  StreamLanguage
} from '@codemirror/language'

const math = create(all)
const digits = 14
let parser = math.parser()
const editorDOM = document.querySelector('#editor')
const docChanged = new CustomEvent('docChanged')
const selectionChanged = new CustomEvent('selectionChanged')

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
    StreamLanguage.define(mathjsLang(math)),
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        editorDOM.dispatchEvent(docChanged)
      } else if (update.selectionSet) {
        editorDOM.dispatchEvent(selectionChanged)
      }
    })
  ],
})

let editor = new EditorView({
  state: startState,
  parent: editorDOM
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

const formatResultTyped = math.typed({
  'number': x => math.format(x, { precision: digits }),
  'undefined': () => '',
  'string': x => `<code>${x}</code>`,
  'any': math.typed.referTo(
    'number',
    fnumber => x => katex.renderToString(math.parse(fnumber(x)).toTex())
  )
})

function formatResult(x){
  if(typeof x === 'object' && x.isHelp){
    return `<pre>${math.format(x)}</pre>`
  }
  return formatResultTyped(x)
}

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
    currentLine: 1,
    get calcExpressions() {
      this.expressions = processExpressions(getExpressions(editor.state.doc.toString()))
    },
    get getCurrentLine() {
      this.currentLine = editor.state.doc.lineAt(
        editor.state.selection.ranges[editor.state.selection.mainIndex].from
      ).number - 1
    }
  })
)

Alpine.start()