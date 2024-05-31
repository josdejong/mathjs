import fs from 'node:fs'
import path from 'node:path'

/**
 * Test whether a file contains only ASCII characters
 * Returns an Array with the characters which are not ASCII, i.e. char code >= 128
 */
export function validateChars (filename) {
  const contents = fs.readFileSync(filename)
  const lines = []
  const invalidChars = []
  let inSingleLineComment = false
  let inMultiLineComment = false

  for (let i = 0; i < contents.length; i++) {
    const c = contents[i]
    const cChar = String.fromCharCode(c)
    const cCharPrev = String.fromCharCode(contents[i - 1])
    const cCharNext = String.fromCharCode(contents[i + 1])

    if (cChar === '\n') {
      lines.push(i)
    }

    if (!inSingleLineComment && !inMultiLineComment) {
      if (cChar === '/' && cCharNext === '/') {
        inSingleLineComment = true
      }

      if (cChar === '/' && cCharNext === '*') {
        inMultiLineComment = true
      }
    }

    if (inSingleLineComment && cChar === '\n') {
      inSingleLineComment = false
    }

    if (inMultiLineComment && cCharPrev === '*' && cChar === '/') {
      inMultiLineComment = false
    }

    if (c > 128) {
      const ln = lines.length + 1
      const col = i - (lines.length > 0 ? last(lines) : 0)
      invalidChars.push({
        filename,
        ln,
        col,
        c,
        insideComment: inSingleLineComment || inMultiLineComment
      })
    }
  }

  return invalidChars
}

/**
 * Find all files inside a dir, recursively.
 * Source: https://gist.github.com/kethinov/6658166#gistcomment-2389484
 * @function getAllFiles
 * @param  {string} dir Dir path string.
 * @return {string[]} Array with all file names that are inside the directory.
 */
export function getAllFiles (dir) {
  return fs.readdirSync(dir).reduce(function (files, file) {
    const name = path.join(dir, file)
    const isDirectory = fs.statSync(name).isDirectory()
    return isDirectory
      ? files.concat(getAllFiles(name))
      : files.concat([name])
  }, [])
}

// return the last item from an array
function last (array) {
  return array[array.length - 1]
}
