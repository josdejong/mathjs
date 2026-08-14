// Inline ESM replacement for the 'escape-latex' package (v1.2.0)
// Original: https://github.com/dangmai/escape-latex (MIT license)

// Map the characters to escape to their escaped values. The list is derived
// from http://www.cespedes.org/blog/85/how-to-escape-latex-special-characters
const defaultEscapes = {
  '{': '\\{',
  '}': '\\}',
  '\\': '\\textbackslash{}',
  '#': '\\#',
  $: '\\$',
  '%': '\\%',
  '&': '\\&',
  '^': '\\textasciicircum{}',
  _: '\\_',
  '~': '\\textasciitilde{}'
}

const formatEscapes = {
  '\u2013': '\\--',
  '\u2014': '\\---',
  ' ': '~',
  '\t': '\\qquad{}',
  '\r\n': '\\newline{}',
  '\n': '\\newline{}'
}

/**
 * Escape a string to be used in LaTeX documents.
 * @param {string} str the string to be escaped.
 * @param {boolean} params.preserveFormatting whether formatting escapes should
 *  be performed (default: false).
 * @return {string} the escaped string, ready to be used in LaTeX.
 */
export function escapeLatex (str, { preserveFormatting = false } = {}) {
  const s = String(str)
  const escapes = preserveFormatting
    ? { ...defaultEscapes, ...formatEscapes }
    : defaultEscapes
  const escapeKeys = Object.keys(escapes)
  const parts = []
  let i = 0

  while (i < s.length) {
    let matched = false
    for (let k = 0; k < escapeKeys.length; k++) {
      const key = escapeKeys[k]
      if (s.startsWith(key, i)) {
        parts.push(escapes[key])
        i += key.length
        matched = true
        break
      }
    }
    if (!matched) {
      parts.push(s[i++])
    }
  }

  return parts.join('')
}
