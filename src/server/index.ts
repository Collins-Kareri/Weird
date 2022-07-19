import "dotenv/config";
import { join } from "path";
import EXPRESS from "express";
import SESSIONS from "express-session";
import HELMET from "helmet";
import CORS from "cors";
import ROUTER from "@src/server/routes/main.routes";
import { initDriver } from "@src/server/neo4j/neo4j.driver";
import passport from "passport";
import "@server/passport/passport";

const APP = EXPRESS();
const PORT = process.env.server_port;

// Connect to Neo4j and Verify Connectivity
const { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD } = process.env;

initDriver(NEO4J_URI as string, NEO4J_USERNAME as string, NEO4J_PASSWORD as string);

const CORS_OPTIONS = {
    origin: process.env.NODE_ENV === "development" ? "*" : false,
};

APP.set("trust proxy", 1); // trust first proxy

APP.use(EXPRESS.json());

APP.use(EXPRESS.static(join(__dirname, "../../dist/")));

APP.use(
    SESSIONS({
        name: "session",
        secret: process.env.session_secret as string,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: true, httpOnly: true },
    })
);

APP.use(passport.initialize());
APP.use(passport.session());

APP.use(CORS(CORS_OPTIONS));

APP.use(HELMET());

APP.use("/api", ROUTER);

APP.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../../dist/index.html"));
});

APP.listen(PORT, () => {
    console.log(`⚡️[server]: Server running at http://localhost:${PORT}`);
});
