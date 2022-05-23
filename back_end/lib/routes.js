import handlers from "./handlers.js"

const routeMap={
    "/createAccount":handlers.createAccount,
    "/createSession":handlers.createSession,
    "/generateSignature":handlers.generateSignature,
    "/storeImageRef":handlers.storeImageRef,
    "/favicon.ico":""
};

export default routeMap;