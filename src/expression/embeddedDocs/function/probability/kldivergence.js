export const kldivergenceDocs = {
  name: 'kldivergence',
  category: 'Probability',
  syntax: [
    'kldivergence(reference, test)'
  ],
  description: 'Calculate the Kullback-Leibler (KL) divergence of the reference distribution relative to the test distribution. The input vectors are normalized, and swapping them can change the result.',
  examples: [
    'kldivergence([0.7, 0.5, 0.4], [0.2, 0.9, 0.5])',
    'kldivergence([0.2, 0.9, 0.5], [0.7, 0.5, 0.4])'
  ],
  seealso: []
}
