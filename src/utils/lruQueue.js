// (c) 2018, Mariusz Nowak
// SPDX-License-Identifier: ISC
// Derived from https://github.com/medikoo/lru-queue
export function lruQueue (limit) {
  let size = 0
  let base = 1
  let queue = Object.create(null)
  let map = Object.create(null)
  let index = 0
  const del = function (id) {
    const oldIndex = map[id]
    if (!oldIndex) return
    delete queue[oldIndex]
    delete map[id]
    --size
    if (base !== oldIndex) return
    if (!size) {
      index = 0
      base = 1
      return
    }
    while (!Object.prototype.hasOwnProperty.call(queue, ++base)) { /* empty */ }
  }
  limit = Math.abs(limit)
  return {
    hit: function (id) {
      const oldIndex = map[id]; const nuIndex = ++index
      queue[nuIndex] = id
      map[id] = nuIndex
      if (!oldIndex) {
        ++size
        if (size <= limit) return undefined
        id = queue[base]
        del(id)
        return id
      }
      delete queue[oldIndex]
      if (base !== oldIndex) return undefined
      while (!Object.prototype.hasOwnProperty.call(queue, ++base)) { /* empty */ }
      return undefined
    },
    delete: del,
    clear: function () {
      size = index = 0
      base = 1
      queue = Object.create(null)
      map = Object.create(null)
    }
  }
}
