Cypress.Commands.add("createUser", (credentials) => {
    cy.intercept("get", `api/user/:${credentials.username}`).as("userExist");
    cy.intercept("get", `api/user/:${credentials.email}`).as("emailExist");
    cy.intercept("post", "api/user/create").as("createUser");

    cy.get("h1").contains("create account", { matchCase: false });
    cy.get("input[name='username']").type(credentials.username);

    cy.get("input[name='email']").type(credentials.email);

    cy.get("button[type='submit']").contains("next", { matchCase: false }).click();

    cy.wait("@userExist");
    cy.wait("@emailExist");

    cy.get("input[name='password']").type(credentials.password);
    cy.get("input[name='confirm_password']").type(credentials.password);
    cy.get("button[type='submit']").contains("create account", { matchCase: false }).click();

    cy.wait("@createUser");
    cy.url().should("include", "/profile");
});
