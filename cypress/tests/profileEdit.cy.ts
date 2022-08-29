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
                cy.wait(1000);
                cy.wait("@profilePicUpload");
                cy.wait(1000);
                cy.wait("@updateUser");
                cy.wait(1000);

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

    it("should update username and email.", () => {
        cy.get<User>("@userData").then((credentials: User) => {
            cy.request("post", "api/user/login", {
                username: credentials.username,
                password: credentials.password,
            }).then((res) => {
                cy.intercept("/api/user/update").as("updateUser");
                cy.intercept("get", `api/user/:${credentials.username}`).as("previous_userExist");
                cy.intercept("get", `api/user/:${credentials.email}`).as("previous_emailExist");
                cy.intercept("get", "api/user/:newUsername").as("new_userExist");
                cy.intercept("get", "api/user/:newemail@mail.com").as("new_emailExist");

                expect(res.status).eq(200);
                expect(res.body).to.haveOwnProperty("msg", "successful");

                cy.visit("/profile/edit");
                cy.wait(1000);

                //check whether the ui displays the correct information
                cy.get("#profilePic").should("not.exist");
                cy.get("#username").should("contain.value", credentials.username);
                cy.get("#email").should("contain.value", credentials.email);

                cy.get("#updateUserDataCtaContainer")
                    .find(">button")
                    .should("exist")
                    .first()
                    .contains("cancel", { matchCase: false });

                cy.get("#updateUserDataCtaContainer")
                    .find(">button")
                    .should("exist")
                    .last()
                    .contains("update", { matchCase: false });

                //update username
                cy.get("#username").focus().clear().type("newUsername").blur();
                cy.wait("@new_userExist");
                cy.get("#updateUserDataCtaContainer").find(">button").last().click();
                cy.wait("@updateUser");
                cy.get("#username").should("contain.value", "newUsername");

                //update email
                cy.get("#email").focus().clear().type("newemail@mail.com").blur();
                cy.wait("@new_emailExist");
                cy.get("#updateUserDataCtaContainer").find(">button").last().click();
                cy.wait("@updateUser");
                cy.get("#email").should("contain.value", "newemail@mail.com");

                //return username and email to previous credentials
                cy.get("#username").focus().clear().type(credentials.username).blur();
                cy.wait("@previous_userExist");
                cy.get("#email").focus().clear().type(credentials.email).blur();
                cy.wait("@previous_emailExist");
                cy.get("#updateUserDataCtaContainer").find(">button").last().click();
                cy.wait("@updateUser");

                //check if email and username match the ones from the fixture ie they returned to normal
                cy.get("#username").should("contain.value", credentials.username);
                cy.get("#email").should("contain.value", credentials.email);
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
