Cypress.Commands.add("register",(credentials)=>{
    cy.get("h1").contains("register", { matchCase: false });
    cy.get("#firstname").type(credentials.firstname);
    cy.get("#lastname").type(credentials.lastname);
    cy.get("#username").type(credentials.username);
    cy.get("#email").type(credentials.email);
    cy.get("#password").type(credentials.password);
    cy.get("#signUpButton").click();
});