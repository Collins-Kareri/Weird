import "dotenv/config";
import { join } from "path";
import EXPRESS from "express";
const APP = EXPRESS();
import ROUTER from "./routes.js";

APP.use(EXPRESS.static("dist"));

APP.use(EXPRESS.json());

APP.use("/api", ROUTER);

APP.get("*", (request, response) => {
	response.sendFile(join(__dirname, "../../dist/template.html"));
});

APP.listen(process.env.port, () => {
	console.log(`Server listening on http://localhost:${process.env.port}`);
});
