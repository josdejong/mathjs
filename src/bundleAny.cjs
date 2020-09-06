var all = require('./factoriesAny.js')
var coreCreate = require('./core/create.js')

var defaultInstance = coreCreate.create(all)

// TODO: not nice having to revert to CommonJS, find an ES6 solution
module.exports = /* #__PURE__ */ defaultInstance
