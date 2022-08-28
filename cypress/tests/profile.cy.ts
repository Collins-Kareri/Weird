/* eslint-disable cypress/no-unnecessary-waiting */
describe("profile page", () => {
    beforeEach(() => {
        cy.fixture("user.json").as("userData");
        cy.visit("/profile");
    });

    it("should not allow user to visit profile while unauthenticated", () => {
        cy.get("#popover").find("p").contains("you need to login first.", { matchCase: false });
    });

    it("displays username and profile photo and cta take you edit profile page.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/create", credentials).then(() => {
                cy.wait(1000);
                cy.visit("/profile");

                cy.get("#username").should("exist").and("contain.text", credentials.username);
                cy.get("#email").should("exist").and("contain.text", credentials.email);
                cy.get("#profilePic").should("exist");

                cy.get("#profileInfo").find("button").contains("edit profile", { matchCase: false }).click();
                cy.wait(1000);
                cy.url().should("contain", "/profile/edit");
            });
        });
    });

    it("should display tab with image number and collection number.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.visit("/profile");
                cy.get("#tab").should("exist");
                cy.get("#imageTab").should("exist").and("contain.text", "images 0");
                cy.get("#collectionTab").should("exist").and("contain.text", "collections 0");
            });
        });
    });

    it("should display image placeholderContent if no images are uploaded and cta should redirect to publish page.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.visit("/profile");
                cy.get("#imageTab").click();

                cy.get("#placeholderContent")
                    .should("exist")
                    .find("span")
                    .contains("Publish an image. Join the community.", { matchCase: false });

                cy.get("#placeholderContent")
                    .should("exist")
                    .find("button")
                    .contains("publish", { matchCase: false })
                    .click();

                cy.url().should("include", "/publish");

                cy.get("button[type=button]").click();

                cy.url().should("include", "/profile");
            });
        });
    });

    it("should display collection placeholderContent if no collection exists and cta should open create collection modal.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.visit("/profile");
                cy.get("#collectionTab").click();

                cy.get("#placeholderContent")
                    .should("exist")
                    .find("span")
                    .contains("Start curating images. Start a collection.", { matchCase: false });

                cy.get("#placeholderContent")
                    .should("exist")
                    .find("button")
                    .contains("create", { matchCase: false })
                    .click();

                cy.get("#createCollection").should("exist").find("#closeIcon").click();

                cy.get("#createCollection").should("not.exist");
            });
        });
    });

    it("should create a collection", () => {});

    it("should display image modal on image click.", () => {});

    //test image logic

    it("displays user images.", () => {});

    it("should display edit image modal on image edit button click.", () => {});

    it("should edit tags of a specific image.", () => {});

    it("should delete selected image.", () => {});

    //test collection logic

    it("should display collections.", () => {});

    it("should display edit collection page on collection edit button click.", () => {});

    it("should delete image in collection.", () => {});

    it("should allow editing of collection name and description.", () => {});

    it("should take you to recent and trending images page on browse images click.", () => {});

    it("should delete a collection.", () => {});

    after(() => {
        cy.fixture("user.json").as("userData");

        cy.get<User>("@userData").then((credentials: User) => {
            cy.deleteUserByApi(credentials.username);
        });
    });
});
