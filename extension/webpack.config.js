const CopyWebpackPlugin = require("copy-webpack-plugin")
const path = require('path');


module.exports = {
  mode: 'production',
  experiments: {
    asyncWebAssembly: true,
    topLevelAwait: true
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  entry: {
    background: './src/background.ts',
    popup: './src/popup.ts'
  },
  plugins: [
    new CopyWebpackPlugin({patterns: [
      {from: './public/manifest.json'},
      {from: './public/popup.html'},
      {from: './public/style.css'},
    ]}),
  ],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  }
};
