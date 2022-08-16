import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

export async function deleteAsset(public_id: string): Promise<string> {
    return new Promise((success, fail) => {
        cloudinary.uploader.destroy(public_id, { resource_type: "image" }, (result, error) => {
            if (error) {
                fail(error);
                return;
            }

            success(result);
            return;
        });
    });
}
