// Cypress.Commands.add("deleteUser",(username)=>{
//     //find delete button and delete user
// })

Cypress.Commands.add("deleteUserByApi",(username)=>{
    //find delete button and delete user
    cy.request("delete","/api/deleteUser",{username:username}).as("deleteUser");
    cy.wait("@deleteUser").its("response.body").should("have.a.property","msg","ok");
})