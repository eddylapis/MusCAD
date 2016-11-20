// not used
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');

exports.setupCSS = function(paths) {
  return {
    resolve: { extensions: ['', '.less'] },
    module: {
      loaders: [
        {
          test: /\.less$/,
          loaders: ['style', 'css', 'less'],
          include: paths,
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file'
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=image/svg+xml'
        }
      ]
    }
  };
}

exports.extractCSS = function(paths) {
  const less = new ExtractTextPlugin('[name].[chunkhash].css');
  return {
    resolve: { extensions: ['', '.less'] },
    module: {
      loaders: [
        {
          test: /\.less$/,
          loader: less.extract('style', 'css!less'),
          include: paths,
        },
        {
          test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/font-woff'
        },
        {
          test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=application/octet-stream'
        },
        {
          test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'file'
        },
        {
          test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
          loader: 'url?limit=10000&mimetype=image/svg+xml'
        }
      ]
    },
    plugins: [less]
  };
}

exports.purifyCSS = function(paths) {
  plugins: [
    new PurifyCSSPlugin({
      basePath: process.cwd(),
      paths: paths
    })
  ]
}
