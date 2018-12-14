const gls_const = require('gsl-const')
// https://github.com/mariuszgromada/MathParser.org-mXparser/blob/86a2af45cd5cb7d7c121dc9d7104c240258ac550/CURRENT/c-sharp/src/org/mariuszgromada/math/mxparser/mathcollection/MathConstants.cs
const constant = {
    /**
     * Euler-Mascheroni constant
     */
    EULER_MASCHERONI: 0.57721566490153286060651209008240243,
    /**
     * Plastic constant
     */
    PLASTIC: 1.32471795724474602596090885447809734,
    /**
     * Embree-Trefethen constant
     */
    EMBREE_TREFETHEN: 0.70258,
    /**
     * Feigenbaum constant
     */
    FEIGENBAUM_DELTA: 4.66920160910299067185320382046620161,
    /**
     * Feigenbaum constant
     */
    FEIGENBAUM_ALFA: 2.50290787509589282228390287321821578,
    /**
     * Feigenbaum constant
     */
    TWIN_PRIME: 0.66016181584686957392781211001455577,
    /**
     * Meissel-Mertens constant
     */
    MEISSEL_MERTEENS: 0.26149721284764278375542683860869585,
    /**
     * Brun's constant for twin primes
     */
    BRAUN_TWIN_PRIME: 1.9021605823,
    /**
     * Brun's constant for prime quadruplets
     */
    BRAUN_PRIME_QUADR: 0.8705883800,
    /**
     * de Bruijn-Newman constant
     */
    BRUIJN_NEWMAN: -2.7E-9,
    /**
     * Catalan's constant
     */
    CATALAN: 0.91596559417721901505460351493238411,
    /**
     * Landau-Ramanujan constant
     */
    LANDAU_RAMANUJAN: 0.76422365358922066299069873125009232,
    /**
     * Viswanath's constant
     */
    VISWANATH: 1.13198824,
    /**
     * Legendre's constant
     */
    LEGENDRE: 1.0,
    /**
     * Ramanujan-Soldner constant
     */
    RAMANUJAN_SOLDNER: 1.45136923488338105028396848589202744,
    /**
     * Erdos-Borwein constant
     */
    ERDOS_BORWEIN: 1.60669515241529176378330152319092458,
    /**
     * Bernstein's constant
     */
    BERNSTEIN: 0.28016949902386913303,
    /**
     * Gauss-Kuzmin-Wirsing constant
     */
    GAUSS_KUZMIN_WIRSING: 0.30366300289873265859744812190155623,
    /**
     * Hafner-Sarnak-McCurley constant
     */
    HAFNER_SARNAK_MCCURLEY: 0.35323637185499598454,
    /**
     * Golomb-Dickman constant
     */
    GOLOMB_DICKMAN: 0.62432998854355087099293638310083724,
    /**
     * Cahen's constant
     */
    CAHEN: 0.6434105463,
    /**
     * Laplace limit
     */
    LAPLACE_LIMIT: 0.66274341934918158097474209710925290,
    /**
     * Alladi-Grinstead constant
     */
    ALLADI_GRINSTEAD: 0.8093940205,
    /**
     * Lengyel's constant
     */
    LENGYEL: 1.0986858055,
    /**
     * Levy's constant
     */
    LEVY: 3.27582291872181115978768188245384386,
    /**
     * Apery's constant
     */
    APERY: 1.20205690315959428539973816151144999,
    /**
     * Mills' constant
     */
    MILLS: 1.30637788386308069046861449260260571,
    /**
     * Backhouse's constant
     */
    BACKHOUSE: 1.45607494858268967139959535111654356,
    /**
     * Porter's constant
     */
    PORTER: 1.4670780794,
    /**
     * Porter's constant
     */
    LIEB_QUARE_ICE: 1.5396007178,
    /**
     * Niven's constant
     */
    NIVEN: 1.70521114010536776428855145343450816,
    /**
     * Sierpiński's constant
     */
    SIERPINSKI: 2.58498175957925321706589358738317116,
    /**
     * Khinchin's constant
     */
    KHINCHIN: 2.68545200106530644530971483548179569,
    /**
     * Fransén-Robinson constant
     */
    FRANSEN_ROBINSON: 2.80777024202851936522150118655777293,
    /**
     * Landau's constant
     */
    LANDAU: 0.5,
    /**
     * Parabolic constant
     */
    PARABOLIC: 2.29558714939263807403429804918949039,
    /**
     * Omega constant
     */
    OMEGA: 0.56714329040978387299996866221035555,
    /**
     * MRB constant
     */
    MRB: 0.187859,
    /**
     * A069284 - Logarithmic integral function li(2)
     */
    LI2: 1.045163780117492784844588889194613136522615578151,
    /**
     * Gompertz Constant OEIS A073003
     */
    GOMPERTZ: 0.596347362323194074341078499369279376074,
    /**
     * Square root of 2
     */
    SQRT2: 1.4142135623730950488016887242096980785696718753769,
    /**
     * Square root of pi
     */
    SQRTPi: 1.772453850905516027298167483341145182797549456122387128213,

    /**
     * Natural logarithm of pi
     */
    LNPI: Math.log(Math.PI),
    /**
     * Tetration left convergence limit
     */
    EXP_MINUS_E: Math.pow(Math.E, -Math.E),
    /**
     * Tetration right convergence limit
     */
    EXP_1_OVER_E: Math.pow(Math.E, 1.0 / Math.E),
    /**
     * 1 over e
     */
    EXP_MINUS_1: 1.0 / Math.E,
    /**
     * Natural logarithm of sqrt(2)
     */
    LN_SQRT2: Math.log(Math.sqrt(2)),
    /**
     * Not-a-Number
     */
    NOT_A_NUMBER: NaN,
}
module.exports = {
    more: constant,
    phy: gls_const
} 