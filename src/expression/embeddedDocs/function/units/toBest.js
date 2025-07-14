export const toBestDocs = {
  name: 'toBest',
  category: 'Units',
  syntax: [
    'toBest(x)',
    'toBest(x, unitList)',
    'toBest(x, unitList, options)'
  ],
  description: 'Converts to the most appropriate display unit.',
  examples: [
    'toBest(unit(5000, "m"))',
    'toBest(unit(3500000, "W"))',
    'toBest(unit(0.000000123, "A"))',
    'toBest(unit(10, "m"), "cm")',
    'toBest(unit(10, "m"), "mm,km", {offset: 1.5})'
  ],
  seealso: []
}
