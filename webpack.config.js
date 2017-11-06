var webpack = require('webpack');
var path = require('path');
var nodeExternals = require('webpack-node-externals');

var config = {
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/bot.js',
  output: {
    path: path.resolve('dist'),
    filename: 'harold.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
};

module.exports = config;
