let currentProgress=[];
const RES_ARR=[];

async function readFileData(file){
    const FILEREADER=new FileReader();
    FILEREADER.readAsDataURL(file);
    return new Promise((resolve,reject)=>{
        FILEREADER.onerror=(evt)=>{
            console.error(evt);
            console.error("Error occured reading files");
            alert("Error occured reading files.\nPlease try again.");
            reject("Error occured reading files")
        }   

        FILEREADER.onloadend=()=>{
            resolve(FILEREADER.result);
        }
    });
}

function validateFormat(fileName){
    return /\.(jpeg|jpg|png|gif)$/g.test(fileName);
}

function isCloudinaryUploadOp(url){
    return /\b\.cloudinary\.\b/g.test(url);
}

export async function handleInputData(files){
        const IMAGES=[];
        if(files.length>3)
        {
            alert("You can only upload three images at a time.");
            return IMAGES;
        }

        for(let file of files)
        {
            if(!validateFormat(file.name))
            {
                alert("We only allow images of format: jpeg,jpg,png or gif.\nPlease choose the right format and try again.");
                break;
            }

            const NAME=file.name.replace(/\b\.(jpeg|jpg|png|gif)$/g,"");
            IMAGES.push({url:await readFileData(file),name:NAME});
        }

        return IMAGES;
}

function handleProgress(evt,identifier,numberOfImages,setProgress){
    const ISPRESENT=currentProgress.findIndex(({imgId})=>{
        return imgId===identifier;
    });

    const PROGRESS=Math.round((evt.loaded*100.0)/evt.total);

    if(isFinite(PROGRESS)&&ISPRESENT>=0)
    {
        currentProgress=currentProgress.map((value)=>{
            if(value.imgId===identifier){
                value.progress=PROGRESS;
                return value;
            }else
            {
                return value;
            }
        });
    }else
    {
        currentProgress.push({imgId:identifier,progress:PROGRESS});
    }

    const CURRENT_PROGRESS_ARR=currentProgress.map(({progress})=>{
        return progress;
    });

    if(currentProgress.length===numberOfImages)
    {
        saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"progress"}]);
        setProgress(Math.min.apply(null,CURRENT_PROGRESS_ARR));
    }
}

function handleLoad(url,UPLOAD_RES,noOfValuesToUpload,setResults){
    if(isCloudinaryUploadOp(url)){
        let public_id=JSON.parse(UPLOAD_RES).public_id;
        let userName=JSON.parse(localStorage.getItem("userData")).userName;
        RES_ARR.push({
            public_id:public_id,
            ownerName:userName,
            name:`${userName}_${public_id}_weird`
        });
        if(RES_ARR.length===noOfValuesToUpload)
        {
            setResults(RES_ARR);
            saveToClientStorage("sessionStorage",[{key:"pageStatus",value:""}])
        }
        return;
    }

    if(JSON.parse(UPLOAD_RES).msg !== "Request was already received await reponse.")
    {
        saveToClientStorage("sessionStorage",[{key:"pageStatus",value:""}]);
    }
        return UPLOAD_RES;
}

/**
 * 
 * @param {STRING} url the url to make request to.
 * @param {STRING} method  the method of the request
 * @param {OBJECT} options  contains data to send, setProgress function & number of items to upload
 * @returns a promise.
 */
export async function makeReq(url,method,options={}){
    return new Promise((succeed,fail)=>{
        
        saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"loading"}]);

        const IDENTIFIER=options.identifier?options.identifier:`${url.replace("\\","")}_req`;
        const XHR=new XMLHttpRequest();

        XHR.open(method,url,true);

        if(!( isCloudinaryUploadOp(url) ))
        {
            XHR.setRequestHeader("Req-Name",IDENTIFIER);
            XHR.setRequestHeader("Content-Type","application/json");
        }

        XHR.setRequestHeader("X-Requested-With", "XMLHttpRequest");

        XHR.upload.onprogress=(evt)=>{
            handleProgress(evt,IDENTIFIER,options.noOfValuesToUpload,options.setProgress);
        }

        XHR.onerror=()=>{
            saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"fail"}]);
            // alert(`Error occured making the ${IDENTIFIER} request`);
            fail("error occurred while making request");
        }

        XHR.onabort=()=>{
            saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"fail"}]);
            alert("request was aborted");
            fail("the request was aborted")
        }

        XHR.onload=()=>{
            if(XHR.status>=500)
            {
                // alert("Couldn't proceed with the request due to an internal server error.")
                saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"fail"}]);
                fail("Server error");
            }

            const UPLOAD_RES=XHR.response;

            if(XHR.readyState===XMLHttpRequest.DONE)
            {
                handleLoad(url,UPLOAD_RES,options.noOfValuesToUpload,options.setResults);
                succeed(UPLOAD_RES);
            }
        }

        if(options.data&&Object.keys(options.data).length>0)
        {
            
            var sendData=JSON.stringify(options.data);

            if(isCloudinaryUploadOp(url))
            {
                //as cloudinary only accepts form data uploads
                sendData=new FormData();
                sendData.append("file",options.data.file);
                sendData.append("api_key",options.data.api_key);
                sendData.append("timestamp",options.data.timestamp);
                sendData.append("signature",options.data.signature);
                sendData.append("upload_preset","weird");
                sendData.append("detection","lvis_v1");
            }

            XHR.send(sendData);
        }else
        {
            XHR.send();
        }
    });
}

export async function generateSignature(){
    let response;
    try {
        response=JSON.parse(await makeReq("/generateSignature","get"));
    } catch (error) {
        saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"fail"}]);
        console.error(error);
    }finally{
        return response.data;
    }
}

export function sendToCloudinary(options){
    const {file,signatureObj,...newOptions}=options;
    //"https://api.cloudinary.com/v1_1/karerisspace/image/upload"
    const UPLOAD_DATA={},
        CLOUDINARY_URL="https://api.cloudinary.com/v1_1/karerisspace/image/upload";

    UPLOAD_DATA.timestamp=signatureObj.timestamp;
    UPLOAD_DATA.api_key=signatureObj.api_Key;
    UPLOAD_DATA.signature=signatureObj.signature;
    UPLOAD_DATA.file=file;

    newOptions.data=UPLOAD_DATA;

    try {
        makeReq(CLOUDINARY_URL,"post",newOptions);
    } catch (error) {
        saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"fail"}]);
        console.error("yap",error);  
    }
}

export function storeInDb(data,setProgress,setResults){

    const URL="/storeImageRef";
    const OPTIONS={data,setProgress,identifier:`${URL}_${data[0].public_id}`,setResults};
    console.log(OPTIONS);

    makeReq(URL,"post",OPTIONS)
    .then((data)=>{
        let res=JSON.parse(data);
        if(res.msg==="saved")
        {
            saveToClientStorage("sessionStorage",[{key:"pageStatus",value:"success"}]);
            setResults([res.msg]);
        }
    },(err)=>{
        setResults(err);
        RES_ARR.splice(0,RES_ARR.length);
    });
}

/**
 * Take the storage type ie. sessionStorage/localStorage and an array of objects with a key and a value to store.
 * @param {*} storageType STRING
 * @param {*} data ARRAY
 */
export function saveToClientStorage(storageType,data){    
    for(let item of data){
        window[storageType].setItem(item.key,item.value);
        window.dispatchEvent(new Event("storage"));
    };
}