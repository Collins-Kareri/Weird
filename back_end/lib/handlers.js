import helpers,{requestDelivered} from "./helpers.js";

import {signRequest} from "./cloudinary.js"

const handlers={};

/**
 * TAKES CARE OF THE LOGIC NEEDED TO CREATE A NEW USER
 * @Data{data that will be use to create the user}
 * @Callback{used to return the results of the created operation} 
 */
handlers.createAccount=async function (data,callback){
    if (data.method.toLowerCase() == "post")
    {
        const {userName,password}=data.payLoad;
        try 
        {
            let lookUpResult=await helpers.lookUpUser(userName);

            if(lookUpResult.length>0)
            {
                //tell the client the user exists in the database
                callback(200,{msg:"Username already exists"});
                return; 
            };
                
            data.payLoad.password=helpers.hash(password);

            const QUERY= `create (u:User {userName: $data.userName, email: $data.email, password: $data.password})
                    return u.userName as userName, u.email as email`;
            const USERCREATERES=await helpers.runDbQuery(QUERY,data.payLoad);
    
            requestDelivered.delete(data.reqIdentifier)

            if(USERCREATERES.length>0)
            {
                const resObj=USERCREATERES[0],
                resName=resObj.get("userName"),
                resEmail=resObj.get("email");
                callback(201,{msg: "Account created successfully",userData:{userName:resName,email:resEmail}});
                return;
            };

            callback(200, {msg: "Account not created"});
            return;
        } catch (error) 
        {
            callback(500,{msg:`Error occured error:${error}`})
            return;  
        };
    }
    else
    {
        callback(405,{msg:"Http method not allowed"});
        return;
    };
};

/**
 * LOGS IN A USER
 * @param {*} data 
 * @param {*} callback 
 */
handlers.createSession=async function(data,callback){
    if(data.method.toLowerCase() == "post")
    {
        const {password}=data.payLoad;
        try 
        {
            data.payLoad.password=helpers.hash(password);

            const QUERY = `match (u:User {userName:$data.userName,password:$data.password})
            return u.userName as userName, u.email as email`
            const LOGINRES=await helpers.runDbQuery(QUERY,data.payLoad);
    
            requestDelivered.delete(data.reqIdentifier)
    
            if(LOGINRES.length>0)
            {
                const RESNAME=LOGINRES[0].get("userName"),
                RESEMAIL=LOGINRES[0].get("email");
                callback(200,{msg:"Log in successful",userData:{userName:RESNAME,email:RESEMAIL}});
            }else
            {
                callback(200,{msg:`Wrong username or password. Please try again`});
            }   
        } catch (err) 
        {
            requestDelivered.delete(data.reqIdentifier)
            callback(500,{msg:`Error occured: ${err}`});
        }  
    }
    else
    {
        requestDelivered.delete(data.reqIdentifier)
        callback(405,{msg:"Http method not allowed"})
    };
};

handlers.storeImageRef=async function(data,callback){
    try {
        const QUERY=`UNWIND $data AS properties
        MATCH (usr:User {userName:properties.ownerName})
        MERGE (img:Image {name:properties.name,public_id:properties.public_id})
        CREATE (usr)-[rel:UPLOADED]->(img)
        RETURN img,rel`;
        const SAVEIMAGERES=await helpers.runDbQuery(QUERY,data.payLoad);
        if(SAVEIMAGERES.length>0)
        {
            console.log(SAVEIMAGERES);
            callback(200,{msg:"saved",no_Of_Values_Saved:SAVEIMAGERES.length});
        }else
        {
            callback(200,{msg:`Wrong username or password. Please try again`});
        }
        requestDelivered.delete(data.reqIdentifier) 
    } catch (err) {
        requestDelivered.delete(data.reqIdentifier)
        callback(500,{msg:`Error occured: ${err}`})
    }
};

handlers.generateSignature=function(data,callback){
    /*generate a signature to enable signed uploads to cloudinary*/
    try
    {
        signRequest()
        .then((res)=>{
            callback(200,{msg:"Everything is okay",data:res});
            requestDelivered.delete(data.reqIdentifier);
        },
        (err)=>{
            callback(500,{msg:`The signature generation didn't work, error: ${err}`});
        });   
    } catch (error) 
    {
        callback(501,{msg:`Error occured error ${error}`});
    };
};

handlers.notFound=function(data,callback){
    console.log(data.method);
    callback(404, {msg:"You have not specified this route in your server. Check the route for spelling errors or capitalization errors."});
};

export default handlers;