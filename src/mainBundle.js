'use strict'

const { create } = require('./mainInstance')

const defaultInstance = create()

// TODO: not nice having to revert to CommonJS, find an ES6 solution
module.exports = /* #__PURE__ */ defaultInstance
