describe("login", () => {
    //should check the login process
    it("successfully loads", () => {
        cy.visit("/");
        cy.ping();
        cy.get("h1").contains("h1", "hello dude", { matchCase: false });
        //should login user
        //after login there should be a cookie with a username property, email and a session token
    });
});
