// test Help
import assert from 'assert'

import math from '../../../src/defaultInstance.js'
import { embeddedDocs } from '../../../src/expression/embeddedDocs/embeddedDocs.js'
const Help = math.Help

describe('help', function () {
  const doc = {
    name: 'add',
    category: 'Operators',
    syntax: [
      'x + y',
      'add(x, y)'
    ],
    description: 'Add two values.',
    examples: [
      'a = 2.1 + 3.6',
      'a - 3.6'
    ],
    seealso: [
      'subtract'
    ]
  }

  it('should generate the help for a function', function () {
    const help = new Help(doc)

    assert(help instanceof Help)
    assert.deepStrictEqual(help.doc.name, 'add')
    assert.deepStrictEqual(help.doc, doc)
  })

  it('should throw an error when constructed without new operator', function () {
    assert.throws(function () {
      console.log(Help(embeddedDocs.sin))
    }, /Constructor must be called with the new operator/)
  })

  it('should throw an error when constructed without doc argument', function () {
    assert.throws(function () {
      console.log(new Help())
    }, /Argument "doc" missing/)
  })

  it('should have a property isHelp', function () {
    const a = new Help(doc)
    assert.strictEqual(a.isHelp, true)
  })

  it('should have a property type', function () {
    const a = new Help(doc)
    assert.strictEqual(a.type, 'Help')
  })

  it('should stringify a help', function () {
    const help = new Help(doc)
    assert.strictEqual(help.toString(),
      '\nName: add\n' +
        '\n' +
        'Category: Operators\n' +
        '\n' +
        'Description:\n' +
        '    Add two values.\n' +
        '\n' +
        'Syntax:\n' +
        '    x + y\n' +
        '    add(x, y)\n' +
        '\n' +
        'Examples:\n' +
        '    a = 2.1 + 3.6\n' +
        '        5.7\n' +
        '    a - 3.6\n' +
        '        2.1\n' +
        '\n' +
        'See also: subtract\n')
  })

  it('should stringify a help with empty doc', function () {
    const help = new Help({})
    assert.strictEqual(help.toString(), '\n')
  })

  it('should stringify a doc with empty example', function () {
    const help = new Help({
      name: 'add',
      examples: [
        '2 + 3',
        ''
      ]
    })

    assert.strictEqual(help.toString(),
      '\nName: add\n' +
        '\n' +
        'Examples:\n' +
        '    2 + 3\n' +
        '        5\n' +
        '    \n' +
        '\n')
  })

  it('should stringify a doc with example throwing an error', function () {
    const help = new Help({
      name: 'add',
      examples: [
        '2 ^^ 3'
      ]
    })

    assert.strictEqual(help.toString(),
      '\nName: add\n' +
        '\n' +
        'Examples:\n' +
        '    2 ^^ 3\n' +
        '        SyntaxError: Value expected (char 4)\n' +
        '\n')
  })

  it('should return string representation on valueOf', function () {
    const help = new Help({
      name: 'add',
      examples: [
        '2 ^^ 3'
      ]
    })

    assert.strictEqual(help.valueOf(),
      '\nName: add\n' +
            '\n' +
            'Examples:\n' +
            '    2 ^^ 3\n' +
            '        SyntaxError: Value expected (char 4)\n' +
            '\n')
  })

  it('should export doc to JSON', function () {
    const help = new Help(doc)
    const json = help.toJSON()
    assert.deepStrictEqual(json, {
      mathjs: 'Help',
      name: 'add',
      category: 'Operators',
      syntax: [
        'x + y',
        'add(x, y)'
      ],
      description: 'Add two values.',
      examples: [
        'a = 2.1 + 3.6',
        'a - 3.6'
      ],
      seealso: [
        'subtract'
      ]
    })
    json.name = 'foo' // this should not alter the original doc
    json.examples.push('2 + 3') // this should not alter the original doc
    assert.strictEqual(doc.name, 'add')
    assert.notStrictEqual(json.examples.length, doc.examples.length)
  })

  it('should instantiate Help from json using fromJSON', function () {
    const json = {
      mathjs: 'Help',
      name: 'add',
      category: 'Operators',
      syntax: [
        'x + y',
        'add(x, y)'
      ],
      description: 'Add two values.',
      examples: [
        'a = 2.1 + 3.6',
        'a - 3.6'
      ],
      seealso: [
        'subtract'
      ]
    }

    const help = Help.fromJSON(json)
    assert(help instanceof Help)
    assert.deepStrictEqual(doc, help.doc)
  })
})
