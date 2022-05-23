import handlers from "./handlers.js"

const routeMap={
    "/createAccount":handlers.createAccount,
    "/createSession":handlers.createSession,
    "/generateSignature":handlers.generateSignature,
    "/storeImageRef":handlers.storeImageRef,
    "/storeImgRef":handlers.storeImgRef,
    "/favicon.ico":""
};

export default routeMap;