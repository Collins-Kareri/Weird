import jwt_decode from "jwt-decode";

describe("create a user and log them in", () => {
    beforeEach(() => {
        cy.visit("/createAccount");
        cy.fixture("../fixtures/user.json").as("userData");
    });

    it("should create user and authenticate", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.register(credentials);
        });
        cy.intercept("/api/createUser").as("createUser");
        cy.get<User>("@userData").then((credentials: User) => {
            cy.wait("@createUser").its("response.status").should("eq", 201);
            cy.location("pathname").should("equal", `/profile@${credentials.username}`);

            cy.get<User>("@userData").then(() => {
                cy.getCookie("session").as("userCookie");

                cy.get("@userCookie")
                    .should("exist")
                    .and("have.a.property", "session")
                    .and("have.a.property", "credentials");

                cy.get("@userCookie").then((cookie: any) => {
                    const user = jwt_decode(cookie.credentials);
                    cy.wrap(user)
                        .should("have.a.property", "username", credentials.username)
                        .and("have.a.property", "email", credentials.email);
                });
            });
            //look at checking cookie properties at once.
        });
    });

    it("should find user in the db", () => {
        //request user db to look for user and check that the properties equal to username,password,email
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("get", `/api/user:${credentials.username}`).as("getUser");
            cy.wait("@getUser").should("have.a.property", "username", credentials.username);
        });
    });

    it("should fail username and email field already exists validation", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.get("input[name='username']").type(credentials.username).blur();
            cy.intercept(`/api/user:${credentials.username}`).as("doesUserExist");
            cy.wait("@doesUserExist").then(() => {
                //get the username input and then see if there is an error message
                cy.get("input[name='username']")
                    .parent()
                    .find("p")
                    .contains("username already exists", { matchCase: false });
            });
            cy.get("input[name='email']").type(credentials.username).blur();
            cy.intercept(`/api/user:${credentials.email}`).as("doesUserExist");
            cy.wait("@doesUserExist").then(() => {
                //get the email input and then see if there is an error message
                cy.get("input[name='email']").parent().find("p").contains("email already exists", { matchCase: false });
            });
        });
    });

    it("should go back from step2", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.get("input[name='username']").type(credentials.username);
            cy.intercept(`/api/user:${credentials.username}`, { msg: "not found" });

            cy.get("input[name='email']").type(credentials.email);
            cy.intercept(`/api/user:${credentials.email}`, { msg: "not found" });

            cy.get("button[type='submit'").click();

            cy.get("button[type='button']").contains("back", { matchCase: false }).click();

            cy.get("input[name='username']").should("have.value", credentials.username);
            cy.get("input[name='email']").should("have.value", credentials.email);
        });
    });

    it("should fail password field client validation", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.get("input[name='username']").type(credentials.username);
            cy.get("input[name='email']").type(credentials.email);
            cy.intercept(`/api/findUser:${credentials.username}`, { msg: "not found" }).as("user");
            cy.intercept(`/api/findUser:${credentials.email}`, { msg: "not found" }).as("email");
            cy.get("button[type='submit'").click();

            cy.get("input[name='password']").type(credentials.password);
            cy.get("input[name='confirm password']").type("secret").blur();
            cy.get("input[name='confirm password']")
                .parent()
                .find("p")
                .contains("passwords don't match", { matchCase: false });
        });
    });

    after(() => {
        cy.fixture("../fixtures/user.json").as("userData");
        cy.get<User>("@userData").then((credentials: User) => {
            cy.deleteUserByApi(credentials.username);
        });
    });
});
