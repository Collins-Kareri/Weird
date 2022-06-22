describe("login", () => {
    beforeEach(() => {
        cy.request("get", "/api/ping", { failOnStatusCode: false })
            .then((response) => {
                expect(response.body).to.deep.property("msg", "active");
            });
    });
    //should check the login process
    it("successfully loads", () => {
        cy.visit("/");
        cy.get("h1").contains("h1", "hello", { matchCase: false });
        //should login user
        //after login there should be a cookie with a username property, email and a session token
    });
});