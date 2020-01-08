import { csFlip } from './csFlip'

/**
 * Flips the value if it is negative of returns the same value otherwise.
 *
 * @param {Number}  i               The value to flip
 *
 * Reference: http://faculty.cse.tamu.edu/davis/publications.html
 */
export function csUnflip (i) {
  // flip the value if it is negative
  return i < 0 ? csFlip(i) : i
}
