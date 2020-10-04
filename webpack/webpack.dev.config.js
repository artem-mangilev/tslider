const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.config')

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',

  devtool: 'inline-source-map',

  devServer: {
    contentBase: baseWebpackConfig.externals.paths.build,
    host: '0.0.0.0',
    port: 8081,
    disableHostCheck: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    stats: 'errors-warnings',
  },
})

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig)
})