describe("login", () => {
    //todo on logo click should take you to home.
    beforeEach(() => {
        cy.visit("/login");
        cy.fixture("../fixtures/user.json").as("userData");
    });

    it("should login user and authenticate creating a cookie session", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("api/user/login").as("loginUser");

            cy.request("post", "api/user/create", credentials).then((res) => {
                expect(res.status).to.eq(201);
                expect(res.body).to.haveOwnProperty("msg", "created");

                cy.get("h1").contains("login", { matchCase: false });
                cy.get("input[name='username']").type(credentials.username);
                cy.get("input[name='password']").type(credentials.password);
                cy.get("button[type='submit']").contains("login", { matchCase: false }).click();

                cy.wait("@loginUser").its("response.statusCode").should("eq", 200);

                cy.checkAuthStatus(credentials);
            });
        });
    });

    it("should fail if username doesn't exist", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("api/user/login").as("loginUser");

            cy.get("input[name='username']").type("username");
            cy.get("input[name='password']").type(credentials.password);
            cy.get("button[type='submit']").contains("login", { matchCase: false }).click();

            cy.wait("@loginUser").its("response.statusCode").should("eq", 400);
            cy.get("@loginUser").its("response.body").should("have.a.property", "msg", "username doesn't exist");
            cy.get("input[name='username']")
                .parent()
                .find("p")
                .contains("username doesn't exist", { matchCase: false });
        });
    });

    it("should fail if password is not valid", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("api/user/login").as("loginUser");

            cy.get("input[name='username']").type(credentials.username);
            cy.get("input[name='password']").type("secret");
            cy.get("button[type='submit']").contains("login", { matchCase: false }).click();

            cy.wait("@loginUser").its("response.statusCode").should("eq", 400);
            cy.get("@loginUser").its("response.body").should("have.a.property", "msg", "password not valid");
            cy.get("input[name='password']").parent().find("p").contains("password not valid", { matchCase: false });
        });
    });

    // it("should take you to previous page on cancel button click", () => {
    //     cy.get("button[type='cancel']").contains("login", { matchCase: false }).click();
    // });

    // it("logo icon click should take you to home", () => {
    //     cy.get("button[type='cancel']").contains("login", { matchCase: false }).click();
    // });

    after(() => {
        cy.fixture("../fixtures/user.json").as("userData");
        cy.get<User>("@userData").then((credentials: User) => {
            cy.deleteUserByApi(credentials.username);
        });
    });
});
