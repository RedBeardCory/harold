const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

const config = {
  target: 'node',
  externals: [nodeExternals()],
  entry: './src/Main.js',
  output: {
    path: path.resolve('dist'),
    filename: 'harold.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  stats: {
    colors: true
  },
  devtool: 'source-map'
};

module.exports = config;
