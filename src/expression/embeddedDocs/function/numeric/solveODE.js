export const solveODEDocs = {
  name: 'solveODE',
  category: 'Numeric',
  syntax: [
    'solveODE(func, tspan, y0)',
    'solveODE(func, tspan, y0, options)'
  ],
  description: 'Numerical Integration of Ordinary Differential Equations.',
  examples: [
    'f(t,y) = y',
    'tspan = [0, 4]',
    'solveODE(f, tspan, 1)',
    'solveODE(f, tspan, [1, 2])',
    'solveODE(f, tspan, 1, { method:"RK23", maxStep:0.1 })'
  ],
  seealso: ['derivative', 'simplifyCore']
}
