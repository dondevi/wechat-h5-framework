/**
 * =============================================================================
 *  Cooking Config
 * =============================================================================
 *
 * @see http://elemefe.github.io/cooking/
 *
 * @author dondevi
 * @create 2016-10-28

 * @update 2017-05-23 dondevi
 *   1.Update: code style
 */

const path = require("path");
const cooking = require("cooking");

cooking.set({

  entry: {
    index: "./src/index.js",
    mock:  "./src/modules/Mock/index.js",
    // ajax: "./src/modules/Core/ajax.js",
    // util: "./src/modules/Util/index.js",
  },
  template: "./src/index.html",

  clean: true,
  extends: ["autoprefixer", /*"karma"*/],
  publicPath: "./",
  assetsPath: "./",
  extractCSS: true,

  alias: {
    "vendors": path.resolve(__dirname, "./vendors"),
    "examples": path.resolve(__dirname, "./examples"),
    "src": path.resolve(__dirname, "./src"),
    "themes": path.resolve(__dirname, "./src/themes"),
    "modules": path.resolve(__dirname, "./src/modules"),
    "components": path.resolve(__dirname, "./src/components"),
  },

  devServer: {
    port: 8000,
    clean: false,
    hostname: "0.0.0.0",
    sourceMap: true,
    publicPath: "/",
  },

});


cooking.add("loader.html", {
  test: /\.html$/,
  loader: "html-loader",
  query: {
    interpolate: true,
    attrs: ["img:src", "link:href", "script:src", "iframe:src"],
  },
});


module.exports = cooking.resolve();
