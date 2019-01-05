/**
 * This is a util function for generating a random matrix recursively.
 * @param {number[]} size
 * @param {number} min
 * @param {number} max
 * @param {function} randFunc
 * @returns {Array}
 */
export function randomDataForMatrix (size, min, max, randFunc) {
  const data = []
  size = size.slice(0)

  if (size.length > 1) {
    for (let i = 0, length = size.shift(); i < length; i++) {
      data.push(randomDataForMatrix(size, min, max, randFunc))
    }
  } else {
    for (let i = 0, length = size.shift(); i < length; i++) {
      data.push(randFunc(min, max))
    }
  }

  return data
}
