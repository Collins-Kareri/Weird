declare namespace Cypress {
    interface Chainable {
        /**
         * Create a new user by using UI.
         * @example cy.register(credentials)
         */
        createUser(credentials: User): void;
        /**
         * Checks the authentication status.
         * @example cy.checkAuthStatus(credentials)
         */
        checkAuthStatus(credentials: User): void;

        deleteUserByApi(username: string): void;
        /**
         * Check if you can make request to server from client.
         */
        ping(): void;
        /**
         * Uploads image to cloudinary
         * @example cy.uploadImg(public_id)
         */
        uploadImg(imageData: TestImg): void;
    }
}
