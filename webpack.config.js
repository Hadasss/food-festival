const webpack = require("webpack");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const path = require("path");
const WebpackPwaManifest = require("webpack-pwa-manifest");

const config = {
  entry: {
    app: "./assets/js/script.js",
    events: "./assets/js/events.js",
    schedule: "./assets/js/schedule.js",
    tickets: "./assets/js/tickets.js",
  },
  output: { filename: "[name].bundle.js", path: __dirname + "/dist" },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              esModule: false,
              name(file) {
                return "[path][name].[ext]";
              },
              publicPath(url) {
                return url.replace("../", "/assets/");
              },
            },
          },
          {
            loader: "image-webpack-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }),
    // the report outputs to an HTML file in the dist folder:
    new BundleAnalyzerPlugin({ analyzerMode: "static" }),
    new WebpackPwaManifest({
      name: "Food Event",
      short_name: "Foodies",
      description: "An app that allows you to view upcoming food events.",
      start_url: "../index.html",
      background_color: "#01579b",
      theme_color: "#ffffff",
      // fingerprints and inject—were not present in our manifest.json. That is because they are both specific to the manifest plugin. Fingerprints tell webpack whether or not it should generate unique fingerprints so that each time a new manifest is generated, it looks like this: manifest.lhge325d.json. Because we do not want this feature, we set fingerprints to be false.
      fingerprints: false,
      // The inject property determines whether the link to the manifest.json is added to the HTML. Because we are not using fingerprints, we can also set inject to be false. We will hardcode the path to the manifest.json instead, just like we would in an application without webpack.
      inject: false,
      icons: [
        {
          src: path.resolve("assets/img/icons/icon-512x512.png"),
          sizes: [96, 128, 192, 256, 384, 512],
          // the destination property designates where the icons will be sent after the creation of the web manifest is completed by the plugin.
          destination: path.join("assets", "icons"),
        },
      ],
    }),
  ],

  mode: "development",
};

module.exports = config;
