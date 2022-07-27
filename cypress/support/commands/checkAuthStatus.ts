Cypress.Commands.add("checkAuthStatus", (credentials) => {
    cy.getCookie("session").should("exist");

    cy.request("get", "api/auth").then((res) => {
        expect(res.status).eq(200);
        expect(res.body).to.haveOwnProperty("msg", "authenticated");
        expect(res.body).to.haveOwnProperty("user");
        expect(res.body.user).to.haveOwnProperty("username", credentials.username);
        expect(res.body.user).to.haveOwnProperty("email", credentials.email);
    });
});
