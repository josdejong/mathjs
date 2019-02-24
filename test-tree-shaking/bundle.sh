#!/bin/sh

# bundle
npx webpack usecase1.js -o bundles/usecase1.bundle.js --mode=production --devtool source-map
npx webpack usecase2.js -o bundles/usecase2.bundle.js --mode=production --devtool source-map
npx webpack usecase3.js -o bundles/usecase3.bundle.js --mode=production --devtool source-map
npx webpack usecase4.js -o bundles/usecase4.bundle.js --mode=production --devtool source-map
npx webpack usecase5.js -o bundles/usecase5.bundle.js --mode=production --devtool source-map
npx webpack usecase6.js -o bundles/usecase6.bundle.js --mode=production --devtool source-map
npx webpack usecase7.js -o bundles/usecase7.bundle.js --mode=production --devtool source-map

# run
node bundles/usecase1.bundle.js
node bundles/usecase2.bundle.js
node bundles/usecase3.bundle.js
node bundles/usecase4.bundle.js
node bundles/usecase5.bundle.js
node bundles/usecase6.bundle.js
node bundles/usecase7.bundle.js
#
## zip the bundles
tar -czvf bundles/usecase1.bundle.js.tar.gz bundles/usecase1.bundle.js
tar -czvf bundles/usecase2.bundle.js.tar.gz bundles/usecase2.bundle.js
tar -czvf bundles/usecase3.bundle.js.tar.gz bundles/usecase3.bundle.js
tar -czvf bundles/usecase4.bundle.js.tar.gz bundles/usecase4.bundle.js
tar -czvf bundles/usecase5.bundle.js.tar.gz bundles/usecase5.bundle.js
tar -czvf bundles/usecase6.bundle.js.tar.gz bundles/usecase6.bundle.js
tar -czvf bundles/usecase7.bundle.js.tar.gz bundles/usecase7.bundle.js
ls bundles -lah | grep '.tar.gz'

## explore the contents of the bundles
npx source-map-explorer bundles/usecase1.bundle.js
npx source-map-explorer bundles/usecase2.bundle.js
npx source-map-explorer bundles/usecase3.bundle.js
npx source-map-explorer bundles/usecase4.bundle.js
npx source-map-explorer bundles/usecase5.bundle.js
npx source-map-explorer bundles/usecase6.bundle.js
npx source-map-explorer bundles/usecase7.bundle.js
