// TODO: Import the neo4j-driver dependency
import neo4j, { Driver } from "neo4j-driver";

let driver: Driver;

export async function initDriver(uri: string, username: string, password: string) {
    driver = neo4j.driver(uri, neo4j.auth.basic(username, password));

    return await driver.verifyConnectivity().then(() => driver);
}

export function getDriver() {
    return driver;
}

export function closeDriver() {
    return driver && driver.close();
}
