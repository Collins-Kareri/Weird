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
 * Provides a signature for requests
 * @returns a signature to sign requests on the front
 */
export async function signRequest(){
    //upload the files to cloudinary one by one
    const API_KEY=config.cloudinaryConfigurations.api_Key
    const TIMESTAMP=Math.round((new Date).getTime()/1000);
    const SIGNATURE=cloudinary.utils.api_sign_request({
        timestamp:TIMESTAMP,
        upload_preset:"weird",
        detection:"lvis_v1"
    },config.cloudinaryConfigurations.api_Secret);
    return {timestamp: TIMESTAMP,signature: SIGNATURE,api_Key: API_KEY};
};

export default cloudinary;