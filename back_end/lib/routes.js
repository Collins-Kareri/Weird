import HANDLERS from "./handlers.js"

const routeMap={
    "createAccount":HANDLERS.createAccount,
    "createSession":HANDLERS.createSession,
    "generateSignature":HANDLERS.generateSignature,
    "storeImageRef":HANDLERS.storeImageRef,
    "retrieveImages":HANDLERS.retrieveImages,
    "retrieveCollection":HANDLERS.retrieveCollection,
    "updateImgInfo":HANDLERS.replaceTags,
    "deleteImg":HANDLERS.deleteImg,
    "favicon.ico":""
};

export default routeMap;