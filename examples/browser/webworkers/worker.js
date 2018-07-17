importScripts('../../../dist/math.js')

// create a parser
const parser = self.math.parser()

self.addEventListener('message', function (event) {
  const request = JSON.parse(event.data)
  let result = null
  let err = null

  try {
    // evaluate the expression
    result = parser.eval(request.expr)
  } catch (e) {
    // return the error
    err = e
  }

  // build a response
  const response = {
    id: request.id,
    result: result,
    err: err
  }

  // send the response back
  self.postMessage(JSON.stringify(response))
}, false)
