import { factory } from '../../utils/factory'

const name = 'Spa'
const dependencies = ['addScalar', 'equalScalar', 'FibonacciHeap']

export const createSpaClass = /* #__PURE__ */ factory(name, dependencies, ({ addScalar, equalScalar, FibonacciHeap }) => {
  /**
   * An ordered Sparse Accumulator is a representation for a sparse vector that includes a dense array
   * of the vector elements and an ordered list of non-zero elements.
   */
  function Spa () {
    if (!(this instanceof Spa)) { throw new SyntaxError('Constructor must be called with the new operator') }

    // allocate vector, TODO use typed arrays
    this._values = []
    this._heap = new FibonacciHeap()
  }

  /**
   * Attach type information
   */
  Spa.prototype.type = 'Spa'
  Spa.prototype.isSpa = true

  /**
   * Set the value for index i.
   *
   * @param {number} i                       The index
   * @param {number | BigNumber | Complex}   The value at index i
   */
  Spa.prototype.set = function (i, v) {
    // check we have a value @ i
    if (!this._values[i]) {
      // insert in heap
      const node = this._heap.insert(i, v)
      // set the value @ i
      this._values[i] = node
    } else {
      // update the value @ i
      this._values[i].value = v
    }
  }

  Spa.prototype.get = function (i) {
    const node = this._values[i]
    if (node) { return node.value }
    return 0
  }

  Spa.prototype.accumulate = function (i, v) {
    // node @ i
    let node = this._values[i]
    if (!node) {
      // insert in heap
      node = this._heap.insert(i, v)
      // initialize value
      this._values[i] = node
    } else {
      // accumulate value
      node.value = addScalar(node.value, v)
    }
  }

  Spa.prototype.forEach = function (from, to, callback) {
    // references
    const heap = this._heap
    const values = this._values
    // nodes
    const nodes = []
    // node with minimum key, save it
    let node = heap.extractMinimum()
    if (node) { nodes.push(node) }
    // extract nodes from heap (ordered)
    while (node && node.key <= to) {
      // check it is in range
      if (node.key >= from) {
        // check value is not zero
        if (!equalScalar(node.value, 0)) {
          // invoke callback
          callback(node.key, node.value, this)
        }
      }
      // extract next node, save it
      node = heap.extractMinimum()
      if (node) { nodes.push(node) }
    }
    // reinsert all nodes in heap
    for (let i = 0; i < nodes.length; i++) {
      // current node
      const n = nodes[i]
      // insert node in heap
      node = heap.insert(n.key, n.value)
      // update values
      values[node.key] = node
    }
  }

  Spa.prototype.swap = function (i, j) {
    // node @ i and j
    let nodei = this._values[i]
    let nodej = this._values[j]
    // check we need to insert indeces
    if (!nodei && nodej) {
      // insert in heap
      nodei = this._heap.insert(i, nodej.value)
      // remove from heap
      this._heap.remove(nodej)
      // set values
      this._values[i] = nodei
      this._values[j] = undefined
    } else if (nodei && !nodej) {
      // insert in heap
      nodej = this._heap.insert(j, nodei.value)
      // remove from heap
      this._heap.remove(nodei)
      // set values
      this._values[j] = nodej
      this._values[i] = undefined
    } else if (nodei && nodej) {
      // swap values
      const v = nodei.value
      nodei.value = nodej.value
      nodej.value = v
    }
  }

  return Spa
}, { isClass: true })
