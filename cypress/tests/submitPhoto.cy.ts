describe("create a user and authenticate them", () => {
    //todo cancel button should take you back to previous page
    //todo on logo click should take you to home.
    beforeEach(() => {
        cy.visit("/createAccount");
        cy.fixture("../fixtures/user.json").as("userData");
    });

    it("should publish an image to the database and image service", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("post", "api/image/publish").as("publishImage");

            cy.request("post", "api/user/create", { body: credentials }).then((res) => {
                cy.fixture("testImg-unsplash.jpg").as("testImg");
                expect(res.status).to.eq(201);
                cy.get("#fileInput").selectFile("@testImg", { force: true });
                cy.get("button[type='submit']").click();
                cy.wait("@publishImage");

                cy.get("#successMsg").find("button[type='submit']").click();
            });
        });
    });

    after(() => {
        cy.request("delete", "api/image/:imageId").then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).haveOwnProperty("msg", "ok");
        });
    });
});
