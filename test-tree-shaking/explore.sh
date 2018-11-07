#!/bin/sh

sh bundle_and_run.sh

# explore the contents
npx source-map-explorer bundles/usecase1.bundle.js
npx source-map-explorer bundles/usecase2.bundle.js
npx source-map-explorer bundles/usecase3.bundle.js
npx source-map-explorer bundles/usecase4.bundle.js
npx source-map-explorer bundles/usecase5.bundle.js
npx source-map-explorer bundles/usecase6.bundle.js
