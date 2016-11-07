module.exports = [
  require('./derivative'),
  require('./derivative.transform'),

  // simplify
  require('./simplify'),
  require('./simplify/simplifyConstant'),
  require('./simplify/simplifyDerivative'),
  require('./simplify.transform'),

  // decomposition
  require('./decomposition/lup'),
  require('./decomposition/slu'),

  // solver
  require('./solver/lsolve'),
  require('./solver/lusolve'),
  require('./solver/usolve')
];
