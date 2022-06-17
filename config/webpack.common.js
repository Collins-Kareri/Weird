const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path=require("path");

module.exports = {
  // Where webpack looks to start building the bundle
  entry: [path.resolve(__dirname,'../src/client/index.jsx')],

  // Where webpack outputs the assets and bundles
  output: {
    path: path.resolve(__dirname,'../dist'),
    filename: '[name].[fullhash].bundle.js',
    publicPath: '/',
  },

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
      { 
        test: /\.js(x?)$/, 
        use: ['babel-loader'],
        exclude:/node_modules/
      },

      // Images: Copy image files to build folder
      { 
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i, 
        type: 'asset/resource' 
      }
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
        //set up alias of normally imported files
    },
  },
  // Customize the webpack build process
  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname,"../public"),
          globOptions: {
            ignore: ['*.DS_Store','favicon.ico','index.html'],
          },
          noErrorOnMissing: true,
        },
      ],
    })
  ]
}
