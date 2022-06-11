"use strict";

import config from "./config.js";
import { v2 as cloudinary } from 'cloudinary'

const {api_Key,api_Secret,account_Name}=config.cloudinaryConfigurations;

cloudinary.config({
    cloud_name:account_Name,
    api_key:api_Key,
    api_secret:api_Secret
});

/**
 * provides a signature to sign a cloudinary request
 * @param {STRING} uploadType determines the upload preset to be signed
 * @returns an object with the timestamp, signature & api key
 */
export async function signRequest(uploadType){
    //upload the files to cloudinary one by one
    const API_KEY=config.cloudinaryConfigurations.api_Key
    const TIMESTAMP=Math.round((new Date).getTime()/1000);
    let upload_preset;

    if(uploadType === "image")
    {
        upload_preset="trialToUpload";
    }

    if(uploadType === "profile")
    {
        upload_preset="profile";
    }

    const SIGNATURE=cloudinary.utils.api_sign_request({
        timestamp:TIMESTAMP,
        upload_preset,
        detection:"lvis_v1"
    },config.cloudinaryConfigurations.api_Secret);
    return {timestamp: TIMESTAMP,signature: SIGNATURE,api_Key: API_KEY};
};

export default cloudinary;