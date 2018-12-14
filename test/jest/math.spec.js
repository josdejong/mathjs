// const math = require('../../dist/math')
const math = require('../../src/main')
it(`extend math and add physical constants`, () => {
    expect(math.more).toBeInstanceOf(Object)
    expect(math.phy).toBeInstanceOf(Object)
});

describe(`compareEquation`, () => {
    it(`test compareEquation functionality`, () => {
        expect(math.compareEquation).toBeInstanceOf(Function)
        expect(math.compareEquation('a^2+b^2c^2')).toBeFalsy()
        expect(math.compareEquation('a^2+b^2=c^2', {
            a: 3,
            b: 4,
            c: 5
        })).toBeTruthy()
        expect(math.compareEquation('a^2+b^2=c^2', {
            a: 3,
            b: 4,
            c: 6
        })).toBeFalsy()
    });
    it(`The probability density of the normal distribution is`, () => {
        expect(math.compareEquation(`density=1/sqrt (2*pi *sigma ^2)*e^(-(x-u )^2/(2*sigma ^2))`, {
            sigma: 0.5,
            x: 1,
            u: 5,
            density: 1.0104542167073798e-14
        })).toBeTruthy()
    });
    it(`Count the number of elements of a (multi)set. When a second parameter is ‘true’, count only the unique values. A multi-dimension array will be converted to a single-dimension array before the operation.`, () => {
        expect(math.compareEquation('left=right', {
            right: math.setSize([1, 2, 2, 4]),
            left: 4
        })).toBeTruthy()
        expect(math.compareEquation('left=right', {
            right: math.setSize([1, 2, 2, 4], true),
            left: 3
        })).toBeTruthy()
        expect(math.compareEquation('left=right', {
            right: math.setSize([[1, 2, 2, 4], [1, 1, 7]], true),
            left: 4
        })).toBeTruthy()
    });
    it(`Function sum can compute the sum of a matrix`, () => {
        expect(math.compareEquation('left=right', {
            right: math.sum([[2, 5], [4, 3], [1, 7]]),
            left: 22
        })).toBeTruthy()
    });
    describe(`https://en.wikipedia.org/wiki/Black-body_radiation`, () => {
        it(`{\displaystyle B_{\nu }(T)={\frac {2h\nu ^{3}}{c^{2}}}{\frac {1}{e^{\frac {h\nu }{kT}}-1}},}`, () => {
            expect(math.eval(`B_(T)=2*h*v ^3/c^2*1/(e^(h*v/(k*T))-1)`)).toEqual(expect.any(Function))
        });
    });
    describe(`http://mathjs.org/docs/reference/functions/random.html`, () => {
        it(`Return a random number larger or equal to min and smaller than max using a uniform distribution.`, () => {
            expect(math.compareEquation('left>right', {
                right: math.random(),
                left: 1
            })).toBeTruthy();
            expect(math.compareEquation('left>right', {
                right: math.random(100),
                left: 100
            })).toBeTruthy()
            expect(math.compareEquation('left<right', {
                left: math.random(30, 40),
                right: 40
            })).toBeTruthy()
            expect(math.compareEquation('left=right', {
                right: math.random([2, 3]).length,
                left: 2
            })).toBeTruthy()
            expect(math.compareEquation('left=right', {
                right: math.random([2, 3])[0].length,
                left: 3
            })).toBeTruthy()
        });
    });
});

