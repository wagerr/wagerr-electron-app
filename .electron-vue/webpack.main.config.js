'use strict';

process.env.BABEL_ENV = 'main';

const path = require('path');
const { dependencies } = require('../package.json');
const webpack = require('webpack');

const TerserPlugin = require('terser-webpack-plugin');

let mainConfig = {
  devtool: 'source-map',
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  },
  externals: [...Object.keys(dependencies || {})],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist')
  },
  plugins: [new webpack.NoEmitOnErrorsPlugin()],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main',
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
        cache: true
      })
    ]
  }
};

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.plugins.push(
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production', // use 'production' unless process.env.NODE_ENV is defined
      DEBUG_PROD: false
    })
  );
}

module.exports = mainConfig;
