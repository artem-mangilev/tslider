const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')

const GH_PAGES_PUBLIC_PATH = '/tslider/'

const buildWebpackConfig = merge(baseWebpackConfig, {
  mode: 'production',

  output: {
    filename: '[name].js',
    path: baseWebpackConfig.externals.paths.build,
    publicPath: GH_PAGES_PUBLIC_PATH,
  },
})

module.exports = new Promise((resolve, reject) => {
  resolve(buildWebpackConfig)
})
