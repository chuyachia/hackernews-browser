// TODO split bundle, dynamic import, extract css to files?
const path = require("path");
const webpack = require("webpack");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = (env, arg) => {
  return {
    entry: "./src/index.js",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[hash].bundle.js"
    },
    resolve: { extensions: [".js", ".jsx"] },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: "babel-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.(css|sass)$/,
          loader: ["style-loader","css-loader","sass-loader"],
        }
      ]
    },
    devServer: {
      port: 8080,
      contentBase: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        title: "Hacker News Browser",
        template: path.resolve(__dirname,"public","index.html"),
      }),
      new webpack.DefinePlugin({
        __HACKER_NEWS_BASE__: "'https://hacker-news.firebaseio.com/v0'",
      })
    ]
  }
}