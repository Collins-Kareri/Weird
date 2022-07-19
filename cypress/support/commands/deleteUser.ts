Cypress.Commands.add("deleteUserByApi", (username) => {
    //find delete button and delete user
    //cy.request("delete", "/api/deleteUser", { username: username });
    cy.intercept("/api/deleteUser", { msg: "ok" });
    // cy.wait("@deleteUser").its("response.body").should("have.a.property", "msg", "ok");
});
