import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pathToSrc = path.resolve(__dirname, "../src/client/index.jsx");
const pathToPublic = path.resolve(__dirname, "../public");

const config = {
	// Where webpack looks to start building the bundle
	entry: [pathToSrc],

	// Where webpack outputs the assets and bundles
	output: {
		path: path.resolve(__dirname, "../dist"),
		filename: "[name].bundle.js",
		publicPath: "/"
	},

	// Determine how modules within the project are treated
	module: {
		rules: [
			// JavaScript: Use Babel to transpile JavaScript files
			{
				//ignore
				test: /\.js(x?)$/,
				loader: "babel-loader",
				exclude: /node_modules/,
				options: {
					presets: [
						"@babel/preset-env",
						"@babel/preset-react"
					]
				}
			},

			// Images: Copy image files to build folder
			{
				test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
				type: "asset/resource"
			}
		],
	},

	resolve: {
		modules: [pathToSrc, "node_modules"],
		extensions: [".js", ".jsx", ".json"],
		alias: {
			//set up alias of normally imported files
			"@": pathToSrc
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
					from: path.resolve(__dirname, "../public"),
					to: "assets",
					globOptions: {
						ignore: ["*.DS_Store"],
					},
					noErrorOnMissing: true,
				},
			],
		}),

		new HtmlWebpackPlugin({
			title: "webpack Boilerplate",
			favicon: pathToPublic + "/favicon.ico",
			template: pathToPublic + "/template.html", // template file
			filename: "index.html", // output file
		})
	]
};


export default config;
