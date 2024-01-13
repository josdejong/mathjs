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

/**
 * Evaluates a given expression using a parser.
 *
 * @param {string} expression - The expression to evaluate.
 * @returns {any} The result of the evaluation, or the error message if an error occurred.
*/
function calc(expression) {
  let result
  try {
    result = parser.evaluate(expression)
  } catch (error) {
    result = error.toString()
  }
  return result
}

/**
 * Formats result depending on the type of result
 * 
 * @param {number, string, Help, any} result - The result to format
 * @returns {string} The string in HTML with the formated result
 */
const formatResult = math.typed({
  'number': result => math.format(result, { precision: digits }),
  'string': result => `<code>${result}</code>`,
  'Help': result => `<pre>${math.format(result)}</pre>`,
  'any': math.typed.referTo(
    'number',
    fnumber => result => katex.renderToString(math.parse(fnumber(result)).toTex())
  )
})

/**
 * Processes an array of expressions by evaluating them, formatting the results,
 * and determining their visibility.
 *
 * @param {Array<{from: number, to: number, source: string}>} expressions - An array of objects representing expressions,
 *   where each object has `from`, `to`, and `source` properties.
 * @returns {Array<{from: number, to: number, source: string, outputs: any, visible: boolean}>} An array of processed expressions,
 *   where each object has additional `outputs` and `visible` properties.
 */
function processExpressions(expressions) {
  parser.clear()
  return expressions.map(expression => {
    const result = calc(expression.source)
    const outputs = formatResult(result)
    // Determine visibility based on the result type:
    // - Undefined results are hidden.
    // - Results with an `isResultSet` property (presumably indicating a result set) are hidden.
    // - All other results are visible.
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