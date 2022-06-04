import helpers from "./helpers.js";
import cloudinary,{signRequest} from "./cloudinary.js"
import HELPERS from "./helpers.js";
const HANDLERS={};

/**
 * TAKES CARE OF THE LOGIC NEEDED TO CREATE A NEW USER
 * @Data{data that will be use to create the user}
 * @Callback{used to return the results of the created operation} 
 */
HANDLERS.createAccount=async function (data,callback){
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
        }
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
HANDLERS.createSession=async function(data,callback){
    if(data.method.toLowerCase() == "post")
    {
        const {password}=data.payLoad;
        try 
        {
            data.payLoad.password=helpers.hash(password);

            const QUERY = `match (u:User {userName:$data.userName,password:$data.password})
            return u.userName as userName, u.email as email`
            const LOGINRES=await helpers.runDbQuery(QUERY,data.payLoad);
    
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
            
            callback(500,{msg:`Error occured: ${err}`});
        }  
    }
    else
    {
        
        callback(405,{msg:"Http method not allowed"})
    };
};

HANDLERS.storeImageRef=async function(data,callback){
    try {
        const QUERY=`UNWIND $data AS properties
        MATCH (usr:User {userName:properties.ownerName})
        MERGE (img:Image {name:properties.name,public_id:properties.public_id})
        CREATE (usr)-[rel:UPLOADED]->(img)
        RETURN img,rel`;
        const SAVE_IMAGE_RES=await helpers.runDbQuery(QUERY,data.payLoad);
        if(SAVE_IMAGE_RES.length>0)
        {
            callback(200,{msg:"saved",no_Of_Values_Saved:SAVE_IMAGE_RES.length});
        }else
        {
            callback(200,{msg:`Images where not stored.`});
        }     
    } catch (err) {     
        callback(500,{msg:`Error occured: ${err}`})
    }
};

HANDLERS.generateSignature=function(data,callback){
    /*generate a signature to enable signed uploads to cloudinary*/
    try
    {
        signRequest()
        .then((res)=>{
            callback(200,{msg:"Everything is okay",data:res});
            ;
        },
        (err)=>{
            callback(500,{msg:`The signature generation didn't work, error: ${err}`});
        });   
    } catch (error) 
    {
        callback(501,{msg:`Error occured error ${error}`});
    };
};

HANDLERS.retrieveImages=async function(data,callback){
    try {
        const QUERY=`MATCH (usr:User {userName:$data.userName})-[rel:UPLOADED]->(img)
        RETURN img.name AS name, img.public_id as public_id`;
        const RETRIEVE_IMAGES=await helpers.runDbQuery(QUERY,data.payLoad);
        const RESULTS=[];
        if(RETRIEVE_IMAGES.length>0)
        {
            for(let image of RETRIEVE_IMAGES)
            {
                let name=image.get("name");
                let public_id=image.get("public_id");
                const {tags,context}=await helpers.getTags(public_id).then(res=>{ return res},err=>{throw err});
                const TRANSFORMEDIMG=helpers.transformImage(public_id)
                RESULTS.push({name,public_id,imgURL:TRANSFORMEDIMG,tags:tags,description:context});
            }
            
            callback(200,{msg:"retrieved",data:RESULTS});
        }else
        {
            callback(200,{msg:`No images were found for this user.`});
        }
    } catch (err) {
        console.log(err); 
        callback(400,{msg:`Error occured: ${JSON.stringify(err)}`})
    }
};

HANDLERS.updateImgInfo=async function(data,callback){
    try {
        let {tags,public_id,context}=data.payLoad;
        if( !(/^\w+=\b/gi.test(context)) )
        {
            throw new Error("The context is not properly formatted. Expected a string in the format (context name = context value) eg alt = image description.")
        } 
        cloudinary.uploader.explicit(public_id,{type:"upload",tags:tags,context:context},(err,res)=>{
            if(err)
            {
                console.log(err);
                callback(500,{msg: `${JSON.stringify(err)}`});
            }else
            {
                console.log(res);
                callback(200,{msg:`successfully updated`,data:{tags:res.tags,context:res.context.custom.alt}});
            }
        })  
    } catch (error) {
        console.log(error);
        callback(400,{msg:`Edit request failed error: ${error}`});
    }
}

HANDLERS.deleteImg=async function(data,callback){
    try {
        const {public_id}=data.payLoad;

        async function _delete_ref_from_db(){
            return new Promise( async (resolve,reject)=>{
                const DELETE_IMG_QUERY =`MATCH (img:Image {public_id:$data.public_id}) DETACH DELETE img`;
                const RESULTS= await HELPERS.runDbQuery(DELETE_IMG_QUERY,data.payLoad);

                if(RESULTS.length>0)
                {
                    reject("not deleted")
                    return;
                }

                resolve("ok")
                return;
            })
        }

        const DELETE_FROM_CLOUDINARY=await cloudinary.uploader.destroy(public_id,{resource_type:"image",invalidate:true});
        const DELETE_REF=await _delete_ref_from_db();

        if(DELETE_FROM_CLOUDINARY.result === DELETE_REF)
        {
            callback(200,{msg:"ok"});
            return;
        }

        callback(304,{msg:"not deleted"});
        return;
    } catch (error) {
        console.log(error);
        callback(500,{msg:`Cannot delete image error: ${error}`})
    }
}

HANDLERS.notFound=function(data,callback){
    callback(404, {msg:"You have not specified this route in your server. Check the route for spelling errors or capitalization errors."});
};

export default HANDLERS;