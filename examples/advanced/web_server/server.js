/**
 * This example demonstrates how to run math.js in a child process with limited
 * execution time.
 *
 * Prerequisites:
 *
 *     npm install express workerpool
 *
 * Start the server:
 *
 *     node ./server.js
 *
 * Make a request to the server:
 *
 *     GET http://localhost:8080/mathjs?expr=sqrt(16)
 *
 * Note that the query parameter `expr` should be properly url encoded.
 */
const path = require('path')

let express
let workerpool
try {
  express = require('express')
  workerpool = require('workerpool')
} catch (err) {
  console.log('Error: To run this example, install express and workerpool first via:\n\n' +
      '    npm install express workerpool\n')
  process.exit()
}

const app = express()
const pool = workerpool.pool(path.join(__dirname, '/math_worker.js'))

const TIMEOUT = 10000 // milliseconds

/**
 * GET /mathjs?expr=...
 */
app.get('/mathjs', function (req, res) {
  const expr = req.query.expr
  if (expr === undefined) {
    return res.status(400).send('Error: Required query parameter "expr" missing in url.')
  }

  pool.exec('evaluate', [expr])
    .timeout(TIMEOUT)
    .then(function (result) {
      res.send(result)
    })
    .catch(function (err) {
      res.status(400).send(formatError(err))
    })
})

/**
 * Format error messages as string
 * @param {Error} err
 * @return {String} message
 */
function formatError (err) {
  if (err instanceof workerpool.Promise.TimeoutError) {
    return 'TimeoutError: Evaluation exceeded maximum duration of ' + TIMEOUT / 1000 + ' seconds'
  } else {
    return err.toString()
  }
}

// handle uncaught exceptions so the application cannot crash
process.on('uncaughtException', function (err) {
  console.log('Caught exception: ' + err)
  console.trace()
})

// start the server
const PORT = process.env.PORT || 8080
app.listen(PORT, function () {
  console.log('Listening at http://localhost:' + PORT)
  console.log('Example request:\n    GET http://localhost:' + PORT + '/mathjs?expr=sqrt(16)')
})
