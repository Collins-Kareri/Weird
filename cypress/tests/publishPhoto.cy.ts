describe("create a user and authenticate them", () => {
    //todo cancel button should take you back to previous page
    //todo on logo click should take you to home.
    beforeEach(() => {
        cy.fixture("../fixtures/user.json").as("userData");
    });

    it("should publish an image to the database and image service", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("post", "api/image/publish").as("publishImage");

            cy.request("post", "api/user/create", credentials).then((res) => {
                cy.fixture("testImg-unsplash.jpg").as("testImg");
                expect(res.status).to.eq(201);
                // cy.get("#fileBrowse").selectFile("@testImg", { force: true });
                // cy.get("button[type='submit']").click();
                // cy.wait("@publishImage");

                // cy.get("#successMsg").find("button[type='submit']").click();
                cy.visit("/publish");
                cy.request("post", "api/image/publish", {
                    public_id: "publ2145",
                    asset_id: "asse8709",
                    secure_url: "https://host/value",
                    url: "http://host/value",
                }).then((res) => {
                    expect(res.status).to.eq(201);
                });
            });
        });
    });

    after(() => {
        cy.fixture("../fixtures/user.json").as("userData");

        cy.get<User>("@userData").then((credentials: User) => {
            cy.deleteUserByApi(credentials.username);
            // cy.request("get", `api/image/:${credentials.username}`).then((res) => {
            //     expect(res.body).to.haveOwnProperty("img");
            //     expect(res.body.img[0]).to.haveOwnProperty("publicId");

            //     cy.request("delete", `api/image/:${res.body.img[0].publicId}`).then((res) => {
            //         expect(res.status).to.eq(200);
            //         expect(res.body).haveOwnProperty("msg", "ok");
            //     });

            //     cy.deleteUserByApi(credentials.username);
            // });
        });
    });
});
