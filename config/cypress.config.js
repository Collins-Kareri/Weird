const { defineConfig } = require("cypress");
const PATH = require("path");

module.exports = defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		specPattern: "cypress/tests/*.spec.cy.{js,jsx,ts,tsx}",
		supportFile: false,
		screenshotOnRunFailure: false,
	},
	component: {
		devServer: {
			framework: "react",
			bundler: "webpack",
			"webpackConfig": require("./webpack.dev.js"),
		},
		indexHtmlFile: PATH.resolve("../cypress/support/component-index.html"),
		specPattern: "src/client/*.spec.cy.{js,jsx,ts,tsx}",
		supportFile: "cypress/support/component.js",
		screenshotOnRunFailure: false
	},
});
