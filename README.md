# math.js website

This project contains the website of math.js, available at https://mathjs.org.
The website is static, and is hosted on [github pages](https://pages.github.com/).


# Update

To update the website with the latest version of math.js:

- Update the version number of math.js in package.json.

- Install the dependencies via npm:

      npm install

- Update the docs, examples, and version number via the build tool:

      npm run build

- Ensure any new pages are added to git.

- To generate the website locally using [Jekyll](https://jekyllrb.com/):

      jekyll

  This will generate the static website in the folder `_site`.

- To test the website locally, use Jekyll as server:

      jekyll --server 4000
  
  The website is than available in the browser at http://localhost:4000.


# Deploy

To deploy the website, all that is needed is to commit the changes via git, 
and push the changes to the `gh-pages` branch of math.js on github.
