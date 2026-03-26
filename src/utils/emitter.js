// Inline ESM replacement for the 'tiny-emitter' package (v2.1.0)
// Original: https://github.com/scottcorgan/tiny-emitter (MIT license)

/**
 * Extend given object with emitter functions `on`, `off`, `once`, `emit`
 * @param {Object} obj
 * @return {Object} obj
 */
export function mixin (obj) {
  const events = {}

  obj.on = function (name, callback, ctx) {
    (events[name] || (events[name] = [])).push({ fn: callback, ctx })
    return obj
  }

  obj.off = function (name, callback) {
    if (!callback) {
      delete events[name]
      return obj
    }

    const listeners = events[name]
    if (listeners) {
      const live = listeners.filter(e => e.fn !== callback && e.fn._ !== callback)
      live.length ? (events[name] = live) : delete events[name]
    }

    return obj
  }

  obj.once = function (name, callback, ctx) {
    function listener (...args) {
      obj.off(name, listener)
      callback.apply(ctx, args)
    }
    listener._ = callback
    return obj.on(name, listener, ctx)
  }

  obj.emit = function (name, ...args) {
    const listeners = (events[name] || []).slice()
    for (let i = 0; i < listeners.length; i++) {
      listeners[i].fn.apply(listeners[i].ctx, args)
    }
    return obj
  }

  return obj
}
