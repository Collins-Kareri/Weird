import "dotenv/config";
import { join } from "path";
import EXPRESS from "express";
import ROUTER from "./routes";
const APP = EXPRESS();
const PORT = process.env.server_port;

APP.use(EXPRESS.static("dist"));

APP.use(EXPRESS.json());

APP.use("/api", ROUTER);

APP.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../../dist/index.html"));
});

APP.listen(PORT, () => {
    console.log(`⚡️[server]: Server running at http://localhost:${PORT}`);
});
