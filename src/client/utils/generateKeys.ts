import { v4 as uuidv4 } from "uuid";

function generateKey() {
    const myuuid = uuidv4();
    return myuuid;
}

export default generateKey;
