/**
 * =============================================================================
 *  Karma configuration
 * =============================================================================
 *
 * @see http://karma-runner.github.io/0.13/config/configuration-file.html
 * @see https://github.com/webpack/karma-webpack
 *
 * @author dondevi
 * @create 2017-05-25
 *
 */

const path = require("path");
const merge = require("webpack-merge");
const webpack = require("webpack");
const projectRoot = path.resolve(__dirname, "./");

var webpackConfig = require("./cooking.conf.js");


// No need for app entry and plugin during testing
delete webpackConfig.entry;
delete webpackConfig.plugins;


webpackConfig = merge(webpackConfig, {
  devtool: "#inline-source-map",
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify("testing")
    })
  ]
});


const karmaConfig = {
  // Plugins config
  webpack: webpackConfig,
  webpackMiddleware: {
    noInfo: true
  },
  // list of files / patterns to load in the browser
  files: [
    "tests/**.js"
  ],
  // list of files to exclude
  exclude: [
  ],
  // frameworks to use
  // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
  frameworks: ["mocha", "sinon-chai"],
  // preprocess matching files before serving them to the browser
  // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
  preprocessors: {
    "**/*.js": [/*"babel", */"webpack", "sourcemap"]
  },
  // test results reporter to use
  // possible values: "dots", "progress"
  // available reporters: https://npmjs.org/browse/keyword/karma-reporter
  reporters: ["progress", /*"spec"*/],
  // start these browsers
  // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
  browsers: [/*"Chrome",*/ "PhantomJS"],
  // web server port
  port: 9876,
  // level of logging
  // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
  logLevel: config.LOG_INFO,
  // logLevel: config.LOG_DEBUG,
  // enable / disable watching file and executing tests whenever any file changes
  autoWatch: false,
  // Continuous Integration mode
  // if true, Karma captures browsers, runs the tests and exits
  singleRun: true,
  // coverageReporter: {
  //   dir: "./coverage",
  //   reporters: [
  //     { type: "lcov", subdir: "." },
  //     { type: "text-summary" }
  //   ]
  // }
};


module.exports = function (config) {
  config.set(karmaConfig);
};
