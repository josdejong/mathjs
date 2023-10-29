import { parse } from 'mathjs'

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
        parse(expression)
        return true
    } catch (error) {
        return false
    }
}

function isEmptyString(str) {
    return str.trim() === ""
}