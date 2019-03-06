const rollup = require('rollup');
const uglify = require('rollup-plugin-uglify-es');

/**
 * Bundle the JavaScript components together and smoosh them with uglify
 */
async function bundleJavaScript() {
  const bundle = await rollup.rollup({
    input: `${__dirname}/src/tatl.js`,
    plugins: [uglify()]
  });

  await bundle.write({
    format: 'umd',
    name: 'tatl',
    dir: `${__dirname}/dist`
  });
}

bundleJavaScript();
