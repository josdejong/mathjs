'use strict'

const all = require('../factoriesAny')
const { create } = require('./instance')

const defaultInstance = create(all)

// TODO: not nice having to revert to CommonJS, find an ES6 solution
module.exports = /* #__PURE__ */ defaultInstance
