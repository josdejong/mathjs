'use strict'

function factory (type, config, load) {
  const csTdfs = load(require('./csTdfs'))

  /**
   * Post order a tree of forest
   *
   * @param {Array}   parent          The tree or forest
   * @param {Number}  n               Number of columns
   *
   * Reference: http://faculty.cse.tamu.edu/davis/publications.html
   */
  const csPost = function (parent, n) {
    // check inputs
    if (!parent) { return null }
    // vars
    let k = 0
    let j
    // allocate result
    const post = [] // (n)
    // workspace, head: first n entries, next: next n entries, stack: last n entries
    const w = [] // (3 * n)
    const head = 0
    const next = n
    const stack = 2 * n
    // initialize workspace
    for (j = 0; j < n; j++) {
      // empty linked lists
      w[head + j] = -1
    }
    // traverse nodes in reverse order
    for (j = n - 1; j >= 0; j--) {
      // check j is a root
      if (parent[j] === -1) { continue }
      // add j to list of its parent
      w[next + j] = w[head + parent[j]]
      w[head + parent[j]] = j
    }
    // loop nodes
    for (j = 0; j < n; j++) {
      // skip j if it is not a root
      if (parent[j] !== -1) { continue }
      // depth-first search
      k = csTdfs(j, k, w, head, next, post, stack)
    }
    return post
  }

  return csPost
}

exports.name = 'csPost'
exports.path = 'algebra.sparse'
exports.factory = factory
