Cypress.Commands.add("ping",()=>{
    cy.request("get","/api/ping").as("toServer");
    cy.get("@toServer").its("body").should("have.a.property","msg","active");
})