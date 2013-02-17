/**
 * Return a random number between 0 and 1
 * @return {Number} res
 */
function random () {
    // TODO: implement parameter min and max
    return Math.random();
}

math.random = random;

/**
 * Function documentation
 */
random.doc = {
    'name': 'random',
    'category': 'Probability',
    'syntax': [
        'random()'
    ],
    'description':
        'Return a random number between 0 and 1.',
    'examples': [
        'random()',
        '100 * random()'
    ],
    'seealso': []
};
