Cypress.Commands.add("register", (credentials) => {
    beforeEach(() => {
        cy.visit("/register");
    });
    cy.request("post", "/api/createUser").as("createUser");
    cy.visit("/signup");
    cy.get("h1").contains("register", { matchCase: false });
    cy.get("#username").type(credentials.username);
    cy.get("#email").type(credentials.email);
    cy.get("#password").type(credentials.password);
    cy.get("#signUpButton").click();

    cy.wait("@createUser").its("response.statusCode").should("eq", 201);
});