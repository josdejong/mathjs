math.docs.range = {
    'name': 'range',
    'category': 'Type',
    'syntax': [
        'start:end',
        'start:step:end',
        'range(start, end)',
        'range(start, step, end)',
        'range(string)'
    ],
    'description':
        'Create a range.',
    'examples': [
        '1:5',
        '3:-1:-3',
        'range(3, 6)',
        'range(0, 2, 10)',
        'range("4:10")',
        'a = [1, 2, 3; 4, 5, 6]',
        'a(:, 2:3)'
    ],
    'seealso': [
        'boolean', 'complex', 'matrix', 'number', 'string', 'unit'
    ]
};
