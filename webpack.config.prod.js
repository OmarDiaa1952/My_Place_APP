const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin"); // For minification
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // For CSS extraction

module.exports = {
  mode: "production", // Correct mode
  entry: {
    "share-place": "./src/SharePlace.js",
    "my-place": "./src/MyPlace.js",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist", "assets", "scripts"),
    publicPath: "assets/scripts/", // Or "/" if you want relative paths from root
  },
  devtool: "source-map", // Or 'hidden-source-map' if you don't want source maps in production
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                { useBuiltIns: "usage", corejs: { version: 3 } },
              ],
            ],
          },
        },
      },
      {
        // Example: If you have css or scss files
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [new TerserPlugin()], // Minify JavaScript
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      // Extract CSS into separate files
      filename: "[name].[contenthash].css", // Name the output CSS files
    }),
  ],
};
