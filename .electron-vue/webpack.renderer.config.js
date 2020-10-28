'use strict';

process.env.BABEL_ENV = 'renderer';

const path = require('path');
const { dependencies } = require('../package.json');
const webpack = require('webpack');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const TerserPlugin = require('terser-webpack-plugin');

let rendererConfig = {
  devtool: 'inline-source-map',

  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',

  target: 'electron-renderer',

  entry: {
    renderer: path.join(__dirname, '../src/renderer/main.js')
  },
  externals: [...Object.keys(dependencies || {})],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.html$/,
        use: 'vue-html-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: file => (
          /node_modules/.test(file) &&
          !/\.vue\.js/.test(file)
        )
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      },
      {
        test: /\.css$/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'vue-style-loader' :
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: ''
              }
            },
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              importLoaders: 1,
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'vue-style-loader' :
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: ''
              }
            },
            {
            loader: 'css-loader',
            options: {
              esModule: false,
              importLoaders: 1,
              sourceMap: true
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.sass$/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'vue-style-loader' :
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: ''
              }
            },
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              importLoaders: 1,
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true
              }
            }
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          process.env.NODE_ENV !== 'production' ? 'vue-style-loader' :
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: ''
              }
            },
          {
            loader: 'css-loader',
            options: {
              esModule: false,
              importLoaders: 1,
              sourceMap: true
            }
          },
          'less-loader'
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'imgs/[name]--[folder].[ext]'
          }
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'media/[name]--[folder].[ext]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'fonts/[name]--[folder].[ext]'
          }
        }
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  plugins: [
    new VueLoaderPlugin(),

    new MiniCssExtractPlugin({ filename: 'styles.css' }),

    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: path.resolve(__dirname, '../src/index.ejs'),
      minify: {
        collapseWhitespace: true,
        removeAttributeQuotes: true,
        removeComments: true
      },
      nodeModules:
        process.env.NODE_ENV !== 'production'
          ? path.resolve(__dirname, '../node_modules')
          : false
    }),

    new webpack.HotModuleReplacementPlugin({
      multiStep: true,
    }),

    new webpack.NoEmitOnErrorsPlugin(),
  ],

  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist')
  },

  resolve: {
    alias: {
      '@': path.join(__dirname, '../src/renderer'),
      vue$: 'vue/dist/vue.esm.js'
    },
    extensions: ['.js', '.vue', '.json', '.css', '.node']
  },

  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
};

/**
 * Adjust rendererConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  rendererConfig.devtool = process.env.DEBUG_PROD === 'true' ? 'source-map' : 'none';

  rendererConfig.plugins.push(
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production', // use 'production' unless process.env.NODE_ENV is defined
      DEBUG_PROD: false
    }),
  );
}

module.exports = rendererConfig;
