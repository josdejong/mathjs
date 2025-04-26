import { Bench } from 'tinybench'
import { index, Range, subset, map, ones, random, round } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const matrix = map(ones(10, 10, 'dense'), _ => round(random(-5, 5), 2))
const array = matrix.toArray()
const arrayOfBooleans = [true, false, false, true, true, true, false, true, false, true,]
const fiveNumbers = [0, 1, 5, 7, 9]
const twoNumbers = [4, 6]
const range = new Range(2, 9, 3)
const rangeAll = new Range()

// console.log('data', array)
// console.log('abs(data)', abs(array))npm run

const bench = new Bench({ time: 100, iterations: 100 })
  .add('subset(matrix, rows and columns)', () => {
	subset(matrix, index(fiveNumbers, twoNumbers))
  })
  .add('subset(array, rows and columns)', () => {
	subset(array, index(fiveNumbers, twoNumbers))
  })
  .add('subset(matrix, booleans and columns)', () => {
	subset(matrix, index(arrayOfBooleans, twoNumbers))
  })
  .add('subset(array, booleans and columns)', () => {
	subset(array, index(arrayOfBooleans, twoNumbers))
  })
  .add('subset(matrix, columns and booleans)', () => {
	subset(matrix, index(arrayOfBooleans, twoNumbers))
  })
  .add('subset(array, columns and booleans)', () => {
	subset(array, index(arrayOfBooleans, twoNumbers))
  })
  .add('subset(matrix, range and rows)', () => {
	subset(matrix, index(range, twoNumbers))
  })
  .add('subset(array, range and rows)', () => {
	subset(array, index(range, twoNumbers))
  })
  .add('subset(matrix, range and all)', () => {
	subset(matrix, index(range, rangeAll))
  })
  .add('subset(array, range and all)', () => {
	subset(array, index(range, rangeAll))
  })
  .add('subset(matrix, all and range)', () => {
	subset(matrix, index(rangeAll, range))
  })
  .add('subset(array, all and range)', () => {
	subset(array, index(rangeAll, range))
  })
  .add('subset(matrix, all and all)', () => {
	subset(matrix, index(rangeAll, rangeAll))
  })
  .add('subset(array, all and all)', () => {
	subset(array, index(rangeAll, rangeAll))
  })
  

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
