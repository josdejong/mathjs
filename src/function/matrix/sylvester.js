import { factory } from '../../utils/factory.js'

const name = 'sylvester'
const dependencies = ['typed', 'schur', 'matrixFromColumns', 'matrix', 'multiply', 'range', 'concat', 'transpose', 'index', 'subset', 'add', 'subtract', 'identity', 'lusolve']


export const createSylvester = /* #__PURE__ */ factory(name, dependencies, ({ typed, schur, matrixFromColumns, matrix, multiply, range, concat, transpose, index, subset, add, subtract, identity, lusolve }) => {
 /**
   * 
   * Solves the real-valued Sylvester equation AX-XB=C for X, where A, B and C are 
   * matrices of appropriate dimensions, being A and B squared. The method used is 
   * the Bartels-Stewart algorithm.
   * https://en.wikipedia.org/wiki/Sylvester_equation
   * 
   * Syntax:
   *
   *     math.sylvester(A, B, C)
   *
   * Examples:
   *
   *     const A = [[1, 2], [2, 1]]
   *     const B = [[3, 2], [2, 2]]
   *     const C = [[-2, 0], [1, 3]]
   *     const X = math.sylvester(A, B, C)        // returns [[-0.2, 0.8], [-0.8, 0.2]] 
   *
   * See also:
   *
   *     schur, lyap
   *
   * @param {Matrix} A  Matrix A
   * @param {Matrix} B  Matrix B
   * @param {Matrix} C  Matrix C
   * @return {Matrix}   Matrix X, solving the Sylvester equation
   */
  return typed(name, {
    'Matrix, Matrix, Matrix': function (A,B,C) {
        let n = A.size()[0];
        let sA = schur(A)
        let F = sA.T  
        let U = sA.U
        let sB = schur(B)
        let G = sB.T
        let V = sB.U
        let D = multiply(multiply(transpose(U),C),V)
        let all = range(0,n)
        let y = [];
    
    
        hc = (a,b) => concat(a,b,1)  
        vc = (a,b) => concat(a,b,0)  
    
        for (let k=0; k<n; k++){
            if (k<(n-1) && abs(subset(G,index(k+1,k)))>1e-5){ 
                let RHS = vc(subset(D,index(all,k)), subset(D,index(all,k+1)))
                for (let j=0; j<k; j++)
                    RHS = add(RHS, 
                        vc(multiply(y[j], subset(G,index(j,k))), multiply(y[j], subset(G,index(j,k+1))))
                        )
                let gkk = multiply(identity(n), multiply(-1, subset(G,index(k,k))))
                let gmk = multiply(identity(n), multiply(-1, subset(G,index(k+1,k))))
                let gkm = multiply(identity(n), multiply(-1, subset(G,index(k,k+1))))
                let gmm = multiply(identity(n), multiply(-1, subset(G,index(k+1,k+1))))
                let LHS = vc(
                    hc(add(F,gkk), gmk),
                    hc(gkm,             add(F,gmm)),
                )
                // y_aux = multiply(inv(LHS), RHS)
                y_aux = lusolve(LHS, RHS)
                y[k] = y_aux.subset(index(range(0,n),0))
                y[k+1] = y_aux.subset(index(range(n,2*n),0))
                k++;
                
            }
            else { 
                let RHS = subset(D,index(all,k))
                for (let j=0; j<k; j++)
                    RHS = add(RHS, multiply(y[j], subset(G,index(j,k))))
                let gkk = subset(G,index(k,k))
                let LHS = subtract(F,multiply(gkk,identity(n)))
                
                y[k] = lusolve(LHS, RHS)
                
            }
        }
        let Y = matrix(matrixFromColumns(...y))
        let X = multiply(U, multiply(Y, transpose(V)))
    
    
        return X
    }
  })
})

