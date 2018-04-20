if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: '../.env' });
}
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const bodyParser = require('body-parser');
const request = require('sync-request');

module.exports = {
  mode: 'development',

  entry: './src/app.js',

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  plugins: [
    new HtmlWebPackPlugin({
      template: './src/index.html',
      filename: './index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],

  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    open: true,
    hot: true,
    https: true,
    setup: function(app) {
      app.use(bodyParser.json());
      app.use(
        bodyParser.urlencoded({
          extended: true,
        }),
      );
      app.post(/^\//, function(req, res) {
        var serviceCallResponse = request(
          'POST',
          `http://localhost:${process.env.SERVER_PORT}` + req.originalUrl,
          {
            json: req.body,
          },
        );
        res.send(serviceCallResponse.getBody('utf8'));
      });
    },
  },
};
