/* eslint-env node */
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const PreloadWebpackPlugin = require('@vue/preload-webpack-plugin');

const path = require('path')
const webpack = require('webpack')
const mode = process.env.NODE_ENV || 'development'
const prod = mode === 'production'

module.exports = env => {
  const isStaging = env.STAGING === 'true'

  return {
    entry: {
      bundle: ['./src/main.js']
    },
    devServer: {
      historyApiFallback: true
    },
    resolve: {
      alias: {
        svelte: path.resolve('node_modules', 'svelte')
      },
      extensions: ['.mjs', '.js', '.svelte'],
      mainFields: ['svelte', 'browser', 'module', 'main']
    },
    output: {
      path: __dirname + '/build',
      filename: '[name].[contentHash].js',
      chunkFilename: '[name].[contentHash].[id].js'
    },
    optimization: {
      minimize: true,
      moduleIds: 'hashed',
      runtimeChunk: 'single'
    },
    node: {
      crypto: true
    },
    module: {
      rules: [
        {
          test: /\.svelte$/,
          use: {
            loader: 'svelte-loader',
            options: {
              emitCss: true,
              hotReload: true
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            /**
             * MiniCssExtractPlugin doesn't support HMR.
             * For developing, use 'style-loader' instead.
             * */
            prod ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader'
          ]
        }
      ]
    },
    mode,
    plugins: [
      new CopyWebpackPlugin({
        patterns: [{ from: 'public', to: '' }]
      }),
      new HtmlWebpackPlugin({
        template: 'src/template.html',
        scriptLoading: 'defer'
      }),
      new MiniCssExtractPlugin({
        filename: '[name].[contentHash].css'
      }),
      new PreloadWebpackPlugin({
        fileWhitelist: [/\.css$/]
      }),
      new webpack.DefinePlugin({
        STAGING: JSON.stringify(isStaging),
        WS_URL: isStaging
          ? JSON.stringify('wss://staging.api.blocknative.com/v0')
          : JSON.stringify('wss://api.blocknative.com/v0'),
        API_URL: isStaging
          ? JSON.stringify('https://staging.api.blocknative.com')
          : JSON.stringify('https://api.blocknative.com'),
        EXPORT_CONFIG: isStaging
      })
    ],
    devtool: prod ? false : 'source-map'
  }
}
