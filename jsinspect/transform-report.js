/**
 * Generate results first with jsinspect (from project root):  
 * `npx jsinspect --config ./jsinspect/config.json > ./jsinspect/report.json`
 * 
 * Then run this script to transform the output (from project root):  
 * `node ./jsinspect/transform-report.js`  
 * Each duplication will be in its own file inside the folder `results`.
 */

import { rmdirSync, mkdirSync, writeFileSync, readFileSync } from "fs"

const resultsDir = './jsinspect/results'
const reportFile = './jsinspect/report.json'

rmdirSync(resultsDir, { recursive: true })
mkdirSync(resultsDir)

const jsinspectReport = JSON.parse(readFileSync(reportFile))

for (const duplicationResult of jsinspectReport) {
    outputResultToFile(duplicationResult)
}

function outputResultToFile({ id, instances: rawInstances }) {
    const instances = transformInstances(rawInstances)
    const positionLinks = instances.map(({ position }) => `[${position}](#${position})  `).join('\n')
    const instancesString = formatInstances(instances)
    const outputPath = `${resultsDir}/${id}.md`
    const output = assembleOutput(positionLinks, instancesString)
    writeFileSync(outputPath, output)
}

function transformInstances(rawInstances) {
    return rawInstances.map(({ path, lines: [firstLine, lastLine], code }) => {
        path = path.replace(/\\/g, '/')
        return {
            position: `${path}:${firstLine},${lastLine}`,
            code
        }
    })
}

function formatInstances(instances) {
    return instances.map(({ position, code }) => {
        let str = `### ${position}\n\n`
        str += "```js\n"
        str += code + '\n'
        str += "```\n"
        return str
    }).join('\n\n\n')
}

function assembleOutput(positionLinks, instancesString) {
    return '## Paths\n\n'
        + positionLinks + '\n\n'
        + '## Code\n\n'
        + instancesString
}