import { Bench } from 'tinybench'
import { index, Range, subset, map, ones, random, round } from '../../lib/esm/index.js'
import { formatTaskResult } from './utils/formatTaskResult.js'

const matrix = map(ones(10, 10, 'dense'), _ => round(random(-5, 5), 2))
const array = matrix.toArray()
const bigMatrix = map(ones(150, 150, 'dense'), _ => round(random(-5, 5), 2))
const bigArray = map(ones(150, 150, 'dense'), _ => round(random(-5, 5), 2))
const arrayOfBooleans = [true, false, false, true, true, true, false, true, false, true]
const fiveNumbers = [0, 1, 5, 7, 9]
const twoNumbers = [4, 6]
const range = new Range(2, 9, 3)
const bigRange = new Range(1, 150, 10)
const rangeAll = new Range(0, 10)
const replacement = [1]

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
  .add('subset(matrix, rows and columns, replacement)', () => {
    subset(matrix, index(fiveNumbers, twoNumbers), replacement)
  })
  .add('subset(array, rows and columns, replacement)', () => {
    subset(array, index(fiveNumbers, twoNumbers), replacement)
  })
  .add('subset(matrix, booleans and columns, replacement)', () => {
    subset(matrix, index(arrayOfBooleans, twoNumbers), replacement)
  })
  .add('subset(array, booleans and columns, replacement)', () => {
    subset(array, index(arrayOfBooleans, twoNumbers), replacement)
  })
  .add('subset(matrix, columns and booleans, replacement)', () => {
    subset(matrix, index(arrayOfBooleans, twoNumbers), replacement)
  })
  .add('subset(array, columns and booleans, replacement)', () => {
    subset(array, index(arrayOfBooleans, twoNumbers), replacement)
  })
  .add('subset(matrix, range and rows, replacement)', () => {
    subset(matrix, index(range, twoNumbers), replacement)
  })
  .add('subset(array, range and rows, replacement)', () => {
    subset(array, index(range, twoNumbers), replacement)
  })
  .add('subset(matrix, range and all, replacement)', () => {
    subset(matrix, index(range, rangeAll), replacement)
  })
  .add('subset(array, range and all, replacement)', () => {
    subset(array, index(range, rangeAll), replacement)
  })
  .add('subset(matrix, all and range, replacement)', () => {
    subset(matrix, index(rangeAll, range), replacement)
  })
  .add('subset(array, all and range, replacement)', () => {
    subset(array, index(rangeAll, range), replacement)
  })
  .add('subset(matrix, all and all, replacement)', () => {
    subset(matrix, index(rangeAll, rangeAll), replacement)
  })
  .add('subset(array, all and all, replacement)', () => {
    subset(array, index(rangeAll, rangeAll), replacement)
  })
  .add('subset(bigMatrix, rows and columns)', () => {
    subset(bigMatrix, index(fiveNumbers, twoNumbers))
  })
  .add('subset(bigArray, rows and columns)', () => {
    subset(bigArray, index(fiveNumbers, twoNumbers))
  })
  .add('subset(bigMatrix, range and columns)', () => {
    subset(bigMatrix, index(bigRange, twoNumbers))
  })
  .add('subset(bigArray, rows and range)', () => {
    subset(bigArray, index(fiveNumbers, bigRange))
  })

bench.addEventListener('cycle', (event) => console.log(formatTaskResult(bench, event.task)))
await bench.run()
