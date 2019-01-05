/**
 * This is a util function for generating a random matrix recursively.
 * @param {number[]} size
 * @param {function} random
 * @returns {Array}
 */
export function randomMatrix (size, random) {
  const data = []
  size = size.slice(0)

  if (size.length > 1) {
    for (let i = 0, length = size.shift(); i < length; i++) {
      data.push(randomMatrix(size, random))
    }
  } else {
    for (let i = 0, length = size.shift(); i < length; i++) {
      data.push(random())
    }
  }

  return data
}
