const testsContext = require.context('../unit-tests/', true, /.test\.js$/)

testsContext.keys().forEach(testsContext)
