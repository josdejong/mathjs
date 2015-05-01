module.exports = [
  require('./clone'),
  // note: config is already loaded by core.js
  require('./filter'),
  require('./format'),
  // note: import is already loaded by core.js
  require('./map'),
  require('./print'),
  require('./sort'),
  require('./typeof'),
  require('./forEach')
];
