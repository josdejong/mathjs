module.exports = [
  require('./derivative'),
  require('./derivative.transform'),

  // decomposition
  require('./decomposition/lup'),
  require('./decomposition/slu'),

  // solver
  require('./solver/lsolve'),
  require('./solver/lusolve'),
  require('./solver/usolve')
];
