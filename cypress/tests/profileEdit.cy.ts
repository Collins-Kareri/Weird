/* eslint-disable cypress/no-unnecessary-waiting */
describe("profile edit page functionality", () => {
    beforeEach(() => {
        cy.fixture("user.json").as("userData");
        cy.fixture("testImg-unsplash.jpg", null).as("testImg");
        cy.visit("/profile/edit");
    });

    it("should not allow an unauthenticated user", () => {
        cy.get("#popover").find("p").contains("you need to login first.", { matchCase: false });
    });

    it("should contain profile pic container with no profile image, change and delete cta.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/create", credentials).then(() => {
                cy.visit("/profile/edit");

                cy.get("#profilePicContainer").should("exist");
                cy.get("#profilePic").should("not.exist");

                cy.get("#editProfilePic").should("exist");

                cy.get("div[data-within=profilePicActions]")
                    .should("exist")
                    .find(">button")
                    .first()
                    .contains("change", { matchCase: false });

                cy.get("div[data-within=profilePicActions]")
                    .should("exist")
                    .find(">button")
                    .last()
                    .contains("delete", { matchCase: false });
            });
        });
    });

    it("should change profile picture.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                cy.intercept("/api/image/signature/:profilePic").as("signatureGeneration");
                cy.intercept("https://api.cloudinary.com/v1_1/karerisspace/image/upload").as("profilePicUpload");
                cy.intercept("/api/user/update").as("updateUser");

                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.visit("/profile/edit");

                cy.get("div[data-within=profilePicActions]")
                    .should("exist")
                    .find(">button")
                    .first()
                    .contains("change", { matchCase: false });

                cy.get("#fileBrowse").should("exist");

                cy.get("#fileBrowse").selectFile(
                    { contents: "@testImg", fileName: "testImg", mimeType: "image/jpg" },
                    { force: true }
                );

                cy.wait("@signatureGeneration");
                cy.wait("@profilePicUpload");
                cy.wait("@updateUser");

                cy.request("/api/auth").then((res) => {
                    expect(res.body).to.haveOwnProperty("user");
                    expect(res.body.user).to.haveOwnProperty("profilePic");
                    expect(res.body.user.profilePic).to.haveOwnProperty("url");
                    cy.get("#profilePic").should("exist").and("have.attr", "src", res.body.user.profilePic.url);
                });
            });
        });
    });

    it("should delete profile image", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                cy.intercept("/api/image/profileImage/delete").as("deleteProfilePic");

                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.visit("/profile/edit");

                cy.get("div[data-within=profilePicActions]")
                    .should("exist")
                    .find(">button")
                    .last()
                    .contains("delete", { matchCase: false })
                    .click();

                cy.wait(1000);
                cy.wait("@deleteProfilePic");

                cy.get("#profilePic").should("not.exist");
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
