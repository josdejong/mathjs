import { factory } from '../../../utils/factory.js';

const name = 'complexInfinity';
const dependencies = ['typed', 'ComplexInfinity'];

export const createComplexInfinity = /* #__PURE__ */ factory(
  name,
  dependencies,
  ({ typed, ComplexInfinity }) => {

    return typed('complexInfinity', {
      '': function () {
        return new ComplexInfinity()
      }
    });
  }
);
