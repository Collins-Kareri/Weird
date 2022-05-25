import dbInstance from "neo4j-driver";
import crypto from "crypto";
import config from "./config.js";

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
        console.log(`🤯 ${error}`);
        return;
    };

    //runs the query and returns the results of the query
    try
    {   
        queryResult= await SESSION.run(query,{data:data});
    } 
    catch (error) 
    {
        console.error('Something went wrong: ', error)
        throw error;
    } 
    finally 
    {
        await SESSION.close();
        await DRIVER.close();        
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
HELPERS.signRequest=async function(){
    //upload the files to cloudinary one by one
};

export default HELPERS;