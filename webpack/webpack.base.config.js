const { resolve } = require('path')

const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const CONTEXT = resolve(__dirname, '..', 'src')
const BUILD = resolve(__dirname, '..', 'build')
const NODE_MODULES = resolve(__dirname, '..', 'node_modules')
const TS_CONFIG = resolve(__dirname, '..', 'tsconfig.json')

const DEMO_NAME = 'index'
const DEMO_TEMPLATE = resolve(CONTEXT, `${DEMO_NAME}.pug`)

const loadersForCSS = [
  'style-loader',
  MiniCssExtractPlugin.loader,
  'css-loader',
]

module.exports = {
  externals: {
    paths: {
      build: BUILD,
    },
  },

  context: CONTEXT,

  entry: './index.ts',

  output: {
    filename: '[name].js',
    path: BUILD,
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /.pug$/,
        use: {
          loader: 'pug-loader',
          options: {
            root: CONTEXT,
          },
        },
      },

      {
        test: /.scss$/,
        use: [...loadersForCSS, 'sass-loader'],
      },

      {
        test: /.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },

  resolve: {
    extensions: ['.ts', '.js'],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),

    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.$': 'jquery',
      'window.jQuery': 'jquery',
    }),

    new HtmlWebpackPlugin({
      template: DEMO_TEMPLATE,
      filename: `${DEMO_NAME}.html`,
    }),
  ],
}
