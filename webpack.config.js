var webpack = require('webpack');
var path = require('path');

var LIBRARY_NAME = 'junimarc';
var GLOBAL_NAME = 'Junimarc';

module.exports = {
    devtool: 'source-map',
    entry: path.join(__dirname, 'src', 'index.js'),
    output: {
        path: path.join(__dirname, 'dist'),
        filename: LIBRARY_NAME + '.js',
        libraryTarget: 'umd',
        library: GLOBAL_NAME,
        sourceMapFilename: '[file].map',
    },
    module: {
        loaders: [
            {
              test: /\.js$/,
              exclude: /node_modules/,
              loaders: ['babel-loader'],
            }, {
              test: /\.js/,
              exclude: /node_modules/,
              loader: 'eslint-loader',
            },
        ]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
      new webpack.optimize.DedupePlugin(),
      new webpack.NoErrorsPlugin()   
    ]
};
