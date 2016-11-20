const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./webpack/main');

const PATHS = {
  app: path.join(__dirname, 'src'),
  data: path.join(__dirname, 'tmp'),
  files: path.join(__dirname, 'images'),
  //style: [ path.join(__dirname, 'style', 'app.less') ],
  build: path.join(__dirname, 'build'),
};

const common =  {
  entry: {
    //style: PATHS.style,
    app: path.join(PATHS.app, 'main.js')
  },
  output: {
    path: PATHS.build,
    filename: '[name].js',
    sourceMapFilename: '[file].map',
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]?[loaders]',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'API',
      template: path.join(PATHS.app, 'index.ejs')
    })
  ]
};

var config;

switch(process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
        common,
        parts.loadJSON(PATHS.data),
        parts.loadFile(PATHS.files),
        parts.babel(PATHS.app),
        {
          devtool: 'source-map',
          output: {
            path: PATHS.build,
            filename: '[name].[chunkhash].js',
            chunkFilename: '[chunkhash].js'
          }
        },
        parts.clean(PATHS.build),
        parts.setFreeVariable('process.env.NODE_ENV', 'production'),
        parts.autoExtractBundle(),
        parts.minify()
        //parts.extractCSS(PATHS.style),
        //parts.purifyCSS([PATHS.app])
    );
    break;
  default:
    config = merge(
        common,
        parts.eslint(PATHS.app),
        parts.loadJSON(PATHS.data),
        parts.loadFile(PATHS.files),
        parts.babel(PATHS.app),
        { devtool: 'eval-source-map' },
        parts.setFreeVariable('process.env.NODE_ENV', 'development'),
        //parts.setupCSS(PATHS.style),
        parts.devServer({
          host: process.env.HOST,
          port: process.env.PORT || 8086
        })
    );
}

module.exports = validate(config);
