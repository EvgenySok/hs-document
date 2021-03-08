const { resolve } = require('path')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCSSAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const isProd = !isDev

require('dotenv').config()

const PORT = process.env.PORT || 5000

const optimization = () => {
  if (isProd) {
    return {
      minimize: true,
      minimizer: [new TerserPlugin({ parallel: true }), new OptimizeCSSAssetsWebpackPlugin()],
    }
  }
  return {}
}

const config = {
  mode: 'development',
  entry: [
    'babel-polyfill',
    resolve(__dirname, 'client/index.js'),
  ],
  optimization: optimization(),
  output: {
    path: resolve(__dirname, 'dist'),
    filename: '[name].[fullhash:8].js',
  },
  devServer: {
    open: isDev,
    port: '8080',
    hot: isDev,
    contentBase: resolve(__dirname, 'dist'),
    watchContentBase: true,
    proxy: [{
      context: ['/auth', '/api', '/socket.io'],
      target: `http://localhost:${PORT}`,
      ws: true,
    }],
  },

  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          emitWarning: true,
          quiet: true,
        },
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [ require('autoprefixer')],
            },
          },
          'sass-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|webp)$/,
        use: [
          {
            loader: 'file-loader',
          },
        ]
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[fullhash:8].css',
      chunkFilename: '[id].css',
      ignoreOrder: false,
    }),
    new HTMLWebpackPlugin({ template: './client/index.html' }),
    new CopyWebpackPlugin({
      patterns: [
        { from: resolve(__dirname, 'client/assets/images'), to: 'images' },
        { from: resolve(__dirname, 'client/assets/fonts'), to: 'fonts' },
      ],
    }),
  ],
  stats: {
    entrypoints: false,
    children: false,
  },
}

module.exports = config