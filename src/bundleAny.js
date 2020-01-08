const all = require('./factoriesAny')
const { create } = require('./core/create')

const defaultInstance = create(all)

// TODO: not nice having to revert to CommonJS, find an ES6 solution
module.exports = /* #__PURE__ */ defaultInstance
