/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");
const pathToIndexFile = path.resolve(__dirname, "../src/client/index.tsx");

const config = {
    // Where webpack looks to start building the bundle
    entry: [pathToIndexFile],

    // Where webpack outputs the assets and bundles
    output: {
        path: path.resolve(__dirname, "../dist"),
        filename: "[name].bundle.js",
        publicPath: "/",
    },

    // Determine how modules within the project are treated
    module: {
        rules: [
            // JavaScript: Use ts-loader to transpile typescript files
            {
                //ignore
                test: /\.ts(x?)$/,
                loader: "ts-loader",
                options: { reportFiles: ["src/client/*.{ts,tsx}"] },
                exclude: /node_modules/,
            },

            // Images: Copy image files to build folder
            {
                test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
                type: "asset/resource",
            },
        ],
    },

    resolve: {
        modules: [pathToIndexFile, "node_modules"],
        extensions: [".ts", ".tsx", ".js", ".jsx", ".json"],
        alias: {
            //set up alias of normally imported files
            "@src": path.resolve(__dirname, "../src"),
            "@client": path.resolve(__dirname, "../src/client"),
            "@components": path.resolve(__dirname, "../src/client/components"),
            "@clientUtils": path.resolve(__dirname, "../src/client/utils"),
            "@pages": path.resolve(__dirname, "../src/client/pages"),
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
                    from: path.resolve(__dirname, "../public/assets"),
                    to: "assets",
                    globOptions: {
                        ignore: ["*.DS_Store", "*.ico"],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),
    ],
};

module.exports = config;
