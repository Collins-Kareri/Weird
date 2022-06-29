const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
	mode: "production",
	devtool: false,
	output: {
		publicPath: "./"
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [{
					loader: MiniCssExtractPlugin.loader
				},
					"css-loader",
					"postcss-loader"
				]
			},
		],
	},
	plugins: [
		// Extracts CSS into separate files
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css",
			chunkFilename: "[id].css",
		}),
		new HtmlWebpackPlugin({
			favicon: "./public/favicon.ico",
			template: "./templates/index.html" // template file
		})
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), "..."],
		runtimeChunk: {
			name: "runtime",
		},
	},
	performance: {
		hints: "warning",
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
})
