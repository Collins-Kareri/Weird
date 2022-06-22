import { defineConfig } from "cypress";
import { resolve } from "path";
import webpack from "./webpack.dev.js";

export default defineConfig({
	e2e: {
		baseUrl: "http://localhost:3000",
		specPattern: "cypress/tests/*.cy.{js,jsx,ts,tsx}",
		supportFile: false,
		screenshotOnRunFailure: false,
	},
	component: {
		devServer: {
			framework: "react",
			bundler: "webpack",
			"webpackConfig": webpack,
		},
		indexHtmlFile: resolve("../cypress/support/component-index.html"),
		specPattern: "src/client/*.cy.{js,jsx,ts,tsx}",
		supportFile: "cypress/support/component.js",
		screenshotOnRunFailure: false
	},
});
