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
    if(data.method.toLowerCase() !== "post")
    {
        callback(405,{msg:"The method used is not allowed"});
        return;
    }
    
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
        const USER_CREATE_RES=await helpers.runDbQuery(QUERY,data.payLoad);
        if(USER_CREATE_RES.length>0)
        {
            const resObj=USER_CREATE_RES[0],
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

/**
 * LOGS IN A USER
 * @param {*} data 
 * @param {*} callback 
 */
HANDLERS.createSession=async function(data,callback){
    if(data.method.toLowerCase() !== "post")
    {
        callback(405,{msg:"The method used is not allowed"});
        return;
    }
    
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
};

HANDLERS.updateUserCredentials=async function(data,callback){

    const {userName,updatedCredentials}=data.payLoad;

    if(data.method.toLowerCase() !== "put")
    {
        callback(405,{msg:"The method used is not allowed"});
        return;
    }

    if(updatedCredentials.userName !== userName)
    {
        const LOOK_UP_USER=await HELPERS.lookUpUser(updatedCredentials.userName);
        if(LOOK_UP_USER.length>0)
        {
            //tell the client the user exists in the database
            callback(200,{msg:"Username already exists"});
            return; 
        };
    }

    try {     
        let updateRes;
        const QUERY=`MATCH (usr:User {userName:$data.userName})
                    SET usr += $data.updatedCredentials RETURN usr.userName as userName,usr.email as email`;
        const RESULTS=await HELPERS.runDbQuery(QUERY,data.payLoad);
        if(RESULTS.length>0)
        {
            RESULTS.map((res)=>{
                updateRes=res.toObject();
            })
            callback(200,{msg:"Successfully updated",data:updateRes});
            return; 
        };
        callback(304,{msg:"Not updated"});
    } catch (error) {
        callback(500,{msg:`${error}`});
    }
};

//CRUD IMAGE FUNCTIONALITY
HANDLERS.storeImageRef=async function(data,callback){

    if(data.method.toLowerCase() !== "post")
    {
        callback(405,{msg:"The method used is not allowed"});
        return;
    }

    try {
        const QUERY=`UNWIND $data AS properties
        MATCH (usr:User {userName:properties.ownerName})
        MERGE (img:Image {name:properties.name,public_id:properties.public_id})
        CREATE (usr)-[rel:UPLOADED]->(img)
        RETURN img,rel`;
        console.log(data)
        const SAVE_IMAGE_RES=await helpers.runDbQuery(QUERY,data.payLoad);
        if(SAVE_IMAGE_RES.length>0)
        {
            callback(200,{msg:"saved",no_Of_Values_Saved:SAVE_IMAGE_RES.length});
        }else
        {
            callback(200,{msg:`Image refs where not saved to db.`});
        }     
    } catch (err) {     
        callback(500,{msg:`Error occured: ${err}`})
    }
};

HANDLERS.updateProfilePic=async function(data,callback){
    if(data.method.toLowerCase() !== "put")
    {
        callback(405,{msg:"Method not allowed"});
        return;
    }

    try {
        const {ownerName,public_id,currentProfilePic}=data.payLoad;
        let profile_pic;
        let delete_current_profile_pic_reponse=null;

        if(Boolean(currentProfilePic))
        {
            delete_current_profile_pic_reponse=await cloudinary.uploader.destroy(currentProfilePic,{resource_type:"image",invalidate:true}); 
        };

        const QUERY=`MATCH (usr:User {userName:$data.ownerName})
                        SET usr.profile_pic=$data.public_id
                        RETURN  usr.profile_pic AS profile_pic`;
        
        const RESULTS=await HELPERS.runDbQuery(QUERY,data.payLoad);

        RESULTS.map((res)=>{
            profile_pic=res.get("profile_pic");
        });

        if( Boolean(public_id) && !(Boolean(profile_pic)) )
        {
            //check if public_id is a truthy that is we had a public id to change and check if profile_pic is not a falsy ie undefined or an empty string
            callback(417,{msg:"Couldn't update the profile_pic."});
            return;
        }

        callback(200,{msg:"Saved",data:{userName:ownerName,profile_pic}})
        return;   
    } catch (error) {
        callback(500,{msg:error});
    }
}

HANDLERS.generateSignature=function(data,callback){
    /*generate a signature to enable signed uploads to cloudinary*/
    if(data.method.toLowerCase() !== "get")
    {
        callback(405,{msg:"The method used is not allowed"});
        return;
    }

    const {searchParams}=data;

    if(!searchParams.get("uploadType"))
    {
        callback(400,{msg:"Missing query param: (uploadType)"});
        return;
    }

    try
    {
        signRequest(searchParams.get("uploadType"))
        .then((res)=>{
            callback(200,{msg:"Everything is okay",data:res});
        },
        (err)=>{
            callback(500,{msg:`The signature generation didn't work, error: ${err}`});
        });   
    } catch (error) 
    {
        callback(400,{msg:`Error occured error ${error}`});
    };
};

HANDLERS.retrieveImages=async function(data,callback){
    if(data.method.toLowerCase() !== "get")
    {
        callback(405,{msg:"The method used is not allowed"});
        return;
    };

    const {searchParams}=data;

    if(!searchParams.get("userName"))
    {
        callback(400,{msg:"Missing query param: (userName)"});
        return;
    }

    try {
        const QUERY=`MATCH (usr:User {userName:$data.userName})-[rel:UPLOADED]->(img)
        RETURN usr.profile_pic AS profile_pic, img.name AS name, img.public_id as public_id`;
        const RETRIEVE_IMAGES=await helpers.runDbQuery(QUERY,{userName:searchParams.get("userName")});
        const RESULTS=[];
        let profile_pic;
        if(RETRIEVE_IMAGES.length>0)
        {
            for(let image of RETRIEVE_IMAGES)
            {
                profile_pic= !(Boolean(image.get("profile_pic")))?"":image.get("profile_pic");
                let name=image.get("name");
                let public_id=image.get("public_id");
                const {tags,context}=await helpers.getTags(public_id).then(res=>{ return res},err=>{throw err});
                const TRANSFORMEDIMG=helpers.transformImage(public_id)
                RESULTS.push({name,public_id,imgURL:TRANSFORMEDIMG,tags:tags,description:context});
            }

            callback(200,{msg:"retrieved",data:{imagesArr:RESULTS,profile_pic}});
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

    if(data.method.toLowerCase() !== "put")
    {
        callback(405,{msg:"The method used is not allowed"});
        return;
    }

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
    if(data.method.toLowerCase() !== "delete")
    {
        callback(405,{msg:"The method used is not allowed"});
        return;
    }
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

        if( (DELETE_FROM_CLOUDINARY.result === "ok") && (DELETE_REF === "ok") )
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