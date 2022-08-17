import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

/**
 * Deletes an image from cloudinary using public_id
 * @param  {string} public_id
 */
export async function deleteAsset(public_id: string): Promise<string> {
    return new Promise((success, fail) => {
        cloudinary.uploader.destroy(public_id, { resource_type: "image" }, (error, deleteRes) => {
            if (error) {
                fail("error deleting asset");
                return;
            }

            success(deleteRes.result);
            return;
        });
    });
}
