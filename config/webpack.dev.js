/* eslint-disable @typescript-eslint/no-var-requires */
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const common = require("./webpack.common.js");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const { resolve } = require("path");
require("dotenv").config();
const Dotenv = require("dotenv-webpack");

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
                    "css-loader",
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                config: resolve(__dirname, "./postcss.config.js"),
                            },
                        },
                    },
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
            "/api": `http://localhost:${process.env.server_port}`,
        },
        port: process.env.client_port,
    },
    plugins: [
        new HtmlWebpackPlugin({
            favicon: "./public/favicon.ico",
            template: "./templates/index.html", // template file
            filename: "index.html", // output file
        }),
        new ReactRefreshWebpackPlugin(),
        new Dotenv(),
    ],
});

module.exports = config;
