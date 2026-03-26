import assert from 'assert'
import { escapeLatex } from '../../../src/utils/escapeLatex.js'

describe('escapeLatex', function () {
  it('should escape empty string correctly', function () {
    assert.strictEqual(escapeLatex(''), '')
  })

  it('should escape casted string correctly', function () {
    assert.strictEqual(escapeLatex(1), '1')
  })

  it('should escape # correctly', function () {
    assert.strictEqual(
      escapeLatex('Hashtag #yolo is all the rage these days #twitter'),
      'Hashtag \\#yolo is all the rage these days \\#twitter'
    )
  })

  it('should escape $ correctly', function () {
    assert.strictEqual(
      escapeLatex('$2 is greater than $1'),
      '\\$2 is greater than \\$1'
    )
  })

  it('should escape % correctly', function () {
    assert.strictEqual(
      escapeLatex('100% is 20% point greater than 80%'),
      '100\\% is 20\\% point greater than 80\\%'
    )
  })

  it('should escape & correctly', function () {
    assert.strictEqual(
      escapeLatex('Me & you & a dog named Boo'),
      'Me \\& you \\& a dog named Boo'
    )
  })

  it('should escape backslash correctly', function () {
    assert.strictEqual(
      escapeLatex('C:\\ is a good place to format'),
      'C:\\textbackslash{} is a good place to format'
    )
  })

  it('should escape { correctly', function () {
    assert.strictEqual(
      escapeLatex('This { does not have an matching bracket'),
      'This \\{ does not have an matching bracket'
    )
  })

  it('should escape } correctly', function () {
    assert.strictEqual(
      escapeLatex('There is no opening bracket for this }'),
      'There is no opening bracket for this \\}'
    )
  })

  it('should escape ^ correctly', function () {
    assert.strictEqual(
      escapeLatex('2^2^2^2 = 256'),
      '2\\textasciicircum{}2\\textasciicircum{}2\\textasciicircum{}2 = 256'
    )
  })

  it('should escape _ correctly', function () {
    assert.strictEqual(
      escapeLatex('_ is a shortcut to Underscore, e.g., _.each()'),
      '\\_ is a shortcut to Underscore, e.g., \\_.each()'
    )
  })

  it('should escape ~ correctly', function () {
    assert.strictEqual(
      escapeLatex('pi ~ 3.1416'),
      'pi \\textasciitilde{} 3.1416'
    )
  })

  it('should escape *nix newline correctly', function () {
    assert.strictEqual(
      escapeLatex('\n\n', { preserveFormatting: true }),
      '\\newline{}\\newline{}'
    )
  })

  it('should escape Windows newline correctly', function () {
    assert.strictEqual(
      escapeLatex('\r\n\r\n', { preserveFormatting: true }),
      '\\newline{}\\newline{}'
    )
  })

  it('should escape mixed newlines correctly', function () {
    assert.strictEqual(
      escapeLatex('\r\n\n\n\r\n', { preserveFormatting: true }),
      '\\newline{}\\newline{}\\newline{}\\newline{}'
    )
  })

  it('should escape \u2013 (en-dash) correctly', function () {
    assert.strictEqual(
      escapeLatex('\u2013', { preserveFormatting: true }),
      '\\--'
    )
  })

  it('should escape \u2014 (em-dash) correctly', function () {
    assert.strictEqual(
      escapeLatex('\u2014', { preserveFormatting: true }),
      '\\---'
    )
  })

  it('should escape spaces correctly', function () {
    assert.strictEqual(
      escapeLatex('Look ma,  multiple spaces', { preserveFormatting: true }),
      'Look~ma,~~multiple~spaces'
    )
  })

  it('should escape tabs correctly', function () {
    assert.strictEqual(
      escapeLatex('\t\t', { preserveFormatting: true }),
      '\\qquad{}\\qquad{}'
    )
  })

  it('should not preserve formatting by default', function () {
    assert.strictEqual(
      escapeLatex('en dash \u2013 is cool'),
      'en dash \u2013 is cool'
    )
  })

  it('should not escape - (hyphen)', function () {
    assert.strictEqual(
      escapeLatex('hyphen - is the best'),
      'hyphen - is the best'
    )
  })

  it('stack overflow test', function () {
    const numChars = 100000
    const originalStr = Array(numChars).join('\\')
    const escapedStr = Array(numChars).join('\\textbackslash{}')
    assert.strictEqual(escapeLatex(originalStr), escapedStr)
  })

  it('composite test 1', function () {
    assert.strictEqual(
      escapeLatex('These {} should be escaped, as well as this \\ character'),
      'These \\{\\} should be escaped, as well as this \\textbackslash{} character'
    )
  })
})
