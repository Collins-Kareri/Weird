describe("create a user and authenticate them", () => {
    //todo cancel button should take you back to previous page
    //todo on logo click should take you to home.
    beforeEach(() => {
        cy.visit("/createAccount");
        cy.fixture("user.json").as("userData");
    });

    it("should create user and authenticate creating a cookie session", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("post", "api/user/create").as("createUser");

            cy.createUser(credentials);

            cy.wait("@createUser");

            cy.checkAuthStatus(credentials);

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

            cy.get("#username").type(credentials.username).blur();
            cy.wait("@userExist").then(() => {
                //get the username input and then see if there is an error message
                cy.get("#username").parent().find("p").contains("username exists", { matchCase: false });
            });

            cy.intercept("get", `api/user/:${credentials.email}`).as("emailExist");

            cy.get("#email").focus().type(credentials.email).blur();

            cy.wait("@emailExist").then(() => {
                //get the email input and then see if there is an error message
                cy.get("#email").parent().find("p").contains("email exists", { matchCase: false });
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
            cy.intercept(`api/user/:${credentials.username}`, { msg: "not found" }).as("usernameExists");
            cy.intercept(`api/user/:${credentials.email}`, { msg: "not found" }).as("emailExists");

            cy.get("input[name='username']").type(credentials.username);

            cy.get("input[name='email']").type(credentials.email);
            cy.wait("@usernameExists");

            cy.get("button[type='submit']").click();
            cy.wait("@emailExists");

            cy.wait("@usernameExists");
            cy.wait("@emailExists");
            // eslint-disable-next-line cypress/no-unnecessary-waiting
            cy.wait(500);

            cy.get("button[type='button']").contains("back", { matchCase: false }).click();

            cy.get("input[name='username']").should("have.value", credentials.username);
            cy.get("input[name='email']").should("have.value", credentials.email);
        });
    });

    // it("should take you to previous page on cancel button click", () => {
    //     cy.get("button[type='cancel']").contains("login", { matchCase: false }).click();
    // });

    // it("logo icon click should take you to home", () => {
    //     cy.get("button[type='cancel']").contains("login", { matchCase: false }).click();
    // });

    after(() => {
        cy.fixture("user.json").as("userData");
        cy.get<User>("@userData").then((credentials: User) => {
            cy.deleteUserByApi(credentials.username);
        });
    });
});
