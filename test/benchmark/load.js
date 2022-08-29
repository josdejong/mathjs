// test performance of loading a new mathjs instance

const Benchmark = require('benchmark')
const padRight = require('pad-right')

const timeLabel = 'import, parse, and load time'
console.time(timeLabel)
const { create, all } = require('../..')
const assert = require('assert')
const math = create(all)
console.timeEnd(timeLabel)

function pad (text) {
  return padRight(text, 10, ' ')
}

let calls

const suite = new Benchmark.Suite()
suite
  .add(pad('load lazy'), function () {
    // load all functions lazily into a new instance
    const instance = math.create()
    assert('add' in instance)
  })
  .add(pad('load all'), function () {
    const instance = math.create()
    // force to load all lazy functions
    const everything = Object.values(instance)
    assert(everything.find(fn => fn.name === 'add'))
    calls = instance.typed.createCount
  })
  .on('cycle', function (event) {
    console.log(String(event.target))
  })
  .on('complete', function () {
    console.log(`Load all created ${calls} typed functions.`)
  })
  .run()
