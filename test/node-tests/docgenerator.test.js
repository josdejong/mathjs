import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { collectDocs, iteratePath } from '../../tools/docgenerator.js'

const srcPath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../src') + path.sep

describe('function reference categories', function () {
  let outputRoot
  let outputPath

  beforeEach(function () {
    outputRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mathjs-doc-reference-'))
    outputPath = path.join(outputRoot, 'functions')
  })

  afterEach(function () {
    for (const file of ['concat.md', 'format.md']) {
      const generatedFile = path.join(outputPath, file)
      if (fs.existsSync(generatedFile)) fs.unlinkSync(generatedFile)
    }
    const index = path.join(outputRoot, 'functions.md')
    if (fs.existsSync(index)) fs.unlinkSync(index)
    if (fs.existsSync(outputPath)) fs.rmdirSync(outputPath)
    fs.rmdirSync(outputRoot)
  })

  function category (index, name) {
    const section = index.split(`## ${name} functions\n`)[1]
    assert.ok(section, `Missing ${name} section`)
    return section.split('\n## ')[0]
  }

  it('lists concat once with appropriate syntax in both categories', function () {
    assert.equal(collectDocs(['concat'], srcPath).concat.category, 'matrix')
    iteratePath(['concat', 'format'], srcPath, outputPath, outputRoot)
    const index = fs.readFileSync(path.join(outputRoot, 'functions.md'), 'utf8')
    const matrix = category(index, 'Matrix')
    const string = category(index, 'String')
    const concatLink = /\]\(functions\/concat\.md\)/g
    assert.equal((matrix.match(concatLink) || []).length, 1)
    assert.equal((string.match(concatLink) || []).length, 1)
    assert.equal((index.match(concatLink) || []).length, 2)
    assert.match(matrix.split('\n').find(line => line.includes('(functions/concat.md)')), /dim/)
    const stringEntry = string.split('\n').find(line => line.includes('(functions/concat.md)'))
    assert.match(stringEntry, /str1.*str2/)
    assert.doesNotMatch(stringEntry, /dim/)
    assert.match(string, /\]\(functions\/format\.md\)/)
    assert.doesNotMatch(matrix, /\]\(functions\/format\.md\)/)
    assert.ok(fs.existsSync(path.join(outputPath, 'concat.md')))
  })

  it('does not add concat when it is not among the documented functions', function () {
    iteratePath(['format'], srcPath, outputPath, outputRoot)
    const index = fs.readFileSync(path.join(outputRoot, 'functions.md'), 'utf8')
    assert.match(category(index, 'String'), /\]\(functions\/format\.md\)/)
    assert.doesNotMatch(index, /\]\(functions\/concat\.md\)/)
  })

  it('creates the String category even when concat is its only function', function () {
    iteratePath(['concat'], srcPath, outputPath, outputRoot)
    const index = fs.readFileSync(path.join(outputRoot, 'functions.md'), 'utf8')
    assert.match(category(index, 'String'), /\]\(functions\/concat\.md\)/)
  })
})
