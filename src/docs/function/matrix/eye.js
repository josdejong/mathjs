math.docs.eye = {
    "name": "eye",
    "category": "Numerics",
    "syntax": [
        "eye(n)",
        "eye(m, n)",
        "eye([m, n])",
        "eye"
    ],
    "description": "Returns the identity matrix with size m-by-n. The matrix has ones on the diagonal and zeros elsewhere.",
    "examples": [
        "eye(3)",
        "eye(3, 5)",
        "a = [1, 2, 3; 4, 5, 6]",
        "eye(size(a))"
    ],
    "seealso": [
        "concat", "det", "diag", "inv", "ones", "range", "size", "squeeze", "transpose", "zeros"
    ]
};
