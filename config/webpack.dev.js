import { merge } from "webpack-merge";

import common from "./webpack.common.js";

const config = merge(common, {
	mode: "development",
	devtool: "eval-source-map",
	module: {
		rules: [
			// Styles
			{
				test: /\.css$/,
				use: [
					"style-loader",
					{
						loader: "css-loader",
						options: { sourceMap: true, importLoaders: 1, modules: false },
					}
				],
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
	}
});

export default config;