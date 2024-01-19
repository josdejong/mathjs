import './style.css'
import 'github-markdown-css/github-markdown.css'
import 'katex/dist/katex.min.css'
import { StreamLanguage } from '@codemirror/language'
import { EditorState } from '@codemirror/state'
import { basicSetup, EditorView } from 'codemirror'
import katex from 'katex'
import { all, create } from 'mathjs'
import getExpressions from './getExpressions'
import { mathjsLang } from './mathjs-lang.js'

const timeout = 250 // milliseconds
const digits = 14

const math = create(all)
const parser = math.parser()
const editorDOM = document.querySelector('#editor')
const resultsDOM = document.querySelector('#result')

let processedExpressions
let previousSelectedExpressionIndex
let timer

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
    EditorView.lineWrapping,
    EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        // if doc changed debounce and update results after a timeout
        clearTimeout(timer)
        timer = setTimeout(() => {
          updateResults()
          previousSelectedExpressionIndex = null
          updateSelection()
        }, timeout)
      } else if (update.selectionSet) {
        updateSelection()
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
    // - Results with an `isResultSet` property are hidden when empty.
    // - All other results are visible.
    const visible = result === undefined ? false : (result.isResultSet && result.entries.length === 0) ? false : true
    return ({
      ...expression,
      outputs,
      visible
    })
  })
}

/**
 * Updates the displayed results based on the editor's current content.
 *
 * @function updateResults
 * @requires getExpressions, processExpressions, resultsToHTML
 *
 * @description
 * 1. Extracts expressions from the editor's content.
 * 2. Evaluates and analyzes the expressions.
 * 3. Generates HTML to display the processed results.
 * 4. Renders the generated HTML in the designated results container.
 */
function updateResults() {
  // Extract expressions from the editor's content.
  const expressions = getExpressions(editor.state.doc.toString());

  // Evaluate and analyze the expressions.
  processedExpressions = processExpressions(expressions);

  // Generate HTML to display the results.
  const resultsHtml = resultsToHTML(processedExpressions);

  // Render the generated HTML in the results container.
  resultsDOM.innerHTML = resultsHtml;
}

/**
* Updates the visual highlighting of results based on the current line selection in the editor.
*
* @function updateSelection
* @requires editor, processedExpressions
*
* @description
* 1. Determines the current line number in the editor's selection.
* 2. Finds the corresponding result (processed expression) that matches the current line.
* 3. If a different result is selected than before:
*   - Removes highlighting from the previously selected result.
*   - Highlights the newly selected result.
*   - Scrolls the newly selected result into view.
*/
function updateSelection() {
  const selectedLine = editor.state.doc.lineAt(
    editor.state.selection.ranges[editor.state.selection.mainIndex].from
  ).number - 1;

  let selectedExpressionIndex;

  processedExpressions.forEach((result, index) => {
    if ((selectedLine >= result.from) && (selectedLine <= result.to)) {
      selectedExpressionIndex = index;
    }
  });

  if (selectedExpressionIndex !== previousSelectedExpressionIndex) {
    const previouslyHighlightedResult = document.querySelector('#result').children[previousSelectedExpressionIndex];
    if (previouslyHighlightedResult !== undefined) {
      previouslyHighlightedResult.className = null;
    }

    const currentlySelectedResult = document.querySelector('#result').children[selectedExpressionIndex];
    if (currentlySelectedResult !== undefined) {
      currentlySelectedResult.className = 'highlighted';
      currentlySelectedResult.scrollIntoView({ block: 'nearest', inline: 'start' });
    }

    previousSelectedExpressionIndex = selectedExpressionIndex;
  }
}

/**
* Converts an array of processed results into HTML elements for display.
*
* @function resultsToHTML
* @param {Array<{from: number, to: number, source: string, outputs: any, visible: boolean}>} results - An array of processed results, where each object has:
*   - from: The starting line number of the expression.
*   - to: The ending line number of the expression.
*   - source: The original expression string.
*   - outputs: The formatted result of evaluating the expression.
*   - visible: A boolean indicating whether the result should be displayed or hidden.
* @returns {string} A string of HTML elements representing the results, where each result is enclosed in a <pre> tag with appropriate styling based on its visibility.
*/
function resultsToHTML(results) {
  return results.map(el => {
    const elementStyle = el.visible ? '' : 'style="display:none"'
    return `<pre ${elementStyle}>${el.outputs}</pre>`
  }
  ).join('')
}

updateResults()
