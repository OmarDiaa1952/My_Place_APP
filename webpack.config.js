const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  mode: "development", // Keep mode as "development"
  entry: {
    SharePlace: "./src/SharePlace.js",
    MyPlace: "./src/MyPlace.js",
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist", "assets", "scripts"),
    publicPath: "assets/scripts/", // Or "/" if you prefer relative paths from root
  },
  devtool: "eval-source-map", // Keep eval-source-map for fast source maps in dev
  devServer: {
    static: {
      directory: path.join(__dirname, "dist"), // Correct static configuration
    },
    hot: true, // Enable Hot Module Replacement (HMR) for faster updates
    // The following is optional, but very helpful
    // open: true, // Automatically open the browser
    // port: 9000, // You can specify a custom port if 8080 is in use
  },
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
    ],
  },
  plugins: [new CleanWebpackPlugin()], // Correct usage
};
