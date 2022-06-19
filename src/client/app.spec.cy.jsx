import App from "./app";
import React from "react";

describe("it mounts", () => {
    it("mounts", () => {
        cy.mount(<App />);
    });
});