describe("create a user and authenticate them", () => {
    //todo cancel button should take you back to previous page
    beforeEach(() => {
        cy.fixture("../fixtures/user.json").as("userData");
    });

    it("should publish an image to the database and image service", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.intercept("post", "api/image/publish").as("publishImage");
            cy.intercept("post", "https://api.cloudinary.com/v1_1/karerisspace/image/upload").as("cloudinaryUpload");

            cy.request("post", "api/user/create", credentials).then((res) => {
                cy.fixture("testImg-unsplash.jpg", null).as("testImg");
                expect(res.status).to.eq(201);

                cy.visit("/publish");

                cy.get("#fileBrowse").selectFile("@testImg", { force: true });

                cy.get("#tagInput").type("tag{enter}");
                cy.get("#description").type("description is here");

                cy.get("button[type='submit']").click();

                cy.wait("@cloudinaryUpload").then((cloudinaryUploadRes) => {
                    expect(cloudinaryUploadRes.response?.statusCode).eq(200);
                    expect(cloudinaryUploadRes.response?.body).to.haveOwnProperty("asset_id");
                    cloudinaryUploadRes.response?.body.asset_id;

                    cy.wait("@publishImage").then((dbRes) => {
                        expect(dbRes.response?.statusCode).eq(201);

                        cy.request("delete", `api/image/:${cloudinaryUploadRes.response?.body.asset_id}`).then(
                            (imageDeleteRes) => {
                                expect(imageDeleteRes.status).to.eq(200);
                                expect(imageDeleteRes.body).haveOwnProperty("msg", "ok");
                            }
                        );
                    });
                });
            });
        });
    });

    after(() => {
        cy.fixture("../fixtures/user.json").as("userData");

        cy.get<User>("@userData").then((credentials: User) => {
            cy.deleteUserByApi(credentials.username);
        });
    });
});
