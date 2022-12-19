import { writeService } from "@server/neo4j/neo4j.transactions";
import { getDriver } from "@server/neo4j/neo4j.driver";

/**
 * Creates image node in neo4j db
 * @param data
 */
export async function addImageDataToDb(data: {
    public_id: string;
    asset_id: string;
    url: string;
    secure_url: string;
    username: string;
}) {
    const driver = getDriver();
    const session = driver.session();
    const err = "Could't add to database";

    const query = `MATCH (usr:User {name:$username})
    MERGE (img:Image 
        {
            name:$asset_id,
            url:$url,
            secure_url:$secure_url,
            public_id:$public_id,
            asset_id:$asset_id
        })
    MERGE (img)<-[rel:UPLOADED]-(usr)
    RETURN img as image, rel, SIZE((usr)-[:UPLOADED]->(:Image)) as noOfUploadedImages, SIZE( (:Collection)-[:CURATED_BY]->(usr) ) as noOfCollections, {id: usr.id, username: usr.name, email: usr.email, public_id: usr.profilePicPublicId, url: usr.profilePicUrl} as user`;

    const { public_id, asset_id, url, secure_url, username } = data;

    const dbRes = await writeService(session, query, { username, url, secure_url, public_id, asset_id });

    if (dbRes.records[0].length > 0) {
        const { public_id, url, ...others } = dbRes.records[0].get("user");
        const noOfUploadedImages = dbRes.records[0].get("noOfUploadedImages").toNumber();
        const noOfCollections = dbRes.records[0].get("noOfCollections").toNumber();

        let userProps;

        if (public_id && url) {
            userProps = { profilePic: { public_id, url }, ...others };
        } else {
            userProps = others;
        }

        return { ...userProps, noOfUploadedImages, noOfCollections };
    } else {
        throw err;
    }
}
