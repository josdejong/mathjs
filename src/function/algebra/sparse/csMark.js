import { csFlip } from './csFlip'

/**
 * Marks the node at w[j]
 *
 * @param {Array}   w               The array
 * @param {Number}  j               The array index
 *
 * Reference: http://faculty.cse.tamu.edu/davis/publications.html
 */
export function csMark (w, j) {
  // mark w[j]
  w[j] = csFlip(w[j])
}
