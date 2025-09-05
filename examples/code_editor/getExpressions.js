import { parse } from 'mathjs'

/**
 * Extracts parsable expressions from a multiline string.
 *
 * @param {string} str - The multiline string containing expressions.
 * @returns {Array<{from: number, to: number, source: string}>} An array of objects,
 *   where each object represents a parsable expression and contains:
 *   - from: The starting line number of the expression within the original string.
 *   - to: The ending line number of the expression within the original string.
 *   - source: The actual string content of the expression.
 */
export default function getExpressions(str) {
    const lines = str.split('\n');
    let nextLineToParse = 0;
    const result = [];

    for (let lineID = 0; lineID < lines.length; lineID++) {
        const linesToTest = lines.slice(nextLineToParse, lineID + 1).join('\n');
        if (canBeParsed(linesToTest)) {
            if (!isEmptyString(linesToTest)) {
                result.push({ from: nextLineToParse, to: lineID, source: linesToTest });
            }
            // Start the next parsing attempt from the line after the successfully parsed expression.
            nextLineToParse = lineID + 1;
        }
    }
    // Handle any remaining lines that couldn't be parsed as expressions.
    const linesToTest = lines.slice(nextLineToParse).join('\n');
    if (!isEmptyString(linesToTest)) {
        result.push({ from: nextLineToParse, to: lines.length - 1, source: linesToTest });
    }
    return result;
}

/**
 * Determines whether a given expression can be successfully parsed.
 *
 * @param {string} expression - The expression to parse.
 * @returns {boolean} True if the expression can be parsed, false otherwise.
 */
function canBeParsed(expression) {
    try {
        parse(expression)
        return true
    } catch (error) {
        return false
    }
}

/**
 * Checks if a given string is empty or only contains whitespace characters.
 *
 * @param {string} str - The string to check.
 * @returns {boolean} True if the string is empty or only contains whitespace, false otherwise.
 */
function isEmptyString(str) {
    return str.trim() === ""
}