const path = require('path')
const HtmlPlugin = require('html-webpack-plugin')
const CleanTerminalPlugin = require('clean-terminal-webpack-plugin');

const basePath = path.join(__dirname, 'src')
const env = process.env.NODE_ENV || 'development'

console.log('Webpack running in ' + env)

module.exports = {
  entry: {
    main: path.join(basePath, 'index.tsx'),
  },

  output: {
    path: path.join(basePath, '..', 'build'),
    publicPath: env === 'development' ? '/' : '',
    filename: '[name].js',
  },

  plugins: [
    new CleanTerminalPlugin(),
    new HtmlPlugin({
      title: 'SciDrive Web',
      template: path.join(basePath, 'index.html'),
    }),
  ],

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  module: {
    rules: [
      {
        test: /\.(js|mjs|jsx|ts|tsx)$/,
        exclude: /(node_modules)/,
        use: {
          // `.swcrc` can be used to configure swc
          loader: "swc-loader",
          options: {
            sync: true,
            jsc: {
              target: "es2020",
              parser: {
                syntax: "typescript",
                tsx: true,
                dynamicImport: true,
                exportDefaultFrom: true,
              },
            },
            module: {
              type: "commonjs",
              strict: true,
              ignoreDynamic: true
            }
          }
        }
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
      },
      { test: /\.css$/i, use: ["style-loader", { loader: "css-loader", options: { url: false }}] }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },

  devServer: {
    port: 9000,
    static: [ 
      { directory: path.join(__dirname, 'src', 'schemas'), "publicPath": "/schemas" },
      { directory: path.join(__dirname, 'build'), "publicPath": "/" },
    ],
    historyApiFallback: true,
  },
  mode: process.env.NODE_ENV || "development"
}