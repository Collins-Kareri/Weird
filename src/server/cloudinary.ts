import "dotenv/config";
import { v2 as cloudinary } from "cloudinary";

interface SignatureExtraparams {
    context?: string;
    tag?: string;
    public_id?: string | undefined;
}

cloudinary.config({
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

/**
 * Deletes an image from cloudinary using public_id
 * @param  {string} public_id
 */
export async function deleteAsset(public_id: string | undefined): Promise<string> {
    if (!public_id) {
        return "ok";
    }

    return new Promise((success, fail) => {
        cloudinary.uploader.destroy(public_id, { resource_type: "image" }, (error, deleteRes) => {
            if (error) {
                fail("failed");
                return;
            }

            success(deleteRes.result);
            return;
        });
    });
}

export function generateSignature(preset: string, extraParams?: SignatureExtraparams) {
    if (!preset) {
        return "nothing to sign";
    }

    const timestamp = Math.round(new Date().getTime() / 1000);
    let paramsToSign = {};
    let folder;

    if (preset.toLowerCase() === "profilepic") {
        folder = "profilePictures_Weird";
    } else {
        folder = "weird";
    }

    if (extraParams) {
        Object.keys(extraParams).forEach((key) => {
            if (typeof extraParams[key as keyof SignatureExtraparams] === "undefined") {
                delete extraParams[key as keyof SignatureExtraparams];
            }
        });

        paramsToSign = { timestamp, upload_preset: preset, folder, ...extraParams };
    } else {
        paramsToSign = { timestamp, upload_preset: preset, folder };
    }

    const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET as string);

    return { signature, timestamp, apiKey: process.env.CLOUDINARY_API_KEY };
}
