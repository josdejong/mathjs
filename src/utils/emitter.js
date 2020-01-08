import Emitter from 'tiny-emitter'

/**
 * Extend given object with emitter functions `on`, `off`, `once`, `emit`
 * @param {Object} obj
 * @return {Object} obj
 */
export function mixin (obj) {
  // create event emitter
  const emitter = new Emitter()

  // bind methods to obj (we don't want to expose the emitter.e Array...)
  obj.on = emitter.on.bind(emitter)
  obj.off = emitter.off.bind(emitter)
  obj.once = emitter.once.bind(emitter)
  obj.emit = emitter.emit.bind(emitter)

  return obj
}
