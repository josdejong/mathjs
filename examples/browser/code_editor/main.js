const textInput = document.getElementById('input')
const result = document.getElementById('output')
let currentID = null
let listOfBlocks
let listOfIDText
const inputs = getExamples(["unit", "sum", "add", "subtract", "sin", "cos", "matrix", "multiply", "divide"]).join('\n\n')
const digits = 14
textInput.value = inputs

let editor = CodeMirror.fromTextArea(textInput, {
    lineNumbers: true,
    lineWrapping: true,
    mode: "mathjs",
    keyMap: "sublime",
    autoCloseBrackets: true,
    extraKeys: {
        "Alt-F": "findPersistent",
        "Ctrl-Space": "autocomplete"
    },
    matchBrackets: true,
    highlightSelectionMatches: { showToken: /\w/, annotateScrollbar: false },
    foldGutter: true,
    gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    showCursorWhenSelecting: true,
    styleActiveLine: true,
    hintOptions: { hint: mathHints }
});


let parser = math.parser()
calc()
editor.on('change', delayedCalc)
editor.on('cursorActivity', highlightResult)

const wait = 300
let timer
function delayedCalc() {
    clearTimeout(timer)
    timer = setTimeout(calc, wait)
}


function highlightResult() {
    const line = editor.getCursor().line
    const lineID = getIDofLine(line)
    const blockID = getIDofBlock(line)
    scrollInto(blockID)
    highlight(lineID)
    highlightBlock(blockID)
    scrollInto(lineID)
}

function formatResult(x) {
    if (x !== undefined) {
        return math.format(x, { precision: digits })
    }
}

function formatResults(result) {
    if (typeof result === "object" && result.isResultSet) {
        return result.entries.map(r => formatResult(r)).join('')
    }
    else {
        return formatResult(result)
    }
}


function getExamples(functions) {
    return functions.map(functionName => math.help(functionName).doc.examples.join('\n'))
}

function calc() {
    listOfIDText = []
    listOfBlocks = []
    parser.clear()
    let blockString = ""
    const blocks = splitInBlocks(editor.getValue())
    blocks.forEach((block, blockID) => {
        listOfBlocks.push({ from: block.from, to: block.to })
        const expressions = splitByParse(block.text)
        let results = ""
        expressions.forEach(expression => {
            let result
            try {
                result = parser.evaluate(expression.text)
            } catch (error) {
                result = error.toString()
            }
            const idText = `F${block.from + expression.from}T${block.from + expression.to}`
            currentID = idText
            listOfIDText.push({ from: block.from + expression.from, to: block.from + expression.to })
            if (result !== undefined) {
                const resultText = formatResults(result)
                if (result.entries && result.entries.length > 0) {
                    results += `<code id='${idText}'>${resultText}</code><br>`
                } else if (result.entries === undefined) {
                    results += `<code id='${idText}'>${resultText}</code><br>`
                }
            }
        })
        if (results.length > 0) {
            blockIdText = `BlockF${block.from}T${block.to}`
            blockString += `<pre id='${blockIdText}'>${results}</pre>`
        }
    })
    result.innerHTML = blockString
    highlightResult()
}

function isEmptyString(str) {
    return str.trim() === ""
}

function splitInBlocks(lines) {
    const linesArray = lines.split('\n')
    let lastLineIsEmpty = isEmptyString(linesArray[0])
    let blockFrom = 0
    let blockID = 0
    let blockTo = null
    const blockInfo = []


    linesArray.slice(1).forEach((line, i) => {
        if (!isEmptyString(line)) {
            if (lastLineIsEmpty) {
                blockFrom = i + 1,
                    blockTo = null
            }
            lastLineIsEmpty = false
        } else {
            if (!lastLineIsEmpty) {
                blockID += 1
                blockTo = i
                blockInfo.push({ from: blockFrom, to: blockTo })
            }
            lastLineIsEmpty = true
        }

    })

    if (!lastLineIsEmpty) blockInfo.push({ from: blockFrom, to: linesArray.length - 1 })
    blockInfo.forEach((b, id) => {
        blockInfo[id].text = linesArray.slice(b.from, b.to + 1).join('\n')
    })

    return (blockInfo)
}

function canBeParsed(expression) {
    try {
        math.parse(expression)
        return true
    } catch (error) {
        return false
    }
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

function highlight(ID) {
    document.querySelectorAll('.highlighted').
        forEach(element => element.classList.remove('highlighted'))
    const elementToChange = document.getElementById(ID)
    if (elementToChange !== null) elementToChange.className = 'highlighted'
}

function highlightBlock(ID) {
    document.querySelectorAll('.currentBlockResult').
        forEach(element => element.classList.remove('currentBlockResult'))
    const elementToChange = document.getElementById(ID)
    if (elementToChange !== null) elementToChange.className = 'currentBlockResult'
}

function scrollInto(ID) {
    const element = ID ? document.getElementById(ID) : null
    if (element !== null) {
        element.scrollIntoView({ block: 'nearest', inline: 'start' })
        highlight(ID)
    }
}

//result.innerHTML = md.render("# hi")


function mathHints(cm, options) {
    return new Promise(function (accept) {
        setTimeout(function () {
            const cursor = cm.getCursor(), line = cm.getLine(cursor.line)
            let start = cursor.ch, end = cursor.ch
            while (start && /\w/.test(line.charAt(start - 1))) --start
            while (end < line.length && /\w/.test(line.charAt(end))) ++end
            const word = line.slice(start, end)
            const results = completer(word)
            if (results.length > 0) {
                return accept({
                    list: results,
                    from: CodeMirror.Pos(cursor.line, start),
                    to: CodeMirror.Pos(cursor.line, end)
                })
            } else {
                return accept(null)
            }
        }, 100)
    })
}

/**
* auto complete a text
* @param {String} text
* @return {[Array, String]} completions
*/
function completer(text) {
    // based on https://github.com/josdejong/mathjs/tree/develop/bin/cli.js
    let matches = []
    let keyword
    const m = /[a-zA-Z_0-9]+$/.exec(text)
    if (m) {
        keyword = m[0]

        // scope variables
        for (const def in parser.getAll()) {
            if (def.startsWith(keyword)) {
                matches.push(def)
            }
        }

        // math functions and constants
        const ignore = ['expr', 'type']
        const mathFunctions = math.expression.mathWithTransform

        for (const func in mathFunctions) {
            if (hasOwnPropertySafe(mathFunctions, func)) {
                if (func.startsWith(keyword) && ignore.indexOf(func) === -1) {
                    matches.push(func)
                }
            }
        }

        const importedFunctions = []
        for (const func of importedFunctions) {
            if (func.startsWith(keyword)) {
                matches.push(func)
            }
        }

        // units
        const Unit = math.Unit
        for (const name in Unit.UNITS) {
            if (hasOwnPropertySafe(Unit.UNITS, name)) {
                if (name.startsWith(keyword)) {
                    matches.push(name)
                }
            }
        }
        for (const name in Unit.PREFIXES) {
            if (hasOwnPropertySafe(Unit.PREFIXES, name)) {
                const prefixes = Unit.PREFIXES[name]
                for (const prefix in prefixes) {
                    if (hasOwnPropertySafe(prefixes, prefix)) {
                        if (prefix.startsWith(keyword)) {
                            matches.push(prefix)
                        } else if (keyword.startsWith(prefix)) {
                            const unitKeyword = keyword.substring(prefix.length)
                            for (const n in Unit.UNITS) {
                                const fullUnit = prefix + n
                                if (hasOwnPropertySafe(Unit.UNITS, n)) {
                                    if (
                                        !matches.includes(fullUnit) &&
                                        n.startsWith(unitKeyword) &&
                                        Unit.isValuelessUnit(fullUnit)) {
                                        matches.push(fullUnit)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // remove duplicates
        matches = Array.from(new Set(matches))
    }

    return matches
}

// helper function to safely check whether an object has a property
// copy from the function in object.js which is ES6
function hasOwnPropertySafe(object, property) {
    return object && Object.hasOwnProperty.call(object, property)
}

function getIDofLine(line) {
    let name = ''
    listOfIDText.forEach(
        idText => {
            if (line >= idText.from && line <= idText.to) {
                name = `F${idText.from}T${idText.to}`
            }
        }
    )
    return name
}

function getIDofBlock(line) {
    let name = ''
    listOfBlocks.forEach(
        idText => {
            if (line >= idText.from && line <= idText.to) {
                name = `BlockF${idText.from}T${idText.to}`
            }
        }
    )
    return name
}