#!/usr/bin/env node

/*
 * This simply preloads mathjs and drops you into a REPL to
 * help interactive debugging.
 **/
global.math = require('../lib/browser/math.js')
const repl = require('repl')

repl.start({ useGlobal: true })
