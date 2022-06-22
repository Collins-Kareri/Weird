import { faker } from "@faker-js/faker";

const credentials = {
    username: faker.name(),
    email: faker.internet.email(undefined, undefined, "mymailprovider.com"),
    password: faker.internet.password(20, false)
};

describe("create a user and log them in", () => {
    /**todo:
        *go to signup page
        *get the inputs and type in values and submit.
        *check if user exists in db
        *check if a cookie was set with the username, email and a token.
        *determine how long a cookie should last and check that it does last that long
        *retry to see the error of username exists same for email. Inform them to login instead may include a redirect to login
        *check if it takes them to login
        *then delete the user from your db at the end of the test
    */

    cy.register(credentials);

    it("redirects to profile on success", () => {
        //go to the profile page
        cy.location("pathname").should("equal", `/profile@${credentials.username}`);
    });

    it("find the user created in the db", () => {
        //request user db to look for user and check that the properties equal to username,password,email
        cy.request("get", "/api").then((response) => {
            expect(response.body).to.haveOwnProperty("username", credentials.username);
        });
    });

    it("find a cookie set that should expire on after 12 hours on remember me?", () => {
        //get cookie set with a username, email, token
        cy.getCookie("user_session")
            .should("exist")
            .and("have.a.property", "username", credentials.username)
            .and("have.a.property", "email", credentials.email)
            .and("have.a.property", "sessionToken");
        //look at checking cookie properties at once.
    });

    it("should not signup as user already exists", () => {
        cy.register(credentials);
        cy.get("loginOption").click();
        cy.location("pathname").should("equal", "/login");
        cy.get("h1").should("contain", "login");
    });

    it("should remove user from db", () => {
        cy.visit("/register");
        cy.clearCookie("user_session");
        cy.request("delete", "/api/deleteUser", { username: credentials.username }).as("deleteUser");
        cy.wait("@deleteUser").then((response) => {
            expect(response.body).to.haveOwnProperty("msg", "deleted");
        });
    });
});