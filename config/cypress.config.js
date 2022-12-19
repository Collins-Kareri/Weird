/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config({ path: "../.env" });
const { defineConfig } = require("cypress");
const { resolve } = require("path");
const webpackConfig = require("./webpack.dev");
const client_url = process.env.client_port;
const cloudinary_upload_url = process.env.My_CLOUDINARY_URL;

module.exports = defineConfig({
    e2e: {
        baseUrl: `http://localhost:${client_url}`,
        env: {
            cloudinary_upload_url,
        },
        specPattern: "cypress/tests/*.cy.{js,jsx,ts,tsx}",
        supportFile: "cypress/support/e2e.ts",
        screenshotOnRunFailure: false,
        chromeWebSecurity: false,
        video: false,
    },
    component: {
        devServer: {
            framework: "react",
            bundler: "webpack",
            webpackConfig,
        },
        indexHtmlFile: resolve("../cypress/support/component-index.html"),
        specPattern: "src/client/**/*.cy.{js,jsx,ts,tsx}",
        supportFile: "cypress/support/component.ts",
        screenshotOnRunFailure: false,
    },
});
