const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

const pkg = require('../package.json');

exports.devServer = function(options) {
  return {
    devServer: {
      historyApiFallback: true,
      hot: true,
      inline: true,
      stats: 'errors-only',
      host: options.host,
      port: options.port,
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        multiStep: true,
      })
    ],
  }
}

exports.eslint = function(paths) {
  return {
    module: {
      preLoaders: [{
        test: /\.js$/,
        loaders: ['eslint'],
        include: paths,
      }]
    }
  };
}

exports.babel = function(paths) {
  return {
    resolve: { extensions: ['', '.js'] },
    module: {
      loaders: [{
        test: /\.js$/,
        loader: 'babel',
        include: paths,
      }]
    }
  };
}

exports.loadFile = function(paths) {
  return {
    module: {
      loaders: [{
        test: /\.(jpe?g|png)/,
        loader: 'file',
        include: paths,
        query: { path: '/', },
      }]
    }
  };
}

exports.loadJSON = function(paths) {
  return {
    module: {
      loaders: [{
        test: /\.json$/,
        loader: 'json',
        include: paths,
      }]
    }
  };
}

exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
        compress: {
          warnings: false,
          drop_console: true
        },
        mangle: {
          except: ['$'],
          screw_ie8: true,
          keep_fnames: true
        },
        sourceMap: false,
      })
    ]
  };
}

exports.setFreeVariable = function(key, val) {
  const env = {};
  env[key] = JSON.stringify(val);
  return {
    plugins: [new webpack.DefinePlugin(env)]
  };
}

exports.autoExtractBundle = function() {
  const name = 'vendor', entry = {};
  entry[name] = Object.keys(pkg.dependencies);

  return {
    entry: entry,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        names: [name, 'manifest']
      })
    ]
  };
}

exports.clean = function(path) {
  return { plugins: [ new CleanWebpackPlugin([path], {root: process.cwd()}) ] };
}
