Cypress.Commands.add("deleteUserByApi", (username) => {
    //find delete button and delete user
    cy.request("delete", `api/user/:${username}`).then((res) => {
        expect(res.body).to.haveOwnProperty("msg", "ok");
    });
});
