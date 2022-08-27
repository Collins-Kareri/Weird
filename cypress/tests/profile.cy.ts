describe("profle page", () => {
    beforeEach(() => {
        cy.fixture("user.json").as("userData");
        cy.visit("/profile");
    });

    it("should not allow user to visit profile while unauthenticated", () => {
        cy.get("#popover").find("p").contains("you need to login first.", { matchCase: false });
    });

    it("displays username and profile photo", () => {});

    it("should display tab with image number and collection number.", () => {});

    it("should display image placeholder if no images are uploaded.", () => {});

    it("should display collection placeholder if no collection exists.", () => {});

    it("should open create collection modal on create button click from the placeholder.", () => {});

    it("should create a collection", () => {});

    it("should redirect to publish photo on publish button click from image placeholder.", () => {});

    it("should display image modal on image click.", () => {});

    it("displays user images.", () => {});

    it("should display edit image modal on image edit button click.", () => {});

    it("should edit tags of a specific image.", () => {});

    it("should delete selected image.", () => {});

    it("should displays collections.", () => {});

    it("should display edit collection page on collection edit button click.", () => {});

    it("should delete image in collection.", () => {});

    it("should allow editing of collection name and description.", () => {});

    it("should take you to recent and trending images page on browse images click.", () => {});

    it("should delete a collection.", () => {});
});
