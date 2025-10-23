import { factory } from '../../utils/factory.js'

export const createUseMatrixForArrayScalar = /* #__PURE__ */ factory('useMatrixForArrayScalar', ['typed', 'DenseMatrix'], ({ typed, DenseMatrix }) => ({
  'Array, number': typed.referTo('DenseMatrix, number',
    selfDn => (x, y) => selfDn(new DenseMatrix(x), y).valueOf()),

  'Array, BigNumber': typed.referTo('DenseMatrix, BigNumber',
    selfDB => (x, y) => selfDB(new DenseMatrix(x), y).valueOf()),

  'number, Array': typed.referTo('number, DenseMatrix',
    selfnD => (x, y) => selfnD(x, new DenseMatrix(y)).valueOf()),

  'BigNumber, Array': typed.referTo('BigNumber, DenseMatrix',
    selfBD => (x, y) => selfBD(x, new DenseMatrix(y)).valueOf())
}))
