math.docs.subset = {
    'name': 'subset',
    'category': 'Matrix',
    'syntax': [
        'value(index)',
        'value(index) = replacement',
        'subset(value, [index])',
        'subset(value, [index], replacement)'
    ],
    'description': 'Get or set a subset of a matrix or string.',
    'examples': [
        'd = [1, 2; 3, 4]',
        'e = []',
        'e(0, 0:1) = [5, 6]',
        'e(1, :) = [7, 8]',
        'f = d * e',
        'f(1, 0)',
        'f(:, 0)'
    ],
    'seealso': [
        'concat', 'det', 'diag', 'eye', 'inv', 'ones', 'range', 'size', 'squeeze', 'transpose', 'zeros'
    ]
};
