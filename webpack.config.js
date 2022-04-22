const path = require("path");
const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = {
  entry: "./assets/js/script.js",
  output: { path: path.resolve(__dirname, "dist"), filename: "main.bundle.js" },
  plugins: [
    new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
    // the report outputs to an HTML file in the dist folder:
    new BundleAnalyzerPlugin({ analyzerMode: "static" }),
  ],

  mode: "development",
};
