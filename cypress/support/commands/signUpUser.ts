Cypress.Commands.add("register", (credentials) => {
    cy.get("h1").contains("create account", { matchCase: false });
    cy.get("input[name='username']").type(credentials.username);
    cy.get("input[name='email']").type(credentials.email);
    cy.get("button[type='submit'").contains("next", { matchCase: false }).click();
    cy.get("input[name='password']").type(credentials.password);
    cy.get("input[name='confirm_password']").type(credentials.password);
    cy.get("button[type='submit'").contains("create account", { matchCase: false }).click();
});
