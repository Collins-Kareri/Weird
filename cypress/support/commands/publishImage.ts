/* eslint-disable cypress/no-unnecessary-waiting */
Cypress.Commands.add("uploadImg", (imageData) => {
    //neo4j request to make a db node
    cy.intercept("post", "api/image/publish").as("publishImage");

    //cloudinary request to upload image to cloudinary
    cy.intercept("post", "").as("cloudinaryUpload");

    cy.request("post", "api/test/upload_img", {
        imagePath: "./cypress/fixtures/testImg-unsplash.jpg",
        ...imageData,
    }).then((response) => {
        expect(response.status).eq(200);
        expect(response.body).to.haveOwnProperty("public_id", "weird/vtbs4c1yd9jhai4ktpf4");
    });
});
