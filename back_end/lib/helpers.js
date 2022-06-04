import dbInstance from "neo4j-driver";
import crypto from "crypto";
import config from "./config.js";
import cloudinary from "./cloudinary.js";

const HELPERS={};
export const requestDelivered=new Map();

HELPERS.runDbQuery=async function(query,data){
    /**
    * CONNECTION INSTANCE TO NEO4J
    */
    const USER = config.Neo4jConfigurations.usrName,
        PASSWORD =  config.Neo4jConfigurations.pswd,
        URI = config.Neo4jConfigurations.uri,
        DRIVER = dbInstance.driver(URI, dbInstance.auth.basic(USER,PASSWORD)),
        SESSION = DRIVER.session();
    let queryResult=null;

    //Checks if connection was successful, if not, it throw an error.
    try 
    {
        await DRIVER.verifyConnectivity();
    } 
    catch (error) 
    {
        throw new Error(`🤯 ${error}`);
    };

    //runs the query and returns the results of the query
    try
    {   
        queryResult= await SESSION.run(query,{data:data});
    } 
    catch (error) 
    {
        console.error('Couldn\'t run you\'re query: ', error)
        throw error;
    } 
    finally 
    {
        await SESSION.close();
        await DRIVER.close();
        console.log(queryResult);      
        return queryResult.records;
    };
}

/**
 * CHECKS IF USER EXISTS
 * @param {*} userName 
 * @returns A DATABASE RECORD IF USER EXISTS
 */
HELPERS.lookUpUser=async function (userName)
{
    const QUERY=`match(u:User {userName:$data})
    return u.userName as userName`,
        QUERYRESULT=await HELPERS.runDbQuery(QUERY,userName);

    return QUERYRESULT;
};

HELPERS.hash=function(str){
    if(typeof str == "string" && str.length>0){
        str=crypto.createHmac("sha256",config.hashSecret)
            .update(str)
            .digest("hex");
        return str;
    }else{
        throw "Cannot hash this string please look at it again and try again."
    }
};

HELPERS.checkIfReqIsDuplicate=function(reqIdentifier){
    if(requestDelivered.has(reqIdentifier)){
        let status=requestDelivered.get(reqIdentifier).status;
        return {receiveStatus:"received",executeStatus:status};
    }else{
        requestDelivered.set(reqIdentifier,{status:"received"});
        return {receiveStatus:"not received"};
    };
};

//crud functionality for images stored in cloudinary
HELPERS.getTags=async function(public_id){
    let results= await cloudinary.api.resource(public_id,{tags:true,context:true,resource_type:"image"});
    let rate={rate_Limit_Remaining:results.rate_limit_remaining,
                rate_Limit_ResetAt:results.rate_limit_reset_at,
                rate_Limit_Allowed:results.rate_limit_allowed}
    let alt=typeof results.context !== "undefined" ?results.context.custom.alt:"";
    return {tags:results.tags,context:alt};
}

HELPERS.transformImage=function(public_id){
    //retrieve the url only
    let results= cloudinary.image(public_id,{
        transformation:[{width:512,crop:"scale"},
        {radius:10},
        {quality:"auto",fetch_format:"auto"}]
    }).match(/(?<=').+(?=')/g).join();//extract the url from the response.

    return results;
}

export default HELPERS;