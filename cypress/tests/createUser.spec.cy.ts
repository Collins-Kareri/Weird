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
    beforeEach(() => {
        cy.visit("/register");
        cy.fixture("../fixtures/user.json").as("userData");
        cy.get("@userData").then((credentials) => {
            cy.register(credentials);
        });
    });

    after(()=>{
        cy.intercept("post", "/api/createUser", { body: {} });
        cy.visit("/register");
        // cy.fixture("../fixtures/user.json").as("userData");
        cy.get("@userData").then((credentials:any) => {
            cy.deleteUserByApi(credentials.username);
        });
    })

    it("should create user", () => {
        //go to the profile page
        cy.intercept("/register").as("createUser");
        cy.get("@userData").then((credentials:any) => {
            cy.wait("@createUser").its("response.status").should("eq", 201);
            cy.location("pathname").should("equal", `/profile@${credentials.username}`);
        });
    });

    it("should find the user in the db", () => {
        //request user db to look for user and check that the properties equal to username,password,email
        cy.intercept("post", "/api/createUser", { body: {} });

        cy.get("@userData").then((credentials:any) => {
            cy.request("get", `/api:${credentials.username}`).as("getUser");
            cy.wait("@getUser").should("have.a.property", "username", credentials.username);
        });
    });

    it("should find a cookie set", () => {
        //get cookie set with a username, email, token
        cy.intercept("post", "/api/createUser", { body: {} });

        cy.get("@userData").then((credentials:any) => {
            cy.getCookie("user_session")
                .should("exist")
                .and("have.a.property", "username", credentials.username)
                .and("have.a.property", "email", credentials.email)
                .and("have.a.property", "sessionToken");
        });
        //look at checking cookie properties at once.
    });

    it("should fail signup", () => {
        cy.get("loginOption").click();
        cy.location("pathname").should("equal", "/login");
        cy.get("h1").should("contain", "login");
    });
});