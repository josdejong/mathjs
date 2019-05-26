import { csMarked } from './csMarked'
import { csMark } from './csMark'
import { csUnflip } from './csUnflip'

/**
 * Depth-first search computes the nonzero pattern xi of the directed graph G (Matrix) starting
 * at nodes in B (see csReach()).
 *
 * @param {Number}  j               The starting node for the DFS algorithm
 * @param {Matrix}  g               The G matrix to search, ptr array modified, then restored
 * @param {Number}  top             Start index in stack xi[top..n-1]
 * @param {Number}  k               The kth column in B
 * @param {Array}   xi              The nonzero pattern xi[top] .. xi[n - 1], an array of size = 2 * n
 *                                  The first n entries is the nonzero pattern, the last n entries is the stack
 * @param {Array}   pinv            The inverse row permutation vector, must be null for L * x = b
 *
 * @return {Number}                 New value of top
 *
 * Reference: http://faculty.cse.tamu.edu/davis/publications.html
 */
export function csDfs (j, g, top, xi, pinv) {
  // g arrays
  const index = g._index
  const ptr = g._ptr
  const size = g._size
  // columns
  const n = size[1]
  // vars
  let i, p, p2
  // initialize head
  let head = 0
  // initialize the recursion stack
  xi[0] = j
  // loop
  while (head >= 0) {
    // get j from the top of the recursion stack
    j = xi[head]
    // apply permutation vector
    const jnew = pinv ? pinv[j] : j
    // check node j is marked
    if (!csMarked(ptr, j)) {
      // mark node j as visited
      csMark(ptr, j)
      // update stack (last n entries in xi)
      xi[n + head] = jnew < 0 ? 0 : csUnflip(ptr[jnew])
    }
    // node j done if no unvisited neighbors
    let done = 1
    // examine all neighbors of j, stack (last n entries in xi)
    for (p = xi[n + head], p2 = jnew < 0 ? 0 : csUnflip(ptr[jnew + 1]); p < p2; p++) {
      // consider neighbor node i
      i = index[p]
      // check we have visited node i, skip it
      if (csMarked(ptr, i)) { continue }
      // pause depth-first search of node j, update stack (last n entries in xi)
      xi[n + head] = p
      // start dfs at node i
      xi[++head] = i
      // node j is not done
      done = 0
      // break, to start dfs(i)
      break
    }
    // check depth-first search at node j is done
    if (done) {
      // remove j from the recursion stack
      head--
      // and place in the output stack
      xi[--top] = j
    }
  }
  return top
}
