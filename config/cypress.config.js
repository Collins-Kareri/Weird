const { defineConfig } = require("cypress")
const { resolve } = require("path")

module.exports = defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		specPattern: "cypress/tests/*.cy.{js,jsx,ts,tsx}",
		supportFile: "cypress/support/e2e.ts",
		screenshotOnRunFailure: false,
	},
	component: {
		devServer: {
			framework: "react",
			bundler: "webpack",
			"webpackConfig": require("./webpack.dev.js"),
		},
		indexHtmlFile: resolve("../cypress/support/component-index.html"),
		specPattern: "src/client/*.cy.{js,jsx,ts,tsx}",
		supportFile: "cypress/support/component.js",
		screenshotOnRunFailure: false
	},
})
