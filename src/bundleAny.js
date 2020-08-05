const all = require('./factoriesAny.js')
const { create } = require('./core/create.js')

const defaultInstance = create(all)

// TODO: not nice having to revert to CommonJS, find an ES6 solution
module.exports = /* #__PURE__ */ defaultInstance
