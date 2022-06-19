require("dotenv").config();
const PATH = require("path");
const EXPRESS = require("express");
const APP = EXPRESS();

APP.use(EXPRESS.static("dist"));

APP.get("*", (request, response) => {
	response.sendFile(PATH.join(__dirname, "../../dist/template.html"));
});

APP.listen(process.env.port || 5000, () => {
	console.log(`Server listening on http://localhost:${process.env.port || 5000}`);
});
