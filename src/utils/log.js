/**
 * Log a console.warn message only once
 */
export const warnOnce = (() => {
  const messages = {}

  return function warnOnce (...args) {
    const message = args.join(', ')

    if (!messages[message]) {
      messages[message] = true

      console.warn('Warning:', ...args)
    }
  }
})()
