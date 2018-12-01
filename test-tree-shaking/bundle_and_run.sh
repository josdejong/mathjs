#!/bin/sh

# bundle
npx webpack usecase1.js -o bundles/usecase1.bundle.js --mode=production --devtool source-map
npx webpack usecase2.js -o bundles/usecase2.bundle.js --mode=production --devtool source-map
npx webpack usecase3.js -o bundles/usecase3.bundle.js --mode=production --devtool source-map
npx webpack usecase4.js -o bundles/usecase4.bundle.js --mode=production --devtool source-map
npx webpack usecase5.js -o bundles/usecase5.bundle.js --mode=production --devtool source-map
npx webpack usecase6.js -o bundles/usecase6.bundle.js --mode=production --devtool source-map

# run
node bundles/usecase1.bundle.js
node bundles/usecase2.bundle.js
node bundles/usecase3.bundle.js
node bundles/usecase4.bundle.js
node bundles/usecase5.bundle.js
node bundles/usecase6.bundle.js
