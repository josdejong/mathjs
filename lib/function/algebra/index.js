module.exports = [
  require('./derivative'),

  // simplify
  require('./simplify'),

  // polynomial 
  require('./rationalize'),
  require('./polynomial'),
  
  
  // decomposition
  require('./decomposition/qr'),
  require('./decomposition/lup'),
  require('./decomposition/slu'),

  // solver
  require('./solver/lsolve'),
  require('./solver/lusolve'),
  require('./solver/usolve')
];
