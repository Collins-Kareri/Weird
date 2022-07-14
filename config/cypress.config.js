/* eslint-disable @typescript-eslint/no-var-requires */
require("dotenv").config();
const { defineConfig } = require("cypress");
const { resolve } = require("path");
const webpackConfig = require("./webpack.dev");

module.exports = defineConfig({
    e2e: {
        baseUrl: "http://localhost:3001",
        specPattern: "cypress/tests/*.cy.{js,jsx,ts,tsx}",
        supportFile: "cypress/support/e2e.ts",
        screenshotOnRunFailure: false,
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
