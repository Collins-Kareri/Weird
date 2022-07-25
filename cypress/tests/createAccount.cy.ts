describe("create a user and log them in", () => {
    beforeEach(() => {
        cy.visit("/");
        cy.fixture("../fixtures/user.json").as("userData");
    });

    it("should create user and authenticate creating a session", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("post", "api/user/create").as("createUser");

            cy.register(credentials);

            cy.wait("@createUser");

            cy.getCookie("session").should("exist");

            cy.request("get", "api/auth").then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "authenticated");
                expect(res.body).to.haveOwnProperty("user");
                expect(res.body.user).to.haveOwnProperty("username", credentials.username);
                expect(res.body.user).to.haveOwnProperty("email", credentials.email);
            });

            //look at checking cookie properties at once.
        });
    });

    it("should find user in the db", () => {
        //request user db to look for user and check that the properties equal to username,password,email
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("get", `api/user/:${credentials.username}`).then((res) => {
                expect(res.body).to.haveOwnProperty("msg", "found");
            });
        });
    });

    it("should find username and email exist", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("get", `api/user/:${credentials.username}`).as("userExist");

            cy.get("input[name='username']").type(credentials.username).blur();
            cy.wait("@userExist").then(() => {
                //get the username input and then see if there is an error message
                cy.get("input[name='username']").parent().find("p").contains("username exists", { matchCase: false });
            });

            cy.intercept("get", `api/user/:${credentials.email}`).as("emailExist");

            cy.get("input[name='email']").type(credentials.email).blur();

            cy.wait("@emailExist").then(() => {
                //get the email input and then see if there is an error message
                cy.get("input[name='email']").parent().find("p").contains("email exists", { matchCase: false });
            });
        });
    });

    it("should fail password field validation", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept(`api/user/:${credentials.username}`, { msg: "not found" }).as("user");
            cy.intercept(`api/user/:${credentials.email}`, { msg: "not found" }).as("email");
            cy.get("input[name='username']").type(credentials.username);
            cy.get("input[name='email']").type(credentials.email);
            cy.get("button[type='submit'").click();

            cy.get("input[name='password']").type(credentials.password);
            cy.get("input[name='confirm_password']").type("secret").blur();
            cy.get("input[name='confirm_password']")
                .parent()
                .find("p")
                .contains("passwords don't match", { matchCase: false });
        });
    });

    it("should go back to step1", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.get("input[name='username']").type(credentials.username);
            cy.intercept(`api/user/:${credentials.username}`, { msg: "not found" });

            cy.get("input[name='email']").type(credentials.email);
            cy.intercept(`api/user/:${credentials.email}`, { msg: "not found" });

            cy.get("button[type='submit'").click();

            cy.get("button[type='button']").contains("back", { matchCase: false }).click();

            cy.get("input[name='username']").should("have.value", credentials.username);
            cy.get("input[name='email']").should("have.value", credentials.email);
        });
    });

    after(() => {
        cy.fixture("../fixtures/user.json").as("userData");
        cy.get<User>("@userData").then((credentials: User) => {
            cy.deleteUserByApi(credentials.username);
        });
    });
});
