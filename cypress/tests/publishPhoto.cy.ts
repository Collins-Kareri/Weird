/* eslint-disable cypress/no-unnecessary-waiting */
describe("publish image to neo4j and cloudinary", () => {
    beforeEach(() => {
        cy.fixture("user.json").as("userData");
        cy.fixture("testImg-unsplash.jpg", null).as("testImg");
        cy.visit("/publish");
    });

    it("should not allow upload image while unauthenticated", () => {
        cy.get("#popover").find("p").contains("you need to login first.", { matchCase: false });
    });

    it("should display a preview of selected image", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/create", credentials).then(() => {
                cy.wait(1000);
                cy.visit("/publish");

                cy.get("#fileBrowse").selectFile(
                    { contents: "@testImg", fileName: "testImg", mimeType: "image/jpg" },
                    { force: true }
                );

                cy.get("#imageEl").should("exist").and("have.attr", "src");
            });
        });
    });

    it("should remove preview image on remove button click", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.visit("/publish");

                cy.get("#fileBrowse").selectFile(
                    { contents: "@testImg", fileName: "testImg", mimeType: "image/jpg" },
                    { force: true }
                );
                cy.get("#closeIcon").click();
                cy.get("#imageEl").should("not.exist");
            });
        });
    });

    it("should publish an image to the database and cloudinary image service", () => {
        cy.intercept("post", "api/user/create", {});

        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                //neo4j request to make a db node
                cy.intercept("post", "api/image/publish").as("publishImage");

                //cloudinary request to upload image to cloudinary
                cy.intercept("post", Cypress.env("cloudinary_upload_url")).as("cloudinaryUpload");

                //upload image by ui
                cy.visit("/publish");

                cy.get("#fileBrowse").selectFile(
                    { contents: "@testImg", fileName: "testImg", mimeType: "image/jpg" },
                    { force: true }
                );
                cy.get("#tagInput").type("tag{enter}");
                cy.get("#description").type("description is here");

                cy.get("button[type='submit']").click();

                //deal with the cloudinary request
                cy.wait("@cloudinaryUpload").then((cloudinaryUploadRes) => {
                    expect(cloudinaryUploadRes.response?.statusCode).eq(200);
                    expect(cloudinaryUploadRes.response?.body).to.haveOwnProperty("public_id");
                    cloudinaryUploadRes.response?.body.asset_id;

                    //deal with the neo4j request
                    cy.wait("@publishImage").then((dbRes) => {
                        expect(dbRes.response?.statusCode).eq(201);

                        cy.wait(1000);

                        cy.get("button[type='submit']").click();

                        cy.url().should("include", "/profile");

                        cy.request(
                            "delete",
                            `api/image/:${cloudinaryUploadRes.response?.body.public_id.replace(/\//g, "_")}`
                        ).then((imageDeleteRes) => {
                            expect(imageDeleteRes.status).to.eq(200);
                            expect(imageDeleteRes.body).haveOwnProperty("msg", "ok");
                        });
                    });
                });
            });
        });
    });

    after(() => {
        cy.fixture("user.json").as("userData");

        cy.get<User>("@userData").then((credentials: User) => {
            cy.deleteUserByApi(credentials.username);
        });
    });
});
