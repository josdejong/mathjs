// test performance of loading a new mathjs instance
import assert from 'node:assert'
import { Bench } from 'tinybench'
import { all, create } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const timeLabel = 'import, parse, and load time'
console.time(timeLabel)
const math = create(all)
console.timeEnd(timeLabel)

let calls

const bench = new Bench({ time: 100, iterations: 100 })
  .add('load lazy', function () {
    // load all functions lazily into a new instance
    const instance = math.create()
    assert('add' in instance)
  })
  .add('load all', function () {
    const instance = math.create()
    // force to load all lazy functions
    const everything = Object.values(instance)
    assert(everything.find(fn => fn.name === 'add'))
    calls = instance.typed.createCount
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
console.log(`Created ${calls} typed functions.`)
