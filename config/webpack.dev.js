const { merge } = require("webpack-merge")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const common = require("./webpack.common.js")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const path = require("path")

const config = merge(common, {
	mode: "development",
	devtool: "eval-source-map",
	module: {
		rules: [
			// Styles
			{
				test: /\.css$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader
					},
					"css-loader",
					{
						loader: "postcss-loader",
						options: {
							postcssOptions: {
								config: path.resolve(__dirname, "./postcss.config.js")
							}
						}
					}
				]
			},
		],
	},
	devServer: {
		compress: true,
		historyApiFallback: true,
		hot: true,
		open: true,
		proxy: {
			"/api": "http://localhost:5000",
		},
		port: 3000
	},
	plugins: [
		new HtmlWebpackPlugin({
			favicon: "./public/favicon.ico",
			template: "./templates/index.html", // template file
			filename: "index.html", // output file
		}),
		// Extracts CSS into separate files
		new MiniCssExtractPlugin({
			filename: "[name].css"
		}),
		new ReactRefreshWebpackPlugin(),
	]
})

module.exports = config