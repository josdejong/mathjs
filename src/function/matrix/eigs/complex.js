export function createComplex({add, multiply, abs, bignumber, diag}) {
    /**
     * @param {number[][]} arr
     * @param {number} N
     * @param {number|BigNumber} prec
     * @param {'number'|'BigNumber'|'Complex'} type
     */
    function main(arr, N, prec, type)
    {
        // TODO check if any row/col are zero except the diagonal

        let R = balance(arr, N, prec, type)

        console.log(arr, R)

        throw new Error('Not implemented yet.')
    }

    function balance(arr, N, prec, type)
    {
        const big  = type === 'BigNumber'
        const cplx = type === 'Complex'

        const bigZero = bignumber(0)
        const bigOne  = bignumber(1)

        // base of the floating-point arithmetic
        const radix = big ? bignumber(10) : 2
        const radixSq = multiply(radix, radix)

        // the diagonal transformation matrix R
        const Rdiag = Array(+N).fill(big ? bigOne : 1)

        // this isn't the only time we loop thru the matrix...
        let last = false

        while (!last)
        {
            // ...haha I'm joking! unless...
            last = true

            for (let i = 0; i < N; i++)
            {

                // compute the taxicab norm of i-th column and row
                let colNorm = big ? bigZero : 0
                let rowNorm = big ? bigZero : 0

                for (let j = 0; j < N; j++)
                {
                    if (i === j) continue;
                    let c = big||cplx ? arr[i][j].abs() : Math.abs(arr[i][j])
                    let r = big||cplx ? arr[j][i].abs() : Math.abs(arr[j][i])
                    colNorm = big ? colNorm.add(c) : colNorm + c
                    rowNorm = big ? rowNorm.add(c) : rowNorm + r
                }


                if (big ? !colNorm.equals(0) && !rowNorm.equals(0) : colNorm !== 0 && rowNorm !== 0)
                {
                    // find integer power closest to balancing the matrix
                    let f = big ? bignumber(1) : 1
                    let c = colNorm

                    const rowDivRadix = big ? rowNorm.div(radix) : rowNorm/radix
                    const rowMulRadix = big ? rowNorm.mul(radix) : rowNorm*radix

                    if (!big) {
                        while (c < rowDivRadix) {
                            c *= radixSq
                            f *= radix
                        }
                        while (c > rowMulRadix) {
                            c /= radixSq
                            f /= radix
                        }
                    } else {
                        while (c.lessThan(rowDivRadix)) {
                            c = c.mul(radixSq)
                            f = f.mul(radix)
                        }
                        while (c.greaterThan(rowMulRadix)) {
                            c = c.div(radixSq)
                            f = f.div(radix)
                        }
                    }


                    // check whether balancing is needed
                    const condition = !big
                        ? (c + rowNorm)/f < 0.95*(colNorm + rowNorm)
                        : c.add(rowNorm).div(f).lessThan(colNorm.add(rowNorm).mul(0.95))


                    // apply balancing similarity transformation
                    if (condition)
                    {
                        // okay bro we should definitely loop once again
                        last = false

                        let g = big ? bigOne.div(f) : 1/f
                        R[i] = big ? R[i].mul(f) : R[i]*f

                        for (let j = 0; j < N; j++)
                        {
                            arr[i][j] = multiply(arr[i][j], g)
                            arr[j][i] = multiply(arr[j][i], f)
                        }
                    }

                }
            }
        }

        // return the diagonal transformation matrix
        return diag(Rdiag);
    }


    return main;
}