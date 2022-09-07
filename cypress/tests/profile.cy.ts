/* eslint-disable cypress/no-unnecessary-waiting */
describe("profile page", () => {
    beforeEach(() => {
        cy.fixture("user.json").as("userData");
        cy.fixture("/cloudinaryImages/id1.json").as("testImage");
    });

    it("should not allow user to visit profile while unauthenticated", () => {
        cy.visit("/profile");
        cy.get("#popover").find("p").contains("you need to login first.", { matchCase: false });
    });

    it("displays username and profile photo container with no profile image and a button to take you edit profile page.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/create", credentials).then(() => {
                cy.wait(1000);
                cy.visit("/profile");

                cy.get("#username").should("exist").and("contain.text", credentials.username);
                cy.get("#email").should("exist").and("contain.text", credentials.email);
                cy.get("#profilePicContainer").should("exist");
                cy.get("#profilePic").should("not.exist");

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
                cy.intercept(`/api/image/:${credentials.username}?skip=${0}&&limit=6`).as("fetchUserImages");

                cy.visit("/profile");
                cy.get("#imageTab").click();
                cy.wait("@fetchUserImages");

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

                cy.get<TestImg>("@testImage").then((imgData: TestImg) => {
                    cy.request("post", "api/image/publish", imgData).then((res) => {
                        expect(res.status).eq(201);
                    });
                });
            });
        });
    });

    //test collection logic
    it("should create a collection", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");
                cy.intercept("/api/collection/").as("createCollection");
                cy.intercept(`/api/collection/:${credentials.username}`).as("fetchCollections");

                cy.visit("/profile");
                cy.get("#collectionTab").click();
                cy.wait("@fetchCollections");

                cy.get("#placeholderContent")
                    .should("exist")
                    .find("span")
                    .contains("Start curating images. Start a collection.", { matchCase: false });

                cy.get("#placeholderContent")
                    .should("exist")
                    .find("button")
                    .contains("create", { matchCase: false })
                    .click();

                cy.get("#collection").type("arts");
                cy.get("#description").type("artworks etc...");
                cy.get("button[type=submit]").should("exist").click();

                cy.intercept(`/api/collection/:${credentials.username}`).as("fetchCollections");

                cy.wait("@createCollection").then((res) => {
                    expect(res.response?.statusCode).to.eq(201);
                    cy.wait(1000);

                    cy.get("#imageTab").click();
                    cy.get("#collectionTab").click();

                    cy.wait("@fetchCollections");

                    cy.get("div[data-within=collection]").should("exist");
                    cy.get("div[data-within=collection]").should("have.length", 1);
                    cy.get("div[data-within=collection]").first().find(">p").first().should("contain.text", "Arts");
                    cy.get("div[data-within=collection]").first().find(">p").last().should("contain.text", "0 items");
                });
            });
        });
    });

    it("should add image to collection", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.intercept(`/api/collection/:${credentials.username}`).as("fetchCollections");

                cy.get<TestImg>("@testImage").then((imgData: TestImg) => {
                    cy.visit("/profile");
                    cy.request("post", `/api/collection/image/:arts?public_id=${imgData.public_id}`).then((res) => {
                        expect(res.status).eq(201);
                        expect(res.body).to.haveOwnProperty("msg", "ok");

                        cy.get("#collectionTab").click();
                        cy.wait("@fetchCollections");

                        cy.get("#imageTab").click();
                        cy.get("#collectionTab").click();

                        cy.wait("@fetchCollections");

                        cy.get("div[data-within=collection]").should("exist");
                        cy.get("div[data-within=collection]").should("have.length", 1);
                        cy.get("div[data-within=collection]").first().find(">p").first().should("contain.text", "Arts");
                        cy.get("div[data-within=collection]")
                            .first()
                            .find(">p")
                            .last()
                            .should("contain.text", "1 item");
                    });
                });
            });
        });
    });

    it("should allow editing of collection.", () => {
        //todo visit edit collection page.
        //todo remove image from collection.
        //todo edit collection details.
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                cy.intercept(`/api/collection/:${credentials.username}`).as("fetchCollections");
                cy.intercept(`api/collection/images/:arts?username=${credentials.username}&&skip=0&&limit=6`).as(
                    "fetchImages"
                );

                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.visit("/profile");
                cy.get("#collectionTab").click();

                cy.wait("@fetchCollections");

                //check ui of the page
                cy.get("div[data-within=collection]")
                    .first()
                    .find(">button")
                    .first()
                    .should("contain.text", "Edit")
                    .click();

                cy.url().should("include", "/profile/edit/collection");
                cy.wait("@fetchImages");

                cy.get("div[data-within=collectionDetails]").first().find(">span").should("have.length", 3);
                cy.get("div[data-within=collectionDetails]").first().find(">span").first().should("have.text", "Arts");

                cy.get("div[data-within=collectionDetails]")
                    .first()
                    .find(">section")
                    .first()
                    .find(">button")
                    .should("have.length", 2);

                cy.get("div[data-within=collectionDetails]")
                    .first()
                    .find(">section")
                    .first()
                    .find(">button")
                    .last()
                    .should("have.text", "Edit")
                    .click();

                cy.intercept("api/collection/:arts").as("updateCollection");
                cy.intercept("api/collection/image/:Crafts").as("removeImage");

                //Update collection data.
                cy.get("div[data-within=editCollection]").first().should("exist");
                cy.get("#collectionName").clear().type("Crafts");
                cy.get("div[data-within=editCollection]")
                    .first()
                    .find(">section")
                    .first()
                    .find(">button")
                    .last()
                    .should("contain.text", "Update")
                    .click();
                cy.wait("@updateCollection");

                cy.get("div[data-within=collectionDetails]")
                    .first()
                    .find(">span")
                    .first()
                    .should("have.text", "Crafts");

                //remove Image
                cy.get("div[data-within=images]").first().find(">section").should("have.length", 1);
                cy.get("div[data-within=images]")
                    .first()
                    .find(">section")
                    .find("button")
                    .first()
                    .should("have.text", "Remove")
                    .click();
                cy.wait("@removeImage");
                cy.get("div[data-within=images]").first().find(">section").should("have.length", 0);
            });
        });
    });

    it("should delete a collection.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.intercept("/api/collection/:Crafts").as("deleteCollection");
                cy.intercept(`/api/collection/:${credentials.username}`).as("fetchCollections");

                cy.visit("/profile");
                cy.get("#collectionTab").click();
                cy.wait("@fetchCollections");

                cy.get("div[data-within=collection]").should("exist");
                cy.get("div[data-within=collection]").should("have.length", 1);

                cy.get("div[data-within=collection]").first().find(">p").first().should("contain.text", "Crafts");
                cy.get("div[data-within=collection]").first().find(">p").last().should("contain.text", "0 items");

                cy.get("div[data-within=collection]").first().find(">button").first().should("contain.text", "Edit");
                cy.get("div[data-within=collection]")
                    .first()
                    .find(">button")
                    .last()
                    .should("contain.text", "Delete")
                    .click();

                cy.wait("@deleteCollection").then((interceptionRes) => {
                    const { response } = interceptionRes;
                    expect(response?.statusCode).to.eq(200);
                    expect(response?.body).to.haveOwnProperty("user");
                    expect(response?.body).to.haveOwnProperty("msg", "ok");
                });
            });
        });
    });

    //test image logic

    it("displays user images.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.intercept(`/api/image/:${credentials.username}?skip=${0}&&limit=6`).as("getUserImages");

                cy.visit("/profile");
                cy.wait("@getUserImages");
                cy.wait(3000);

                cy.get("#imageTab").should("exist").and("contain.text", "images 1");
                cy.get("div[data-within=images]").should("exist");
                cy.get("div[data-within=images]").should("have.length", 1);
                cy.get("div[data-within=images]").first().find(">section").first().find(">img").first().should("exist");
                cy.get("div[data-within=images]")
                    .first()
                    .find(">section")
                    .first()
                    .find(">div")
                    .find(">button")
                    .first()
                    .should("have.text", "Edit");
                cy.get("div[data-within=images]")
                    .first()
                    .find(">section")
                    .find(">div")
                    .first()
                    .find(">button")
                    .last()
                    .should("have.text", "Delete");
            });
        });
    });

    it("should edit tags and description of a specific image.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                cy.get<TestImg>("@testImage").then((imgData: TestImg) => {
                    expect(res.status).eq(200);
                    expect(res.body).to.haveOwnProperty("msg", "successful");

                    cy.intercept(`/api/image/:${credentials.username}?skip=${0}&&limit=6`).as("getUserImages");
                    cy.intercept("get", `/api/image/data/:${imgData.public_id.replace("/", "_")}`).as("getImageData");
                    cy.intercept("put", `/api/image/data/:${imgData.public_id.replace("/", "_")}`).as(
                        "updateUserImage"
                    );
                    cy.visit("/profile");
                    cy.wait("@getUserImages");

                    cy.get("div[data-within=images]")
                        .first()
                        .find(">section")
                        .first()
                        .find(">div")
                        .first()
                        .find(">button")
                        .first()
                        .click();

                    cy.wait("@getImageData");
                    cy.get("#tagInput").type("hello{enter}");
                    cy.get("#description").type("This is description");

                    cy.get("#editUserImage")
                        .find(">button")
                        .last()
                        .should("exist")
                        .and("have.text", "Update")
                        .focus()
                        .click();

                    cy.wait("@updateUserImage").then((result) => {
                        expect(result.response?.statusCode).to.eq(200);
                        expect(result.response?.body).to.haveOwnProperty("imgData");
                        expect(result.response?.body.imgData).to.haveOwnProperty("tags");
                        expect(result.response?.body.imgData.tags[0]).to.eq("hello");
                        expect(result.response?.body.imgData).to.haveOwnProperty("description", "This is description");
                        cy.get("#description").should("have.value", "This is a description");
                    });
                });
            });
        });
    });

    it("should delete selected image.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            //login first
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                cy.get<TestImg>("@testImage").then((imgData: TestImg) => {
                    expect(res.status).eq(200);
                    expect(res.body).to.haveOwnProperty("msg", "successful");

                    cy.intercept(`/api/image/:${credentials.username}?skip=${0}&&limit=6`).as("getUserImages");
                    cy.intercept("get", `/api/image/data/:${imgData.public_id.replace("/", "_")}`).as("getImageData");
                    cy.intercept("delete", `/api/image/:${imgData.public_id.replace("/", "_")}`).as("deleteImage");
                    cy.visit("/profile");
                    cy.wait("@getUserImages");

                    cy.get("div[data-within=images]")
                        .first()
                        .find(">section")
                        .first()
                        .find(">div")
                        .first()
                        .find(">button")
                        .last()
                        .click();
                    cy.wait("@deleteImage");
                    cy.visit("/profile");
                    // cy.get("#imageTab").should("exist").and("contain.text", "images 0");
                    cy.get("div[data-within=images]").should("not.exist");
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
