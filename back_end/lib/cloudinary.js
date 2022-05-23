"use strict";

import config from "./config.js";
import { v2 as cloudinary } from 'cloudinary'

const {apiKey,apiSecret,accountName}=config.cloudinaryConfigurations;

cloudinary.config({
    cloud_name:accountName,
    api_key:apiKey,
    api_secret:apiSecret
});

/**
 * Provides a signature for requests
 * @returns a signature to sign requests on the front
 */
export async function signRequest(){
    //upload the files to cloudinary one by one
    const apiKey=config.cloudinaryConfigurations.apiKey
    const timestamp=Math.round((new Date).getTime()/1000);
    const signature=cloudinary.utils.api_sign_request({
        timestamp:timestamp,
        upload_preset:"weird"
        // detection:"lvis_v1"
    },config.cloudinaryConfigurations.apiSecret);
    return {timestamp,signature,apiKey};
};

export default cloudinary;