const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = merge(common, {
	mode: "production",
	devtool: false,
	module: {
		rules: [
			{
				test: /\.(css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: "css-loader",
						options: {
							importLoaders: 2,
							sourceMap: false,
							modules: false,
						},
					}
				],
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./public/template.html",
			favicon: "./public/favicon.ico",
		}),
		// Extracts CSS into separate files
		new MiniCssExtractPlugin({
			filename: "[name].[contenthash].css",
			chunkFilename: "[id].css",
		}),
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), "..."],
		runtimeChunk: {
			name: "runtime",
		},
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000,
	},
});
