module.exports = [
  require('./derivative'),
  
  // decomposition
  require('./decomposition/lup'),

  // solver
  require('./solver/lsolve'),
  require('./solver/lusolve'),
  require('./solver/usolve')
];
