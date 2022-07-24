import "dotenv/config";
import { join } from "path";
import EXPRESS from "express";
import SESSIONS from "cookie-session";
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
    credentials: true,
    origin: "http://localhost:3á001",
    methods: ["post", "get", "put", "delete"],
};

const SESSION_OPTIONS = {
    name: "session",
    secret: process.env.session_secret,
    maxAge: 5 * 60 * 60 * 1000,
    // secure: true,
    httpOnly: true,
};

APP.set("trust proxy", 1); // trust first proxy

APP.use(EXPRESS.json());

APP.use(EXPRESS.static(join(__dirname, "../../dist/")));

//create user session
APP.use(SESSIONS(SESSION_OPTIONS));

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
