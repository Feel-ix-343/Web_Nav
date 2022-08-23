const CopyWebpackPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');


module.exports = {
  mode: 'development',
  devtool: 'cheap-module-source-map',


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
      {
        test: /\.(ts|js)x$/,
        use: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx", ".wasm"],
  },
  entry: {
    popup: './src/popup/popup.tsx',
    worker: './src/WasmWorker.ts',
    background: './src/background.ts'
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
    filename: '[name].js',
  }

};
