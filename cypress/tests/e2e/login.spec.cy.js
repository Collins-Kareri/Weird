describe("login", () => {
    //should check the login process
    it("successfully loads", () => {
        cy.visit("/");
        cy.get("h1").contains("h1", "hello", { matchCase: false });
    });
});